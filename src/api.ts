import { API_addQuery } from "./types";
export class API {
    public url: string;
    
    public constructor(public token: string) {
        this.token = token;
        this.url = "https://logistics.sudo.host";
    }

    // account
    public async login() {
        const response = await fetch(this.url + "/login", {
            method: 'GET',
            headers: {
                "x-api-key": `${this.token}`,
            },
        });
        if (response.status === 200) {
            return true;
        } else {
            return false;
        }
    }

    public async addQuery(query: API_addQuery) {
        const response = await fetch(this.url + "/package/addQuery", {
            method: 'POST',
            headers: {
                "x-api-key": `${this.token}`,
            },
            body: JSON.stringify(query)
        });
        if (response.status === 200) {
            return true;
        } else {
            return false;
        }
    }
}