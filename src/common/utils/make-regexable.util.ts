const regexSymbols = ['\\', '.', '*', '+', '?', '|', '[', ']', '^', '(', ')', '{', '}', '$'];

export const makeRegexableUtil = (str) => {
    if (!str) return '';
    let result = str;
    for (const regexSymbol of regexSymbols) {
        result = result.replaceAll(`${regexSymbol}`, '\\' + `${regexSymbol}`);
    }
    return result;
};
