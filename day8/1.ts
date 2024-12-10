// # =======================================
// # start time: 12:11pm
// # end time: 5:17pm
// # 
// # issues:
// #  * I overcomplicated the problem by initially not taking the time to understand how the placement
// #    of the antinodes should work, and assuming I would need to use slope and distance formulas to find them.
// # 
// # reflections:
// # 
// # =======================================

import readFileAsGrid from "../util/readFileAsGrid"
import { difference } from "../util/cartesian"

const startTime = Date.now()

const grid = readFileAsGrid('./input.txt')
const gridLength = grid.length
const gridWidth = grid[0].length

function findAntennas(grid: string[][]) {
  const antennas = {}
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      let match = grid[y][x].match(/[A-Za-z0-9]/)
      if (!match) continue
      const type = match[0]
      if (!antennas[type]) antennas[type] = []
      antennas[type].push({ x, y })
    }
  }
  return antennas
}

function findAntinodesForTwoAntennas(
  antenna1: { x: number, y: number }, 
  antenna2: { x: number, y: number }
) {
  const d = difference(antenna1, antenna2)
  const antinodes = [
    {
      x: antenna1.x - d.x,
      y: antenna1.y - d.y
    },
    {
      x: antenna2.x + d.x,
      y: antenna2.y + d.y
    },
  ]
  return antinodes
}

async function findAntinodesForAllAntennasOfType(antennasOfType: { x: number, y: number }[]) {
  let potentialAntinodes = []
  for (let i = 0; i < antennasOfType.length; i++) {
    for (let j = i + 1; j < antennasOfType.length; j++) {
      potentialAntinodes = potentialAntinodes.concat(findAntinodesForTwoAntennas(antennasOfType[i], antennasOfType[j]))
    }
  }
  const antinodes = potentialAntinodes.filter(({ x, y }) => x >= 0 && x < gridWidth && y >= 0 && y < gridLength)
  return antinodes
}

function debugGrid(grid: string[][], antinodes: { x: number, y: number }[]) {

  const gridCopy = grid.map(row => row.slice())
  antinodes.forEach(({ x, y }) => {
    gridCopy[y][x] = '#'
  })

  console.log(gridCopy.map(row => row.join('')).join('\n'))
}


async function main() {

  const antennas = findAntennas(grid)
  // console.log(antennas)

  const antinodePromises = Object.keys(antennas).map(type => findAntinodesForAllAntennasOfType(antennas[type]))
  const antinodes = (await Promise.all(antinodePromises)).flat().reduce((acc, antinode) => {
    if (!acc.some(({ x, y }) => x === antinode.x && y === antinode.y)) acc.push(antinode)
    return acc
  }, [])

  console.log('antinodes: ', antinodes.length)

  // debugGrid(grid, antinodes)
  
  console.log('Execution time: ', (Date.now() - startTime), 'ms')  
}

main()

