export function numberFormat(x: string | null | number | undefined | Number | String, precision = 3): string {
    if (x === undefined || x === null || x === '') return '';

    const pureString = String(x).replace(/[^\d.-]/g, '');

    const sign = pureString[0] === '-' ? '-' : '';

    const parts = pureString.split('.');
    let numbersAfterDigit = '';
    if (parts.length === 2) numbersAfterDigit = parts[1];

    const formatArrays = Intl.NumberFormat('us-US', {
        currency: 'USD',
        style: 'currency',
        useGrouping: true,
        maximumFractionDigits: precision,
    }).formatToParts(Number(pureString));

    let formattedString = '';
    formatArrays.forEach((part) => {
        switch (part.type) {
            case 'integer': {
                formattedString += part.value;
                break;
            }
            case 'group': {
                formattedString += ' ';
                break;
            }
            case 'decimal': {
                if (parts.length === 2) formattedString += '.';
                break;
            }
            case 'fraction': {
                if (numbersAfterDigit.length < precision) formattedString += numbersAfterDigit;
                else formattedString += numbersAfterDigit.substring(0, precision);
                break;
            }

            default:
                break;
        }
    });

    let result = sign + formattedString;

    return result;
}

export function roundNumber(num: number, decimalPlaces = 3): number {
    if (!num || typeof num !== 'number') return num;
    const factor = Math.pow(10, decimalPlaces);
    const result = Math.round(num * factor) / factor;
    return result;
}
