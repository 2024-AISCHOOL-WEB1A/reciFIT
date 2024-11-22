export const receiptFormatDate = (input) => {
  // 숫자만 추출
  const numericString = input.replace(/\D/g, ""); // 모든 문자를 제거하고 숫자만 남깁니다

  // yyyymmdd 또는 yymmdd 형식인지 확인
  if (numericString.length === 8) {
    // yyyyMMdd 형식 (yyyymmdd)
    const year = numericString.slice(0, 4); // yyyy
    const month = numericString.slice(4, 6); // mm
    const day = numericString.slice(6, 8); // dd
    return `${year}-${month}-${day}`;
  } else if (numericString.length === 6) {
    // yyMMdd 형식 (yymmdd)
    const year = `20${numericString.slice(0, 2)}`; // yy -> 20yy
    const month = numericString.slice(2, 4); // mm
    const day = numericString.slice(4, 6); // dd
    return `${year}-${month}-${day}`;
  } else {
    // 형식이 잘못되었을 경우 오늘 날짜 반환
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
    const dd = String(today.getDate()).padStart(2, "0"); // 날짜에 0을 채우기
    return `${yyyy}-${mm}-${dd}`;
  }
};

export const formatDateToYyyyMmDd = (dateString) => {
  const date = new Date(dateString);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
};

export const formatDateToString = (dateString) => {
  const date = new Date(dateString);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0"); // 로컬 시간 기준
  const MM = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${MM}:${ss}`;
};

export function formatDateToKorMonth(dateString) {
  const date = new Date(dateString);

  const year = date.getFullYear(); // 연도
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 월 (0부터 시작하므로 +1 해주고, 2자리로 패딩)

  return `${year}년 ${month}월`;
}
