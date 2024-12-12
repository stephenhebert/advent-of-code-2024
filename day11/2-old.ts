// # =======================================
// # start time: 11:25pm
// # end time:
// #
// # issues:
// #  * breaks after 38 iterations
// #  * need an algorithm that can handle the large number of stones
// #    without increasing memory complexity exponentially
// #  * my initial algorithm has been the fastest so far
// #  * best benchmark so far is 40 blinks in 10s
// #  * 45 blinks is 86s
// #  * after trying to optimize: 45 blinks in 62s
// #  * the instructions say to preserve order, but it's not necessary to the solution
// #  * i tried to stick with it out of honor, but without it, an object solution would be much faster
// #  * reading the reddit:
// #    * laternfish is mentioned
// #    * also recursion with memoization
// #
// #
// #
// #
// # reflections:
// #  
// #  * everything I've tried since has been slower
// #
// # =======================================

import readFileAsString from "../util/readFileAsString"

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

const blinks = 45
const stones = readFileAsString('./input.txt')
  .split(' ')
  .map(Number)
  .map(value => ({ value, blinksRemaining: blinks }))

let totalStonesAfterAllBlinks = 0

async function processQueue(queue: Stone[]) {
  let stone = queue.shift()
  while (stone) {
    if (queue.length > 20) {
      queue.unshift(stone)
      return new Promise(
        (resolve) => setImmediate(
          async () => { 
            await Promise.all([processQueue(queue.slice(0, 10)), processQueue(queue.slice(10))])
            resolve()
          }
        )
      )
    }
    if (stone.blinksRemaining === 0) {
      totalStonesAfterAllBlinks++
      stone = queue.shift()
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
  }
}

processQueue(stones).then(() => {
  console.log('number of stones', totalStonesAfterAllBlinks)
  console.log('Execution time: ', (Date.now() - startTime), 'ms')
})

