import readFileAsString from "../util/readFileAsString"

const input = readFileAsString("./input.txt")

const mulInstructionRegexString = 'mul\\((\\d{1,3}),(\\d{1,3})\\)'
const doInstructionRegexString = 'do\\(\\)'
const dontInstructionRegexString = 'don\'t\\(\\)'

enum InstructionType {
  MUL,
  DO,
  DONT
}

function getInstructionType(instruction) {
  if (instruction.match(new RegExp(mulInstructionRegexString))) {
    return InstructionType.MUL
  } else if (instruction.match(new RegExp(doInstructionRegexString))) {
    return InstructionType.DO
  } else if (instruction.match(new RegExp(dontInstructionRegexString))) {
    return InstructionType.DONT
  }
}

const instructionRegexString = `(${mulInstructionRegexString}|${doInstructionRegexString}|${dontInstructionRegexString})`

const instructions = input.match(new RegExp(instructionRegexString, 'g'))

let enabled = true

const result = instructions.reduce((acc, instruction) => {
  const instructionType = getInstructionType(instruction)
  if (instructionType === InstructionType.MUL && enabled) {
    const [_, a, b] = instruction.match(new RegExp(mulInstructionRegexString))
    return acc + (parseInt(a) * parseInt(b))
  } else if (instructionType === InstructionType.DO) {
    enabled = true
  } else if (instructionType === InstructionType.DONT) {
    enabled = false
  }
  return acc
  
}, 0)

console.log('Result:', result)