import { ServiceLoader } from './_loader.js';
import { Service2Id } from '../types.js';
import { API } from '../api.js';

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

interface ItemPic {
  PicType: string;
  PicUrl: string;
}

interface Detail {
  Id: string;
  ProdId: string;
  ProdName: string;
  ProdPrice: number;
  SpecName: string;
  Qty: number;
  ActualQty: number;
  SubTotal: number;
  ItemSaleType: string;
  ItemType: string;
  Pid: string;
  BTOOrdNo: any[];
  BTOSingleton: any[];
  CombineId: string;
  CombineName: string;
  CombineTotal: number;
  CombineOrdNo: any[];
  Disfee: number;
  Platshop: string;
  ShipType: string;
  ShipDate: string;
  ShipInfoUrl: string;
  ShipId: string;
  ShipName: string;
  ShipSpecialMsg: string;
  isMultiBoxes: number;
  SerialNumber: any[];
  ActId: string;
  ActName: string;
  ActDiscount: number;
  ActTotalDiscount: number;
  ActRelation: any[];
  PrimeActId: string;
  PrimeActName: string;
  PrimeActDiscount: number;
  CouponActId: string;
  CouponActName: string;
  CouponTotalDiscount: number;
  CouponType: string;
  RefundStatus: string;
  RefundUrl: string;
  ExchangeUrl: string;
  ExchangeProcessUrl: string;
  PCAAccountUrl: string;
  RefundSheetUrl: string;
  CertificateUrl: string;
  ImgUrl: string;
  ReserveInfo: any[];
  PreShpDt: string;
  EticketUrl: string;
  EticketStatus: any;
  IsShipProd: number;
  StoreType: string;
  ItemPIc: ItemPic[];
  IsActGift: number;
  isSet: number;
  QuickSetDate: string;
}

interface Warehouse {
  WarehouseId: string;
  Type: string;
  Name: string;
  is24H: number;
  ShipFee: number;
  OrdNo: string[];
  QuickSetDate: string;
}

interface OrderDetail {
  Detail: { [key: string]: Detail };
  Warehouse: Warehouse[];
}

interface Order {
  [key: string]: OrderDetail;
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

  async detail(orderId: string) {
    let resp = await fetch(`https://ecvip.pchome.com.tw/fsapi/order/v1/detail?id=${orderId}`, {
      method: 'GET'
    }).then((response) => {
      if (response.status != 200) {
        console.error('PChome24h order detail fetch failed');
        return false;
      }
      return response;
    })
    if (!resp) {
      return;
    }
    return await resp.json() as Order;
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
    if (!resp) {
      return;
    }

    let orderlist: OrderList = await resp.json() as OrderList;
    orderlist.Rows.forEach(async (row) => {
      let detail = await this.detail(row.Id);
      if (detail) {
        Object.keys(detail[row.Id].Detail).forEach((key) => {
          // Do something with each key
          let prod = detail[row.Id].Detail[key]
          if (prod.ShipName) {
            let shipId = Service2Id(prod.ShipName)
            // this.client.
          }
          
          
        });
      }
      
    });
    
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