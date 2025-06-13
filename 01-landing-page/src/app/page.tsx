import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Claude Code Academy</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#overview" className="text-gray-700 hover:text-blue-600 font-medium">講座概要</a>
              <a href="#curriculum" className="text-gray-700 hover:text-blue-600 font-medium">カリキュラム</a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 font-medium">受講生の声</a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 font-medium">料金</a>
              <a href="#faq" className="text-gray-700 hover:text-blue-600 font-medium">FAQ</a>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="hidden sm:block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                無料相談
              </button>
              <button className="md:hidden p-2">
                <span className="sr-only">メニューを開く</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              AI時代のプログラミング
              <br />
              <span className="text-blue-600">Claude Code</span>で未来を切り開く
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Anthropic社のClaude Codeを使いこなして、プログラミング効率を10倍に。
              初心者から上級者まで、実践的なスキルを身につけられる包括的な講座です。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors">
                今すぐ申し込む
              </button>
              <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-50 transition-colors">
                無料体験を始める
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section id="overview" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              なぜClaude Codeなのか？
            </h2>
            <p className="text-xl text-gray-600">
              従来のプログラミング学習を革新する、AI駆動の開発環境を学ぼう
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">効率性の向上</h3>
              <p className="text-gray-600">
                AIの力でコード生成、デバッグ、リファクタリングを自動化。開発時間を大幅短縮。
              </p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">学習の加速</h3>
              <p className="text-gray-600">
                インタラクティブなAIアシスタントが、あなたの学習をサポート。つまずくポイントを瞬時に解決。
              </p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">💡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">実践的スキル</h3>
              <p className="text-gray-600">
                実際のプロジェクトでClaude Codeを活用。現場ですぐに使えるスキルを習得。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section id="curriculum" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              体系的なカリキュラム
            </h2>
            <p className="text-xl text-gray-600">
              基礎から応用まで、段階的に学べる充実したコンテンツ
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-blue-600 text-sm font-semibold mb-2">WEEK 1-2</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">基礎理解</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Claude Codeとは</li>
                <li>• 環境構築</li>
                <li>• 基本操作</li>
                <li>• プロンプトエンジニアリング</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-green-600 text-sm font-semibold mb-2">WEEK 3-4</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">実践応用</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Webアプリ開発</li>
                <li>• APIとの連携</li>
                <li>• データベース操作</li>
                <li>• テスト自動化</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-purple-600 text-sm font-semibold mb-2">WEEK 5-6</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">プロジェクト開発</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• チーム開発</li>
                <li>• Git連携</li>
                <li>• CI/CD構築</li>
                <li>• デプロイメント</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-orange-600 text-sm font-semibold mb-2">WEEK 7-8</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">最適化・運用</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• パフォーマンス最適化</li>
                <li>• セキュリティ対策</li>
                <li>• 監視・運用</li>
                <li>• 成果発表</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              受講生の声
            </h2>
            <p className="text-xl text-gray-600">
              実際に受講された方々からの生の声をお聞きください
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-xl">★★★★★</div>
              </div>
              <p className="text-gray-700 mb-6">
                「Claude Codeを使えるようになってから、開発効率が劇的に向上しました。特にデバッグ作業が格段に楽になり、より創造的な部分に時間を使えるようになりました。」
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  T.S
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-900">田中 将太さん</div>
                  <div className="text-gray-600 text-sm">フロントエンドエンジニア</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-xl">★★★★★</div>
              </div>
              <p className="text-gray-700 mb-6">
                「プログラミング初心者でしたが、Claude Codeのおかげで学習がとてもスムーズでした。分からないことを即座に質問して解決できるのが素晴らしいです。」
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                  A.Y
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-900">山田 明子さん</div>
                  <div className="text-gray-600 text-sm">Web制作者</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-xl">★★★★★</div>
              </div>
              <p className="text-gray-700 mb-6">
                「既存のコードの保守作業がとても楽になりました。Claude Codeがコードの意図を理解してくれるので、レガシーシステムの改修も効率的に進められています。」
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  K.M
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-900">松本 健太郎さん</div>
                  <div className="text-gray-600 text-sm">システムエンジニア</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              料金プラン
            </h2>
            <p className="text-xl text-gray-600">
              あなたの学習スタイルに合わせて選べる3つのプラン
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">ベーシック</h3>
              <div className="text-3xl font-bold text-gray-900 mb-4">
                ¥29,800
                <span className="text-base font-normal text-gray-600">/月</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  基礎講座アクセス
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  コミュニティフォーラム
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  月1回のメンタリング
                </li>
              </ul>
              <button className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                プランを選択
              </button>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-blue-600 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">人気</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">スタンダード</h3>
              <div className="text-3xl font-bold text-gray-900 mb-4">
                ¥49,800
                <span className="text-base font-normal text-gray-600">/月</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  全講座アクセス
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  個別メンタリング（週1回）
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  プロジェクト添削
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  就転職サポート
                </li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                プランを選択
              </button>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">プレミアム</h3>
              <div className="text-3xl font-bold text-gray-900 mb-4">
                ¥79,800
                <span className="text-base font-normal text-gray-600">/月</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  スタンダードプラン全て
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  1on1専属メンター
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  企業紹介・斡旋
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  生涯サポート
                </li>
              </ul>
              <button className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                プランを選択
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              よくある質問
            </h2>
            <p className="text-xl text-gray-600">
              受講前の疑問にお答えします
            </p>
          </div>
          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                プログラミング初心者でも受講できますか？
              </h3>
              <p className="text-gray-600">
                はい、プログラミング初心者の方でも問題ありません。基礎から丁寧に説明し、Claude Codeの力を借りながら段階的に学習を進めていきます。むしろ初心者の方こそ、AI駆動の開発手法を最初から身につけることで、従来の学習方法よりも効率的にスキルアップできます。
              </p>
            </div>
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                受講に必要な環境はありますか？
              </h3>
              <p className="text-gray-600">
                パソコン（Windows、Mac、Linux対応）とインターネット接続があれば受講可能です。Claude Codeはブラウザベースで動作するため、特別なソフトウェアのインストールは最小限で済みます。詳細な環境構築方法は講座開始時にサポートいたします。
              </p>
            </div>
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                どのくらいの学習時間が必要ですか？
              </h3>
              <p className="text-gray-600">
                週10-15時間程度の学習時間を推奨しています。ただし、Claude Codeの効率性により、従来の学習方法と比べて短時間で多くのことを学べます。忙しい方でも週末中心の学習で十分に習得可能です。
              </p>
            </div>
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                就職・転職サポートはありますか？
              </h3>
              <p className="text-gray-600">
                スタンダードプラン以上で就転職サポートを提供しています。履歴書・職務経歴書の添削、面接対策、企業紹介まで総合的にサポートいたします。Claude Codeスキルは現在市場価値が高く、多くの企業から注目されています。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            今すぐ始めて、未来のプログラミングを体験しよう
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            無料体験レッスンで、Claude Codeの革新的な開発体験を実感してください
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors">
              無料体験を始める
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors">
              資料をダウンロード
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Claude Code Academy</h3>
              <p className="text-gray-400">
                AI時代のプログラミング教育を通じて、次世代の開発者を育成します。
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">講座</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">基礎コース</a></li>
                <li><a href="#" className="hover:text-white">応用コース</a></li>
                <li><a href="#" className="hover:text-white">プロジェクトコース</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">サポート</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">お問い合わせ</a></li>
                <li><a href="#" className="hover:text-white">技術サポート</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">会社情報</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">プライバシーポリシー</a></li>
                <li><a href="#" className="hover:text-white">利用規約</a></li>
                <li><a href="#" className="hover:text-white">特定商取引法</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Claude Code Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}