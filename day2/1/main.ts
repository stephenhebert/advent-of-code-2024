import readFileAsArray from "../../util/readFileAsArray"

const input = readFileAsArray("../input.txt")

enum ReadingType {
  INCREASING,
  DECREASING
}

function isReportSafe(line: string): boolean {
  let readings = line.split(" ").map((reading) => parseInt(reading))
  const readingType = (readings[0] - readings[1]) > 0 ? ReadingType.DECREASING : ReadingType.INCREASING
  
  for (let i = 1; i < readings.length; i++) {
    const difference = (readings[i] - readings[i - 1]) * (readingType === ReadingType.INCREASING ? 1 : -1)
    if (difference < 1 || difference > 3) { 
      // console.log('line: ', line)
      // console.log('readingType: ', readingType === ReadingType.INCREASING ? 'increasing' : 'decreasing')
      // console.log('unsafe', difference)
      return false
    }
  }
  return true
}

const safeReports = input.reduce((acc, line) => {
  const isSafe = isReportSafe(line)
  return acc + (isSafe ? 1 : 0)
}, 0)

console.log('Safe reports: ', safeReports)
