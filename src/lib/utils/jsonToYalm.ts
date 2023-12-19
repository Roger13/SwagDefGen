export default function jsonToYalm(value: string) {
  return value
    .replace(/[{},"]+/g, '')
    .replace(/\t/g, '  ')
    .replace(/(^ *\n)/gm, '')
}