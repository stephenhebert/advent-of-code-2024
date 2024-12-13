// # =======================================
// # start time: 11:16pm
// # end time: 3:09pm
// # 
// # design:
// #  * create a map of every point
// #  * for each point, map a region
// #  * for each region,
// #    * get area
// #    * get perimeter
// #  * for all regions, sum
// #
// #  * part 2 - find sides
// #    * add borders to position and mark during region mapping
// #    * for each region, walk perimeter to find sides
// #
// # issues/insights:
// #  * introduced a bug into the adjacent points function
// #  * attempted solutions to finding sides:
// #    * circle, degrees, distance, etc -- won't work because the region may contain other regions and have interior borders
// #    * walking the perimeter via continuous adjacencies -- diagonal lines are a problem
// #    * zoom to deal with diagonal lines -- too complex
// # 
// # reflections:
// # 
// # 
// # =======================================

import readFileAsGrid from '../util/readFileAsGrid'
import { groupBy } from '../util/array'

// TODO: use performance instead
const startTime = Date.now()

enum Direction {
  Up = 'up',
  Right = 'right',
  Down = 'down',
  Left = 'left'
}

type Point = {
  x: number
  y: number
}

type AdjacentPoint = Point & {
  direction: Direction
}

type RegionPoint = Point & {
  borders: Direction[]
}

type RegionPerimeterSide = {
  type: Direction
  points: RegionPoint[]
}

type Region = {
  points: RegionPoint[]
  area: number
  sides: RegionPerimeterSide[]
  totalCost: number
}

type RegionType = {
  id: string
  totalCost: number
  regions: Region[]
  unmappedPoints: Point[]
}

// TODO: accept parameter for file path
const grid = readFileAsGrid('./input.txt')

type Map = Record<string, RegionType>

const map: Map = {}

function isInBounds({ x, y }: Point) {
  return x >= 0 && x < grid[0].length && y >= 0 && y < grid.length
}

function isSameRegionType({ x, y }: Point, regionType: RegionType) {
  return grid[y][x] === regionType.id
}

function getAdjacentPoint({ x, y }: Point, direction: Direction): AdjacentPoint {
  switch (direction) {
    case Direction.Up:
      return { x, y: y-1, direction }
    case Direction.Right:
      return { x: x+1, y, direction }
    case Direction.Down:
      return { x, y: y+1, direction }
    case Direction.Left:
      return { x: x-1, y, direction }
  }
}

function getAllAdjacentPoints({ x, y }: Point): AdjacentPoint[] {
  return [
    getAdjacentPoint({ x, y }, Direction.Up),
    getAdjacentPoint({ x, y }, Direction.Right),
    getAdjacentPoint({ x, y }, Direction.Down),
    getAdjacentPoint({ x, y }, Direction.Left)
  ]
}

function getX(point: Point) {
  return point.x
}

function getY(point: Point) {
  return point.y
}

function getSortOrder(getSortId: (point: Point) => number) {
  return (a: Point, b: Point) => getSortId(a) - getSortId(b)
}

function getIsVertical(direction: Direction) {
  return direction === Direction.Up || direction === Direction.Down
}

async function getSidesForRegionByDirectionAndGroup(
  region: Region, 
  direction: Direction, 
  group: RegionPoint[], 
  getId: (point: Point) => number
) {
  let current = group.shift()
  let previous
  let currentSide: RegionPerimeterSide = {
    type: direction,
    points: []
  }
  while (current) {
    if (!previous || getId(current) - getId(previous) === 1) {
      currentSide.points.push(current)
    }
    else {
      region.sides.push(currentSide)
      currentSide = {
        type: direction,
        points: [current]
      }
    }
    previous = current
    current = group.shift()
  }
  region.sides.push(currentSide)
}

async function getSidesForRegionByDirection(region: Region, direction: Direction) {
  const isVertical = getIsVertical(direction)
  const getId = isVertical ? getX : getY
  const getGroupId = (point: Point) =>
    (isVertical ? getY(point) : getX(point)).toString()

  const borderPointsForDirection = region.points
    .filter(point => point.borders.includes(direction))
    .sort(getSortOrder(getId))
  const groupedBorderPoints = groupBy(borderPointsForDirection, getGroupId)
  await Promise.all(
    Object
    .keys(groupedBorderPoints)
    .map(group => {
      getSidesForRegionByDirectionAndGroup(region, direction, groupedBorderPoints[group], getId)
    })
  )
}

async function determineSides(region: Region) {
  await Promise.all(
    Object
      .values(Direction)
      .map(direction => {
        getSidesForRegionByDirection(region, direction)
      })
  )
}

function chartRegion(
  regionType: RegionType, 
  point: RegionPoint, 
  visited: Point[] = []
): RegionPoint[] {
  visited.push(point)
  const potentialAdjacentRegionPoints = getAllAdjacentPoints(point)
  const adjacentRegionPoints: RegionPoint[] = []
  if (!point.borders) point.borders = []
  potentialAdjacentRegionPoints.forEach(adjacentPoint => {
    if (!isInBounds(adjacentPoint) || !isSameRegionType(adjacentPoint, regionType)) 
      return point.borders.push(adjacentPoint.direction)
    if (visited.some(({ x, y }) => x === adjacentPoint.x && y === adjacentPoint.y))
      return 
    adjacentRegionPoints.push({ x: adjacentPoint.x, y: adjacentPoint.y, borders: [] })
  })
  const regionPoints = [
    point, 
    ...adjacentRegionPoints.flatMap(point => chartRegion(regionType, point, visited))
  ]
  return regionPoints.reduce((acc, point) => {
    if (acc.some(({ x, y }) => x === point.x && y === point.y)) return acc
    return acc.concat([point])
  }, [])
}

async function mapRegionType(regionType: RegionType): Promise<RegionType> {
  while (regionType.unmappedPoints.length) {
    const point = regionType.unmappedPoints.shift()
    const regionPositions = chartRegion(regionType, point)
    regionPositions.forEach(point => {
      const index = regionType.unmappedPoints.findIndex(({ x, y }) => x === point.x && y === point.y)
      if (index !== -1) regionType.unmappedPoints.splice(index, 1)
    })

    const region: Region = {
      points: regionPositions,
      area: regionPositions.length,
      sides: [],
      totalCost: 0
    }
    await determineSides(region)
    // console.log('region', regionType.id, region)
    region.totalCost = region.area * region.sides.length

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
          unmappedPoints: []
        }
      }
      map[id].unmappedPoints.push({ x, y })
    }
  }
  
  const regionTypePromises = Object.keys(map).map(id => mapRegionType(map[id]))
  await Promise.all(regionTypePromises)
  
  const totalCost = Object.keys(map).reduce((acc, id) => acc + map[id].totalCost, 0)

  console.log('Total cost:', totalCost)
  console.log('Execution time: ', (Date.now() - startTime), 'ms')  

}


main()

