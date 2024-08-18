// import './service/_loader';
import { Pchome24h } from './service/pchome24h.js';

chrome.alarms.onAlarm.addListener(handleAlarm)


async function handleAlarm(alarm: chrome.alarms.Alarm) {
    console.log('Got alarm', alarm);
    let client = new Pchome24h();
    await client.load();
}