// utils
// TODO? generalize elementwise to any number of operands
function elementwise(op, a, b) {
    if (b && a.length != b.length) {
        console.warn("dimension mismatch, blindly trying anyway")
    }
    let r = []
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
        r[i] = op(a[i], b[i])
    }
    return r
}

function devSeed(observations) {
    return Array.from({length: observations}, () => Math.random()*20+20);
}

// stats related functions
function mean(X){
  let res = 0.0
  for (let i in X){
    res += parseFloat(i)
  }
  return res/X.length
}
function covariance(X, Y){
  if (X.length != Y.length) {
      console.info("covariance length mismatch")
  }
  let N = Math.min(X.length, Y.length)
  let res = 0
  let xu = mean(X)
  let yu = mean(Y)
  for (let i=0; i<N; i++){
    res+= (X[i]-xu)*(Y[i]-yu)
  }
  return res/N
}

const cov = covariance // alias

function variance(X){
  let res = 0
  let xu = mean(X)
  for (let i in X){
    res += Math.pow((parseFloat(i) - xu), 2)
  }
  return res/X.length
}

// const var = variance // alias we can't use for obvious reasons. Sorry!

function standardDeviation(X, silent){
  let res = variance(X)
  if (!silent && res < 0){
    throw new Error("No complex Support")
  }
  return Math.pow(res, 0.5)
}

function lag(X, t){
  if (X.length < t){
    console.warn("Not enough observations to lag: " + X.length + " < " + t)
  }
  return X.slice(t).concat(X.slice(0,t))
}

const std = standardDeviation // alias

function correlation(X, Y){
  return covariance(X, Y)/(standardDeviation(X) * standardDeviation(Y))
}

const corr = correlation // alias

function autoCorrelation(X, t){
  return correlation(X, lag(X,t))
}


// ABC for models
class Model {
    constructor(data, params) {
        this.data = data.slice()
        this.params = params || {}
    }
    fit() {
        throw new Error("Use one of the implementations, not base class.")
    }
    append() {
        throw new Error("Use one of the implementations, not base class.")
    }
    forecast() {
        throw new Error("Use one of the implementations, not base class.")
    }
}
