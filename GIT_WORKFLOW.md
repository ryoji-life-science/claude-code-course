# Git操作ガイド 📝

忘れがちなGit操作を自動的に行うためのチェックリストとコマンド集

## 🚀 新規プロジェクト作成時（必須）

### 1. プロジェクト作成直後
```bash
# Next.jsプロジェクト作成後、すぐに実行
cd プロジェクト名
git init
git add .
git commit -m "初期設定: プロジェクト作成

- Next.js 15 + TypeScript + Tailwind CSS
- 基本設定完了

🤖 Generated with Claude Code"
```

### 2. GitHubリポジトリ作成 & 連携
```bash
# GitHubでリポジトリ作成後
git remote add origin https://github.com/ryoji-life-science/プロジェクト名.git
git push -u origin main
```

## ⏰ 定期的なコミット（習慣化）

### 毎回作業開始時
```bash
# 最新の状態を確認
git status
git pull  # チームで作業している場合
```

### 機能実装完了時（即座に実行）
```bash
git add .
git commit -m "具体的な変更内容を記述"
git push
```

### 作業終了時（毎回必須）
```bash
# 1日の作業終了時
git add .
git commit -m "作業終了: 今日実装した内容のまとめ"
git push
```

## 📋 コミットタイミング チェックリスト

### ✅ 即座にコミットすべき瞬間
- [ ] 新しい機能が動作確認できた
- [ ] バグを1つ修正した
- [ ] デザインを変更した
- [ ] 新しいページを追加した
- [ ] API連携ができた
- [ ] テストを追加した
- [ ] 作業を中断する前
- [ ] 1日の作業終了時

### ❌ コミットを避けるべき状態
- [ ] エラーが出ている
- [ ] 動作確認していない
- [ ] 作業途中の中途半端な状態

## 🎯 コミットメッセージのテンプレート

### 機能追加
```bash
git commit -m "新機能: ○○機能を実装

- 具体的な機能の説明
- 動作確認済み

🤖 Generated with Claude Code"
```

### バグ修正
```bash
git commit -m "修正: ○○のバグを解決

- 問題の説明
- 修正内容
- 動作確認済み

🤖 Generated with Claude Code"
```

### デザイン変更
```bash
git commit -m "デザイン: ○○のスタイルを改善

- 変更箇所の説明
- レスポンシブ対応確認済み

🤖 Generated with Claude Code"
```

### リファクタリング
```bash
git commit -m "リファクタリング: ○○のコードを改善

- 改善内容
- 動作に影響なし確認済み

🤖 Generated with Claude Code"
```

## 🔄 日常的なGitワークフロー

### 朝の作業開始時
```bash
# 1. ターミナルでプロジェクトフォルダに移動
cd /path/to/project

# 2. 最新状態を確認
git status
git pull

# 3. 開発サーバー起動
npm run dev
```

### 機能実装中（15-30分ごと）
```bash
# 小さな変更でもこまめに保存
git add .
git commit -m "進捗: ○○の実装中"
git push
```

### 夕方の作業終了時
```bash
# 1. 最終的な動作確認
npm run build  # エラーがないか確認

# 2. 全ての変更をコミット
git add .
git commit -m "作業終了: 本日の実装完了

今日の成果:
- ○○機能を実装
- ○○のバグを修正
- ○○のデザインを改善

🤖 Generated with Claude Code"

# 3. GitHubにプッシュ
git push
```

## 🚨 緊急時のコマンド

### 間違えてコミットした場合
```bash
# 直前のコミットを取り消し（ファイルは残る）
git reset --soft HEAD~1

# コミットメッセージだけ修正
git commit --amend -m "正しいコミットメッセージ"
```

### ファイルを間違えて追加した場合
```bash
# ステージングから除外
git reset ファイル名

# .gitignoreに追加してから再コミット
echo "除外したいファイル" >> .gitignore
git add .gitignore
git commit -m ".gitignoreを更新"
```

## 📱 スマホのリマインダー設定例

### 定期リマインダー
- **毎日 18:00**: 「作業終了前にgit push しましたか？」
- **毎週 金曜**: 「今週のプロジェクトをGitHubで確認」

### 作業時リマインダー  
- **Pomodoro 25分後**: 「git add . && git commit して進捗を保存」

## 🎯 成功のコツ

1. **小さく、頻繁に** コミットする
2. **具体的なメッセージ** を書く
3. **動作確認後** にコミットする
4. **毎日必ず** プッシュする
5. **習慣化** するまで続ける

## 📞 困った時のヘルプ

```bash
# 現在の状態を確認
git status

# コミット履歴を確認
git log --oneline -10

# ヘルプを表示
git help
```

---
**💡 覚え方**: 「作業したら即コミット、1日の終わりに必ずプッシュ」