// # =======================================
// # start time: 10:10am
// # end time: 10:25am
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

function getBlockSize(stack, index, step) {
  const id = stack[index]
  let size = 0
  while (stack[index] === id) {
    size++
    index += step
  }
  return size
}

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
  
  for (let j = stack.length - 1; j > 0; j--) {
    if (stack[j] === '.') continue
    let fileBlockSize = getBlockSize(stack, j, -1)
    for (let i = 0; i < j; i++) {
      if (stack[i] === '.') {
        let spaceBlockSize = getBlockSize(stack, i, 1)
        if (spaceBlockSize >= fileBlockSize) {
          for (let k = 0; k < fileBlockSize; k++) {
            stack[i + k] = stack[j - k]
            stack[j - k] = '.'
          }
          break
        }
      }
    }
    j -= fileBlockSize - 1
  }

  // console.log('stack', stack.join(''))


  let checksum = 0
  for (let i = 0; i < stack.length; i++) {
      if (stack[i] === '.') continue
      checksum += Number(stack[i]) * i
  }

  console.log('checksum', checksum)
  

  console.log('Execution time: ', (Date.now() - startTime), 'ms')  

}

main()

