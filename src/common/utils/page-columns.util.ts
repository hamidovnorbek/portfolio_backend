import { PageNames, Table, TableColumnType } from '../types/table.type';

export const getPageColumns = (page_name: PageNames) => {
    let columns: Table[] = [];

    switch (page_name) {
        case PageNames.EMPLOYEE:
            columns = [
                {
                    key: 'full_name',
                    type: TableColumnType.STRING,
                    translation_key: 'FULL_NAME',
                },
                {
                    key: 'phone_number',
                    type: TableColumnType.STRING,
                    translation_key: 'PHONE_NUMBER',
                },
            ];
            break;

        case PageNames.CURRENCY:
            columns = [
                {
                    key: 'name',
                    type: TableColumnType.STRING,
                    translation_key: 'NAME',
                },
                {
                    key: 'symbol',
                    type: TableColumnType.STRING,
                    translation_key: 'SYMBOL',
                },
                {
                    key: 'is_main',
                    type: TableColumnType.BOOLEAN,
                    translation_key: 'IS_MAIN',
                },
            ];
            break;
    }
    return columns;
};
