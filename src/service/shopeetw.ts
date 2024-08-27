import {
  ServiceLoader
} from './loader.js';
import {
  Service2Id, API_addQuery
} from '../types.js';

export interface GetAccountInfo {
  bff_meta: any
  error: number
  error_msg: any
  data: Data
}

export interface Data {
  userid: number
  username: string
  email: string
  portrait: string
  shopid: number
  phone: string
  phone_verified: boolean
  is_seller: boolean
  cb_option: number
  ctime: number
  payment_password: any
  web_option: number
  access: Access
  holiday_mode_on: any
  holiday_mode_mtime: any
  not_new_user: boolean
  tos_accepted_time: any
  feed_account_info: FeedAccountInfo
  birth_timestamp: any
  adult_consent: number
  has_password: boolean
  is_mall_seller: any
  cover: string
  email_verified: boolean
  tax_id: any
  cookies_accepted_time: any
  disallow_data_processing: any
  nickname: any
  gender: number
  editable_username: any
  birth_timestamp_verified: boolean
}

export interface Access {
  hide_likes: number
  wallet_setting: number
  seller_coin_setting: any
  seller_wholesale_setting: any
  seller_ads_setting: any
  voucher_wallet_setting: any
  group_buy_setting: any
  seller_unlimited_reply: any
  show_imagesearch: any
  welcome_package_setting: any
  shopee_credit_setting: any
  pilot_test_features: number[]
  wallet_provider: any
  has_legacy_wallet: any
  auto_translation_enabled: any
  slash_price_setting: any
}

export interface FeedAccountInfo {
  is_kol: any
  can_post_feed: boolean
}


export class ShopeeTW extends ServiceLoader {
  async valid() {
    // 測試登入
    const url = "https://shopee.tw/api/v4/account/basic/get_account_info"
    return fetch(url, {
      method: 'GET',
    }).then((response) => {
      if (response.status != 200) {
        return false;
      }
      return response.json().then((data: GetAccountInfo) => {
        if (data.error_msg == null) {
          return true;
        }
        return false;
      });
  })
  }

  public async load() {
      console.log('shopeetw loaded');
      let is_valid = await this.valid();
      if (!is_valid) {
          console.error('shopeetw login failed');
          return;
      }
    }
  }