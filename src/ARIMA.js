class AutoRegression extends Model {
    constructor(data, params) {
        super(data, params)
        this.p = this.params.p || 5
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
        this.data.push(pt)
        let i = this.data.length
        let ma = this.data.slice(Math.max((i-this.q) + 1, 0), i +1 )
        let res = ma.reduce((a,b)=>a+b) / ma.length
        this.X.push(res)
        return res
    }
}

// I think I've done ARMA very nontradionally (read: wrong), revisit later...
class ARMA extends Model {
    constructor(data, params) {
        super(data, params)
        this.q = this.params.q || 5
        this.p = this.params.p || 5
    }
    fit() {
        this.ma = new MovingAverage(this.data, {q:this.q})
        this.ma.fit()
        this.ar = new AutoRegression(this.ma.fit(), {p:this.p})
        return this.ar.fit()
    }
    forecast(n) {
        return this.ar.forecast(n)
    }
    append(pt) {
        this.ar.append(this.ma.append(pt))
    }
}


class ARIMA extends Model {
    constructor(data, params) {
        super(data, params)
        this.q = this.params.q || 5
        this.d = this.params.d || 1
        this.p = this.params.p || 5
    }
    fit() {
        // differencing order d
        let diff_data = this.data.slice()
        for (let j=0; j < this.d; j++){
          let new_diff_data = diff_data.slice()
          new_diff_data[0] = 0
          for (let i=1; i < diff_data.length ; i++){
            new_diff_data[i] = diff_data[i] - diff_data[i-1]
            console.log(new_diff_data[i])
          }
          diff_data = new_diff_data
        }
        this._arma = new ARMA(diff_data, this.params)
        this.diff_data = diff_data
        return this._arma.fit()
    }
    forecast(n) {
        return this._arma.forecast(n)
    }
    append(pt) {
        let diff_data = this.diff_data.slice()
        for (let i=0; i < diff_data.length -1 ; i++){
          new_diff_data[j] = diff_data[j] - diff_data[j-1]
        }
        let new_pt = diff_data[diff_data.length-1]
        this.diff_data = new_pt
        return this._arma.append(new_pt)
    }
}
