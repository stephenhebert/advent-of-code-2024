import readFileAsString from "../../util/readFileAsString"

const input = readFileAsString("../input.txt")

const instructionRegexString = 'mul\\((\\d{1,3}),(\\d{1,3})\\)'

const instructions = input.match(new RegExp(instructionRegexString, 'g'))

const result = instructions.reduce((acc, instruction) => {
  const [_, a, b] = instruction.match(new RegExp(instructionRegexString))
  return acc + (parseInt(a) * parseInt(b))
}, 0)

console.log('Result:', result)