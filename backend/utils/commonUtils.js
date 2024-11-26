function normalizeString(str) {
  if (!str) return str;
  return str.replace(/\s+/g, "");
}

// 스네이크 케이스를 캐멀 케이스로 변환하는 함수
// const toCamelCase = (obj) => {
//   if (Array.isArray(obj)) {
//     return obj.map((item) => toCamelCase(item));
//   } else if (typeof obj === "object" && obj !== null) {
//     return Object.keys(obj).reduce((acc, key) => {
//       const camelKey = key.replace(/_([a-zA-Z])/g, (_, char) =>
//         char.toUpperCase()
//       );
//       acc[camelKey] = toCamelCase(obj[key]);
//       return acc;
//     }, {});
//   }
//   return obj;
// };
const toCamelCase = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map((item) => toCamelCase(item));
  } else if (typeof obj === "object" && obj !== null) {
    if (obj instanceof Date) {
      return obj; // Date 객체는 그대로 반환
    }
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-zA-Z])/g, (_, char) =>
        char.toUpperCase()
      );
      acc[camelKey] = toCamelCase(obj[key]);
      return acc;
    }, {});
  } else if (
    typeof obj === "string" &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(obj)
  ) {
    // ISO 8601 문자열은 Date 객체로 변환 (선택사항)
    return new Date(obj);
  }
  return obj;
};

module.exports = { normalizeString, toCamelCase };
