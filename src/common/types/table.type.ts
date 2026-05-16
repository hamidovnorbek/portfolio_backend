export enum TableColumnType {
    STRING = 'string',
    NUMBER = 'number',
    BOOLEAN = 'boolean',
    DATE = 'date',
    ENUM = 'enum',
    CURRENCY = 'currency',
    EXTRA = 'extra',
    ARRAY = 'array',
}

export enum PageNames {
    EMPLOYEE = 'employee',
    CURRENCY = 'currency',
}

export interface Table {
    key: string;
    type: TableColumnType;
    translation_key: string;
    enum_values?: { [key: string]: { translation_key: string; color?: string } };
    date_format?: string;
    currency_field?: string;
    children?: Table[];
    children_key?: string;
    extra_string?: string;
    width?: string;
    color?: string;
    array_values?: { key: string; value: string };
}
