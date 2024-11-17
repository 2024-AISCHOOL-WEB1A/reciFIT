const db = require("../config/db");

let ingredientsCache = null;

async function loadIngredients() {
  if (!ingredientsCache) {
    const [rows] = await db.execute("SELECT ingre_name FROM TB_INGREDIENT");
    ingredientsCache = rows.map((row) => row.ingre_name);
    // console.log(ingredientsCache);
  }
  return ingredientsCache;
}

loadIngredients().catch((err) => {
  console.error("Error loading ingredients at startup:", err);
});

module.exports = loadIngredients;
