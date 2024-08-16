class API {
    url: string;
    
    constructor(public token: string) {
        this.token = token;
        this.url = "http://localhost:9000";
    }

    async login() {
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



chrome.storage.sync.get(['api'], function (result) {
    if (result.api) {
        let login_input = document.getElementById('account');
        login_input!.remove();
        document.getElementById('login')!.id = 'logout';
        document.getElementById('logout')!.replaceChildren('登出');
        document.getElementById('logout')!.addEventListener('click', btnLogout);
        let login_status = document.getElementById('login_status');
        login_status!.innerHTML = '已登入: ' + result.api;
        
        // let newButton = document.createElement('button');
        // newButton.textContent = '匯入包裹';
        // newButton.id = 'import';
        
        // // Append the button to login_input
        // login_input?.appendChild(newButton);
    } else {
        document.getElementById('login')!.addEventListener('click', btnLogin);
    }
});

async function btnLogout() {
    chrome.storage.sync.remove('api', function () {
        console.log('Account data removed');
        alert('已登出');
    });
    window.location.reload();
}

async function btnLogin() {
    let login_input = document.getElementById('account') as HTMLInputElement;
    let api_token = login_input.value;
    let client = new API(api_token);
    if (await client.login() === false) {
        alert('登入失敗');
        return;
    }
    chrome.storage.sync.set({ api: {token: api_token} }, function () {
        console.log('Account data saved:', api_token);
    });
    window.location.reload();
}
