const reverse = (string) => {
  return string
    .split('')
    .reverse()
    .join('')
}

const average = (arr) => {
  const reducer = (sum,item) => sum + item
  return arr.length !==0 ? arr.reduce(reducer,0) / arr.length : 0
}

module.exports = { reverse,average }