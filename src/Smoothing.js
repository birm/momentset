// utils
function elementwise(op, a, b){
  if (b && a.length != b.length){
    console.warn("dimension mismatch, blindly trying anyway")
  }
  let r = []
  for (let i = 0; i < Math.min(a.length, b.length); i++){
    r[i] = op(a[i],b[i])
  }
  return r
}

// make sure norms behave
function normDiff(a,b, order){
  let r = []
  for (let i = 0; i < a.length; i++){
    let s = 0;
    for (let j=0; j < a[i].length; j++){
      s += a[i][j] ** order + b[i][j]**order
    }
    r[i] = s
  }
  return r
}

function devSeed(dims, observations){
  let res = []
  for (let i=0; i< observations; i++){
    res[i] = []
    for (let j=0; j < dims; j++){
      res[i][j] = Math.random()
    }
  }
  return res;
}


// single double and triple exponential smoothing
class Smoothing{
  constructor(data, params){
    this.data = data
    this.params = params || {}
  }
  fit(){
    throw new Error("Use one of the implementations, not base class.")
  }
  predict(){
    throw new Error("Use one of the implementations, not base class.")
  }
}

class SingleSmooth extends Smoothing{
  constructor(data, params){
    super(data, params)
    this.params.alpha = this.params.alpha || 0.8
  }
  fit(){
    let s = []
    s[0] = this.data[0]
    for (let i=1; i<this.data.length; i++){
      s[i] = elementwise((a,b)=> {return this.params.alpha * a + (1-this.params.alpha)*b}, this.data[i], s[i-1])
    }
    return s
  }
}

// testing so far
j = devSeed(2,100)
s = new SingleSmooth(j)

class DoubleSmooth extends Smoothing{
}

class TripleSmooth extends Smoothing{
}
