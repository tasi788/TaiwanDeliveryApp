// import './service/_loader';
import { Pchome24h } from './service/pchome24h.js';

chrome.alarms.onAlarm.addListener(handleAlarm)


class ServiceLoader{
    pchome24h = Pchome24h;
}

async function handleAlarm(alarm: chrome.alarms.Alarm) {
    // console.log('Got alarm', alarm);
    if (alarm.name === 'printLog') {
        let client = new Pchome24h();
        await client.load();
        // await printLog();
    }
}