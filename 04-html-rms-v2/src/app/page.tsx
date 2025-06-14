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
  Import,
  ZoomIn,
  ZoomOut,
  RotateCcw
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
  const [isEditingId, setIsEditingId] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [previewDevice, setPreviewDevice] = useState<string>('mobile');
  const [showPreview, setShowPreview] = useState(true);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const [previewWidth, setPreviewWidth] = useState(50); // プレビューエリアの幅（%）
  const [isResizing, setIsResizing] = useState(false);
  const [editorFontSize, setEditorFontSize] = useState(14); // エディタのフォントサイズ
  const [previewZoom, setPreviewZoom] = useState(100); // プレビューのズーム倍率（%）

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

  // 商品一覧をフィルタリングしてIDの昇順でソート
  const filteredProducts = products
    .filter(product =>
      product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // IDを文字列として比較（自然な並び順のため）
      return a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' });
    });

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
    setHasUnsavedChanges(false);
    
    // エディタとプレビューエリアを最上部にスクロール
    setTimeout(() => {
      // Monaco Editorのスクロールをリセット
      const editorContainer = document.querySelector('.monaco-editor .monaco-scrollable-element');
      if (editorContainer) {
        editorContainer.scrollTop = 0;
      }
      
      // プレビューエリアのスクロールをリセット
      const previewContainer = document.querySelector('.preview-content')?.closest('.flex-1.overflow-y-auto');
      if (previewContainer) {
        previewContainer.scrollTop = 0;
      }
    }, 100);
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
    setHasUnsavedChanges(false);
    
    // バージョン変更時もスクロールをリセット
    setTimeout(() => {
      const editorContainer = document.querySelector('.monaco-editor .monaco-scrollable-element');
      if (editorContainer) {
        editorContainer.scrollTop = 0;
      }
      
      const previewContainer = document.querySelector('.preview-content')?.closest('.flex-1.overflow-y-auto');
      if (previewContainer) {
        previewContainer.scrollTop = 0;
      }
    }, 100);
  };

  // HTMLコードを保存
  const saveHtmlCode = async () => {
    if (!currentProduct || isSaving) return;

    setIsSaving(true);
    
    try {
      // 少し遅延を追加して保存プロセスを視覚化
      await new Promise(resolve => setTimeout(resolve, 300));
      
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
      
      setHasUnsavedChanges(false);
      setLastSavedTime(new Date());
      showNotification('保存が完了しました', 'success');
    } catch (error) {
      showNotification('保存に失敗しました', 'error');
    } finally {
      setIsSaving(false);
    }
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

  // 商品IDを編集
  const handleIdEdit = (oldId: string, newId: string) => {
    // 新しいIDが既に存在するかチェック
    if (newId !== oldId && products.some(product => product.id === newId)) {
      showNotification('このIDは既に存在します', 'error');
      return;
    }

    // IDが空の場合はエラー
    if (!newId.trim()) {
      showNotification('IDは空にできません', 'error');
      return;
    }

    const updatedProducts = products.map(product =>
      product.id === oldId 
        ? { ...product, id: newId, updatedAt: new Date().toISOString() }
        : product
    );
    
    setProducts(updatedProducts);
    if (currentProduct && currentProduct.id === oldId) {
      setCurrentProduct({ ...currentProduct, id: newId });
    }
    saveToLocalStorage(updatedProducts);
    showNotification('IDが更新されました', 'success');
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

  // JSONファイルからデータをインポート
  const importFromJsonFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          try {
            const data = JSON.parse(content);
            let importedProducts: Product[] = [];
            
            // 旧システムのJSONデータ形式を判定・変換
            if (Array.isArray(data)) {
              // 直接配列の場合（rms_all_products.json形式）
              importedProducts = convertOldProductData(data);
            } else if (data.products && Array.isArray(data.products)) {
              // products配列が含まれている場合
              importedProducts = convertOldProductData(data.products);
            } else if (data.version && data.products) {
              // システムバックアップ形式の場合
              importedProducts = convertOldProductData(data.products);
            } else {
              // 単一商品の場合
              importedProducts = [convertSingleProduct(data)];
            }
            
            if (importedProducts.length > 0) {
              // 重複チェック
              const existingIds = products.map(p => p.id);
              const duplicates = importedProducts.filter(p => existingIds.includes(p.id));
              
              if (duplicates.length > 0) {
                const confirmed = confirm(`${duplicates.length}件の商品が既に存在します。上書きしますか？`);
                if (!confirmed) {
                  showNotification('インポートがキャンセルされました', 'error');
                  return;
                }
              }
              
              // データのマージ
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
              showNotification(`${importedProducts.length}件の商品データをインポートしました`);
            } else {
              showNotification('有効な商品データが見つかりませんでした', 'error');
            }
          } catch (error) {
            console.error('JSON解析エラー:', error);
            showNotification('JSONファイルの解析に失敗しました。正しい形式のファイルか確認してください。', 'error');
          }
        };
        reader.readAsText(file, 'UTF-8');
      }
    };
    input.click();
  };

  // 旧システムの商品データを新形式に変換
  const convertOldProductData = (oldProducts: any[]): Product[] => {
    return oldProducts.map(oldProduct => convertSingleProduct(oldProduct));
  };

  // 単一の旧商品データを新形式に変換
  const convertSingleProduct = (oldProduct: any): Product => {
    return {
      id: oldProduct.id || `product-${Date.now()}`,
      name: oldProduct.name || `商品 ${oldProduct.id}`,
      html: oldProduct.html || '',
      versions: oldProduct.versions || {},
      createdAt: oldProduct.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  };

  // HTMLファイルからデータをインポート
  const importOldData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.html,.htm';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          try {
            const importedProducts = extractProductsFromOldHTML(content);
            if (importedProducts.length > 0) {
              const updatedProducts = [...products, ...importedProducts];
              setProducts(updatedProducts);
              saveToLocalStorage(updatedProducts);
              showNotification(`${importedProducts.length}件の商品データをインポートしました`);
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

  // HTMLコードの変更検知
  useEffect(() => {
    if (!currentProduct) return;
    
    let originalCode = '';
    if (currentVersion === 'default') {
      originalCode = currentProduct.html || '';
    } else if (currentProduct.versions && currentProduct.versions[currentVersion]) {
      originalCode = currentProduct.versions[currentVersion];
    }
    
    setHasUnsavedChanges(htmlCode !== originalCode);
  }, [htmlCode, currentProduct, currentVersion]);

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

  // プレビューサイズの自動計算
  const calculatePreviewSize = () => {
    if (!showPreview) return { width: 375, height: 600, scale: 1 };
    
    const availableWidth = (window.innerWidth * (previewWidth / 100)) - 100; // パディング考慮
    const maxWidth = Math.min(availableWidth - 60, 500); // 最大500px
    const minWidth = 280; // 最小280px
    
    const targetWidth = Math.max(minWidth, Math.min(maxWidth, 375));
    const scale = targetWidth / 375;
    const scaledHeight = 600 * scale;
    
    return { width: targetWidth, height: scaledHeight, scale };
  };

  const previewSize = calculatePreviewSize();

  // フォントサイズ調整関数
  const increaseFontSize = () => {
    setEditorFontSize(prev => Math.min(prev + 2, 24));
  };

  const decreaseFontSize = () => {
    setEditorFontSize(prev => Math.max(prev - 2, 10));
  };

  const resetFontSize = () => {
    setEditorFontSize(14);
  };

  // プレビューズーム調整関数
  const increasePreviewZoom = () => {
    setPreviewZoom(prev => Math.min(prev + 10, 200));
  };

  const decreasePreviewZoom = () => {
    setPreviewZoom(prev => Math.max(prev - 10, 50));
  };

  const resetPreviewZoom = () => {
    setPreviewZoom(100);
  };

  // HTMLコードの自動整形
  const formatHtmlCode = () => {
    if (!htmlCode) return;
    
    try {
      // 簡単なHTML整形ロジック
      const formatted = htmlCode
        .replace(/></g, '>\n<')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map((line, index, array) => {
          let indent = 0;
          
          // 前の行を確認してインデントレベルを決定
          for (let i = 0; i < index; i++) {
            const prevLine = array[i];
            if (prevLine.includes('<') && !prevLine.includes('</') && !prevLine.includes('/>')) {
              indent++;
            }
            if (prevLine.includes('</')) {
              indent--;
            }
          }
          
          // 現在の行が終了タグの場合、インデントを1つ減らす
          if (line.includes('</')) {
            indent--;
          }
          
          return '  '.repeat(Math.max(0, indent)) + line;
        })
        .join('\n');
      
      setHtmlCode(formatted);
      showNotification('HTMLコードを整形しました', 'success');
    } catch (error) {
      showNotification('整形に失敗しました', 'error');
    }
  };

  // プレビュー表示切り替え時にMonaco Editorのレイアウトを再計算
  useEffect(() => {
    const timer = setTimeout(() => {
      // Monaco Editorのレイアウトを再計算
      window.dispatchEvent(new Event('resize'));
    }, 350); // アニメーション完了後に実行

    return () => clearTimeout(timer);
  }, [showPreview]);

  // プレビュー幅変更時にプレビューサイズを再計算
  useEffect(() => {
    if (showPreview) {
      // プレビューサイズ再計算のためにコンポーネントを再レンダリング
      const timer = setTimeout(() => {
        // 強制的に再レンダリングをトリガー
        setPreviewWidth(prev => prev);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [previewWidth, showPreview]);

  // ドラッグリサイズ機能
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const container = document.querySelector('.flex-1.flex');
      if (!container) return;
      
      const containerRect = container.getBoundingClientRect();
      const newPreviewWidth = Math.max(20, Math.min(80, ((containerRect.right - e.clientX) / containerRect.width) * 100));
      setPreviewWidth(newPreviewWidth);
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
        // リサイズ完了後にMonaco Editorのレイアウトを再計算
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 100);
      }
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

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
    <div className="h-screen bg-neutral-50 flex flex-col">
      {/* ヘッダー */}
      <header className="bg-white border-b border-neutral-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-medium text-sm">H</span>
              </div>
              <div>
                <h1 className="text-lg font-medium text-neutral-900">
                  HTML管理システム
                </h1>
              </div>
            </div>
            
            {currentProduct && (
              <div className="flex items-center space-x-2 text-sm text-neutral-600">
                <span>{currentProduct.name}</span>
                {currentVersion !== 'default' && (
                  <>
                    <span className="text-neutral-400">·</span>
                    <span className="text-neutral-500">{currentVersion}</span>
                  </>
                )}
              </div>
            )}
          </div>
        
          <div className="flex items-center space-x-2">
            <button
              onClick={saveHtmlCode}
              disabled={!currentProduct || isSaving}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                hasUnsavedChanges 
                  ? 'bg-orange-500 text-white hover:bg-orange-600' 
                  : 'bg-neutral-900 text-white hover:bg-neutral-800'
              } ${isSaving ? 'bg-green-600' : ''}`}
            >
              {isSaving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <Save size={14} />
              )}
              <span className="mobile-hidden">
                {isSaving ? '保存中' : hasUnsavedChanges ? '保存' : '保存'}
              </span>
            </button>
            
            <button
              onClick={copyHtmlCode}
              disabled={!currentProduct}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Copy size={14} />
              <span className="mobile-hidden">コピー</span>
            </button>

            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                showPreview 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <Eye size={14} />
              <span className="mobile-hidden">{showPreview ? 'プレビュー' : 'プレビュー'}</span>
            </button>

            <button
              onClick={importFromJsonFile}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
              title="JSONファイル(rms_all_products.json等)からデータをインポート"
            >
              <Import size={14} />
              <span className="mobile-hidden">移行</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* サイドバー */}
        <div className="w-80 bg-white border-r border-neutral-200 flex flex-col">
          {/* 検索とコントロール */}
          <div className="p-6 border-b border-neutral-200">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
              <input
                type="text"
                placeholder="検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent bg-white text-neutral-700 placeholder-neutral-400 transition-all text-sm"
              />
            </div>
            
            <button
              onClick={addNewProduct}
              className="w-full flex items-center justify-center space-x-2 bg-neutral-900 text-white py-2.5 rounded-lg hover:bg-neutral-800 transition-colors text-sm font-medium"
            >
              <Plus size={16} />
              <span>新しい商品を追加</span>
            </button>
          </div>

          {/* 商品一覧 */}
          <div className="flex-1 overflow-y-auto">
            {filteredProducts.length === 0 ? (
              <div className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-neutral-100 rounded-full flex items-center justify-center">
                  <Search size={20} className="text-neutral-400" />
                </div>
                <p className="text-sm font-medium text-neutral-700">{searchTerm ? '検索結果がありません' : '商品がありません'}</p>
                <p className="text-xs text-neutral-500 mt-1">
                  {searchTerm ? '別のキーワードで検索してみてください' : '新しい商品を追加して始めましょう'}
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-1">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`group p-3 cursor-pointer rounded-lg transition-all duration-150 hover:bg-neutral-50 ${
                      currentProduct?.id === product.id 
                        ? 'bg-neutral-100 border-l-2 border-neutral-900' 
                        : 'hover:border-l-2 hover:border-neutral-300'
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
                            className="w-full px-3 py-2 text-sm font-medium border border-neutral-300 rounded-lg bg-white text-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                            autoFocus
                          />
                        ) : (
                          <h3
                            className="text-sm font-semibold text-gray-900 truncate cursor-pointer"
                            style={{ color: '#111827' }}
                            onDoubleClick={() => {
                              setIsEditing(true);
                              setEditingName(product.name);
                            }}
                          >
                            {product.name}
                          </h3>
                        )}
                        {isEditingId && currentProduct?.id === product.id ? (
                          <div className="mt-1">
                            <input
                              type="text"
                              value={editingId}
                              onChange={(e) => setEditingId(e.target.value)}
                              onBlur={() => {
                                handleIdEdit(product.id, editingId);
                                setIsEditingId(false);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleIdEdit(product.id, editingId);
                                  setIsEditingId(false);
                                } else if (e.key === 'Escape') {
                                  setIsEditingId(false);
                                  setEditingId('');
                                }
                              }}
                              className="w-full px-2 py-1 text-xs font-mono border border-neutral-300 rounded bg-white text-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                              placeholder="商品ID"
                              autoFocus
                            />
                          </div>
                        ) : (
                          <p 
                            className="text-xs text-gray-700 mt-1 font-mono cursor-pointer hover:text-indigo-600 transition-colors" 
                            style={{ color: '#374151' }}
                            onDoubleClick={() => {
                              setIsEditingId(true);
                              setEditingId(product.id);
                              setCurrentProduct(product);
                            }}
                            title="ダブルクリックでIDを編集"
                          >
                            ID: {product.id}
                          </p>
                        )}
                        {product.updatedAt && (
                          <p className="text-xs text-gray-600 mt-1" style={{ color: '#4b5563' }}>
                            更新: {new Date(product.updatedAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsEditing(true);
                            setEditingName(product.name);
                            setCurrentProduct(product);
                          }}
                          className="p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded transition-colors"
                          title="名前を編集"
                        >
                          <Edit3 size={12} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsEditingId(true);
                            setEditingId(product.id);
                            setCurrentProduct(product);
                          }}
                          className="p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded transition-colors"
                          title="IDを編集"
                        >
                          <span className="text-xs font-mono">ID</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteProduct(product.id);
                          }}
                          className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                          title="削除"
                        >
                          <Trash2 size={12} />
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
        <div className="flex-1 flex">
          {currentProduct ? (
            <div className="flex-1 flex">
              {/* エディタ */}
              <div 
                className="bg-white border-r border-neutral-200 flex flex-col"
                style={{ 
                  width: showPreview ? `${100 - previewWidth}%` : '100%',
                  transition: isResizing ? 'none' : 'width 0.3s ease'
                }}
              >
                <div className="bg-white border-b border-neutral-200">
                  {/* メインツールバー */}
                  <div className="flex items-center justify-between px-6 py-3">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-neutral-700">HTML</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <select
                          value={currentVersion}
                          onChange={(e) => handleVersionChange(e.target.value)}
                          className="text-sm border-0 bg-transparent text-neutral-600 focus:outline-none focus:ring-0 font-medium"
                        >
                          <option value="default">標準</option>
                          {currentProduct?.versions && Object.keys(currentProduct.versions).map(version => (
                            <option key={version} value={version}>{version}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      {/* フォントサイズ調整 - ミニマル */}
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={decreaseFontSize}
                          className="w-6 h-6 flex items-center justify-center text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded transition-colors"
                          title="小"
                        >
                          <span className="text-xs">A</span>
                        </button>
                        <span className="text-xs text-neutral-400 font-mono w-6 text-center">{editorFontSize}</span>
                        <button
                          onClick={increaseFontSize}
                          className="w-6 h-6 flex items-center justify-center text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded transition-colors"
                          title="大"
                        >
                          <span className="text-sm font-semibold">A</span>
                        </button>
                      </div>

                      {/* 整形ボタン */}
                      <button
                        onClick={formatHtmlCode}
                        className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded transition-colors"
                        title="HTMLを整形"
                      >
                        <span className="text-xs font-mono">▽</span>
                      </button>

                      {/* ステータス */}
                      <div className="flex items-center space-x-3 text-xs text-neutral-500">
                        <span>{htmlCode.length.toLocaleString()}</span>
                        {hasUnsavedChanges && (
                          <div className="flex items-center space-x-1 text-amber-600">
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                            <span>未保存</span>
                          </div>
                        )}
                        {lastSavedTime && !hasUnsavedChanges && (
                          <span className="text-green-600">保存済み</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <MonacoEditor
                    height="100%"
                    defaultLanguage="html"
                    value={htmlCode}
                    onChange={(value) => {
                      setHtmlCode(value || '');
                    }}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      fontSize: editorFontSize,
                      lineNumbers: 'on',
                      roundedSelection: false,
                      scrollbar: {
                        vertical: 'auto',
                        horizontal: 'auto',
                        verticalScrollbarSize: 14,
                        horizontalScrollbarSize: 14
                      },
                      automaticLayout: true,
                      formatOnPaste: true,
                      formatOnType: true,
                      wordWrap: 'on',
                      wrappingStrategy: 'advanced',
                    }}
                  />
                </div>
              </div>

              {/* リサイズハンドル */}
              {showPreview && (
                <div 
                  className="w-1 bg-slate-300 hover:bg-indigo-400 cursor-col-resize transition-colors duration-200 relative group"
                  onMouseDown={handleMouseDown}
                >
                  <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center">
                    <div className="w-1 h-8 bg-slate-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </div>
                </div>
              )}

              {/* プレビュー */}
              {showPreview && (
                <div 
                  className="bg-white flex flex-col"
                  style={{ 
                    width: `${previewWidth}%`,
                    transition: isResizing ? 'none' : 'width 0.3s ease'
                  }}
                >
                  <div className="bg-white border-b border-neutral-200">
                    <div className="flex items-center justify-between px-6 py-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium text-neutral-700">プレビュー</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {/* ズーム調整 */}
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={decreasePreviewZoom}
                            className="w-6 h-6 flex items-center justify-center text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded transition-colors"
                            title="縮小"
                          >
                            <span className="text-xs">-</span>
                          </button>
                          <span className="text-xs text-neutral-400 font-mono w-10 text-center">{previewZoom}%</span>
                          <button
                            onClick={increasePreviewZoom}
                            className="w-6 h-6 flex items-center justify-center text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded transition-colors"
                            title="拡大"
                          >
                            <span className="text-xs">+</span>
                          </button>
                        </div>
                        
                        <div className="text-xs text-neutral-500">
                          リアルタイムプレビュー
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto">
                    <style>{`
                      /* プレビュー用の基本スタイル */
                      .preview-content table {
                        border-collapse: collapse;
                        width: 100%;
                        margin: 16px 0;
                      }
                      .preview-content table, .preview-content th, .preview-content td {
                        border: 1px solid #ddd;
                      }
                      .preview-content th, .preview-content td {
                        padding: 12px;
                        text-align: left;
                      }
                      .preview-content th {
                        background-color: #f8f9fa;
                        font-weight: 600;
                      }
                      .preview-content tr:nth-child(even) {
                        background-color: #f9f9f9;
                      }
                      .preview-content * {
                        box-sizing: border-box;
                      }
                      .preview-content {
                        width: 100%;
                        font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
                        font-size: 14px;
                        line-height: 1.6;
                        color: #333;
                      }
                    `}</style>
                    <div
                      className="preview-content p-6"
                      style={{
                        transform: `scale(${previewZoom / 100})`,
                        transformOrigin: 'top left',
                        width: `${10000 / previewZoom}%`,
                      }}
                      dangerouslySetInnerHTML={{ __html: debouncedHtmlCode }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-white">
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
                  <Code size={24} className="text-neutral-400" />
                </div>
                <h3 className="text-lg font-medium text-neutral-900 mb-2">商品を選択してください</h3>
                <p className="text-neutral-600 mb-6 max-w-sm mx-auto text-sm">左のサイドバーから商品を選択するか、新しい商品を追加してHTML編集を開始しましょう</p>
                <button
                  onClick={addNewProduct}
                  className="flex items-center space-x-2 bg-neutral-900 text-white px-4 py-2.5 rounded-lg hover:bg-neutral-800 transition-colors mx-auto text-sm font-medium"
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
        <div className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg text-sm font-medium shadow-lg z-50 backdrop-blur-sm animate-in slide-in-from-bottom-2 duration-300 max-w-sm ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 flex items-center justify-center">
              {notification.type === 'success' ? '✓' : '!'}
            </div>
            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}