import readFile from './readFile'

export default function readFileAsString(filePath: string): string {

  const data = readFile(filePath)

  return data.toString()

}
