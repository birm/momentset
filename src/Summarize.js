// use a polynomial of order n to summarize a time series or forecast
function summarize(n, data){
  // prepare matrix of order n
  let array = []
  let indices = []
  for (let i=1; i<=n; i++){
    array.push(data.map(x=>Math.pow(x,i)))
    indices.push([i])
  }
  insices = math.matrix(indices)
  let mat = math.transpose(math.matrix(array))
  // try to solve
  let a = math.multiply(mat, math.transpose(mat))
  console.log(a)
  let b = math.multiply(mat, indices)
  console.log(b)
  return math.transpose(math.multiply(math.inv(a), b))._data[0]
}
