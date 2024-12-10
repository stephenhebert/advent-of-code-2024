// # =======================================
// # start time: 5:23pm
// # end time: 
// # 
// # issues:
// # 
// # 
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

function getNextPoint(point, difference, direction = '+') {
  return {
    x: point.x + difference.x * (direction === '+' ? 1 : -1),
    y: point.y + difference.y * (direction === '+' ? 1 : -1)
  }
}

function getAllPointsWithinBounds(point, difference, direction = '+') {
  const points = []
  let currentPoint = getNextPoint(point, difference, direction)
  while (
    currentPoint.x >= 0 && currentPoint.x < gridWidth &&
    currentPoint.y >= 0 && currentPoint.y < gridLength
  ) {
    points.push(currentPoint)
    currentPoint = getNextPoint(currentPoint, difference, direction)
  }
  return points
}

function findAllAntinodesForTwoAntennas(
  antenna1: { x: number, y: number }, 
  antenna2: { x: number, y: number }
) {
  const d = difference(antenna1, antenna2)
  const antinodes = [
    ...getAllPointsWithinBounds(antenna1, d, '-'),
    ...getAllPointsWithinBounds(antenna2, d, '+')
  ]
  return antinodes
}

async function findAntinodesForAllAntennasOfType(antennasOfType: { x: number, y: number }[]) {
  if (antennasOfType.length < 2) return []
  let antinodes = [ ...antennasOfType ]

  for (let i = 0; i < antennasOfType.length; i++) {
    for (let j = i + 1; j < antennasOfType.length; j++) {
      antinodes = antinodes.concat(findAllAntinodesForTwoAntennas(antennasOfType[i], antennasOfType[j]))
    }
  }
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

