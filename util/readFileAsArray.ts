import readFileAsString from './readFileAsString'

export default function readFileAsArray(filePath: string): string[] {

  const string = readFileAsString(filePath)

  return string.split('\n')

}
