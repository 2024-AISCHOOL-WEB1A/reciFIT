function normalizeString(str) {
  if (!str) return str;
  return str.replace(/\s+/g, "");
}

// 스네이크 케이스를 캐멀 케이스로 변환하는 함수
const toCamelCase = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map((item) => toCamelCase(item));
  } else if (typeof obj === "object" && obj !== null) {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-zA-Z])/g, (_, char) =>
        char.toUpperCase()
      );
      acc[camelKey] = toCamelCase(obj[key]);
      return acc;
    }, {});
  }
  return obj;
};

module.exports = { normalizeString, toCamelCase };
