import { User as AppUser, Role } from './models';

export * from './models';

export type User = AppUser;

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
        roles?: string[];
    };
    flash?: {
        success?: string;
        error?: string;
        info?: string;
    };
};
