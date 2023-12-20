export default function checkJson(value: string): boolean {
  try {
    JSON.parse(value)
    return true
  } catch (error) {
    alert(`Your JSON is invalid! \n ${error}`)
    return false
  }
}