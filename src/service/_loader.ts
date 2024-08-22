import { API } from '../api.js';

export class ServiceLoader {
    client: API;
    
    public constructor(public token: string) {
        this.token = token;
        this.client = new API(token);
    }

    public async postOrder() {
        let client: API = new API('token');
        if (await client.login() === false) {
            console.log('登入失敗');
            return;
        }
    }
    public async load() {}
}