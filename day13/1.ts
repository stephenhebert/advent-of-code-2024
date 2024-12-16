// # =======================================
// # start time: 11:00pm
// # end time: 12:25pm
// # 
// # issues:
// #  * math is hard
// #  * self-doubt is distracting
// #  * regex input is weird -- different behaviors with global flag
// # 
// # reflections:
// #  * no idea why this works -- why it's not necessary to consider other possible solutions
// #  * the subreddit mentions linear algebra and matrix inversion
// #
// # =======================================
import { performance } from 'node:perf_hooks'
import readFileAsString from '../util/readFileAsString'

const startTime = performance.now()

if (process.argv.length !== 3 ) 
  throw new Error('Please specify the input file')
const inputFileName = process.argv[2]

const input = readFileAsString(`./${inputFileName}`)

const inputRegex = /Button A: X\+(?<x1>\d+), Y\+(?<y1>\d+)\nButton B: X\+(?<x2>\d+), Y\+(?<y2>\d+)\nPrize: X=(?<x3>\d+), Y=(?<y3>\d+)/

function precision(number) {
  return Number(Number(number).toFixed(2))
}

async function main() {

  let games = input.match(new RegExp(inputRegex, 'g'))
  const wins = games
    ?.map(game => {
      let { x1, x2, x3, y1, y2, y3 } = (inputRegex.exec(game))?.groups ?? {}
      x1 = Number(x1)
      x2 = Number(x2)
      x3 = Number(x3) + 10000000000000
      y1 = Number(y1)
      y2 = Number(y2)
      y3 = Number(y3) + 10000000000000
      let a = precision((x3/x2 - y3/y2) / (x1/x2 - y1/y2))
      let b = precision((x3 - x1*a) / x2)
      return { a, b}
    })
    .filter(({ a, b }) => a > 0 && b > 0 && a % 1 === 0 && b % 1 === 0)
  
  const costOfTokens = wins?.reduce((acc, { a, b }) => acc + (a*3 + b), 0)

  console.log('winning games: ', wins?.length)
  console.log('cost of tokens: ', costOfTokens)

  console.log('Execution time: ', (performance.now() - startTime), 'ms')  
}

main()

