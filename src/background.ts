import { PChome24h, ShopeeTW } from './service/index.js';
import { readStorage, loadServices } from './utils.js';
import { ServiceList, ServiceToggle, APIToken } from './types.js';

chrome.alarms.onAlarm.addListener(handleAlarm)


class ServiceLoader{
    pchome24h = PChome24h;
    shopeetw = ShopeeTW;
}

async function handleAlarm(alarm: chrome.alarms.Alarm) {
    console.log('Got alarm', alarm);
    let api_token = await readStorage('api') as APIToken;
    if (alarm.name === "scrapOrder") {
        let toggle = await readStorage('serviceToggle') as ServiceToggle;
        let loader = new ServiceLoader();
        for (const key in toggle.serviceToggle) {
            let t = toggle.serviceToggle[key];
            let serviceClass = loader[key as keyof ServiceLoader];
            if (serviceClass) {
                let serviceInstance = new serviceClass(api_token.api.token);
                await serviceInstance.load();
            }
        }
        console.log('scrapOrder');
    }
}