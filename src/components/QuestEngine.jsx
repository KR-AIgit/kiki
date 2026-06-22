import { useState } from 'react';

export default function QuestEngine({ quests, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState(null); // 'correct', 'wrong', null
  
  const currentQuest = quests[currentIndex];
  const progress = ((currentIndex) / quests.length) * 100;

  // 오답 노트에 저장
  const saveToWrongNotes = (quest) => {
    try {
      const existing = JSON.parse(localStorage.getItem('jian_app_wrong_notes') || '[]');
      if (!existing.find(q => q.id === quest.id)) {
        existing.push({ ...quest, date: new Date().toISOString() });
        localStorage.setItem('jian_app_wrong_notes', JSON.stringify(existing));
      }
    } catch (e) {
      console.error('Failed to save wrong note');
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= quests.length) {
      onComplete(); // 퀘스트 모두 완료
    } else {
      setCurrentIndex(currentIndex + 1);
      setInputValue('');
      setFeedback(null);
    }
  };

  const checkAnswer = (userAnswer) => {
    if (currentQuest.answer === "자유답변") {
      setFeedback('correct');
      setTimeout(handleNext, 1500);
      return;
    }

    const isCorrect = String(userAnswer).replace(/\s/g, '').toLowerCase() === String(currentQuest.answer).replace(/\s/g, '').toLowerCase();
    
    if (isCorrect) {
      setFeedback('correct');
      setTimeout(handleNext, 1500); 
    } else {
      setFeedback('wrong');
      saveToWrongNotes(currentQuest);
      setTimeout(() => setFeedback(null), 2000); 
    }
  };

  const handlePlayAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentQuest.ttsText || currentQuest.question);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("이 브라우저에서는 소리 듣기를 지원하지 않아요.");
    }
  };

  return (
    <div className="card animate-pop-in" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ width: '100%', height: '15px', backgroundColor: 'var(--text-input-bg)', borderRadius: '10px', overflow: 'hidden', marginBottom: '20px' }}>
        <div style={{ width: `${progress}%`, height: '100%', backgroundColor: 'var(--primary-color)', transition: 'width 0.3s ease' }}></div>
      </div>
      <p style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' }}>문제 {currentIndex + 1} / {quests.length}</p>

      {/* 스토리(지문) 영역 */}
      {currentQuest.type === 'story' && currentQuest.storyText && (
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '15px', marginBottom: '20px', border: '2px dashed var(--secondary-color)', lineHeight: '1.6', fontSize: '1.2rem', color: '#333' }}>
          📖 {currentQuest.storyText}
        </div>
      )}

      {/* 질문 영역 */}
      <h2 style={{ fontSize: '1.6rem', marginBottom: '30px', textAlign: 'center', wordBreak: 'keep-all' }}>
        {currentQuest.question}
      </h2>

      {/* 피드백 애니메이션 */}
      {feedback === 'correct' && (
        <div style={{ textAlign: 'center', color: '#4caf50', fontSize: '2rem', animation: 'popIn 0.5s forwards', marginBottom: '20px' }}>
          정답이에요! 🎉
        </div>
      )}
      {feedback === 'wrong' && (
        <div style={{ textAlign: 'center', color: '#f44336', fontSize: '1.5rem', animation: 'bounce 0.5s forwards', marginBottom: '20px' }}>
          다시 한 번 생각해볼까요? 🤔
        </div>
      )}

      {/* 타입별 렌더링 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* 객관식 및 스토리형(선택지) */}
        {(currentQuest.type === 'choice' || (currentQuest.type === 'story' && currentQuest.options)) && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {currentQuest.options.map((opt, idx) => (
              <button 
                key={idx} 
                className="btn" 
                style={{ backgroundColor: 'var(--text-input-bg)', color: 'var(--text-color)', border: '2px solid var(--primary-color)', padding: '15px', fontSize: '1.2rem' }}
                onClick={() => checkAnswer(opt)}
                disabled={feedback === 'correct'}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* 주관식 및 스토리형(작성형) */}
        {(currentQuest.type === 'write' || (currentQuest.type === 'story' && !currentQuest.options)) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input 
              type="text" 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
              placeholder="여기에 정답을 적어주세요!" 
              disabled={feedback === 'correct'}
            />
            <button className="btn" onClick={() => checkAnswer(inputValue)} disabled={!inputValue || feedback === 'correct'}>
              확인하기
            </button>
          </div>
        )}

        {/* 듣고 쓰기 */}
        {currentQuest.type === 'listen' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
            <button className="btn" onClick={handlePlayAudio} style={{ fontSize: '3rem', padding: '20px', borderRadius: '50%' }}>
              🔊
            </button>
            <p style={{ opacity: 0.7 }}>버튼을 눌러 소리를 들어보세요!</p>
            <input 
              type="text" 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
              placeholder="들은 내용을 적어주세요!" 
              style={{ width: '100%' }}
              disabled={feedback === 'correct'}
            />
            <button className="btn" onClick={() => checkAnswer(inputValue)} disabled={!inputValue || feedback === 'correct'} style={{ width: '100%' }}>
              확인하기
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
