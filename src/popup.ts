chrome.storage.sync.get(['api'], function (result) {
    if (result.api) {
        let login_input = document.getElementById('account');
        login_input!.remove();
        document.getElementById('login')!.id = 'logout';
        document.getElementById('logout')!.replaceChildren('登出');
        let login_status = document.getElementById('login_status');
        login_status!.innerHTML = '已登入: ' + result.api;
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const loginButton = document.getElementById('login');
    const APIInput = document.getElementById('account') as HTMLInputElement;
    const logoutButton = document.getElementById('logout');

    if (logoutButton != null) {
            logoutButton!.addEventListener('click', function () {
            chrome.storage.sync.remove('api', function () {
                console.log('Account data removed');
                alert('已登出');
            });
            window.location.reload();
    });}

    if (loginButton != null) {
        loginButton!.addEventListener('click', function () {
            const api_token = APIInput!.value;
            alert('API Token: ' + api_token);
            console.log('API Token:', api_token);
            chrome.storage.sync.set({ api: api_token }, function () {
                console.log('Account data saved:', api_token);
            });
            window.location.reload();
    });}
});