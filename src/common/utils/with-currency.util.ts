import { Document } from 'mongoose';
import { Currency, CurrencySide } from '../db/models/finance/currency/currency.model';
import { numberFormat } from './number-format.util';

export function withCurrency(currency: Currency & Document, amount: number) {
    if (currency?.side === CurrencySide.START) return (currency.symbol || currency.name) + numberFormat(amount);
    return numberFormat(amount) + ' ' + (currency?.symbol || currency?.name);
}
