import { PChome24h, ShopeeTW } from './service/index.js';
import { readStorage, loadServices } from './utils.js';
import { ServiceList, ServiceToggle } from './types.js';

chrome.alarms.onAlarm.addListener(handleAlarm)


class ServiceLoader{
    pchome24h = PChome24h;
    shopeetw = ShopeeTW;
}

async function handleAlarm(alarm: chrome.alarms.Alarm) {
    console.log('Got alarm', alarm);
    if (alarm.name === "scrapOrder") {
        
        // let service = await loadServices();
        let toggle = await readStorage('serviceToggle') as ServiceToggle;
        // console.log(service);
        let loader = new ServiceLoader();
        for (const key in toggle.serviceToggle) {
            let t = toggle.serviceToggle[key];
            let serviceClass = loader[key as keyof ServiceLoader];
            if (serviceClass) {
                let serviceInstance = new serviceClass();
                await serviceInstance.load();
            }
        }
        // let client = new PChome24h();
        // await client.load();
        // await printLog();
    }
}