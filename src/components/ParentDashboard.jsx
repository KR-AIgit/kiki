import { useState, useEffect } from 'react';

export default function ParentDashboard({ onBack }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [wrongNotes, setWrongNotes] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      const notes = JSON.parse(localStorage.getItem('jian_app_wrong_notes') || '[]');
      // 최신순으로 정렬
      notes.sort((a, b) => new Date(b.date) - new Date(a.date));
      setWrongNotes(notes);
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pin === '1234') { // 기본 비밀번호 1234
      setIsAuthenticated(true);
    } else {
      alert('비밀번호가 틀렸습니다.');
      setPin('');
    }
  };

  const handleClearNotes = () => {
    if (window.confirm('오답 노트를 모두 지우시겠습니까?')) {
      localStorage.removeItem('jian_app_wrong_notes');
      setWrongNotes([]);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="card animate-pop-in" style={{ width: '100%', maxWidth: '400px', margin: '0 auto', padding: '30px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>🔒 부모님 모드</h2>
        <p style={{ marginBottom: '20px', opacity: 0.8 }}>비밀번호를 입력해주세요. (기본: 1234)</p>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="password" 
            value={pin} 
            onChange={(e) => setPin(e.target.value)} 
            placeholder="비밀번호 4자리" 
            style={{ textAlign: 'center', fontSize: '2rem', letterSpacing: '10px' }}
            maxLength={4}
          />
          <button type="submit" className="btn" style={{ backgroundColor: '#607d8b' }}>
            확인
          </button>
        </form>
        <button onClick={onBack} style={{ marginTop: '20px', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', fontFamily: 'var(--font-main)' }}>
          닫기
        </button>
      </div>
    );
  }

  return (
    <div className="card animate-pop-in" style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.8rem' }}>📝 우리 아이 오답 노트</h2>
        <button onClick={onBack} className="btn" style={{ padding: '8px 15px', fontSize: '1rem' }}>돌아가기</button>
      </div>

      {wrongNotes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', backgroundColor: '#f9f9f9', borderRadius: '15px', color: '#888' }}>
          <p>틀린 문제가 없습니다! 완벽해요. ✨</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '60vh', overflowY: 'auto', paddingRight: '10px' }}>
          {wrongNotes.map((note, idx) => (
            <div key={idx} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '10px', backgroundColor: '#fff' }}>
              <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}>
                {new Date(note.date).toLocaleString()}
              </p>
              {note.storyText && (
                <p style={{ fontSize: '0.9rem', marginBottom: '10px', color: '#555', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
                  [지문] {note.storyText}
                </p>
              )}
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', wordBreak: 'keep-all' }}>Q. {note.question}</h3>
              <p style={{ color: '#f44336', fontWeight: 'bold' }}>올바른 정답: {note.answer}</p>
            </div>
          ))}
        </div>
      )}

      {wrongNotes.length > 0 && (
        <button onClick={handleClearNotes} style={{ width: '100%', marginTop: '20px', padding: '10px', backgroundColor: 'transparent', border: '1px solid #f44336', color: '#f44336', borderRadius: '10px', cursor: 'pointer', fontFamily: 'var(--font-main)' }}>
          기록 모두 지우기
        </button>
      )}
    </div>
  );
}
