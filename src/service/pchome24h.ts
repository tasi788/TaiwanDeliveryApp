import { ServiceLoader } from './_loader.js';

export interface PChome24hLoginInfo {
  isLogin: number
  LoginId: string
  UUID: string
  LastLoginTime: string
  CheckPw: number
  Type: string
  ValidToken: string
}

export interface OrderList {
  TotalRows: number
  Rows: OrderRow[]
}

export interface OrderRow {
  Id: string
}


export class PChome24h extends ServiceLoader {
  async valid(): Promise<boolean> {
    // test if account token still valid.
    let timestamp = new Date().getTime();
    let url = `https://ecvip.pchome.com.tw/fsapi/member/v1/logininfo?${timestamp}`
    let resp = await fetch(url, {
      method: 'GET',
    });
    if (resp.status != 200) {
      return false;
    }
    let json = await resp.json() as PChome24hLoginInfo;
    if (json.isLogin === 1) {
      return true;
    }
    return false;
  }

  public async load() {
    console.log('PChome24h loaded');
    if (!await this.valid()) {
      console.log('Pchome24h not login');
      return;
    }
    let now = new Date();
    let fmt = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
    console.log(fmt);
    let url = `https://ecvip.pchome.com.tw/ecapi/order/v2/index.php/core/order?site=ecshop&offset=1&limit=20&date=${fmt}-${fmt}&_=${now.getTime()}`;
    // let resp = await 
    let resp = await fetch(url, {
      method: 'GET',
    })
    .then((response) => {
      if (response.status != 200) {
        console.error('PChome24h order list fetch failed');
        return false;
      }
      return response;
    })
    .then((response) => {
      if (typeof response != 'boolean') {
        response.json().then((data: OrderList) => {
          return data;
        })
        }
      })
    
    // // let json: OrderList;
    // await resp.json().then((data: OrderList) => {
    //   json = data;
    // }).catch((error: any) => {
    //   console.error('PChome24h order list fetch failed');
    //   return;
    // });
    // if (orderlist.status != 200) {
    //   console.error('PChome24h order list fetch failed');
    //   return;
    // }


    // let json = await orderlist.json() as OrderList;
    // console.log(json);
  }
}