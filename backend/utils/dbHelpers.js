const db = require("../config/db");

async function getUserRole(userIdx) {
  const [users] = await db.execute(
    `SELECT role FROM TB_USER WHERE user_idx = ?`,
    [userIdx]
  );
  return users[0];
}

async function getRecipeOwner(rcpIdx) {
  const [recipes] = await db.execute(
    `SELECT user_idx FROM TB_RECIPE WHERE rcp_idx = ?`,
    [rcpIdx]
  );
  return recipes[0];
}

// const receiptFormatDate = (inputDate) => {
//   if (/^\d{4}-\d{2}-\d{2}$/.test(inputDate)) {
//     // If input is already in yyyy-mm-dd format
//     return inputDate;
//   } else if (/^\d{14}$/.test(inputDate)) {
//     // If input is in yyyymmddhhMMss format
//     const year = inputDate.slice(0, 4);
//     const month = inputDate.slice(4, 6);
//     const day = inputDate.slice(6, 8);
//     return `${year}-${month}-${day}`;
//   } else {
//     const date = new Date(inputDate);
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");

//     if (isNaN(yyyy) || isNaN(mm) || isNaN(dd)) {
//       return receiptFormatDate(new Date());
//     }
//     return `${year}-${month}-${day}`;
//   }
// };

const receiptFormatDate = (input) => {
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

module.exports = {
  getUserRole,
  getRecipeOwner,
  receiptFormatDate,
};
