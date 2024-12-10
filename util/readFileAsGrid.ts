import readFileAsArray from './readFileAsArray'

export default function readFileAsGrid(filePath: string): string[][] {

  const array = readFileAsArray(filePath)

  return array.map(row => row.split(''))
}
