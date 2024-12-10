// # =======================================
// # start time: 10:10am
// # end time: 10:00am
// # 
// # issues:
// #  * first attempt used strings, which required a lot of string manipulation and converting back and forth
// #    between string and array.  Performance difference was 23s for strings vs < 1s for arrays
// # 
// # reflections:
// # 
// # 
// # =======================================

import readFileAsString from "../util/readFileAsString"

const startTime = Date.now()

function main() {

  const originalFileSystem = readFileAsString('./input.txt')

  const isFile = (index) => index % 2 === 0
  const getFileId = (index) => Math.floor(index / 2)

  let stack = []
  for (let i = 0; i < originalFileSystem.length; i++) {
    if (isFile(i)) {
      for (let j = 0; j < originalFileSystem[i]; j++) {
        stack.push(getFileId(i))
      }
    }
    else {
      for (let j = 0; j < originalFileSystem[i]; j++) {
        stack.push('.')
      }
    }
  }

  let j = stack.length - 1
  for (let i = 0; i < stack.length && i < j; i++) {
    if (stack[i] === '.') {
      while (stack[j] === '.') {
        j--
      }
      if (j > i) {
        stack[i] = stack[j]
        stack[j] = '.'
      }
    }
  }

  let checksum = 0
  for (let i = 0; i < stack.indexOf('.'); i++) {
      checksum += Number(stack[i]) * i
  }

  console.log('checksum', checksum)

  console.log('Execution time: ', (Date.now() - startTime), 'ms')  

}

main()

