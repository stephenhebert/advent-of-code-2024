// # =======================================
// # start time: 12:10pm
// # end time: 12:12pm
// #
// # issues:
// #
// #
// #
// # reflections:
// #
// #
// # =======================================

import readFileAsGrid from '../util/readFileAsGrid.js'

const startTime = Date.now()

const grid = readFileAsGrid('./input.txt')

type Position = {
  x: number
  y: number
}

type Trailhead = Position & {
  score?: number
}

const trailheads: Trailhead[] = []
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    if (grid[y][x] === '0') {
      trailheads.push({ x, y })
    }
  }
}

function isInBounds({ x, y }: Position) {
  return x >= 0 && x < grid[0].length && y >= 0 && y < grid.length
}

function getAdjacentPositions({ x, y }: Position) {
  return [
    { x: x - 1, y },
    { x: x + 1, y },
    { x, y: y - 1 },
    { x, y: y + 1 }
  ].filter(isInBounds)
}

async function hikeTrail(position: Position, index: number) {
  if (index === 9) return 1

  let nextIndex = index + 1
  const nextSteps = getAdjacentPositions(position).filter(({ x, y }) => grid[y][x] === nextIndex.toString())

  const promises = nextSteps.map(nextPosition => hikeTrail(nextPosition, nextIndex))
  const results = await Promise.all(promises)
  return results.reduce((acc, result) => acc + result, 0)
}

async function main() {

  const promises = trailheads.map(trailhead => hikeTrail(trailhead, 0))
  const results = await Promise.all(promises)
  const sum = results.reduce((acc, result) => acc + result, 0)

  console.log('sum', sum)

  console.log('Execution time: ', (Date.now() - startTime), 'ms')
}

main()

