import readFileAsString from "../util/readFileAsString"
import Deque from "collections/deque"

type Stone = {
  value: string
  blinksRemaining: number
}

const startTime = Date.now()

function removeLeadingZeroes(stone: string) {
  return Number(stone).toString()
}

function bifurcate(stone: string) {
  const mid = Math.floor(stone.length / 2)
  const firstHalf = stone.slice(0, mid)
  const secondHalf = removeLeadingZeroes(stone.slice(mid))
  return [firstHalf, secondHalf]
}

function multiply(stone: string) {
  return (Number(stone) * 2024).toString()
}

const blinks = 35
const stones = readFileAsString('./input.txt')
  .split(' ')
  .map(Number)
  .map(value => ({ value, blinksRemaining: blinks }))

let totalStonesAfterAllBlinks = 0

async function processQueue(queue: Deque<Stone>) {
  while (queue.length > 0) {
    let stone = queue.shift()
    if (stone.blinksRemaining === 0) {
      totalStonesAfterAllBlinks++
      continue
    }
    stone.blinksRemaining--
    if (stone.value === '0') {
      stone.value = '1'
    } else if (stone.value.length % 2 === 0) {
      const [firstHalf, secondHalf] = bifurcate(stone.value)
      stone.value = firstHalf
      queue.unshift({ value: secondHalf, blinksRemaining: stone.blinksRemaining })
    } else {
      stone.value = multiply(stone.value)
    }
    queue.push(stone)
  }
}

const deque = new Deque(stones)
processQueue(deque).then(() => {
  console.log('number of stones', totalStonesAfterAllBlinks)
  console.log('Execution time: ', (Date.now() - startTime), 'ms')
})