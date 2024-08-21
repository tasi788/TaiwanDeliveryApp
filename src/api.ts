export class API {
    public url: string;
    
    public constructor(public token: string) {
        this.token = token;
        this.url = "http://localhost:9000";
    }

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
}