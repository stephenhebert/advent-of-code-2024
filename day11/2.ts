// # =======================================
// # start time: 11:25pm
// # end time: 10:51am
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
// #  * (saved original approach as 2-old.ts)
// #  * the dict approach processes 75 blinks in 74ms
// #  * the recursive memoized approach: https://www.reddit.com/r/adventofcode/comments/1hbmu6q/comment/m1hq0bo/
// # reflections:
// #  
// #  * everything I've tried since has been slower
// #  * i asked copilot to help me optimize, but it didn't help
// #    * every suggestion it made was slower
// #    * many of the suggestions were just wrong and would have broken the code
// #
// # =======================================

import readFileAsString from "../util/readFileAsString"

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

const blinks = 75
let stones = readFileAsString('./input.txt')
  .split(' ')
  .reduce((acc, value) => {
    if (!acc[value]) acc[value] = 0
    acc[value]++
    return acc
  }, {})

function blink() {
  stones = Object.entries(stones).reduce((acc, [value, count]) => {
    if (count === 0) return acc
    const newStones = 
      value === '0' 
        ? ['1'] 
        : value.length % 2 === 0 
          ? bifurcate(value) 
          : [multiply(value)]
    newStones.forEach(stone => {
      if (!acc[stone]) acc[stone] = 0
      acc[stone] += count
    })
    return acc
  }, {})
}

for (let i = 0; i < blinks; i++) {
  blink()
}

const totalStonesAfterAllBlinks = Object.values(stones).reduce((acc, count) => acc + count, 0)

console.log('number of stones', totalStonesAfterAllBlinks)

console.log('Execution time: ', (Date.now() - startTime), 'ms')