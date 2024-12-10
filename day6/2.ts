// # =======================================
// # start time: 10:50am
// # end time: 5:20pm
// # 
// # solution design:
// #  * objective - find potential locations where a single obstacle would cause an infinite loop
// # 
// #  observations:
// #    * since loops may be complex, finding them will require similar logic to moving the guard
// #      so we can reuse the code from part 1
// #    * since we'll want to simulate walks to find potential loops, we'll want to scope variables so we can distinguish
// #      between the guard's current position and the position we're inspecting for potential loops 
// #   
// # issues:
// #   * actually needed to use a debugger this time to find a bug in the loop detection logic
// #   * mixing up variables
// #   * not parameterizing function calls that I thought I was
// #   * overlooked the instruction that an obstacle could not be placed at the guard's starting position
// #   * i overlooked that i can't place an obstacle in a location I had already passed through,
// #     as it would have prevented the current path
// #   * in the end, I changed my approach to finding possible obstacles after first charting the original, which
// #     limited the number of potential obstacle positions to check.
// # 
// # reflections:
// #   * small test cases with predictable outcomes are helpful for debugging
// # 
// # =======================================
import readFileAsGrid from "../util/readFileAsGrid"
import deepCopy from "../util/deepCopy"

const startTime = Date.now()

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

type GuardDirection = typeof GUARD_LEFT | typeof GUARD_RIGHT | typeof GUARD_UP | typeof GUARD_DOWN
type MaybeGuardDirection = GuardDirection | null

type Guard = {
  position: MaybePosition
  direction: MaybeGuardDirection
}

const grid = readFileAsGrid('./input.txt')
const log: Record<string, Record<string, string[]>> = {}
const positionsThatWouldCauseLoop: Position[] = []
let initialGuard

function getGuard({ x, y }: Position) {
  const cell = grid[y][x]
  if(
    [
      GUARD_LEFT,
      GUARD_RIGHT,
      GUARD_UP,
      GUARD_DOWN
    ].includes(cell)
  ) {
    const guard = {
      position: { x, y },
      direction: cell as GuardDirection
    }
    return guard
  }
  return false
}

function findGuard() {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const guard = getGuard({ x, y })
      if (guard) return guard
    }
  }
  return false
}

function isOutOfBounds({ x, y }: Position): boolean {
  return x < 0 || y < 0 || x >= grid[0].length || y >= grid.length
}

function turnRight(direction: GuardDirection): GuardDirection {
  switch (direction) {
    case GUARD_UP:
      return GUARD_RIGHT
    case GUARD_RIGHT:
      return GUARD_DOWN
    case GUARD_DOWN:
      return GUARD_LEFT
    case GUARD_LEFT:
      return GUARD_UP
  }
}

function getNextPosition({ x, y }: Position, direction: GuardDirection): Position {
  switch (direction) {
    case GUARD_UP:
      return { x, y: y - 1 }
    case GUARD_RIGHT:
      return { x: x + 1, y }
    case GUARD_DOWN:
      return { x, y: y + 1 }
    case GUARD_LEFT:
      return { x: x - 1, y }
  }
}

function walk(guard, grid, simulate = false) {
  let { x, y } = guard.position

  let prospectivePosition

  do {
    prospectivePosition = getNextPosition({ x, y }, guard.direction as GuardDirection)
    if (isOutOfBounds(prospectivePosition)) {
      guard.position = null
      if (!simulate) grid[y][x] = PATHMARKER
      return
    } else if (grid[prospectivePosition.y][prospectivePosition.x] === OBSTACLE) {
      guard.direction = turnRight(guard.direction as GuardDirection)
      return
    }
  } while (grid[prospectivePosition.y][prospectivePosition.x] === OBSTACLE)

  guard.position = prospectivePosition
  if (!simulate) { 
    grid[y][x] = PATHMARKER
  }

}

function haveWeBeenHereBefore(guard: Guard, log) {
  const { x, y } = guard.position as Position
  const logEntry = log[y]?.[x]
  if (!logEntry) return false
  return logEntry.includes(guard.direction as GuardDirection)
}

function logGuard(guard: Guard, log) {
  // console.log('position:', guard.position, 'direction:', guard.direction)
  const { x, y } = guard.position as Position
  if (!log[y]) log[y] = {}
  if (!log[y][x]) log[y][x] = []
  log[y][x].push(guard.direction as GuardDirection)
}

function addPositionThatWouldCauseLoop(position: Position) {
  const isDuplicate = positionsThatWouldCauseLoop.some(({ x, y }) => x === position.x && y === position.y)
  if (isDuplicate) return
    positionsThatWouldCauseLoop.push(position)
}

async function checkForPotentialLoop(obstaclePosition: Position) {
  const { x, y } = obstaclePosition
  if (x === 1 && y === 2) debugger
  const simulatedGuard = deepCopy(initialGuard)
  const simulatedLog = {}
  const simulatedGrid = deepCopy(grid)
  simulatedGrid[y][x] = OBSTACLE
  if (x === initialGuard.position.x && y === initialGuard.position.y) return
  while (simulatedGuard.position !== null) {
    if (haveWeBeenHereBefore(simulatedGuard, simulatedLog)) {
      addPositionThatWouldCauseLoop(obstaclePosition)
      return
    }
    logGuard(simulatedGuard, simulatedLog)
    walk(simulatedGuard, simulatedGrid, true)
  }
}

function showGrid() {
  grid.forEach(row => console.log(row.join('')))
}


async function main() {

  const guard = findGuard()
  if (!guard.position) console.error('Guard not found')

  initialGuard = deepCopy(guard)
  while (guard.position !== null) {
    logGuard(guard, log)
    walk(guard, grid)
  }

  const potentialObstaclePositions = Object.keys(log).reduce((acc, y) => {
    return [
      ...acc,
      ...Object.keys(log[y]).map(x => ({ x: parseInt(x), y: parseInt(y) }))
    ]
  }, [])

  const simulationPromises = potentialObstaclePositions.map(checkForPotentialLoop)

  await Promise.all(simulationPromises)

  console.log('Positions that would cause a loop:', positionsThatWouldCauseLoop.length)

  // showGrid()


  console.log('Execution time: ', (Date.now() - startTime), 'ms')  

}

main()
