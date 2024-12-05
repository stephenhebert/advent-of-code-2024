import fs from 'fs'

function getListsFromFile() {
  const data = fs.readFileSync('../input.txt',
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

leftList.sort()
rightList.sort()

let totalDistance = 0

for (let i = 0; i < leftList.length; i++) {
  totalDistance += Math.abs(leftList[i] - rightList[i])
}

console.log('Total distance:', totalDistance)