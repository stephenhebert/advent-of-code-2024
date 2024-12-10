// # =======================================
// # start time: 11:55pm
// # end time: 12:22am
// # 
// # issues:
// # 
// # 
// # 
// # reflections:
// # 
// # 
// # =======================================
import readFileAsArray from "../util/readFileAsArray"

const startTime = Date.now()

const operators = ['+', '*']

function getAllPermutations(operations: number) {
  const permutations = []
  const numberOfPermutations = Math.pow(operators.length, operations)
  for (let i = 0; i < numberOfPermutations; i++) {
    const permutation = []
    for (let j = 0; j < operations; j++) {
      permutation.push(i & (1 << j) ? operators[0] : operators[1])
    }
    permutations.push(permutation)
  }
  return permutations
}


function main() {
  const array = readFileAsArray('./input.txt')

  const sum = array.reduce((acc, line) => {
    let [product, factors] = line.split(':')
    product = Number(product)
    factors = factors.trim().split(' ').map(Number)
    const operations = factors.length - 1
    let permutations = getAllPermutations(operations)
    const worksOut = permutations.some(perm => {
      let result = factors[0]
      for (let i = 0; i < perm.length; i++) {
        if (perm[i] === '+') {
          result += factors[ i + 1 ]
        } else {
          result *= factors[ i + 1 ]
        }
      }
      if (result === product) return true
    })
    if (worksOut) return acc + product
    return acc
  }, 0)

  console.log('sum', sum)


  console.log('Execution time: ', (Date.now() - startTime), 'ms')  
}

main()

