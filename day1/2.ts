import fs from 'fs'

function getListsFromFile() {
  const data = fs.readFileSync('./input.txt',
    { encoding: 'utf8', flag: 'r' });

  const leftList = []
  const rightList = []

  data.toString().split('\n').forEach((line) => {
    const [left, right] = line.split(/ +/) 
    leftList.push(parseInt(left))
    rightList.push(parseInt(right))
  })

  return { leftList, rightList }
}

const { leftList, rightList } = getListsFromFile()

function getValueCountsFromList(list) {
  const counts = {}
  list.forEach((value) => {
    if (counts[value]) {
      counts[value] += 1
    } else {
      counts[value] = 1
    }
  })
  return counts
}

const rightCounts = getValueCountsFromList(rightList)

let similarityScore = 0

leftList.forEach((value) => {
  if (rightCounts[value]) {
    similarityScore += value * rightCounts[value]
  }
})

console.log('Similarity score:', similarityScore)
