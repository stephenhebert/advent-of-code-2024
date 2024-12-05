import readFileAsArray from "../../util/readFileAsArray"

// const input = readFileAsArray("./example2.txt")
const input = readFileAsArray("../input.txt")

const grid = input.map((line) => line.toLowerCase().split(""))

const needle = 'mas'.split('')

type Occurrence = {
  x: number
  y: number
}

// async function searchEast(x: number, y: number, needle: string[], grid: string[][]) {
//   if (grid[y].length - x < needle.length) return false
//   for (let i = 1; i < needle.length; i++) {
//     if (grid[y][x + i] !== needle[i]) {
//       return false
//     }
//   }
//   return true
// }

// async function searchWest(x: number, y: number, needle: string[], grid: string[][]) {
//   if (x < needle.length - 1) return false
//   for (let i = 1; i < needle.length; i++) {
//     if (grid[y][x - i] !== needle[i]) {
//       return false
//     }
//   }
//   return true
// }

// async function searchSouth(x: number, y: number, needle: string[], grid: string[][]) {
//   if (grid.length - y < needle.length) return false
//   for (let i = 1; i < needle.length ; i++) {
//     if (grid[y + i][x] !== needle[i]) {
//       return false
//     }
//   }
//   return true
// }

// async function searchNorth(x: number, y: number, needle: string[], grid: string[][]) {
//   if (y < needle.length - 1) return false
//   for (let i = 1; i < needle.length; i++) {
//     if (grid[y - i][x] !== needle[i]) {
//       return false
//     }
//   }
//   return true
// }

async function searchSouthEast(x: number, y: number, needle: string[], grid: string[][]) {
  if (grid.length - y < needle.length + 1 || grid[y].length - x < needle.length + 1) return false
  for (let i = 1; i < needle.length + 1; i++) {
    if (grid[y + i][x + i] !== needle[i - 1]) {
      return false
    }
  }
  return true
}

async function searchSouthWest(x: number, y: number, needle: string[], grid: string[][]) {
  if (grid.length - y < needle.length + 1 || x < needle.length) return false
  for (let i = 1; i < needle.length + 1; i++) {
    if (grid[y + i][x - i] !== needle[i - 1]) {
      return false
    }
  }
  return true
}

async function searchNorthEast(x: number, y: number, needle: string[], grid: string[][]) {
  if (y < needle.length || grid[y].length - x < needle.length + 1) return false
  for (let i = 1; i < needle.length + 1; i++) {
    if (grid[y - i][x + i] !== needle[i - 1]) {
      return false
    }
  }
  return true
}

async function searchNorthWest(x: number, y: number, needle: string[], grid: string[][]) {
  if (y < needle.length || x < needle.length) return false
  for (let i = 1; i < needle.length + 1; i++) {
    if (grid[y - i][x - i] !== needle[i - 1]) {
      return false
    }
  }
  return true
}

async function findCrossWord(needle: string[], grid: string[][], occurrence: Occurrence ) {
  const { x, y } = occurrence
  const beforeMiddle = needle.slice(0, Math.floor(needle.length / 2))
  const afterMiddle = needle.slice(Math.floor(needle.length / 2) + 1)

  const getIsNorthEast = async () => await searchSouthWest(x, y, beforeMiddle.reverse(), grid) && await searchNorthEast(x, y, afterMiddle, grid)
  const getIsSouthWest = async () => await searchNorthEast(x, y, beforeMiddle.reverse(), grid) && await searchSouthWest(x, y, afterMiddle, grid)

  const getIsSouthEast = async () => await searchNorthWest(x, y, beforeMiddle.reverse(), grid) && await searchSouthEast(x, y, afterMiddle, grid)
  const getIsNorthWest = async () => await searchSouthEast(x, y, beforeMiddle.reverse(), grid) && await searchNorthWest(x, y, afterMiddle, grid)

  const getIsForwardSlash = async () => await getIsNorthEast() || await getIsSouthWest()
  const getIsBackwardSlash = async () => await getIsSouthEast() || await getIsNorthWest()

  if (await getIsForwardSlash() && await getIsBackwardSlash()) return occurrence
}


async function main() {

  if (needle.length % 2 === 0) return console.error('Needle must have an odd length')
  const middleLetter = needle[ Math.floor(needle.length / 2) ]

  const middleLetterOccurrences: Occurrence[] = []

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === middleLetter) middleLetterOccurrences.push({ x, y })
    }
  }

  const occurrencePromises = middleLetterOccurrences.map(occurrence => findCrossWord(needle, grid, occurrence))

  const occurrences = (await Promise.all(occurrencePromises)).filter(o => o)




  console.log('occurrences:', occurrences.length)



  // debugDrawByoccurrences(occurrences)

}

main()

// time:
// start: 9:41am
// end: 10:34am

// challenges:
// 1. naming things - forwardslash, backslash???
// 2. english spelling - occurrences
// 3. off by one errors in with for loops and array comparisons

// lessons learned:
// 1. overengineering part 1 didn't help part 2