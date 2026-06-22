import { useState, useEffect } from 'react';

const THEMES = [
  { id: 'dinosaur', label: '🦕 공룡', color: '#4caf50' },
  { id: 'space', label: '🚀 우주', color: '#3f51b5' },
  { id: 'animal', label: '🦁 동물', color: '#ff9800' },
  { id: 'doll', label: '🎀 인형', color: '#ff85a2' },
];

export default function Onboarding({ onComplete }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('여자');
  const [theme, setTheme] = useState('doll');

  // Preview theme change dynamically
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    document.body.className = `theme-${newTheme}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !age) return;
    onComplete({ name, age, gender, theme });
  };

  return (
    <div className="card animate-pop-in" style={{ margin: '20px', width: 'calc(100% - 40px)', alignSelf: 'center' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '2rem' }}>환영해요! 👋</h1>
      <p style={{ textAlign: 'center', marginBottom: '30px' }}>나의 정보를 입력해주세요!</p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>이름</label>
          <input 
            type="text" 
            placeholder="이름을 입력하세요 (예: 지안)" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>나이</label>
          <input 
            type="number" 
            placeholder="나이를 입력하세요 (예: 8)" 
            value={age} 
            onChange={(e) => setAge(e.target.value)} 
            required 
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>성별</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="여자">여자 어린이 👧</option>
            <option value="남자">남자 어린이 👦</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '10px' }}>좋아하는 테마 (배경)</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleThemeChange(t.id)}
                style={{
                  padding: '15px 10px',
                  borderRadius: '15px',
                  border: theme === t.id ? `4px solid ${t.color}` : '2px solid transparent',
                  backgroundColor: theme === t.id ? '#fff' : 'var(--text-input-bg)',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'var(--font-main)'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="btn" style={{ marginTop: '20px' }}>
          시작하기! ✨
        </button>
      </form>
    </div>
  );
}
