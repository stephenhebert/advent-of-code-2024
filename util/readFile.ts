import fs from 'fs'

export default function readFile(filePath: string): any {

  const data = fs.readFileSync(filePath,
    { encoding: 'utf8', flag: 'r' })

  return data

}
