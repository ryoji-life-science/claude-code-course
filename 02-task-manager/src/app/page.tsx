'use client';

import { useState, useEffect } from 'react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

type FilterType = 'all' | 'active' | 'completed';

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  // ローカルストレージからタスクを読み込み
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      const parsed = JSON.parse(savedTasks);
      const tasksWithDates = parsed.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt)
      }));
      setTasks(tasksWithDates);
    }
  }, []);

  // タスクが変更されたらローカルストレージに保存
  useEffect(() => {
    if (tasks.length > 0 || localStorage.getItem('tasks')) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  // タスクを追加
  const addTask = () => {
    if (newTask.trim() === '') return;
    
    const task: Task = {
      id: Date.now().toString(),
      text: newTask.trim(),
      completed: false,
      createdAt: new Date()
    };
    
    setTasks(prev => [task, ...prev]);
    setNewTask('');
  };

  // タスクの完了状態を切り替え
  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // タスクを削除
  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  // タスクを編集開始
  const startEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  // タスクの編集を保存
  const saveEdit = () => {
    if (editText.trim() === '') return;
    
    setTasks(prev => prev.map(task => 
      task.id === editingId ? { ...task, text: editText.trim() } : task
    ));
    setEditingId(null);
    setEditText('');
  };

  // 編集をキャンセル
  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  // フィルタリングされたタスク
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  // 統計
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const activeTasks = totalTasks - completedTasks;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📝 タスク管理</h1>
          <p className="text-gray-600">効率的にタスクを管理しましょう</p>
        </div>

        {/* 統計表示 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{totalTasks}</div>
              <div className="text-sm text-gray-600">総タスク</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{activeTasks}</div>
              <div className="text-sm text-gray-600">未完了</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
              <div className="text-sm text-gray-600">完了済み</div>
            </div>
          </div>
        </div>

        {/* タスク追加フォーム */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              placeholder="新しいタスクを入力..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={addTask}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              追加
            </button>
          </div>
        </div>

        {/* フィルター */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              すべて
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'active' 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              未完了
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'completed' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              完了済み
            </button>
          </div>
        </div>

        {/* タスク一覧 */}
        <div className="space-y-2">
          {filteredTasks.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="text-gray-400 text-lg">
                {filter === 'all' && 'タスクがありません'}
                {filter === 'active' && '未完了のタスクがありません'}
                {filter === 'completed' && '完了したタスクがありません'}
              </div>
              <div className="text-gray-400 text-sm mt-2">
                新しいタスクを追加してみましょう！
              </div>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white rounded-lg shadow-sm p-4 transition-all ${
                  task.completed ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* 完了チェックボックス */}
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      task.completed
                        ? 'bg-green-600 border-green-600 text-white'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {task.completed && '✓'}
                  </button>

                  {/* タスクテキスト */}
                  <div className="flex-1">
                    {editingId === task.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') saveEdit();
                            if (e.key === 'Escape') cancelEdit();
                          }}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                        <button
                          onClick={saveEdit}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                        >
                          保存
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                        >
                          キャンセル
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <span
                          className={`${
                            task.completed 
                              ? 'line-through text-gray-500' 
                              : 'text-gray-800'
                          }`}
                        >
                          {task.text}
                        </span>
                        <div className="text-xs text-gray-400">
                          {task.createdAt.toLocaleDateString('ja-JP')}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* アクションボタン */}
                  {editingId !== task.id && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(task.id, task.text)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="編集"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="削除"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* フッター */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          データはブラウザに自動保存されます
        </div>
      </div>
    </div>
  );
}