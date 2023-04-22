export function getBoardIndexs(size) {
  let result = [];
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const index = String.fromCodePoint(65 + (j % size)) + (size - i);
      result.push(index);
    }
  }
  return result;
}
