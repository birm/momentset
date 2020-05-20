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
  return correlation(X, lag(X, t))
}

const acf = autoCorrelation // alias

function autoCovariance(X, t){
  return cov(X, lag(X, t))
}

function partialAutoCorrelation(X, k){
  // todo maybe?
  throw new Error("Not implemented yet.")
}


const pacf = partialAutoCorrelation // alias
