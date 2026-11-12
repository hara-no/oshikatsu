import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  Heart, 
  Sparkles, 
  DollarSign, 
  Filter, 
  Plus, 
  Trash2, 
  Tag, 
  Palette, 
  ChevronLeft, 
  ChevronRight, 
  Star,
  Music,
  Tv,
  BookOpen,
  MapPin,
  Smile,
  ShoppingBag,
  Camera,
  Coffee,
  Ticket
} from 'lucide-react';

// --- カラーテーマ定義 (15色) ---
const THEMES = [
  { id: 'green', name: 'セージグリーン (Default)', bg: 'bg-[#F2F7F4]', primary: '#5B8A72', secondary: '#A3C1AD', cardBg: 'rgba(255, 255, 255, 0.85)', text: '#2C4033', accent: '#E0EDE4' },
  { id: 'sakura', name: 'さくらピンク', bg: 'bg-[#FFF5F7]', primary: '#E07A93', secondary: '#F4A6B8', cardBg: 'rgba(255, 255, 255, 0.85)', text: '#4A2C33', accent: '#FCE4EC' },
  { id: 'lavender', name: 'ラベンダー', bg: 'bg-[#F8F5FC]', primary: '#8E7CC3', secondary: '#BCAAA4', cardBg: 'rgba(255, 255, 255, 0.85)', text: '#3A324A', accent: '#EDE7F6' },
  { id: 'sky', name: 'スカイブルー', bg: 'bg-[#F0F8FF]', primary: '#5C93C4', secondary: '#9AC0CD', cardBg: 'rgba(255, 255, 255, 0.85)', text: '#243B4E', accent: '#E3F2FD' },
  { id: 'lemon', name: 'レモンクリーム', bg: 'bg-[#FFFEF0]', primary: '#D4A373', secondary: '#FAEDCD', cardBg: 'rgba(255, 255, 255, 0.85)', text: '#4D3E25', accent: '#FEF9E7' },
  { id: 'mint', name: 'ミントシャワー', bg: 'bg-[#F0FDF4]', primary: '#48BB78', secondary: '#9AE6B4', cardBg: 'rgba(255, 255, 255, 0.85)', text: '#1A4731', accent: '#DCFCE7' },
  { id: 'peach', name: 'ピーチネクター', bg: 'bg-[#FFF5EE]', primary: '#ED8936', secondary: '#FBD38D', cardBg: 'rgba(255, 255, 255, 0.85)', text: '#5B341E', accent: '#FFEDD5' },
  { id: 'rose', name: 'アンティークローズ', bg: 'bg-[#FDF2F4]', primary: '#D53F8C', secondary: '#F687B3', cardBg: 'rgba(255, 255, 255, 0.85)', text: '#501533', accent: '#FCE7F3' },
  { id: 'midnight', name: 'ミッドナイトパープル', bg: 'bg-[#F5F3FF]', primary: '#6B46C1', secondary: '#B794F4', cardBg: 'rgba(255, 255, 255, 0.85)', text: '#2D1B69', accent: '#EDE9FE' },
  { id: 'teal', name: 'ディープティール', bg: 'bg-[#F0FDFA]', primary: '#0D9488', secondary: '#5CBDBC', cardBg: 'rgba(255, 255, 255, 0.85)', text: '#134E4A', accent: '#CCFBF1' },
  { id: 'chocolate', name: 'ショコラ', bg: 'bg-[#FAF6F0]', primary: '#8D6E63', secondary: '#D7CCC8', cardBg: 'rgba(255, 255, 255, 0.85)', text: '#3E2723', accent: '#EFEBE9' },
  { id: 'sunflower', name: 'サンフラワー', bg: 'bg-[#FEFCE8]', primary: '#CA8A04', secondary: '#FDE047', cardBg: 'rgba(255, 255, 255, 0.85)', text: '#422006', accent: '#FEF08A' },
  { id: 'berry', name: 'ベリータルト', bg: 'bg-[#FFF1F2]', primary: '#E11D48', secondary: '#FDA4AF', cardBg: 'rgba(255, 255, 255, 0.85)', text: '#4C0519', accent: '#FFE4E6' },
  { id: 'matcha', name: 'まっちゃラテ', bg: 'bg-[#F4F7F2]', primary: '#4D7C0F', secondary: '#BEF264', cardBg: 'rgba(255, 255, 255, 0.85)', text: '#1A2E05', accent: '#ECFCCB' },
  { id: 'monochrome', name: 'エクリュモノトーン', bg: 'bg-[#FAFAFA]', primary: '#525252', secondary: '#D4D4D4', cardBg: 'rgba(255, 255, 255, 0.9)', text: '#171717', accent: '#F5F5F5' },
];

