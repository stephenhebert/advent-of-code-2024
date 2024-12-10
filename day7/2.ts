// # =======================================
// # start time: 12:24pm
// # end time: 12:40pm
// # 
// # issues:
// # 
// # 
// # reflections:
// #  * slow - Execution time:  7043 ms
// # 
// # =======================================
import readFileAsArray from "../util/readFileAsArray"

const startTime = Date.now()

const operators = ['+', '*', '||']

function getOperatorForPermutationIndices(i,j) {
  return operators[Math.floor(i / Math.pow(operators.length, j)) % operators.length]
}

function isSolved(product, factors, i) {
  let result = factors[0]
  for (let j = 0; j < factors.length - 1; j++) {
    switch (getOperatorForPermutationIndices(i,j)) {
      case '+':
        result += factors[ j + 1 ]
        break
      case '*':
        result *= factors[ j + 1 ]
        break
      case '||':
        result = Number(`${result}${factors[ j + 1 ]}`)
        break
    }
  }
  return result === product
}

async function attemptToSolve(line) {
  let [product, factors] = line.split(':')
  product = Number(product)
  factors = factors.trim().split(' ').map(Number)
  const numberOfPermutations = Math.pow(operators.length, factors.length - 1)
  for (let i = 0; i < numberOfPermutations; i++) {
    if (isSolved(product, factors, i)) return product
  }
  return 0
}

async function main() {
  const array = readFileAsArray('./input.txt')

  const solvedPromises = array.map(attemptToSolve)

  const solved = await Promise.all(solvedPromises)
  const sum = solved.reduce((acc, product) => acc + product, 0)

  console.log('sum', sum)

  console.log('Execution time: ', (Date.now() - startTime), 'ms')  
}

main()
