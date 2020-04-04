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
  forecast(){
    throw new Error("Use one of the implementations, not base class.")
  }
}

class SingleSmooth extends Smoothing{
  constructor(data, params){
    super(data, params)
    this.alpha = this.params.alpha || 0.8
  }
  fit(){
    let s = []
    s[0] = this.data[0]
    for (let i=1; i<this.data.length; i++){
      s[i] = elementwise((a,b)=> {return this.alpha * a + (1-this.alpha)*b}, this.data[i], s[i-1])
    }
    this.s = s
    return s
  }
  forecast(){
    throw new Error("NOT YET IMPLEMENTED")
  }
}

class DoubleSmooth extends Smoothing{
  constructor(data, params){
    super(data, params)
    this.alpha = this.params.alpha || 0.8
    this.beta = this.params.beta || 0.7
  }
  fit(){
    let s = []
    let b = []
    s[0] = this.data[0]
    s[1] = this.data[1]
    b[0] = 0
    b[1] = elementwise((a,b)=>a-b, s[1], s[0])
    for (let i=2; i<this.data.length; i++){
      s[i] = elementwise((a,b)=> {return this.alpha * a + (1-this.alpha)*b}, this.data[i], elementwise((a,b)=>a-b, s[i-1], b[i-1]))
      b[i] = elementwise((a,b)=> {return this.beta* a + (1-this.beta)*b}, elementwise((a,b)=>a-b, s[i], s[i-1]), b[i-1])
    }
    this.s = s
    this.b = b
    return s
  }
  forecast(){
    throw new Error("NOT YET IMPLEMENTED")
  }
}


class TripleSmooth extends Smoothing{
  constructor(data, params){
    super(data, params)
    this.alpha = this.params.alpha || 0.8
    this.beta = this.params.beta || 0.7
    this.gamma = this.params.gamma || 0.6
  }
  fit(){
    let s = []
    s[0] = this.data[0]
    for (let i=1; i<this.data.length; i++){
      s[i] = elementwise((a,b)=> {return this.alpha * a + (1-this.alpha)*b}, this.data[i], s[i-1])
    }
    return s
  }
  forecast(){
    throw new Error("NOT YET IMPLEMENTED")
  }
}

// testing so far
j = devSeed(2,100)
s1 = new SingleSmooth(j)
res1 = s1.fit()
s2 = new DoubleSmooth(j)
res2 = s2.fit()
s3 = new TripleSmooth(j)
res2 = s2.fit()