// --- 10種類の推し活カテゴリー ---
const CATEGORIES = [
  { id: 'live', name: 'ライブ・コンサート', color: '#FF6B6B', icon: Ticket },
  { id: 'release', name: 'CD/DVDリリース', color: '#4ECDC4', icon: Music },
  { id: 'media', name: 'TV/メディア出演', color: '#45B7D1', icon: Tv },
  { id: 'magazine', name: '雑誌・書籍発売', color: '#96CEB4', icon: BookOpen },
  { id: 'goods', name: 'グッズ購入', color: '#FFEEAD', icon: ShoppingBag },
  { id: 'event', name: 'イベント・特典会', color: '#D4A5A5', icon: Sparkles },
  { id: 'cafe', name: 'コラボカフェ', color: '#FF9999', icon: Coffee },
  { id: 'pilgrimage', name: '聖地巡礼', color: '#88D8B0', icon: MapPin },
  { id: 'birthday', name: '記念日・生誕祭', color: '#FFB347', icon: Heart },
  { id: 'other', name: 'その他・メモ', color: '#B39DDB', icon: Smile },
];

// デモ用の初期予定データ
const INITIAL_EVENTS = [
  { id: '1', title: 'ニューシングル「Sparkle」発売', date: '2026-10-15', category: 'release', artist: '☆', cost: 1500, memo: '初回限定盤A・B予約済み' },
  { id: '2', title: '秋の全国ツアー東京公演', date: '2026-10-22', category: 'live', artist: '☆', cost: 9800, memo: 'アリーナ席！ペンライト準備' },
  { id: '3', title: '「JUNON」表紙号発売', date: '2026-10-28', category: 'magazine', artist: '🌸', cost: 950, memo: '書店予約完了' },
  { id: '4', title: 'コラボカフェ来店日', date: '2026-10-05', category: 'cafe', artist: '☆', cost: 3500, memo: '特典コースター狙い' },
];

