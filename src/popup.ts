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
        login_status!.innerHTML = '已登入: ' + result.api.token.split(':')[0];

        let manmaulBtn = document.createElement('button');
        
        manmaulBtn.textContent = '手動匯入包裹';
        manmaulBtn.id = 'import';
        // manmaulBtn.addEventListener('click', getPackage);
        let login_area = document.getElementById('login_area');
        login_area?.appendChild(manmaulBtn);
    } else {
        document.getElementById('login')!.addEventListener('click', btnLogin);
    }
    chrome.alarms.get("printLog").then((alarm) => {console.log(alarm);});
    // console.log(al);
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
    const alarm = await chrome.alarms.get("printLog");
    if (!alarm) {
        // await chrome.alarms.create("getOrder", { periodInMinutes: 60 });
        await chrome.alarms.create("printLog", { periodInMinutes: 0.5 });
    }
    
    window.location.reload();
}
