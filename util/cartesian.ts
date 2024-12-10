function distance(point1: { x: number, y: number }, point2: { x: number, y: number }) {
  return Math.sqrt(
    Math.pow(point1.x - point2.x, 2) +
    Math.pow(point1.y - point2.y, 2)
  )
}

function slope(point1: { x: number, y: number }, point2: { x: number, y: number }) {
  return ((point2.x - point1.x) !== 0 ) ? (point2.y - point1.y) / (point2.x - point1.x) : undefined
}

function difference(point1: { x: number, y: number }, point2: { x: number, y: number }) {
  return { x: point2.x - point1.x, y: point2.y - point1.y }
}

export {
  distance,
  slope,
  difference,
}