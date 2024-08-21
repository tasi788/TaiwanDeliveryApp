export * from './api.js';
import { API } from './api.js';


chrome.storage.sync.get(['api'], function (result) {
    if (result.api) {
        document.getElementById('input_area')!.remove();
        
        document.getElementById('login_btn')!.id = 'logout_btn';
        document.getElementById('logout_btn')!.replaceChildren('登出');
        document.getElementById('logout_btn')!.addEventListener('click', btnLogout);
        document.getElementById('logout_btn')!.className = 'button is-warning';

        let login_status = document.getElementById('login_status');
        login_status!.innerHTML = '已登入: ' + result.api.token.split(':')[0];

        let configpage = document.createElement('button');
        configpage.textContent = '設定';
        configpage.className = 'button is-info';
        configpage.onclick = () => {
            open('index.html');
        };
        document.getElementById('footer-btn')!.appendChild(configpage);
        // login_area?.appendChild(manmaulBtn);
    } else {
        document.getElementById('login_btn')!.addEventListener('click', btnLogin);
    }
    chrome.alarms.get("scrapOrder").then((alarm) => {console.log(alarm);});
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
    let login_input = document.getElementById('input_token') as HTMLInputElement;
    let api_token = login_input.value;
    let client = new API(api_token);
    if (await client.login() === false) {
        alert('登入失敗');
        return;
    }
    chrome.storage.sync.set({ api: {token: api_token} }, function () {
        console.log('Account data saved:', api_token);
    });

    // set alarm
    const alarm = await chrome.alarms.get("scrapOrder");
    if (!alarm) {
        // await chrome.alarms.create("getOrder", { periodInMinutes: 60 });
        await chrome.alarms.create("scrapOrder", { periodInMinutes: 0.5 });
    }
    
    window.location.reload();
}
