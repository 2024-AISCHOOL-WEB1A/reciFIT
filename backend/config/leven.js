async function getLeven() {
  const module = await import("leven");
  return module.default;
}

module.exports = getLeven;
