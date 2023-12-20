export function checkNumberFormat(num: number) {
  if (num < 2147483647 && num > -2147483647) {
    return 'int32'
  } else if (num < 9223372036854775807 && num > -9223372036854775807) {
    return 'int64'
  } else {
    return 'unsafe'
  }
}