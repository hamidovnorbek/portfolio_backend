export function getObjectValue(obj, keysStr) {
    const keys = keysStr.split('.');
    let val = Object.assign({}, obj);
    for (const key of keys) {
        if (!val) return null;
        val = val[key];
    }
    return val;
}
