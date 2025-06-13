'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { 
  Search, 
  Plus, 
  Save, 
  Trash2, 
  Edit3, 
  Copy, 
  Eye,
  Code,
  Smartphone,
  Monitor,
  Import
} from 'lucide-react';

// Monaco Editor を動的インポート（SSR対策）
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full text-gray-500">エディターを読み込み中...</div>
});

interface Product {
  id: string;
  name: string;
  html: string;
  versions?: { [key: string]: string };
  createdAt: string;
  updatedAt?: string;
}

interface PreviewDevice {
  id: string;
  name: string;
  width: number;
  icon: React.ComponentType<{ size?: number }>;
}

const previewDevices: PreviewDevice[] = [
  { id: 'desktop', name: 'デスクトップ', width: 1200, icon: Monitor },
  { id: 'mobile', name: 'スマホ', width: 375, icon: Smartphone },
];

export default function HTMLManagerV2() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [currentVersion, setCurrentVersion] = useState('default');
  const [htmlCode, setHtmlCode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState('');
  const [previewDevice, setPreviewDevice] = useState<string>('mobile');
  const [showPreview, setShowPreview] = useState(true);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // ローカルストレージからデータを読み込み
  useEffect(() => {
    const savedData = localStorage.getItem('htmlManagerV2Data');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setProducts(data);
      } catch (error) {
        console.error('データの読み込みに失敗しました:', error);
      }
    }
  }, []);

  // データをローカルストレージに保存
  const saveToLocalStorage = useCallback((data: Product[]) => {
    try {
      localStorage.setItem('htmlManagerV2Data', JSON.stringify(data));
    } catch (error) {
      console.error('データの保存に失敗しました:', error);
    }
  }, []);

  // 商品一覧をフィルタリング
  const filteredProducts = products.filter(product =>
    product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 新しい商品を追加
  const addNewProduct = () => {
    const newId = `product-${Date.now()}`;
    const newProduct: Product = {
      id: newId,
      name: '新しい商品',
      html: '<div>\n  <!-- HTMLコードをここに入力 -->\n  <h1>新しい商品</h1>\n</div>',
      createdAt: new Date().toISOString(),
    };
    
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    setCurrentProduct(newProduct);
    setHtmlCode(newProduct.html);
    setCurrentVersion('default');
    saveToLocalStorage(updatedProducts);
  };

  // 商品を選択
  const selectProduct = (product: Product) => {
    setCurrentProduct(product);
    setCurrentVersion('default');
    setHtmlCode(product.html || '');
  };

  // バージョン変更
  const handleVersionChange = (version: string) => {
    if (!currentProduct) return;
    
    setCurrentVersion(version);
    
    let code = '';
    if (version === 'default') {
      code = currentProduct.html || '';
    } else if (currentProduct.versions && currentProduct.versions[version]) {
      code = currentProduct.versions[version];
    }
    
    setHtmlCode(code);
  };

  // HTMLコードを保存
  const saveHtmlCode = () => {
    if (!currentProduct) return;

    const updatedProducts = products.map(product => {
      if (product.id === currentProduct.id) {
        const updated = { ...product, updatedAt: new Date().toISOString() };
        
        if (currentVersion === 'default') {
          updated.html = htmlCode;
        } else {
          if (!updated.versions) updated.versions = {};
          updated.versions[currentVersion] = htmlCode;
        }
        
        return updated;
      }
      return product;
    });

    setProducts(updatedProducts);
    setCurrentProduct(updatedProducts.find(p => p.id === currentProduct.id) || null);
    saveToLocalStorage(updatedProducts);
  };

  // 商品名を編集
  const handleNameEdit = (productId: string, newName: string) => {
    const updatedProducts = products.map(product =>
      product.id === productId 
        ? { ...product, name: newName, updatedAt: new Date().toISOString() }
        : product
    );
    
    setProducts(updatedProducts);
    if (currentProduct && currentProduct.id === productId) {
      setCurrentProduct({ ...currentProduct, name: newName });
    }
    saveToLocalStorage(updatedProducts);
  };

  // 商品を削除
  const deleteProduct = (productId: string) => {
    if (confirm('この商品を削除してもよろしいですか？')) {
      const updatedProducts = products.filter(product => product.id !== productId);
      setProducts(updatedProducts);
      
      if (currentProduct && currentProduct.id === productId) {
        setCurrentProduct(null);
        setHtmlCode('');
      }
      
      saveToLocalStorage(updatedProducts);
    }
  };

  // 通知表示
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // HTMLコードをコピー
  const copyHtmlCode = () => {
    navigator.clipboard.writeText(htmlCode).then(() => {
      showNotification('HTMLコードをクリップボードにコピーしました');
    }).catch(() => {
      showNotification('コピーに失敗しました', 'error');
    });
  };

  // サンプルデータを作成
  const createSampleData = () => {
    const sampleProducts: Product[] = [
      {
        id: 'product-001',
        name: '楽天商品ページ - メイン商品',
        html: `<div style="max-width: 800px; margin: 0 auto; font-family: 'Hiragino Sans', 'Meiryo', sans-serif;">
  <!-- ヘッダー部分 -->
  <div style="background: linear-gradient(135deg, #ff6b6b, #ff8e8e); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; font-size: 28px; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
      🌟 特別セール商品 🌟
    </h1>
    <p style="color: white; font-size: 16px; margin: 10px 0 0 0;">
      期間限定！今だけの特別価格でご提供
    </p>
  </div>

  <!-- 商品画像エリア -->
  <div style="background: white; padding: 20px; text-align: center;">
    <div style="background: #f8f9fa; border: 2px dashed #dee2e6; padding: 40px; margin-bottom: 20px; border-radius: 8px;">
      <p style="color: #6c757d; font-size: 18px; margin: 0;">
        📷 商品画像をここに配置
      </p>
    </div>
  </div>

  <!-- 商品説明 -->
  <div style="background: white; padding: 20px;">
    <h2 style="color: #333; border-bottom: 3px solid #ff6b6b; padding-bottom: 10px; margin-bottom: 20px;">
      商品の特徴
    </h2>
    <ul style="line-height: 1.8; color: #555; font-size: 16px;">
      <li>✅ 高品質な素材を使用</li>
      <li>✅ 安心の国内製造</li>
      <li>✅ 365日保証付き</li>
      <li>✅ 送料無料でお届け</li>
    </ul>
  </div>

  <!-- 価格情報 -->
  <div style="background: #fff8e1; padding: 20px; border: 2px solid #ffc107; border-radius: 8px; margin: 20px 0;">
    <div style="text-align: center;">
      <p style="font-size: 14px; color: #666; margin: 0;">通常価格</p>
      <p style="font-size: 20px; color: #999; text-decoration: line-through; margin: 5px 0;">¥9,800</p>
      <p style="font-size: 32px; color: #d32f2f; font-weight: bold; margin: 10px 0;">¥6,800</p>
      <p style="font-size: 16px; color: #ff5722; font-weight: bold; margin: 0;">
        🔥 30%OFF 特別価格！
      </p>
    </div>
  </div>

  <!-- フッター -->
  <div style="background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
    <p style="margin: 0; font-size: 14px;">
      ご不明な点がございましたら、お気軽にお問い合わせください
    </p>
  </div>
</div>`,
        versions: {
          'sale': `<div style="max-width: 800px; margin: 0 auto; font-family: 'Hiragino Sans', 'Meiryo', sans-serif;">
  <!-- 緊急セール用ヘッダー -->
  <div style="background: linear-gradient(135deg, #e53e3e, #ff6b6b); padding: 20px; text-align: center; border-radius: 10px 10px 0 0; position: relative; overflow: hidden;">
    <div style="position: absolute; top: -10px; right: -10px; background: #ffd700; color: #d32f2f; font-weight: bold; padding: 5px 30px; transform: rotate(45deg); font-size: 12px;">
      SALE
    </div>
    <h1 style="color: white; font-size: 32px; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
      🚨 緊急セール開催中！ 🚨
    </h1>
    <p style="color: #ffeb3b; font-size: 18px; margin: 10px 0 0 0; font-weight: bold;">
      残り時間わずか！お見逃しなく！
    </p>
  </div>

  <!-- カウントダウンタイマー風 -->
  <div style="background: #1a1a1a; color: #ff6b6b; padding: 15px; text-align: center; font-family: monospace;">
    <p style="margin: 0; font-size: 18px; font-weight: bold;">
      ⏰ セール終了まで: 2日 14時間 32分 ⏰
    </p>
  </div>

  <!-- 超特価情報 -->
  <div style="background: linear-gradient(135deg, #ff1744, #d32f2f); color: white; padding: 25px; text-align: center; margin: 20px 0; border-radius: 8px;">
    <h2 style="margin: 0 0 10px 0; font-size: 28px;">💥 超特価 💥</h2>
    <p style="font-size: 16px; margin: 0 0 15px 0; opacity: 0.9;">通常価格 ¥9,800 から</p>
    <p style="font-size: 48px; font-weight: bold; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
      ¥4,980
    </p>
    <p style="font-size: 20px; margin: 10px 0 0 0; color: #ffeb3b;">
      🎯 49%OFF！
    </p>
  </div>
</div>`
        },
        createdAt: '2024-06-01T09:00:00.000Z',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'product-002', 
        name: 'スマートフォン対応ページ',
        html: `<div style="max-width: 100%; margin: 0 auto; font-family: 'Hiragino Sans', 'Meiryo', sans-serif;">
  <!-- モバイルヘッダー -->
  <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 15px; text-align: center;">
    <h1 style="color: white; font-size: 22px; margin: 0; line-height: 1.3;">
      📱 スマホ最適化商品
    </h1>
  </div>

  <!-- 商品カード -->
  <div style="background: white; margin: 10px; padding: 15px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <div style="background: #f8f9fa; padding: 30px; text-align: center; border-radius: 6px; margin-bottom: 15px;">
      <p style="color: #6c757d; margin: 0; font-size: 16px;">📷 商品画像</p>
    </div>
    
    <h2 style="color: #333; font-size: 18px; margin: 0 0 10px 0;">スマートフォン向け商品</h2>
    <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0 0 15px 0;">
      この商品はスマートフォンでの表示を最適化しています。タップしやすいボタンとわかりやすいレイアウトが特徴です。
    </p>
    
    <!-- 価格 -->
    <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; text-align: center;">
      <p style="font-size: 24px; color: #2e7d32; font-weight: bold; margin: 0;">¥3,980</p>
      <p style="font-size: 12px; color: #666; margin: 5px 0 0 0;">税込・送料無料</p>
    </div>
  </div>
</div>`,
        createdAt: '2024-06-05T14:30:00.000Z',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'product-003',
        name: 'ファッション・アパレル商品',
        html: `<div style="max-width: 800px; margin: 0 auto; background: white; font-family: 'Hiragino Sans', 'Meiryo', sans-serif;">
  <!-- ファッションヘッダー -->
  <div style="background: linear-gradient(135deg, #2c3e50, #34495e); color: white; padding: 30px; text-align: center;">
    <h1 style="margin: 0; font-size: 32px; letter-spacing: 2px; font-weight: 300;">
      FASHION COLLECTION
    </h1>
    <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.8;">
      新作アイテムが続々登場
    </p>
  </div>

  <!-- 商品詳細 -->
  <div style="padding: 20px;">
    <h2 style="color: #2c3e50; margin: 0 0 15px 0; font-size: 24px;">
      プレミアム コットン Tシャツ
    </h2>
    
    <!-- サイズ選択 -->
    <div style="margin-bottom: 20px;">
      <p style="color: #333; font-weight: bold; margin: 0 0 10px 0;">サイズ選択:</p>
      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        <div style="border: 2px solid #dee2e6; padding: 8px 16px; border-radius: 4px;">S</div>
        <div style="border: 2px solid #007bff; background: #007bff; color: white; padding: 8px 16px; border-radius: 4px;">M</div>
        <div style="border: 2px solid #dee2e6; padding: 8px 16px; border-radius: 4px;">L</div>
        <div style="border: 2px solid #dee2e6; padding: 8px 16px; border-radius: 4px;">XL</div>
      </div>
    </div>

    <!-- 価格と購入 -->
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
      <p style="font-size: 28px; color: #dc3545; font-weight: bold; margin: 0 0 10px 0;">¥2,980</p>
      <p style="color: #666; font-size: 14px; margin: 0 0 15px 0;">税込・送料別</p>
    </div>
  </div>
</div>`,
        versions: {
          'winter': `<div style="max-width: 800px; margin: 0 auto; background: linear-gradient(135deg, #e3f2fd, #bbdefb); font-family: 'Hiragino Sans', 'Meiryo', sans-serif;">
  <!-- 冬季限定ヘッダー -->
  <div style="background: linear-gradient(135deg, #1565c0, #0d47a1); color: white; padding: 30px; text-align: center;">
    <h1 style="margin: 0; font-size: 32px; letter-spacing: 2px; font-weight: 300;">
      ❄️ WINTER COLLECTION ❄️
    </h1>
    <p style="margin: 10px 0 0 0; font-size: 16px; color: #e3f2fd;">
      暖かくて快適な冬のアイテム
    </p>
  </div>

  <div style="padding: 30px; background: white; margin: 0 20px; border-radius: 12px; margin-top: -10px;">
    <h2 style="color: #1565c0; margin: 0 0 20px 0; font-size: 24px; text-align: center;">
      🧥 冬季限定 プレミアム ニット
    </h2>
    
    <!-- 冬季特価 -->
    <div style="background: linear-gradient(135deg, #1565c0, #1976d2); color: white; padding: 25px; border-radius: 8px; text-align: center;">
      <p style="font-size: 16px; margin: 0 0 10px 0; opacity: 0.9;">❄️ 冬季限定価格 ❄️</p>
      <p style="font-size: 36px; font-weight: bold; margin: 0;">¥4,980</p>
      <p style="font-size: 14px; margin: 10px 0 0 0; color: #e3f2fd;">通常価格 ¥7,980 から 37%OFF</p>
    </div>
  </div>
</div>`
        },
        createdAt: '2024-06-10T11:15:00.000Z',
        updatedAt: new Date().toISOString()
      }
    ];

    const updatedProducts = [...products, ...sampleProducts];
    setProducts(updatedProducts);
    saveToLocalStorage(updatedProducts);
    showNotification(`${sampleProducts.length}件のサンプル商品データを追加しました`);
  };

  // 旧システムデータをインポート
  const importOldData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.html';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          // sample.htmlの形式から商品データを抽出する簡易パーサー
          try {
            const products = extractProductsFromOldHTML(content);
            if (products.length > 0) {
              const updatedProducts = [...products, ...products];
              setProducts(updatedProducts);
              saveToLocalStorage(updatedProducts);
              showNotification(`${products.length}件の商品データをインポートしました`);
            } else {
              showNotification('有効な商品データが見つかりませんでした', 'error');
            }
          } catch {
            showNotification('データの解析に失敗しました', 'error');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  // 旧システムのlocalStorageデータを直接インポート
  const importFromOldSystem = () => {
    // 旧システムのlocalStorageキー名
    const oldDataKey = 'rmsHtmlData';
    
    try {
      // 旧システムのデータを取得
      const oldData = localStorage.getItem(oldDataKey);
      
      let importedProducts: Product[] = [];
      let importCount = 0;
      
      if (oldData) {
        const parsedData = JSON.parse(oldData);
        if (Array.isArray(parsedData)) {
          // 旧システムの商品データを新システム形式に変換
          importedProducts = parsedData.map((oldProduct: any) => ({
            id: oldProduct.id,
            name: oldProduct.name || `商品 ${oldProduct.id}`,
            html: oldProduct.html || '',
            versions: oldProduct.versions || {},
            createdAt: oldProduct.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }));
          importCount += importedProducts.length;
        }
      }
      
      if (importedProducts.length > 0) {
        // 重複チェック（IDが既に存在する場合は上書き確認）
        const existingIds = products.map(p => p.id);
        const duplicates = importedProducts.filter(p => existingIds.includes(p.id));
        
        if (duplicates.length > 0) {
          const confirmed = confirm(`${duplicates.length}件の商品が既に存在します。上書きしますか？`);
          if (!confirmed) {
            showNotification('インポートがキャンセルされました', 'error');
            return;
          }
        }
        
        // 既存データとマージ
        const mergedProducts = [...products];
        importedProducts.forEach(importedProduct => {
          const existingIndex = mergedProducts.findIndex(p => p.id === importedProduct.id);
          if (existingIndex !== -1) {
            mergedProducts[existingIndex] = importedProduct;
          } else {
            mergedProducts.push(importedProduct);
          }
        });
        
        setProducts(mergedProducts);
        saveToLocalStorage(mergedProducts);
        showNotification(`${importCount}件の商品データをインポートしました`);
      } else {
        showNotification('旧システムのデータが見つかりませんでした。\\n\\n手順:\\n1. 旧システム（sample.html）をブラウザで開く\\n2. 商品データが表示されることを確認\\n3. 新システムで「旧システム移行」ボタンをクリック', 'error');
      }
    } catch (error) {
      console.error('データインポートエラー:', error);
      showNotification('データの読み込みに失敗しました', 'error');
    }
  };

  // 旧HTML形式から商品データを抽出（ファイルアップロード用）
  const extractProductsFromOldHTML = (html: string): Product[] => {
    // ファイルから直接HTMLを読み込む場合の処理
    const sampleProduct: Product = {
      id: `imported-${Date.now()}`,
      name: '旧システムからインポートされた商品',
      html: html.includes('table') ? html : '<div>\\n  <h1>インポートされたHTMLコード</h1>\\n  <p>旧システムからのデータです</p>\\n</div>',
      createdAt: new Date().toISOString(),
    };
    return [sampleProduct];
  };

  // リアルタイムプレビュー用のデバウンス処理
  const [debouncedHtmlCode, setDebouncedHtmlCode] = useState(htmlCode);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedHtmlCode(htmlCode);
    }, 300);

    return () => clearTimeout(timer);
  }, [htmlCode]);

  // プレビューデバイスの取得
  const currentPreviewDevice = previewDevices.find(d => d.id === previewDevice) || previewDevices[0];

  // キーボードショートカット
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S: 保存
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (currentProduct && htmlCode) {
          saveHtmlCode();
        }
      }
      // Ctrl/Cmd + N: 新しい商品追加
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        addNewProduct();
      }
      // Ctrl/Cmd + D: プレビュー表示切り替え
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        setShowPreview(!showPreview);
      }
      // Ctrl/Cmd + K: コピー
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (currentProduct) {
          copyHtmlCode();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentProduct, htmlCode, showPreview, saveHtmlCode, addNewProduct, copyHtmlCode]);

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">HTML管理システム v2</h1>
          <div className="flex flex-col">
            <div className="text-sm text-gray-500">
              {currentProduct ? `${currentProduct.name} - ${currentVersion}` : '商品を選択してください'}
            </div>
            <div className="text-xs text-gray-400">
              ショートカット: Ctrl+S(保存) | Ctrl+N(新規) | Ctrl+D(プレビュー) | Ctrl+K(コピー)
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={saveHtmlCode}
            disabled={!currentProduct}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save size={16} />
            <span>保存</span>
          </button>
          
          <button
            onClick={copyHtmlCode}
            disabled={!currentProduct}
            className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Copy size={16} />
            <span>コピー</span>
          </button>

          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              showPreview 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Eye size={16} />
            <span>{showPreview ? 'プレビュー表示中' : 'プレビュー非表示'}</span>
          </button>

          <button
            onClick={createSampleData}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            title="サンプル商品データを追加"
          >
            <Plus size={16} />
            <span>サンプル追加</span>
          </button>

          <button
            onClick={importFromOldSystem}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            title="旧システム(sample.html)のlocalStorageからデータをインポート"
          >
            <Import size={16} />
            <span>旧システム移行</span>
          </button>

          <button
            onClick={importOldData}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            title="ファイルからデータをインポート"
          >
            <Import size={16} />
            <span>ファイル移行</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* サイドバー */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* 検索とコントロール */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="商品IDまたは名前で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={addNewProduct}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              <span>新しい商品を追加</span>
            </button>
          </div>

          {/* 商品一覧 */}
          <div className="flex-1 overflow-y-auto">
            {filteredProducts.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchTerm ? '検索結果がありません' : '商品がありません'}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      currentProduct?.id === product.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                    }`}
                    onClick={() => selectProduct(product)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        {isEditing && currentProduct?.id === product.id ? (
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onBlur={() => {
                              handleNameEdit(product.id, editingName);
                              setIsEditing(false);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleNameEdit(product.id, editingName);
                                setIsEditing(false);
                              } else if (e.key === 'Escape') {
                                setIsEditing(false);
                                setEditingName('');
                              }
                            }}
                            className="w-full px-2 py-1 text-sm font-medium border border-blue-500 rounded"
                            autoFocus
                          />
                        ) : (
                          <h3
                            className="text-sm font-medium text-gray-900 truncate cursor-pointer"
                            onDoubleClick={() => {
                              setIsEditing(true);
                              setEditingName(product.name);
                            }}
                          >
                            {product.name}
                          </h3>
                        )}
                        <p className="text-xs text-gray-500 mt-1">ID: {product.id}</p>
                        {product.updatedAt && (
                          <p className="text-xs text-gray-400 mt-1">
                            更新: {new Date(product.updatedAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-1 ml-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsEditing(true);
                            setEditingName(product.name);
                            setCurrentProduct(product);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="名前を編集"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteProduct(product.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="削除"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1 flex flex-col">
          {currentProduct ? (
            <div className="flex-1 flex">
              {/* エディタ */}
              <div className="flex-1 flex flex-col bg-white border-r border-gray-200">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Code size={16} className="text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">HTMLエディタ</span>
                    </div>
                    
                    {/* バージョン選択 */}
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">バージョン:</span>
                      <select
                        value={currentVersion}
                        onChange={(e) => handleVersionChange(e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
                      >
                        <option value="default">標準</option>
                        {currentProduct?.versions && Object.keys(currentProduct.versions).map(version => (
                          <option key={version} value={version}>{version}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {htmlCode.length} 文字
                  </div>
                </div>
                
                <div className="flex-1">
                  <MonacoEditor
                    height="100%"
                    defaultLanguage="html"
                    value={htmlCode}
                    onChange={(value) => setHtmlCode(value || '')}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      fontSize: 14,
                      lineNumbers: 'on',
                      roundedSelection: false,
                      scrollbar: {
                        vertical: 'visible',
                        horizontal: 'visible'
                      },
                      automaticLayout: true,
                      formatOnPaste: true,
                      formatOnType: true,
                    }}
                  />
                </div>
              </div>

              {/* プレビュー */}
              {showPreview && (
                <div className="flex-1 flex flex-col bg-white">
                  <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                      <Eye size={16} className="text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">プレビュー</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {previewDevices.map((device) => {
                        const IconComponent = device.icon;
                        return (
                          <button
                            key={device.id}
                            onClick={() => setPreviewDevice(device.id)}
                            className={`flex items-center space-x-1 px-3 py-1 rounded-md text-xs transition-colors ${
                              previewDevice === device.id
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <IconComponent size={14} />
                            <span>{device.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-auto bg-gray-100 p-4">
                    <div 
                      className="mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
                      style={{ 
                        width: `${currentPreviewDevice.width}px`,
                        maxWidth: '100%',
                        minHeight: '400px'
                      }}
                    >
                      <div
                        dangerouslySetInnerHTML={{ __html: debouncedHtmlCode }}
                        className="p-4"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <Code size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">商品を選択してください</h3>
                <p className="text-gray-600 mb-4">左のサイドバーから商品を選択するか、新しい商品を追加してください</p>
                <button
                  onClick={addNewProduct}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                >
                  <Plus size={16} />
                  <span>新しい商品を追加</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 通知 */}
      {notification && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg text-white font-medium shadow-lg z-50 ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {notification.message}
        </div>
      )}
    </div>
  );
}