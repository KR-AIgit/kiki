import { useState } from 'react';
import QuestEngine from './QuestEngine';
import PetSystem from './PetSystem';
import ParentDashboard from './ParentDashboard';
import { getDailyQuests, getSemesterLevel } from '../utils/curriculum';

// 요일별 매핑 데이터
const SUBJECTS = {
  0: { id: 'creative', name: '창의 (상상하기)', icon: '💭', desc: '만약에... 상상의 나래를 펼쳐요!' },
  1: { id: 'math', name: '기초연산 수학', icon: '🔢', desc: '재미있는 숫자 놀이!' },
  2: { id: 'korean', name: '한글 맞춤법/어휘', icon: '📝', desc: '또박또박 예쁜 글씨!' },
  3: { id: 'english', name: '간단한 파닉스(영어)', icon: '🔤', desc: 'A B C D~ 영어 노래!' },
  4: { id: 'math', name: '기초연산 수학', icon: '🔢', desc: '재미있는 숫자 놀이!' },
  5: { id: 'korean', name: '한글 맞춤법/어휘', icon: '📝', desc: '또박또박 예쁜 글씨!' },
  6: { id: 'creative', name: '창의 (상상하기)', icon: '💭', desc: '만약에... 상상의 나래를 펼쳐요!' },
};

export default function Dashboard({ user, onReset }) {
  // 뷰 상태: 'main', 'quest', 'complete', 'pet', 'parent'
  const [view, setView] = useState('main'); 
  
  const today = new Date().getDay();
  const todaysQuest = SUBJECTS[today];
  const semesterLevel = getSemesterLevel();
  
  const dailyQuests = getDailyQuests(user.age, todaysQuest.id);

  const handleQuestComplete = () => {
    // 퀘스트 완료 시 스티커 +1 추가
    const currentStickers = parseInt(localStorage.getItem('jian_app_stickers') || '0', 10);
    localStorage.setItem('jian_app_stickers', (currentStickers + 1).toString());
    setView('complete');
  };

  if (view === 'pet') {
    return <PetSystem userTheme={user.theme} onBack={() => setView('main')} />;
  }

  if (view === 'parent') {
    return <ParentDashboard onBack={() => setView('main')} />;
  }

  if (view === 'complete') {
    return (
      <div className="card animate-pop-in" style={{ textAlign: 'center', padding: '40px 20px', margin: '20px', width: 'calc(100% - 40px)', alignSelf: 'center' }}>
        <h2 style={{ fontSize: '3rem', animation: 'bounce 1s infinite' }}>🎉🏆✨</h2>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-color)', margin: '20px 0' }}>최고예요!</h1>
        <p style={{ fontSize: '1.4rem', marginBottom: '30px' }}>오늘의 퀘스트 8문제를 모두 완벽하게 해냈어요!<br/>칭찬 스티커 1개를 받았어요! ⭐️</p>
        <button className="btn" onClick={() => setView('pet')} style={{ width: '100%', marginBottom: '10px' }}>
          내 펫 보러가기 🐾
        </button>
        <button className="btn" onClick={() => setView('main')} style={{ width: '100%', backgroundColor: 'var(--secondary-color)' }}>
          메인으로 돌아가기
        </button>
      </div>
    );
  }

  if (view === 'quest') {
    return (
      <div className="animate-pop-in" style={{ width: '100%', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.8rem' }}>{todaysQuest.icon} {todaysQuest.name}</h2>
          <button className="btn" style={{ padding: '8px 15px', fontSize: '1rem', backgroundColor: '#f44336' }} onClick={() => setView('main')}>
            그만하기
          </button>
        </div>
        <QuestEngine quests={dailyQuests} onComplete={handleQuestComplete} />
      </div>
    );
  }

  return (
    <div className="animate-pop-in" style={{ width: '100%', padding: '20px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* 비밀 부모님 버튼 (왼쪽 위 투명한 락 아이콘) */}
      <button 
        onClick={() => setView('parent')} 
        style={{ position: 'absolute', top: '20px', left: '20px', background: 'none', border: 'none', fontSize: '1.5rem', opacity: 0.3, cursor: 'pointer' }}
        title="부모님 모드"
      >
        🔒
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', marginTop: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem' }}>안녕, {user.name}! 🌟</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.8, marginTop: '5px' }}>현재 진도: <strong>{semesterLevel}</strong></p>
        </div>
        <button 
          onClick={onReset}
          style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', color: 'var(--text-color)', fontFamily: 'var(--font-main)' }}>
          정보 수정
        </button>
      </div>

      <div className="card" style={{ textAlign: 'center', padding: '30px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>오늘의 퀘스트 🎯</h2>
        <div style={{ 
          fontSize: '5rem', 
          margin: '30px 0', 
          animation: 'bounce 2s infinite' 
        }}>
          {todaysQuest.icon}
        </div>
        <h3 style={{ fontSize: '1.8rem', color: 'var(--primary-color)' }}>{todaysQuest.name}</h3>
        <p style={{ fontSize: '1.2rem', marginTop: '10px', marginBottom: '30px' }}>{todaysQuest.desc}</p>
        
        <button className="btn" onClick={() => setView('quest')} style={{ width: '100%', fontSize: '1.6rem', padding: '20px' }}>
          출발하기! 🚀
        </button>
      </div>

      {/* 펫 시스템 진입 버튼 */}
      <button className="card btn" onClick={() => setView('pet')} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
        <span style={{ fontSize: '1.5rem' }}>나만의 펫 키우기 🐾</span>
        <span style={{ fontSize: '1.5rem' }}>👉</span>
      </button>
    </div>
  );
}
