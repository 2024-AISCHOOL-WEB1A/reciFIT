const db = require("../config/db");

async function getUserRole(userIdx) {
  const [users] = await db.query(
    `SELECT role FROM TB_USER WHERE user_idx = ?`,
    [userIdx]
  );
  return users[0];
}

async function getRecipeOwner(rcpIdx) {
  const [recipes] = await db.query(
    `SELECT user_idx FROM TB_RECIPE WHERE rcp_idx = ?`,
    [rcpIdx]
  );
  return recipes[0];
}

module.exports = {
  getUserRole,
  getRecipeOwner,
};
