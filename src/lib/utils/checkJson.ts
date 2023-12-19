export default function checkJson(value: string) {
  try {
    return JSON.parse(value)
  } catch (error) {
    alert(`Your JSON is invalid! \n ${error}`)
    return
  }
}