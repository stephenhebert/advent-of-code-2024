import readFileAsArray from "../../util/readFileAsArray"

const input = readFileAsArray("../input.txt")

const blankLineIndex = input.indexOf('')

const rules = input.slice(0, blankLineIndex)
const updates = input.slice(blankLineIndex + 1)

// console.log('rules', rules)
// console.log('updates', updates)

const rulesMap = rules.reduce((acc, rule) => {
  const [before, after] = rule.split('|')
  if (acc[after] === undefined) acc[after] = []
  acc[after].push(before)
  return acc
}, {})

let repairedUpdates = []

async function checkAndRepairUpdate(update) {
  const updateParts = update.split(',')
  let repaired = false
  for (let i = 0; i < updateParts.length - 1; i++) {
    // console.log('inspecting', updateParts[i])
    if (rulesMap[updateParts[i]] === undefined) {
      continue
    }
    let invalidIfAfter = rulesMap[updateParts[i]]
    let remainingParts = updateParts.slice(i + 1)

    let repairIndex
    for ( let j = 0; j < remainingParts.length; j++) {
      if (invalidIfAfter.includes(remainingParts[j])) {
        // console.log('invalid', remainingParts[j])
        repairIndex = i + 1 + j
      }
    }
    if (repairIndex !== undefined) {
      // console.log('repairing', updateParts.join(','))
      repaired = true
      const newAfter = updateParts[i]
      const newBefore = updateParts[repairIndex]
      // console.log('newBefore', newBefore)
      // console.log('newAfter', newAfter)
      updateParts[i] = newBefore
      updateParts[repairIndex] = newAfter
      // console.log('repaired', updateParts.join(','))
      i--
    }
  }
  if (repaired) repairedUpdates.push(updateParts.join(','))
  // validUpdates.push(update)
}

async function main() {
  const updateValidation = updates.map(update => checkAndRepairUpdate(update))
  await Promise.all(updateValidation)

  const sumOfMiddleNumbers = repairedUpdates.reduce((acc, update) => {
    const updateParts = update.split(',')
    return acc + parseInt(updateParts[ Math.floor(updateParts.length / 2) ])
  }, 0)

  console.log('sumOfMiddleNumbers', sumOfMiddleNumbers)
}

main()

// time:
// start: 9:58am
// end: 10:20am

// challenges:
// * mixed up variable names for update and updateParts