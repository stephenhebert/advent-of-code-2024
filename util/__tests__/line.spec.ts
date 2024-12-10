import assert from 'assert/strict'
import { describe, it } from 'node:test'
import { difference } from '../cartesian'

describe('cartesian', () => {
  it('returns the difference between two points', () => {
    const point1 = { x: 0, y: 0 }
    const point2 = { x: 3, y: 4 }
    assert.deepEqual(difference(point1, point2), { x: 3, y: 4 })
  })

  it('returns the negative difference between two points if the order is reversed', () => {
    const point1 = { x: 0, y: 0 }
    const point2 = { x: 3, y: 4 }
    assert.deepEqual(difference(point2, point1), { x: -3, y: -4 })
  })
})