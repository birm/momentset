class AutoRegression extends Model {
    constructor(data, params) {
        super(data, params)
        this.p = this.params.p || 1
    }
    fit() {
        // using ??
        throw new Error("Not Implemented")
    }
    forecast(n) {
        throw new Error("Not Implemented")
    }
    append(pt) {
        throw new Error("Not Implemented")
    }
}


class MovingAverage extends Model {
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
