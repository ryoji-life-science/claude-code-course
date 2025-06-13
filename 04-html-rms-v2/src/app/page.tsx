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
    
    let code = '';
    if (currentVersion === 'default') {
      code = product.html;
    } else if (product.versions && product.versions[currentVersion]) {
      code = product.versions[currentVersion];
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

  // 旧HTML形式から商品データを抽出
  const extractProductsFromOldHTML = (html: string): Product[] => {
    // localStorageからのデータ抽出を試行
    const match = html.match(/localStorage\.getItem\(['"](.*?)['"]\)/);
    if (match) {
      // 実際のlocalStorageデータがある場合の処理
      // ここでは簡易的に新しい商品を作成
      const sampleProduct: Product = {
        id: `imported-${Date.now()}`,
        name: '旧システムからインポートされた商品',
        html: '<div>\n  <h1>インポートされたHTMLコード</h1>\n  <p>旧システムからのデータです</p>\n</div>',
        createdAt: new Date().toISOString(),
      };
      return [sampleProduct];
    }
    return [];
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
            onClick={importOldData}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            title="旧システムからデータをインポート"
          >
            <Import size={16} />
            <span>データ移行</span>
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
                  <div className="flex items-center space-x-2">
                    <Code size={16} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">HTMLエディタ</span>
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