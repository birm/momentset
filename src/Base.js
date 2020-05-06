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

// make sure norms behave
function normDiff(a, b, order) {
    let r = []
    for (let i = 0; i < a.length; i++) {
        let s = 0;
        for (let j = 0; j < a[i].length; j++) {
            s += a[i][j] ** order + b[i][j] ** order
        }
        r[i] = s
    }
    return r
}

function devSeed(dims, observations) {
    let res = []
    for (let i = 0; i < observations; i++) {
        res[i] = new Array(dims).fill(Math.random()*20+20)
    }
    return res;
}

// stats related functions
function mean(X){
  return 0
}

function correlation(X){
  return 0
}

function autoCorrelation(X, k){
  return 0
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
