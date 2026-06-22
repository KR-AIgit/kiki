import questionsData from '../data/questions.json';

// 나이를 학년으로 변환하는 로직
export function getGradeFromAge(age) {
  const numAge = parseInt(age, 10);
  if (numAge === 8) return 1;
  if (numAge === 9) return 2;
  if (numAge === 10) return 3;
  if (numAge > 10) return numAge - 7; // 대략적인 계산
  return 1; // 기본값
}

// 현재 월에 따른 진도(학기/선행) 계산
export function getSemesterLevel() {
  const month = new Date().getMonth() + 1; // 1 ~ 12
  
  if (month >= 1 && month <= 4) {
    return "1학기 심화";
  } else if (month >= 5 && month <= 6) {
    return "2학기 선행";
  } else if (month >= 7 && month <= 10) {
    return "2학기 심화";
  } else {
    return "다음 학년 1학기 선행";
  }
}

// 퀘스트 가져오기
export function getDailyQuests(age, subjectKey) {
  const targetAgeKey = `age_${age}`;
  
  // 현재는 8세 데이터만 구현되어 있으므로 fallback 처리
  const db = questionsData[targetAgeKey] || questionsData['age_8'];
  
  const quests = db[subjectKey];
  if (!quests) return [];

  // 매달 1일 업데이트 로직을 위한 플레이스홀더: 
  // 실제 서비스 시 서버에서 API를 호출하여 이 부분에서 새로운 문제 배열을 받아옴.
  const isFirstDayOfMonth = new Date().getDate() === 1;
  if (isFirstDayOfMonth) {
    console.log("매월 1일 문제 은행 업데이트 실행 (API Call Placeholder)");
  }
  
  // 8문제 고정 반환
  return quests.slice(0, 8);
}
