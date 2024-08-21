import { ServiceList } from './types.js';

export function readStorage(key: string): Promise<object> {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get([key], function (result) {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result);
            }
        });
    });
}

export function loadServices(): Promise<ServiceList> {
    return fetch('./services.json')
        .then(response => response.json())
        .then(data => data as ServiceList);
}