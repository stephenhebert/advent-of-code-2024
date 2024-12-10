import readFileAsArray from "../util/readFileAsArray"
import getEnumNumberKeys from "../util/getEnumNumberKeys"

const input = readFileAsArray("./input.txt")

const grid = input.map((line) => line.toLowerCase().split(""))

const needle = 'xmas'.split('')

enum Direction {
  EAST,
  WEST,
  SOUTH,
  NORTH,
  SOUTHEAST,
  SOUTHWEST,
  NORTHEAST,
  NORTHWEST
}

type occurrence = {
  x: number
  y: number
  direction: Direction
}

async function searchEast(x: number, y: number, needle: string[], grid: string[][]) {
  if (grid[y].length - x < needle.length) return false
  for (let i = 1; i < needle.length; i++) {
    if (grid[y][x + i] !== needle[i]) {
      return false
    }
  }
  return true
}

async function searchWest(x: number, y: number, needle: string[], grid: string[][]) {
  if (x < needle.length - 1) return false
  for (let i = 1; i < needle.length; i++) {
    if (grid[y][x - i] !== needle[i]) {
      return false
    }
  }
  return true
}

async function searchSouth(x: number, y: number, needle: string[], grid: string[][]) {
  if (grid.length - y < needle.length) return false
  for (let i = 1; i < needle.length ; i++) {
    if (grid[y + i][x] !== needle[i]) {
      return false
    }
  }
  return true
}

async function searchNorth(x: number, y: number, needle: string[], grid: string[][]) {
  if (y < needle.length - 1) return false
  for (let i = 1; i < needle.length; i++) {
    if (grid[y - i][x] !== needle[i]) {
      return false
    }
  }
  return true
}

async function searchSouthEast(x: number, y: number, needle: string[], grid: string[][]) {
  if (grid.length - y < needle.length || grid[y].length - x < needle.length) return false
  for (let i = 1; i < needle.length; i++) {
    if (grid[y + i][x + i] !== needle[i]) {
      return false
    }
  }
  return true
}

async function searchSouthWest(x: number, y: number, needle: string[], grid: string[][]) {
  if (grid.length - y < needle.length || x < needle.length - 1) return false
  for (let i = 1; i < needle.length; i++) {
    if (grid[y + i][x - i] !== needle[i]) {
      return false
    }
  }
  return true
}

async function searchNorthEast(x: number, y: number, needle: string[], grid: string[][]) {
  if (y < needle.length - 1 || grid[y].length - x < needle.length) return false
  for (let i = 1; i < needle.length; i++) {
    if (grid[y - i][x + i] !== needle[i]) {
      return false
    }
  }
  return true
}

async function searchNorthWest(x: number, y: number, needle: string[], grid: string[][]) {
  if (y < needle.length - 1 || x < needle.length - 1) return false
  for (let i = 1; i < needle.length; i++) {
    if (grid[y - i][x - i] !== needle[i]) {
      return false
    }
  }
  return true
}

const searchRoutinesByDirection = {
  [Direction.EAST]: searchEast,
  [Direction.WEST]: searchWest,
  [Direction.SOUTH]: searchSouth,
  [Direction.NORTH]: searchNorth,
  [Direction.SOUTHEAST]: searchSouthEast,
  [Direction.SOUTHWEST]: searchSouthWest,
  [Direction.NORTHEAST]: searchNorthEast,
  [Direction.NORTHWEST]: searchNorthWest
}

async function searchFromByDirection(
  { x, y, needle, grid, direction }:
  { x: number, y: number, needle: string[], grid: string[][], direction: Direction }
) {
  const isFound = await searchRoutinesByDirection[Direction[direction]](x, y, needle, grid)
  if (isFound) {
    return { x, y, direction }
  }
}

async function searchFrom(
  { x, y, needle, grid }:
  { x: number, y: number, needle: string[], grid: string[][] }
): Promise<occurrence[]> {

  const searchPromises = getEnumNumberKeys(Direction).map((direction) => {
    return searchFromByDirection({x, y, needle, grid, direction: Direction[direction]})
  })

  const result = await Promise.all(searchPromises)

  return result.filter(r => r)  
}

function debugDrawByOccurences(occurences: occurrence[]) {
  const debugGrid = grid.map((line) => line.map((cell) => '.'))
  occurences.forEach(({ x, y, direction }) => {
    let dx = 0
    let dy = 0
    switch (Direction[direction]) {
      case Direction.EAST:
        dx = 1
        break
      case Direction.WEST:
        dx = -1
        break
      case Direction.SOUTH:
        dy = 1
        break
      case Direction.NORTH:
        dy = -1
        break
      case Direction.SOUTHEAST:
        dx = 1
        dy = 1
        break
      case Direction.SOUTHWEST:
        dx = -1
        dy = 1
        break
      case Direction.NORTHEAST:
        dx = 1
        dy = -1
        break
      case Direction.NORTHWEST:
        dx = -1
        dy = -1
        break
    }
    debugGrid[y][x] = 'x'
    for (let i = 1; i < needle.length; i++) {
      debugGrid[y + (i * dy)][x + (i * dx)] = needle[i]
    }
  })
  debugGrid.forEach((line) => console.log(line.join('').toUpperCase()))
}

async function main() {

  const occurencePromises = []

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] !== needle[0]) continue
      occurencePromises.push(searchFrom({ x, y, needle, grid }))
    }
  }

  const occurencesByPromise = await Promise.all(occurencePromises)
  const occurences = occurencesByPromise.flat()

  // console.log('Occurences:', occurences)


  console.log('Occurences:', occurences.length)

  // debugDrawByOccurences(occurences)

}

main()

// time: 80 minutes

// bugs encountered:
// 1. enum enumeration
// 2. forgetting to require a match on first letter
// 3. off by one error in search routine short circuiting

// lessons learned:
// 1. generating complex debug output may seem daunting but ai can make quick and dirty work

