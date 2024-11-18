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

function receiptFormatDate(inputDate) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(inputDate)) {
    // If input is already in yyyy-mm-dd format
    return inputDate;
  } else if (/^\d{14}$/.test(inputDate)) {
    // If input is in yyyymmddhhMMss format
    const year = inputDate.slice(0, 4);
    const month = inputDate.slice(4, 6);
    const day = inputDate.slice(6, 8);
    return `${year}-${month}-${day}`;
  } else {
    return null;
  }
}

module.exports = {
  getUserRole,
  getRecipeOwner,
  receiptFormatDate,
};
