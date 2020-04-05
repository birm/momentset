// utils
// TODO? generalize elementwise to any number of operands
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
    res[i] = new Array(dims).fill(Math.random())
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
  append(){
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
  forecast(n){
    return new Array(n).fill(this.S[this.S.length-1])
  }
  append(pt){
    let i = this.data.length
    this.S[i] = elementwise((a,b)=> {return this.alpha * a + (1-this.alpha)*b}, pt, this.S[i-1])
    return this.S[i]
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
    return this.S
  }
  forecast(n){
    let f = []
    for (let i=0; i<n; i++){
      f[i] = elementwise((a,b)=>{return a+(i*b)}, this.S[this.S.length-1], this.B[this.B.length-1])
    }
    return f
  }
  append(pt){
    let i = this.data.length
    this.S[i] = elementwise((a,b)=> {return this.alpha * a + (1-this.alpha)*b}, pt, elementwise((a,b)=>a-b, this.S[i-1], this.B[i-1]))
    this.B[i] = elementwise((a,b)=> {return this.beta* a + (1-this.beta)*b}, elementwise((a,b)=>a-b, this.S[i], this.S[i-1]), this.B[i-1])
    return this.S[i]
  }
}

// Holt-winters, multiplicative
class TripleSmooth extends Smoothing{
  constructor(data, params){
    super(data, params)
    this.alpha = this.params.alpha || 0.8
    this.beta = this.params.beta || 0.7
    this.gamma = this.params.gamma || 0.6
    this.period = this.params.period || 24
    if(this.data.length < 2*this.period){
      throw new Error("Requires 2 periods of data for Triple Exp/Holt-Winters")
    }
  }
  fit(){
    let S = []
    let B = []
    let C = []
    let L = this.period
    let A = new Array(L).fill(new Array(this.data[0].length).fill(0));
    S[0] = this.data[0]
    B[0] = new Array(this.data[0].length).fill(0);
    let N = Math.floor(this.data.length/this.period)
    // Initalizations
    for (let i=0; i<L; i++){
      B[0] = elementwise((a,b)=>a+b , B[0], elementwise((c,d)=>{return (c+d)/L}, this.data[L+i], this.data[i]))
      for (let j=0; j<N; j++){
        A[j] = elementwise((a,b)=>a+(b/L), A[j], this.data[(L*j)+i])
      }
    }
    for(let i=0; i<L; i++){
      C[i] = new Array(this.data[0].length).fill(0);
      for (let j=0; j<N; j++){
        C[i] = elementwise((a,b)=>a+b, C[i], elementwise((c,d)=>c/d, this.data[(L*j)+i], A[j]))
        C[i] = elementwise((a,b)=>a/N, C[i], C[i])
      }
    }
    B[0] = elementwise((a,b)=>a/L, B[0], B[0])
    for (let i=1; i<L; i++){
      S[i] = elementwise((a,b)=> {return this.alpha * a + (1-this.alpha)*b}, this.data[i], elementwise((a,b)=>a-b, S[i-1], B[i-1]))
      B[i] = elementwise((a,b)=> {return this.beta* a + (1-this.beta)*b}, elementwise((a,b)=>a-b, S[i], S[i-1]), B[i-1])
    }
    for (let i=L; i<this.data.length; i++){
      S[i] = elementwise((c,d)=>c+d, elementwise((a,b)=> { return this.alpha*(a/b)}, this.data[i], C[i-L]), elementwise((e,f)=>{return 1-this.alpha*(e,f)}, S[i-1], B[i-1]))
      B[i] = elementwise((a,b)=> {return this.beta* a + (1-this.beta)*b}, elementwise((c,d)=>c-d, S[i], S[i-1]), B[i-1])
      C[i] = elementwise((a,b)=> {return a+ (1-this.gamma)}, elementwise((c,d)=>{return this.gamma *(c/d)}, this.data[i], S[i]), C[i-L])
    }
    this.S = S
    this.B = B
    this.C = C
    return this.S
  }
  append(pt){
    let i = this.data.length
    let L = this.period
    this.S[i] = elementwise((c,d)=>c+d, elementwise((a,b)=> { return this.alpha*(a/b)}, pt, this.C[i-L]), elementwise((e,f)=>{return 1-this.alpha*(e,f)}, this.S[i-1], this.B[i-1]))
    this.B[i] = elementwise((a,b)=> {return this.beta* a + (1-this.beta)*b}, elementwise((c,d)=>c-d, this.S[i], this.S[i-1]), this.B[i-1])
    this.C[i] = elementwise((a,b)=> {return a + (1-this.gamma)}, elementwise((c,d)=>{return this.gamma *(c/d)}, pt, this.S[i]), this.C[i-L])
    return this.S[i]
  }
  forecast(n){
    let f = []
    let L = this.period
    for (let i=0; i<n; i++){
      f[i] = elementwise((c,d)=>c+d, elementwise((a,b)=>{return a+i*b}, this.S[this.S.length-1], this.B[this.B.length-1]), this.C[(this.C.length - L + 1 + i)%L])
    }
    return f
  }
}



function HoltWinters(n, data, params){
  if (n==1){
    return new SingleSmooth(data, params)
  } else if (n==2){
    return new DoubleSmooth(data, params)
  } else if(n==3){
    return new TripleSmooth(data, params)
  } else {
    throw new Error("H-W Implemented for n = 1 2 or 3")
  }
}

// smoke testing
j = devSeed(2,100)
s1 = HoltWinters(1,j)
res1 = s1.fit()
s2 = HoltWinters(2,j)
res2 = s2.fit()
s3 = HoltWinters(3,j)
res2 = s3.fit()
s1.append(devSeed(2,1)[0])
s2.append(devSeed(2,1)[0])
s3.append(devSeed(2,1)[0])
f1 = s1.forecast(5)
f2 = s2.forecast(5)
f3 = s3.forecast(5)
