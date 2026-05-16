import dayjs from 'dayjs';
import Excel from 'exceljs';
import { Document } from 'mongoose';
import { AcceptLanguages } from 'src/common/constant/languages';
import { Currency } from 'src/common/db/models/finance/currency/currency.model';
import { currencyService } from 'src/common/service/finance/currency/currency.service';
import { PageNames, Table, TableColumnType } from 'src/common/types/table.type';
import { numberFormat } from 'src/common/utils/number-format.util';
import { getObjectValue } from 'src/common/utils/object-value.util';
import { getPageColumns } from 'src/common/utils/page-columns.util';
import { withCurrency } from 'src/common/utils/with-currency.util';
import { I18nService } from 'src/modules/common/modules/i18n/i18n.service';

class ExportAssistant {
    private currencies = new Map<string, Currency & Document>();
    private async createXlsFile(file_name: string, columns: string[], rows: any[], path: string) {
        const cols = columns.map((c) => ({
            header: c,
            key: c,
            width: 20,
        }));

        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet(file_name);
        worksheet.columns = cols;
        worksheet.addRows(rows);

        worksheet.columns.forEach((column) => {
            const defaultCharWidth = 1.2;
            const maxWidth = 50;
            let contentWidth = column.header ? column.header.toString().length * defaultCharWidth : 0;
            column.eachCell({ includeEmpty: true }, (cell) => {
                contentWidth = Math.max(contentWidth, cell.value ? cell.value.toString().length * defaultCharWidth : 0);
            });
            column.width = Math.min(maxWidth, contentWidth);
        });

        await workbook.xlsx.writeFile(path);
    }

    private formatCellValue = (column: Table, obj: Object, i18n: I18nService, lang = AcceptLanguages.UZ) => {
        const value = getObjectValue(obj, column.key);
        if (!value) return '';
        switch (column.type) {
            case TableColumnType.STRING:
                return value;
            case TableColumnType.NUMBER:
                return numberFormat(value);
            case TableColumnType.DATE:
                return dayjs(value).format(column.date_format || 'DD.MM.YYYY');
            case TableColumnType.ENUM:
                if (column.enum_values?.[value])
                    return i18n.translate(column.enum_values[value].translation_key, { lang });
                return value;
            case TableColumnType.CURRENCY:
                const currency = this.currencies.get(getObjectValue(obj, column.currency_field)?.toString());
                if (!currency) return numberFormat(value);
                return withCurrency(currency, value);
            case TableColumnType.BOOLEAN:
                return value ? '+' : '';
            default:
                return value;
        }
    };

    private initCurrencies = async () => {
        const allCurrencies = await currencyService.getAll();
        allCurrencies.forEach((e) => {
            this.currencies.set(e._id.toString(), e);
        });
    };

    async excel(
        page_name: PageNames,
        data: any[],
        file_name: string,
        i18n: I18nService,
        lang = AcceptLanguages.UZ,
        total_amounts?: any,
    ) {
        await this.initCurrencies();
        const tableColumns = getPageColumns(page_name);

        if (tableColumns[0].children && tableColumns[0].children.length > 0) {
            const workbook = new Excel.Workbook();
            const worksheet = workbook.addWorksheet(file_name);

            const parentHeaders = tableColumns.map((col) => i18n.translate(col.translation_key, { lang }));
            const parentHeaderRow = worksheet.addRow(parentHeaders);
            parentHeaderRow.font = { bold: true };

            data.forEach((parentRecord) => {
                const parentDataRow = tableColumns.map((col) => this.formatCellValue(col, parentRecord, i18n, lang));
                const parentDataExcelRow = worksheet.addRow(parentDataRow);
                parentDataExcelRow.font = { bold: true };

                const childHeaders = tableColumns[0].children!.map((childCol) =>
                    i18n.translate(childCol.translation_key, { lang }),
                );
                const childHeaderRow = worksheet.addRow(childHeaders);
                childHeaderRow.eachCell((cell) => {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'F5EBC7' },
                    };
                });

                const children = parentRecord[tableColumns[0].children_key];
                if (children && Array.isArray(children)) {
                    children.forEach((childRecord: any) => {
                        const childDataRow = tableColumns[0].children!.map((childCol) =>
                            this.formatCellValue(childCol, childRecord, i18n, lang),
                        );
                        worksheet.addRow(childDataRow);
                    });
                }

                worksheet.addRow([]);
            });

            if (typeof total_amounts === 'object' && Object.keys(total_amounts).length) {
                const totalRow = tableColumns.map((col, index) => {
                    if (index === 0) {
                        return i18n.translate('total', { lang });
                    } else if (total_amounts[col.key]) {
                        return this.formatCellValue(col, total_amounts, i18n, lang);
                    } else {
                        return '';
                    }
                });
                worksheet.addRow(totalRow);
            }

            worksheet.columns.forEach((column) => {
                const defaultCharWidth = 1.2;
                const maxWidth = 50;
                let contentWidth = column.header ? column.header.toString().length * defaultCharWidth : 0;
                column.eachCell({ includeEmpty: true }, (cell) => {
                    contentWidth = Math.max(
                        contentWidth,
                        cell.value ? cell.value.toString().length * defaultCharWidth : 0,
                    );
                });
                column.width = Math.min(maxWidth, contentWidth);
            });

            const path = `uploads/${file_name}.xlsx`;
            await workbook.xlsx.writeFile(path);
            return path;
        } else {
            const columns = tableColumns.map((e) => i18n.translate(e.translation_key, { lang }));
            const rows = [];

            for (const item of data) {
                const row = {};
                for (const column of tableColumns) {
                    row[i18n.translate(column.translation_key, { lang })] = this.formatCellValue(
                        column,
                        item,
                        i18n,
                        lang,
                    );
                }
                rows.push(row);
            }

            if (typeof total_amounts === 'object' && Object.keys(total_amounts).length) {
                const total_row = {};
                for (const [index, column] of tableColumns.entries()) {
                    if (index === 0) {
                        total_row[i18n.translate(column.translation_key, { lang })] = i18n.translate('total', { lang });
                    } else if (total_amounts[column.key]) {
                        total_row[i18n.translate(column.translation_key, { lang })] = this.formatCellValue(
                            column,
                            total_amounts,
                            i18n,
                            lang,
                        );
                    } else {
                        total_row[i18n.translate(column.translation_key, { lang })] = '';
                    }
                }
                rows.push({}, total_row);
            }
            const path = `uploads/${file_name}.xlsx`;
            await this.createXlsFile(file_name, columns, rows, path);
            return path;
        }
    }
}

export const exportAssistant = new ExportAssistant();
