export default function changeIndentation(count: number): void {
  let i: number
  if (count >= tabCount) {
    i = tabCount
  } else {
    i = 0
    indentator = '\n'
  }
  for (; i < count; i++) {
    indentator += '\t'
  }
  tabCount = count
}