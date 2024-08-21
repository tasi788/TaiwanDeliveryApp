import { API } from '../api.js';

export class ServiceLoader {
    
    public constructor(public token: string) {
        this.token = token;
    }

    public async postOrder() {
        let client = new API('token');
        if (await client.login() === false) {
            console.log('登入失敗');
            return;
        }
    }
    public async load() {}
}