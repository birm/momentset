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
