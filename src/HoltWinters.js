class SingleSmooth extends Model {
    constructor(data, params) {
        super(data, params)
        this.alpha = this.params.alpha || 0.8
    }
    fit() {
        let S = []
        S[0] = this.data[0]
        for (let i = 1; i < this.data.length; i++) {
            S[i] = this.alpha* this.data[i] + (1 - this.alpha) * S[i-1]
        }
        this.S = S
        return S
    }
    forecast(n) {
        return new Array(n).fill(this.S[this.S.length - 1])
    }
    append(pt) {
        let i = this.data.length
        this.data[i] = pt
        this.S[i] = this.alpha* this.data[i] + ((1 - this.alpha) * this.S[i-1])
        return this.S[i]
    }
}

class DoubleSmooth extends Model {
    constructor(data, params) {
        super(data, params)
        this.alpha = this.params.alpha || 0.8
        this.beta = this.params.beta || 0.7
    }
    fit() {
        let S = []
        let B = []
        S[0] = this.data[0]
        S[1] = this.data[1]
        B[0] = 0
        B[1] = S[1] - S[0]
        for (let i = 2; i < this.data.length; i++) {
            S[i] = this.alpha * this.data[i] + (1 - this.alpha) * (S[i - 1] - B[i - 1])
            B[i] = this.beta * (S[i] - S[i-1]) + (1 - this.beta) * B[i - 1]
        }
        this.S = S
        this.B = B
        return this.S
    }
    forecast(n) {
        let f = []
        for (let i = 0; i < n; i++) {
            f[i] = this.S[this.S.length - 1] + (i * this.B[this.B.length - 1])
        }
        return f
    }
    append(pt) {
        let i = this.data.length
        this.data[i] = pt
        let S = this.S
        let B = this.B
        this.S[i] = this.alpha * this.data[i] + (1 - this.alpha) * (S[i - 1] - B[i - 1])
        this.B[i] = this.beta * (S[i] - S[i-1]) + (1 - this.beta) * B[i - 1]
        return this.S[i]
    }
}

// Holt-winters, additive
class TripleSmooth extends Model {
    constructor(data, params) {
        super(data, params)
        this.alpha = this.params.alpha || 0.8
        this.beta = this.params.beta || 0.7
        this.gamma = this.params.gamma || 0.6
        this.period = this.params.period || 24
        if (this.data.length < 2 * this.period) {
            throw new Error("Requires 2 periods of data for Triple Exp/Holt-Winters")
        }
    }
    fit() {
        let S = []
        let B = []
        let C = []
        let L = this.period
        S[0] = this.data[0]
        B[0] = 0
        let N = Math.floor((this.data.length-1)/ this.period)
        let A = new Array(N).fill(0);
        // Initalizations
        for (let i = 0; i < L; i++) {
            B[0] = B[0] + (this.data[L+i]+this.data[i])/ L
            for (let j = 0; j < N; j++) {
                A[j] = A[j] + (this.data[(L * j) + i]/L)
            }
        }
        for (let i = 0; i < L; i++) {
            C[i] = new Array(this.data[0].length).fill(0);
            for (let j = 0; j < N; j++) {
                C[i] = (C[i] + (this.data[(L*j)]/A[j])) / N
            }
        }
        B[0] = B[0] / L
        for (let i = 1; i < L; i++) {
            S[i] = (this.alpha * this.data[i]) + ((1 - this.alpha) * (S[i-1] - B[i-1]))
            B[i] = this.beta * (S[i] - S[i-1]) + (1 - this.beta) * B[i-1]
        }
        for (let i = L; i < this.data.length; i++) {
            S[i] = (this.alpha*(this.data[i] - C[i-L]))+((1-this.alpha)*(S[i-1] + B[i-1]))
            B[i] = (this.beta * (S[i] - S[i-1])) + ((1 - this.beta) * B[i-1])
            C[i] = (this.gamma * (this.data[i] - S[i-1] - B[i-1])) + (1 - this.gamma)*C[i - L]
        }
        this.S = S
        this.B = B
        this.C = C
        return this.S
    }
    append(pt) {
        let i = this.data.length
        this.data[i] = pt
        let L = this.period
        let S = this.S
        let B = this.B
        let C = this.C
        this.S[i] = (this.alpha*(this.data[i] - C[i-L]))+((1-this.alpha)*(S[i-1] + B[i-1]))
        this.B[i] = (this.beta * (S[i] - S[i-1])) + ((1 - this.beta) * B[i-1])
        this.C[i] = (this.gamma * (this.data[i] - S[i-1] - B[i-1])) + (1 - this.gamma)*C[i - L]
        return this.S[i]
    }
    forecast(n) {
        let f = []
        let L = this.period
        for (let i = 0; i < n; i++) {
            f[i] = this.S[this.S.length - 1] + i * (this.B[this.B.length - 1]) + this.C[(this.C.length - L + 1 + i) % L]
        }
        return f
    }
}



function HoltWinters(n, data, params) {
    if (n == 1) {
        return new SingleSmooth(data, params)
    } else if (n == 2) {
        return new DoubleSmooth(data, params)
    } else if (n == 3) {
        return new TripleSmooth(data, params)
    } else {
        throw new Error("H-W Implemented for n = 1 2 or 3")
    }
}

function _smokeTest(){
  let j = devSeed(100)
  let s1 = HoltWinters(1, j)
  let res1 = s1.fit()
  let s2 = HoltWinters(2, j)
  let res2 = s2.fit()
  let s3 = HoltWinters(3, j)
  let res3 = s3.fit()
  s1.append(devSeed(2)[0])
  s2.append(devSeed(2)[0])
  s3.append(devSeed(2)[0])
  let f1 = s1.forecast(5)
  let f2 = s2.forecast(5)
  let f3 = s3.forecast(5)
}
_smokeTest()
