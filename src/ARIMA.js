class AutoRegression extends Model {
    constructor(data, params) {
        super(data, params)
        this.p = this.params.p || 1
    }
    fit() {
        // using yule walker
        let r = Array(this.p)
        let R = [...Array(this.p)].map(e => Array(this.p));
        // populate R
        for (let j = 0; j< this.p; j++){
          r[j] = acf(this.data, j)
          for (let k=0; k< this.p; k++){
            let kk = (k + j) % this.p
            R[k][kk] = r[j]
          }
        }
        // get R^-1
        // todo, consider removing math.js dep by implementing inv and multiply
        let Ri = math.inv(math.matrix(R))
        this.Phi = math.multiply(Ri, r)._data
        return this.data // does NOT smooth
    }
    forecast(n) {
      let T = this.data.slice(this.data.length - this.Phi.length)
        for (let i=0; i < n; i++){
          let x = 0
          for (let j=0; j < this.Phi.length; j++){
            x += this.Phi[j] * T[T.length - j - 1]
          }
          T.push(x)
        }
        return T.slice(this.Phi.length) // only return predictions
    }
    append(pt) {
        this.data.push(pt)
        this.fit() // recalculate fit
        return pt // no change, does not smooth
    }
}

class MovingAverage extends Model {
    constructor(data, params) {
        super(data, params)
        this.q = this.params.q || 5
    }
    fit() {
        this.X = []
        for (let i=0; i<this.data.length; i++){
          let ma = this.data.slice(Math.max((i-this.q) + 1, 0), i + 1)
          this.X.push(ma.reduce((a,b)=>a+b) / ma.length)
        }
        return this.X
    }
    forecast(n) {
        return new Array(n).fill(this.X[this.X.length - 1])
    }
    append(pt) {
        let i = this.data.length
        let ma = this.data.slice(Math.max((i-this.q) + 1, 0), i )
        ma.push(pt)
        let res = ma.reduce((a,b)=>a+b) / ma.length
        this.data.push(res)
        return res
    }
}


class ARMA extends Model {
    constructor(data, params) {
        super(data, params)
        this.alpha = this.params.alpha || 0.8
    }
    fit() {
        throw new Error("Not Implemented")
    }
    forecast(n) {
        throw new Error("Not Implemented")
    }
    append(pt) {
        throw new Error("Not Implemented")
    }
}


class ARIMA extends Model {
    constructor(data, params) {
        super(data, params)
        this.alpha = this.params.alpha || 0.8
    }
    fit() {
        throw new Error("Not Implemented")
    }
    forecast(n) {
        throw new Error("Not Implemented")
    }
    append(pt) {
        throw new Error("Not Implemented")
    }
}


class SARIMA extends Model {
    constructor(data, params) {
        super(data, params)
        this.alpha = this.params.alpha || 0.8
    }
    fit() {
        throw new Error("Not Implemented")
    }
    forecast(n) {
        throw new Error("Not Implemented")
    }
    append(pt) {
        throw new Error("Not Implemented")
    }
}
