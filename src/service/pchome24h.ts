export class Pchome24h {
  public async load() {
      // https://ecvip.pchome.com.tw/ecapi/order/v2/index.php/core/order?site=ecshop&offset=1&limit=20&date=20140101-20240817&_=1723878810533
    let now = new Date();
    let fmt = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
    console.log(fmt);
    let url = `https://ecvip.pchome.com.tw/ecapi/order/v2/index.php/core/order?site=ecshop&offset=1&limit=20&date=${fmt}-${fmt}&_=${now.getTime()}`;
    // let r = await fetch(url, {
    //   method: 'GET',
    // });
    // console.log(await r.json());
    return 'Pchome24h loaded';
  }
}