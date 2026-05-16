const cyrillicToLatinMap = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'yo',
    ж: 'j',
    з: 'z',
    и: 'i',
    й: 'y',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'kh',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'shch',
    ъ: '',
    ы: 'i',
    ь: '',
    э: 'e',
    ю: 'yu',
    я: 'ya',
};

const latinToCyrillicMap = {
    a: 'а',
    b: 'б',
    v: 'в',
    g: 'г',
    d: 'д',
    e: 'э',
    e2: 'е',
    j: 'ж',
    z: 'з',
    i: 'и',
    y: 'й',
    k: 'к',
    l: 'л',
    m: 'м',
    n: 'н',
    o: 'о',
    p: 'п',
    r: 'р',
    s: 'с',
    t: 'т',
    u: 'у',
    f: 'ф',
    x: 'х',
    ts: 'ц',
    ch: 'ч',
    sh: 'ш',
    shch: 'щ',
    ye: 'е',
    yo: 'ё',
    yu: 'ю',
    ya: 'я',
};

export function transliterate(search: string) {
    if (!search) return '';
    let isFirst = true;
    return search
        .toLocaleLowerCase()
        .split('')
        .map((l) => {
            if (l == 'e' && !isFirst) {
                l = 'e2';
            }
            isFirst = false;
            return cyrillicToLatinMap[l] || latinToCyrillicMap[l] || l;
        })
        .join('');
}

export function transliterate_cr_en(str: string) {
    return str
        .toLocaleLowerCase()
        .split('')
        .map((l) => cyrillicToLatinMap[l] || l)
        .join('');
}
