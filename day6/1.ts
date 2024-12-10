// start time: 8:44am
  // after reading: 8:48am
  // initial algorithm / function setup: 8:53am
// end time: 9:44pm

// issues:
// - Misread problem statement: I was counting moves instead of distinct positions

// reflection:
// - lots of time in cleanup and considering various refactors for readability
// - only debugging was related to misreading the problem statement
// - thinking about how to cleanly (minimizing duplication) keep track of the guard's position,
//   direction, and prospective position, considering encountering multiple potential obstacles
//   in a single move was a challenge

const startTime = Date.now()

import readFileAsGrid from "../util/readFileAsGrid";

// key
const GUARD_LEFT = '<'
const GUARD_RIGHT = '>'
const GUARD_UP = '^'
const GUARD_DOWN = 'v'
const OBSTACLE = '#'
const EMPTY = '.'
const PATHMARKER = 'X'

type Position = {
  y: number
  x: number
}
type MaybePosition = Position | null

let lastGuardPosition: MaybePosition = null

const grid = readFileAsGrid('./input.txt')

function hasGuard({ x, y }: Position) {
  return [
    GUARD_LEFT,
    GUARD_RIGHT,
    GUARD_UP,
    GUARD_DOWN
  ].includes(grid[y][x])
}

function findGuard() {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (hasGuard({ x, y })) {
        return { x, y }
      }
    }
  }
  return null
}

function progressGuard() {
  const { x, y } = lastGuardPosition as Position
  if (!hasGuard({ x, y })) console.error('Guard not found at position', x, y)

  let guard = grid[y][x]
  let prospectivePosition

  do {
    switch (guard) {
      case GUARD_UP:
        prospectivePosition = { x, y: y - 1 }
        break
      case GUARD_RIGHT:
        prospectivePosition = { x: x + 1, y }
        break
      case GUARD_DOWN:
        prospectivePosition = { x, y: y + 1 }
        break
      case GUARD_LEFT:
        prospectivePosition = { x: x - 1, y }
        break
      default:
        console.error('Invalid guard')
    }
    if (
      prospectivePosition.x < 0 
      || prospectivePosition.y < 0 
      || prospectivePosition.x >= grid[0].length 
      || prospectivePosition.y >= grid.length
    ) {
      lastGuardPosition = null
      grid[y][x] = PATHMARKER
      return
    } else if (grid[prospectivePosition.y][prospectivePosition.x] === OBSTACLE) {
      switch (guard) {
        case GUARD_UP:
          guard = GUARD_RIGHT
          break
        case GUARD_RIGHT:
          guard = GUARD_DOWN
          break
        case GUARD_DOWN:
          guard = GUARD_LEFT
          break
        case GUARD_LEFT:
          guard = GUARD_UP
          break
      }
    }
  } while (grid[prospectivePosition.y][prospectivePosition.x] === OBSTACLE)
  
  lastGuardPosition = prospectivePosition
  grid[y][x] = PATHMARKER
  grid[prospectivePosition.y][prospectivePosition.x] = guard

}

function main() {
  lastGuardPosition = findGuard()
  if (!lastGuardPosition) console.error('Guard not found')

  let moves = 0
  while (lastGuardPosition !== null) {
    // console.log('Position: ', lastGuardPosition)
    progressGuard()
    moves++
  }
  
  console.log('Total moves: ', moves)

  const distinctPositions = grid.reduce((acc, row) => {
    return acc + row.filter(cell => cell === PATHMARKER).length
  }, 0)

  console.log('Distinct positions: ', distinctPositions)

  // grid.forEach(row => console.log(row.join('')))
  
}

main()

const endTime = Date.now()
console.log('Execution time: ', (endTime - startTime), 'ms')