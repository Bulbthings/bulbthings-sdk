import { Bulbthings } from '../index';
import { request } from '../utils/http';
import { Key } from '../models/key';
import { parseResource } from '../utils/parse';
import { Account } from '../models';

export class AuthenticationResource {
    private loginKey: Key;

    constructor(private bulbthings: Bulbthings) {}

    async register(params: {
        label: string;
        email: string;
        locale?: string;
        meta?: any;
        origin?: string;
    }): Promise<Account> {
        const res = await request(
            this.bulbthings,
            'POST',
            `${this.bulbthings.options.coreUrl}/authentication/register`,
            { body: params }
        );
        return parseResource({ resource: res.data, type: Account });
    }

    async login(email: string, password: string): Promise<Key> {
        const res = await request(
            this.bulbthings,
            'POST',
            `${this.bulbthings.options.coreUrl}/authentication/login`,
            { body: { email, password } }
        );
        this.loginKey = parseResource({ resource: res.data, type: Key });
        this.bulbthings.setToken(this.loginKey.value);
        return this.loginKey;
    }

    async logout() {
        if (this.loginKey) {
            await request(
                this.bulbthings,
                'DELETE',
                `${this.bulbthings.options.coreUrl}/keys/${this.loginKey.id}`
            );
        }
        this.bulbthings.setToken(undefined);
    }

    async resetPassword(email: string) {
        await request(
            this.bulbthings,
            'POST',
            `${this.bulbthings.options.coreUrl}/authentication/resetPassword/${email}`
        );
    }

    async changePassword(
        emailToken: string,
        newPassword: string
    ): Promise<Account> {
        const res = await request(
            this.bulbthings,
            'POST',
            `${this.bulbthings.options.coreUrl}/authentication/changePassword/${emailToken}`,
            { body: { password: newPassword } }
        );
        return parseResource({ resource: res.data, type: Account });
    }
}
