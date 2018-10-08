export default function isValidNumber(input) {
  const isValid = /^\d*\.?\d*$/
  return input.length && isValid.test(input)
}
