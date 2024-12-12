// # =======================================
// # start time: 11:11pm
// # end time: 11:23pm
// # 
// # issues:
// # 
// # 
// # 
// # reflections:
// # 
// # 
// # =======================================

import readFileAsString from "../util/readFileAsString"

const startTime = Date.now()

function removeLeadingZeroes(stone: string) {
  return Number(stone).toString()
}

function bifurcate(stone: string) {
  const length = stone.length
  const mid = Math.floor(length / 2)
  const firstHalf = removeLeadingZeroes(stone.slice(0, mid))
  const secondHalf = removeLeadingZeroes(stone.slice(mid))
  return [firstHalf, secondHalf]
}

function multiply(stone: string) {
  return (Number(stone) * 2024).toString()
}

function transform(stone: string) {
  if (stone === '0') return '1'
  else if (stone.length % 2 === 0) return bifurcate(stone)
  else return multiply(stone)
}

async function main() {
  const blinks = 25

  let stones = readFileAsString('./input.txt').split(' ')
  for (let i = 0; i < blinks; i++) {
    stones = stones.flatMap(transform)
    // console.log('blinked ', i + 1, 'times')
  }

  console.log('number of stones', stones.length)

  console.log('Execution time: ', (Date.now() - startTime), 'ms')  
}

main()
