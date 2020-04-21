class ARIMA extends Model {
    constructor(data, params) {
        super(data, params)
        this.alpha = this.params.alpha || 0.8
    }
    fit() {
        throw new Error("Use one of the implementations, not base class.")
    }
    forecast(n) {
        throw new Error("Use one of the implementations, not base class.")
    }
    append(pt) {
        throw new Error("Use one of the implementations, not base class.")
    }
}
