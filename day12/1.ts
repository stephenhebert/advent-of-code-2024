// # =======================================
// # start time: 11:16pm
// # end time: 12:28am
// # 
// # design:
// #  * create a map of every point
// #  * for each point, map a region
// #  * for each region,
// #    * get area
// #    * get perimeter
// #  * for all regions, sum
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

type Region = {
  positions: Position[]
  area: number
  perimeter: number
  totalCost: number
}

type RegionType = {
  id: string
  totalCost: number
  regions: Region[]
  unmappedPositions: Position[]
}



type Map = Record<string, RegionType>

const map: Map = {}

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

function chartRegion(
  regionType: RegionType, 
  position: Position, 
  visited: Position[] = []
): Position[] {
  visited.push(position)
  const adjacentRegionPositions = getAdjacentPositions(position)
    .filter(({ x, y }) => grid[y][x] === regionType.id)
    .filter(({ x, y }) => !visited.some(position => position.x === x && position.y === y))
  // console.log('adjacentRegionPositions', adjacentRegionPositions)
  const regionPositions = [
    position, 
    ...adjacentRegionPositions.flatMap(position => chartRegion(regionType, position, visited))
  ]
  return regionPositions.reduce((acc, position) => {
    if (acc.some(({ x, y }) => x === position.x && y === position.y)) return acc
    return acc.concat([position])
  }, [])
}

async function mapRegionType(regionType: RegionType): Promise<RegionType> {
  while (regionType.unmappedPositions.length) {
    const position = regionType.unmappedPositions.shift()
    const regionPositions = chartRegion(regionType, position)
    regionPositions.forEach(position => {
      const index = regionType.unmappedPositions.findIndex(({ x, y }) => x === position.x && y === position.y)
      if (index !== -1) regionType.unmappedPositions.splice(index, 1)
    })

    const region: Region = {
      positions: regionPositions,
      area: regionPositions.length,
      perimeter: regionPositions.reduce((acc, position) => {
        const adjacentPositions = getAdjacentPositions(position)
        const adjacentRegionPositions = adjacentPositions.filter(({ x, y }) => grid[y][x] === regionType.id)
        return acc + (4 - adjacentRegionPositions.length)
      }, 0),
      totalCost: 0
    }
    region.totalCost = region.area * region.perimeter
    regionType.regions.push(region)
  }
  regionType.totalCost = regionType.regions.reduce((acc, region) => acc + region.totalCost, 0)
}

async function main() {

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const id = grid[y][x]
      if (!map[id]) {
        map[id] = {
          id,
          totalCost: 0,
          regions: [],
          unmappedPositions: []
        }
      }
      map[id].unmappedPositions.push({ x, y })
    }
  }

  const regionTypePromises = Object.keys(map).map(id => mapRegionType(map[id]))
  await Promise.all(regionTypePromises)

  // console.log('Map:', map)

  const totalCost = Object.keys(map).reduce((acc, id) => acc + map[id].totalCost, 0)

  console.log('Total cost:', totalCost)
  console.log('Execution time: ', (Date.now() - startTime), 'ms')  

}


main()

