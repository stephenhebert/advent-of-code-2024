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

let validUpdates = []

async function checkUpdate(update) {
  const updateParts = update.split(',')
  for (let i = 0; i < updateParts.length - 1; i++) {
    if (rulesMap[updateParts[i]] === undefined) {
      continue
    }
    let invalidIfAfter = rulesMap[updateParts[i]]
    let remainingParts = updateParts.slice(i + 1)
    const isInvalid = invalidIfAfter.some((rule) => {
      if (remainingParts.includes(rule)) {
        return true
      }
    })
    if (isInvalid) {
      return
    }
  }
  validUpdates.push(update)
}

async function main() {
  const updateValidation = updates.map(update => checkUpdate(update))
  await Promise.all(updateValidation)

  // console.log('validUpdates', validUpdates)

  const sumOfMiddleNumbers = validUpdates.reduce((acc, update) => {
    const updateParts = update.split(',')
    return acc + parseInt(updateParts[ Math.floor(updateParts.length / 2) ])
  }, 0)

  console.log('sumOfMiddleNumbers', sumOfMiddleNumbers)
}

main()

// time:
// start: 9:40am
// end: 9:52am