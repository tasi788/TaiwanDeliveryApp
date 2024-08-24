import {
  ServiceLoader
} from './_loader.js';
import {
  Service2Id, API_addQuery
} from '../types.js';

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
  Detail: {
    [key: string]: Detail
  };
  Warehouse: Warehouse[];
}

interface Order {
  [key: string]: OrderDetail;
}



export class PChome24h extends ServiceLoader {
  async valid(): Promise < boolean > {
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
    try {
      return await resp.json() as Order;
    } catch (error) {
      console.error('Error parsing detail response:', error);
      return false;
    }
    
  }

  async getOrderList(): Promise < OrderList | false > {
    let now = new Date();
    let fmt = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;

    let url = `https://ecvip.pchome.com.tw/ecapi/order/v2/index.php/core/order?site=ecshop&offset=1&limit=20&date=20140101-${fmt}&_=${now.getTime()}`;
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
      return false;
    }
    try {
      return await resp.json() as OrderList;
    } catch (error) {
      console.error('Error parsing orderlist response:', error);
      return false;
    }
  }

  getDate() {
    let now = new Date();
    return `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
  }

  public async load() {
    console.log('PChome24h loaded');
    if (!await this.valid()) {
      console.log('Pchome24h not login');
      return;
    }
    let orderList = await this.getOrderList();
    if (!orderList) {
      console.log('Pchome24h order list fetch failed');
      return;
    }

    // filter orderList by date range
    // 20240621197116[:8]
    // yyyyMMdd
    let now = this.getDate();
    
    orderList.Rows.forEach(async (row) => {
      let prod_date = row.Id.substring(0, 8)
      if (now != prod_date) {
        console.log('skip', row.Id);
        return;
      }
      
      let detail = await this.detail(row.Id);
      let addQueryList: API_addQuery[] = [];
      if (detail) {
        Object.keys(detail[row.Id].Detail).forEach((key) => {
          let prod = detail[row.Id].Detail[key]
          if (prod.ShipName && prod.ShipId) {
            if (addQueryList.some(item => item.track_id === prod.ShipId)) {
              // Skip this iteration if ShipId is already in addQueryList
              return;
          }
            let service_name = Service2Id(prod.ShipName)
            if (!service_name) {
              console.log('Service not found:', prod.ShipName);
              return;
            }
            addQueryList.push({
              track_id: prod.ShipId,
              service: service_name,
              note: `[PChome24h購物]-${prod.ProdName}`
            } as API_addQuery)
          }
        });
      }
      if (addQueryList.length > 0) {
        addQueryList.forEach(async (item) => {
          await this.client.addQuery(item);
        });
      }
    });
  }
}