export default function App() {
  const [currentTheme, setCurrentTheme] = useState(THEMES[0]);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1)); // 2026年10月基準
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [selectedArtistFilter, setSelectedArtistFilter] = useState('ALL');
  
  // モーダル・新規作成用ステート
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('2026-10-10');
  const [newCategory, setNewCategory] = useState('live');
  const [newArtist, setNewArtist] = useState('☆');
  const [newCost, setNewCost] = useState('');
  const [newMemo, setNewMemo] = useState('');

  // 推しメモ＆プロファイルステート
  const [oshiName, setOshiName] = useState('☆ & 🌸');
  const [oshiMessage, setOshiMessage] = useState('ビジュ最高✨');
  const [oshiPhoto, setOshiPhoto] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80');

  // アーティスト一覧の取得
  const artists = useMemo(() => {
    const set = new Set(events.map(e => e.artist));
    return ['ALL', ...Array.from(set)];
  }, [events]);

  // フィルターされた予定
  const filteredEvents = useMemo(() => {
    if (selectedArtistFilter === 'ALL') return events;
    return events.filter(e => e.artist === selectedArtistFilter);
  }, [events, selectedArtistFilter]);

  // 今月の合計金額
  const totalCost = useMemo(() => {
    return filteredEvents.reduce((sum, e) => sum + (Number(e.cost) || 0), 0);
  }, [filteredEvents]);

  // カレンダーの日付生成
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const calendarDays = useMemo(() => {
    const days = [];
    // 前月余白
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({ dayNumber: null, dateStr: null });
    }
    // 当月日
    for (let i = 1; i <= daysInMonth; i++) {
      const mStr = String(month + 1).padStart(2, '0');
      const dStr = String(i).padStart(2, '0');
      const dateStr = `${year}-${mStr}-${dStr}`;
      days.push({ dayNumber: i, dateStr });
    }
    return days;
  }, [year, month, daysInMonth, firstDayOfWeek]);

  // 予定の追加処理
  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newEv = {
      id: Date.now().toString(),
      title: newTitle,
      date: newDate,
      category: newCategory,
      artist: newArtist || '推し',
      cost: Number(newCost) || 0,
      memo: newMemo
    };
    setEvents([...events, newEv]);
    setNewTitle('');
    setNewCost('');
    setNewMemo('');
    setIsModalOpen(false);
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter(ev => ev.id !== id));
  };

  return (
    <div className={`min-h-screen ${currentTheme.bg} transition-colors duration-500 relative overflow-x-hidden font-sans`} style={{ color: currentTheme.text }}>
      
      {/* 背景の小さなお花ランダム配置 (CSSフラワーパターン) */}
      <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden z-0">
        {[...Array(25)].map((_, i) => (
          <div 
            key={i} 
            className="absolute text-white"
            style={{
              top: `${(i * 17) % 100}%`,
              left: `${(i * 23) % 100}%`,
              transform: `scale(${0.6 + (i % 5) * 0.2}) rotate(${i * 35}deg)`,
            }}
          >
            🌸
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        
        {/* ヘッダーセクション */}
        <header className="flex flex-col md:flex-row justify-between items-center bg-white/85 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/60 mb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md" style={{ backgroundColor: currentTheme.primary }}>
              <Heart className="w-8 h-8 fill-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white shadow-sm" style={{ backgroundColor: currentTheme.primary }}>
                  Oshi Calendar
                </span>
                <span className="text-sm font-medium opacity-75">✨info✨</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                {oshiName} カレンダー
              </h1>
            </div>
          </div>

          {/* テーマカラー選択 (15色パレット) */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold opacity-80">
              <Palette className="w-4 h-4" />
              <span>テーマカラーを選ぶ (15色)</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-w-xs justify-end">
              {THEMES.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => setCurrentTheme(theme)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${currentTheme.id === theme.id ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'border-white'}`}
                  style={{ backgroundColor: theme.primary }}
                  title={theme.name}
                />
              ))}
            </div>
          </div>
        </header>

        {/* メインレイアウト (左: サイドバー, 右: カレンダー＆管理) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* 左サイドバー: 推しプロファイル & 金額管理 & カテゴリー一覧 */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* 推しプロファイル & メモカード */}
            <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/60 text-center">
              <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden shadow-md border-4 border-white">
                <img src={oshiPhoto} alt="Oshi" className="w-full h-full object-cover" />
              </div>
              <input 
                type="text" 
                value={oshiName}
                onChange={(e) => setOshiName(e.target.value)}
                className="font-bold text-lg text-center w-full bg-transparent border-b border-dashed border-gray-300 focus:outline-none focus:border-pink-400 mb-2"
              />
              <textarea 
                value={oshiMessage}
                onChange={(e) => setOshiMessage(e.target.value)}
                rows={2}
                className="text-xs text-center w-full bg-pink-50/50 rounded-xl p-2 border border-pink-100 focus:outline-none focus:ring-1 focus:ring-pink-300 resize-none"
                placeholder="今月の意気込みやメモを入力..."
              />
            </div>

            {/* 今月の推し活費 集計カード */}
            <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/60">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold flex items-center gap-1.5 opacity-90">
                  <DollarSign className="w-4 h-4" style={{ color: currentTheme.primary }} />
                  今月の推し活
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 font-semibold">
                  {selectedArtistFilter === 'ALL' ? '全体合計' : selectedArtistFilter}
                </span>
              </div>
              <div className="text-3xl font-extrabold mb-3 tracking-tight" style={{ color: currentTheme.primary }}>
                ¥{totalCost.toLocaleString()}
              </div>
              
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-3 rounded-2xl text-white font-bold flex items-center justify-center gap-2 shadow-md transition-all hover:opacity-90 active:scale-95"
                style={{ backgroundColor: currentTheme.primary }}
              >
                <Plus className="w-5 h-5" />
                新しい予定・金額を追加
              </button>
            </div>

            {/* 10種類のカテゴリー一覧 */}
            <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/60">
              <h3 className="text-sm font-bold mb-3 flex items-center gap-1.5 opacity-90">
                <Tag className="w-4 h-4" style={{ color: currentTheme.primary }} />
                推し活カテゴリー (10種)
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {CATEGORIES.map(cat => {
                  const IconComp = cat.icon;
                  return (
                    <div key={cat.id} className="flex items-center justify-between text-xs py-1.5 px-2 rounded-xl hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full inline-block shadow-sm" style={{ backgroundColor: cat.color }} />
                        <span className="font-medium">{cat.name}</span>
                      </div>
                      <IconComp className="w-3.5 h-3.5 opacity-40" />
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* 右メインエリア: カレンダー & 予定一覧 */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* カレンダーコントロール & アーティストフィルター */}
            <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/60 flex flex-col md:flex-row justify-between items-center gap-4">
              
              {/* 年月切り替え */}
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-extrabold tracking-wide">
                  {year}年 {month + 1}月
                </h2>
                <button 
                  onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* アーティスト別フィルター */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Filter className="w-4 h-4 opacity-60" />
                <span className="text-xs font-bold whitespace-nowrap">推し・グループ別:</span>
                <select 
                  value={selectedArtistFilter}
                  onChange={(e) => setSelectedArtistFilter(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2"
                  style={{ accentColor: currentTheme.primary }}
                >
                  {artists.map(art => (
                    <option key={art} value={art}>{art === 'ALL' ? 'すべての推し (一覧)' : art}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* カレンダー本体グリッド */}
            <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/60">
              
              {/* 曜日ヘッダー */}
              <div className="grid grid-cols-7 gap-2 mb-4 text-center">
                {['日', '月', '火', '水', '木', '金', '土'].map((d, i) => (
                  <div key={d} className={`text-xs font-bold ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'opacity-70'}`}>
                    {d}
                  </div>
                ))}
              </div>

              {/* 日付セル */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((cDay, idx) => {
                  if (!cDay.dayNumber) {
                    return <div key={`empty-${idx}`} className="h-28 bg-gray-50/30 rounded-2xl border border-dashed border-gray-200/50" />;
                  }

                  // この日の予定を抽出
                  const dayEvents = filteredEvents.filter(ev => ev.date === cDay.dateStr);

                  return (
                    <div 
                      key={cDay.dateStr} 
                      className="h-28 bg-white/70 rounded-2xl border border-gray-100 p-2 flex flex-col justify-between overflow-y-auto hover:shadow-md transition-shadow relative group"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold px-1.5 py-0.5 rounded-md bg-gray-100">
                          {cDay.dayNumber}
                        </span>
                        {dayEvents.length > 0 && (
                          <span className="text-[10px] font-bold px-1 rounded-full text-white" style={{ backgroundColor: currentTheme.primary }}>
                            {dayEvents.length}件
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 my-1 flex-1 overflow-y-auto pr-0.5">
                        {dayEvents.map(ev => {
                          const catObj = CATEGORIES.find(c => c.id === ev.category) || CATEGORIES[9];
                          return (
                            <div 
                              key={ev.id}
                              className="text-[10px] px-1.5 py-1 rounded-lg text-white font-medium truncate shadow-sm flex items-center justify-between group/item"
                              style={{ backgroundColor: catObj.color }}
                              title={`${ev.title} (${ev.artist}) - ¥${Number(ev.cost).toLocaleString()}`}
                            >
                              <span className="truncate">{ev.title}</span>
                              <button 
                                onClick={() => handleDeleteEvent(ev.id)}
                                className="hidden group-hover/item:block text-white hover:text-red-200 ml-1"
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      {/* ホバー時に＋ボタンで追加しやすく */}
                      <button 
                        onClick={() => {
                          setNewDate(cDay.dateStr);
                          setIsModalOpen(true);
                        }}
                        className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 text-[10px] bg-gray-900 text-white rounded-full w-5 h-5 flex items-center justify-center transition-opacity shadow"
                        title="この日に予定を追加"
                      >
                        +
                      </button>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* 予定および金額詳細リスト */}
            <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/60">
              <h3 className="text-sm font-bold mb-4 flex items-center justify-between">
                <span className="flex items-center gap-1.5 opacity-90">
                  <Sparkles className="w-4 h-4" style={{ color: currentTheme.primary }} />
                  {selectedArtistFilter === 'ALL' ? 'すべての推し活スケジュール一覧' : `${selectedArtistFilter} のスケジュール一覧`}
                </span>
                <span className="text-xs opacity-60">全 {filteredEvents.length} 件</span>
              </h3>

              {filteredEvents.length === 0 ? (
                <p className="text-xs text-center py-8 opacity-50">予定がまだありません。新しい予定を追加してね！</p>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  {filteredEvents.map(ev => {
                    const catObj = CATEGORIES.find(c => c.id === ev.category) || CATEGORIES[9];
                    return (
                      <div key={ev.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-pink-200 transition-all gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-10 rounded-full" style={{ backgroundColor: catObj.color }} />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: catObj.color }}>
                                {catObj.name}
                              </span>
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-100 opacity-80">
                                {ev.artist}
                              </span>
                              <span className="text-xs font-bold opacity-60">{ev.date}</span>
                            </div>
                            <h4 className="font-bold text-sm mt-1">{ev.title}</h4>
                            {ev.memo && <p className="text-xs opacity-70 mt-0.5">📝 {ev.memo}</p>}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 self-end sm:self-center">
                          <div className="text-right">
                            <span className="text-xs opacity-60 block">費用</span>
                            <span className="font-extrabold text-sm" style={{ color: currentTheme.primary }}>
                              ¥{Number(ev.cost).toLocaleString()}
                            </span>
                          </div>
                          <button 
                            onClick={() => handleDeleteEvent(ev.id)}
                            className="p-2 text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors"
                            title="削除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* 新規予定追加モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-extrabold mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 fill-pink-400 text-pink-400" />
              推し活スケジュールを追加
            </h3>

            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="text-xs font-bold opacity-80 block mb-1">イベント名 / タイトル</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="例: アルバム発売 / ライブ参戦"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold opacity-80 block mb-1">日付</label>
                  <input 
                    type="date" 
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold opacity-80 block mb-1">推し・グループ名</label>
                  <input 
                    type="text" 
                    value={newArtist}
                    onChange={(e) => setNewArtist(e.target.value)}
                    placeholder="例: 推しグループA"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold opacity-80 block mb-1">カテゴリー</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold opacity-80 block mb-1">金額 (円)</label>
                  <input 
                    type="number" 
                    value={newCost}
                    onChange={(e) => setNewCost(e.target.value)}
                    placeholder="例: 8500"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold opacity-80 block mb-1">メモ・座席など</label>
                <input 
                  type="text" 
                  value={newMemo}
                  onChange={(e) => setNewMemo(e.target.value)}
                  placeholder="例: アリーナBブロック 3列目"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  キャンセル
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition-all hover:opacity-90"
                  style={{ backgroundColor: currentTheme.primary }}
                >
                  追加する
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
