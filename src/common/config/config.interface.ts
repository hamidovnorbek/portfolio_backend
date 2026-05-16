const KEYS = ['DB_URL', 'ADMIN_URL', 'ADMIN_PORT', 'JWT_SECRET', 'JWT_EXPIRES', 'MOBILE_URL', 'MOBILE_PORT'] as const;

export type ConfigKeysUnion = (typeof KEYS)[number];

export interface IConfigService {
    get(key: ConfigKeysUnion): string;
}
