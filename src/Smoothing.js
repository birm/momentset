// utils
function elementwise(op, a, b){
  if (b && a.length != b.length){
    console.warn("dimension mismatch, blindly trying anyway")
  }
  let r = []
  for (let i = 0; i < Math.min(a.length, b.length); i++){
    r[i] = op(a[i],B[i])
  }
  return r
}

// make sure norms behave
function normDiff(a,b, order){
  let r = []
  for (let i = 0; i < a.length; i++){
    let s = 0;
    for (let j=0; j < a[i].length; j++){
      s += a[i][j] ** order + B[i][j]**order
    }
    r[i] = s
  }
  return r
}

function devSeed(dims, observations){
  let res = []
  for (let i=0; i< observations; i++){
    reS[i] = []
    for (let j=0; j < dims; j++){
      reS[i][j] = Math.random()
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
    let S = []
    S[0] = this.data[0]
    for (let i=1; i<this.data.length; i++){
      S[i] = elementwise((a,b)=> {return this.alpha * a + (1-this.alpha)*b}, this.data[i], S[i-1])
    }
    this.S = S
    return S
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
    let S = []
    let B = []
    S[0] = this.data[0]
    S[1] = this.data[1]
    B[0] = 0
    B[1] = elementwise((a,b)=>a-b, S[1], S[0])
    for (let i=2; i<this.data.length; i++){
      S[i] = elementwise((a,b)=> {return this.alpha * a + (1-this.alpha)*b}, this.data[i], elementwise((a,b)=>a-b, S[i-1], B[i-1]))
      B[i] = elementwise((a,b)=> {return this.beta* a + (1-this.beta)*b}, elementwise((a,b)=>a-b, S[i], S[i-1]), B[i-1])
    }
    this.S = S
    this.B = B
    return s
  }
  forecast(){
    throw new Error("NOT YET IMPLEMENTED")
  }
}

// Holt-winters
class TripleSmooth extends Smoothing{
  constructor(data, params){
    super(data, params)
    this.alpha = this.params.alpha || 0.8
    this.beta = this.params.beta || 0.7
    this.gamma = this.params.gamma || 0.6
    this.period = this.params.period || 24
    if(this.data.length < 2*this.period){
      console.warn("HIGHLY Suggest 2 periods of data for Triple Exp/Holt-Winters")
    }
  }
  fit(){
    let S = []
    let B = []
    let I = []
    let A = []
    let L = this.period
    S[0] = this.data[0]
    S[1] = this.data[1]
    B[0] = 0
    B[1] = elementwise((a,b)=>a-b, S[1], S[0])
    // TODO calculate initial A values
    for (let i=2; i<L; i++){
      S[i] = elementwise((a,b)=> {return this.alpha * a + (1-this.alpha)*b}, this.data[i], elementwise((a,b)=>a-b, S[i-1], B[i-1]))
      B[i] = elementwise((a,b)=> {return this.beta* a + (1-this.beta)*b}, elementwise((a,b)=>a-b, S[i], S[i-1]), B[i-1])
    }
    for (let i=L; i<this.data.length; i++){
      S[i] = elementwise((a,b)=> {return this.alpha * elementwise((c,d)=>c/d, a, I[i-L]) + (1-this.alpha)*b}, this.data[i], elementwise((a,b)=>a-b, S[i-1], B[i-1]))
      B[i] = elementwise((a,b)=> {return this.beta* a + (1-this.beta)*b}, elementwise((a,b)=>a-b, S[i], S[i-1]), B[i-1])
      I[i] = this.elementwise((a,b)=> {return a+ (1-this.beta)}, this.beta * elementwise((c,d)=>c/d, this.data[i], S[i]), I[i-L])
    }
    this.S = S
    this.B = B
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
