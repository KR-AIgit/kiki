import { useState, useEffect } from 'react';

const PET_STAGES = {
  space: [
    { stage: 1, req: 0, icon: '🥚', name: '우주 알' },
    { stage: 2, req: 5, icon: '🚀', name: '꼬마 로켓' },
    { stage: 3, req: 10, icon: '👨‍🚀', name: '멋진 우주인' },
    { stage: 4, req: 15, icon: '🧚‍♀️', name: '은하수 요정' }
  ],
  dinosaur: [
    { stage: 1, req: 0, icon: '🥚', name: '공룡 알' },
    { stage: 2, req: 5, icon: '🦎', name: '아기 공룡' },
    { stage: 3, req: 10, icon: '🦖', name: '티라노사우루스' },
    { stage: 4, req: 15, icon: '🦕', name: '멋진 익룡' }
  ],
  animal: [
    { stage: 1, req: 0, icon: '🥚', name: '동물 알' },
    { stage: 2, req: 5, icon: '🐰', name: '아기 토끼' },
    { stage: 3, req: 10, icon: '🐶', name: '귀여운 강아지' },
    { stage: 4, req: 15, icon: '🦁', name: '사자 왕' }
  ],
  doll: [
    { stage: 1, req: 0, icon: '🎁', name: '선물 상자' },
    { stage: 2, req: 5, icon: '🧸', name: '곰인형' },
    { stage: 3, req: 10, icon: '👗', name: '예쁜 드레스' },
    { stage: 4, req: 15, icon: '👑', name: '공주님 인형' }
  ]
};

export default function PetSystem({ userTheme, onBack }) {
  const [stickers, setStickers] = useState(0);

  useEffect(() => {
    const savedStickers = parseInt(localStorage.getItem('jian_app_stickers') || '0', 10);
    setStickers(savedStickers);
  }, []);

  const themePets = PET_STAGES[userTheme] || PET_STAGES['doll'];
  
  // 현재 진화 단계 찾기
  let currentPet = themePets[0];
  let nextPet = themePets[1];
  
  for (let i = themePets.length - 1; i >= 0; i--) {
    if (stickers >= themePets[i].req) {
      currentPet = themePets[i];
      nextPet = themePets[i + 1] || null;
      break;
    }
  }

  const progressToNext = nextPet ? ((stickers - currentPet.req) / (nextPet.req - currentPet.req)) * 100 : 100;

  return (
    <div className="card animate-pop-in" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', textAlign: 'center', padding: '30px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>나만의 펫 키우기 🐾</h1>
      <p style={{ opacity: 0.8, marginBottom: '30px' }}>매일 퀘스트를 깨면 스티커를 얻고 펫이 진화해요!</p>

      <div style={{ backgroundColor: 'var(--text-input-bg)', padding: '40px 20px', borderRadius: '20px', marginBottom: '30px', position: 'relative' }}>
        <div style={{ fontSize: '6rem', animation: 'bounce 2s infinite', marginBottom: '10px' }}>
          {currentPet.icon}
        </div>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--primary-color)' }}>{currentPet.name}</h2>
      </div>

      <div style={{ textAlign: 'left', marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span>모은 스티커: ⭐️ {stickers}개</span>
          <span>{nextPet ? `다음 진화까지: ${nextPet.req - stickers}개` : '최종 진화 완료!'}</span>
        </div>
        <div style={{ width: '100%', height: '15px', backgroundColor: 'var(--text-input-bg)', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ width: `${progressToNext}%`, height: '100%', backgroundColor: 'var(--primary-color)', transition: 'width 0.5s ease' }}></div>
        </div>
        {nextPet && <p style={{ textAlign: 'center', marginTop: '10px', opacity: 0.7, fontSize: '0.9rem' }}>다음 모습: {nextPet.icon}</p>}
      </div>

      <button className="btn" onClick={onBack} style={{ width: '100%' }}>
        대시보드로 돌아가기
      </button>
    </div>
  );
}
