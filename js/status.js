// 오늘, 전체 방문자 수
 
    // 오늘 날짜 키 만들기 (예: "visitors_2025-06-07")
    const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    const todayKey = `visitors_${today}`;

    // 오늘 방문자 수 가져오기
    let todayCount = localStorage.getItem(todayKey);
    if (!todayCount) {
        todayCount = 0;
    }

    // 전체 방문자 수 가져오기
    let totalCount = localStorage.getItem("totalVisitors");
    if (!totalCount) {
        totalCount = 0;
    }

    // 방문할 때마다 +1 증가
    todayCount++;
    totalCount++;

    // 저장
    localStorage.setItem(todayKey, todayCount);
    localStorage.setItem("totalVisitors", totalCount);

    // 화면에 표시
    document.getElementById("today-count").textContent = todayCount + "명";
    document.getElementById("total-count").textContent = totalCount + "명";



// 막대 그래프 요일별 방문자 수 

   // 헬퍼: 날짜 문자열 얻기 (n일 전)
  function getDateStr(daysAgo) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  }

  // 헬퍼: 요일 구하기
  function getDayLabel(dateStr) {
    const days = ['일','월','화','수','목','금','토'];
    const dayIndex = new Date(dateStr).getDay();
    return days[dayIndex];
  }

  const barGraph = document.getElementById("bar-graph");
  const barLabels = document.getElementById("bar-labels");

  // 최대 방문자 수 (비율용)
  let maxVisits = 0;
  const recentVisits = [];

  // 최근 5일치 방문자 수 구하기
  for (let i = 4; i >= 0; i--) {
    const dateStr = getDateStr(i);
    const visits = parseInt(localStorage.getItem(`visitors_${dateStr}`)) || 0;
    recentVisits.push({ dateStr, visits });
    if (visits > maxVisits) maxVisits = visits;
  }

  // 그래프 생성
  recentVisits.forEach(({ dateStr, visits }) => {
    const heightPercent = maxVisits ? (visits / maxVisits) * 100 : 0;

    // 막대
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${heightPercent}%`;
    bar.title = `${visits}명`;
    barGraph.appendChild(bar);

    // 레이블
    const label = document.createElement("div");
    label.textContent = getDayLabel(dateStr);
    barLabels.appendChild(label);
  });



// 전체 초기화 버튼

 // 기존 방문자 수, 그래프 표시 함수
  function renderStatsAndGraph() {
    // 오늘 날짜 키
    const today = new Date().toISOString().split('T')[0];
    const todayKey = `visitors_${today}`;

    // 오늘 방문자 수 가져오기
    let todayCount = localStorage.getItem(todayKey);
    todayCount = todayCount ? parseInt(todayCount) : 0;

    // 전체 방문자 수 가져오기
    let totalCount = localStorage.getItem("totalVisitors");
    totalCount = totalCount ? parseInt(totalCount) : 0;

    // 오늘, 전체 방문자 수 표시
    document.getElementById("today-count").textContent = todayCount + "명";
    document.getElementById("total-count").textContent = totalCount + "명";

    // 그래프 초기화
    const barGraph = document.getElementById("bar-graph");
    const barLabels = document.getElementById("bar-labels");
    barGraph.innerHTML = "";
    barLabels.innerHTML = "";

    // 최근 5일 데이터 가져오기 및 그래프 그리기
    let maxVisits = 0;
    const recentVisits = [];

    function getDateStr(daysAgo) {
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      return date.toISOString().split('T')[0];
    }
    function getDayLabel(dateStr) {
      const days = ['일','월','화','수','목','금','토'];
      return days[new Date(dateStr).getDay()];
    }

    for (let i = 4; i >= 0; i--) {
      const dateStr = getDateStr(i);
      const visits = parseInt(localStorage.getItem(`visitors_${dateStr}`)) || 0;
      recentVisits.push({ dateStr, visits });
      if (visits > maxVisits) maxVisits = visits;
    }

    recentVisits.forEach(({ dateStr, visits }) => {
      const heightPercent = maxVisits ? (visits / maxVisits) * 100 : 0;
      const bar = document.createElement("div");
      bar.className = "bar";
      bar.style.height = `${heightPercent}%`;
      bar.title = `${visits}명`;
      barGraph.appendChild(bar);

      const label = document.createElement("div");
      label.textContent = getDayLabel(dateStr);
      barLabels.appendChild(label);
    });
  }

  // 방문자 수 증가 (새로고침시)
  function incrementVisitorCount() {
    const today = new Date().toISOString().split('T')[0];
    const todayKey = `visitors_${today}`;

    let todayCount = localStorage.getItem(todayKey);
    todayCount = todayCount ? parseInt(todayCount) : 0;
    todayCount++;
    localStorage.setItem(todayKey, todayCount);

    let totalCount = localStorage.getItem("totalVisitors");
    totalCount = totalCount ? parseInt(totalCount) : 0;
    totalCount++;
    localStorage.setItem("totalVisitors", totalCount);
  }

  // 초기화 함수
  function resetAllData() {
    // 전체 방문자 수 삭제
    localStorage.removeItem("totalVisitors");

    // 오늘 포함 최근 5일 데이터 삭제
    for(let i=0; i<5; i++){
      const dateStr = new Date();
      dateStr.setDate(dateStr.getDate() - i);
      const key = `visitors_${dateStr.toISOString().split('T')[0]}`;
      localStorage.removeItem(key);
    }
    alert("방문자 통계가 초기화되었습니다!");
    renderStatsAndGraph();
  }

  // 버튼 이벤트 연결
  document.getElementById("reset-btn").addEventListener("click", resetAllData);

  // 페이지 로드 시 동작
  renderStatsAndGraph();