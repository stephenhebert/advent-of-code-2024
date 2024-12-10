import {
  slope,
  distance,
} from '../cartesian'
import assert from 'node:assert'

function it (description: string, callback: () => void) {
  let error = undefined
  try {
    callback()
  }
  catch (e) {
    error = e
  }
  console.log(`${
    error ? '❌' : '✅'
  } ${description}`)
  if (error) console.error(error)
}

it('should return the slope between two points', () => {
  const point1 = { x: 0, y: 0 }
  const point2 = { x: 1, y: 1 }
  assert.equal(slope(point1, point2), 1)
})

it('should return undefined if the slope is vertical', () => {
  const point1 = { x: 0, y: 0 }
  const point2 = { x: 0, y: 1 }
  assert.equal(slope(point1, point2), undefined)
})

it('should return the distance between two points', () => {
  const point1 = { x: 0, y: 0 }
  const point2 = { x: 3, y: 4 }
  assert.equal(distance(point1, point2), 5)
})

// it('should return the point given a slope and distance', () => {
//   const point = { x: 0, y: 0 }
//   const slope = 1
//   const distance = 1
//   assert.deepEqual(getPointGivenSlopeAndDistance(point, slope, distance), { x: 1, y: 1 })
// })