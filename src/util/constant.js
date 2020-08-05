export default {
  ACTIVE: 'dev',
  BASE_URL: {
    dev: 'http://localhost:8080',
    prod: 'http://localhost:8080'
  },
  BASE_STATIC_URL: {
    dev: 'http://localhost:8080/upload/image/',
    prod: 'http://localhost:8080/upload/image/'
  },
  PREFIX: {
    OAUTH: 'account',
    ADMIN: 'admin',
    MERCHANT: 'merchant',
    GOODS: 'product',
    ORDER: 'trade',
    UPLOAD: 'upload'
  },
  ENCRPY_SALT: 'adam',
  USER_INFO_KEY: 'userInfo',
  OK_CODE: 200,
  HEADERS_JSON: { 'Content-Type': 'application/json' },
  HEADERS_UPLOAD: { 'Content-Type': 'multipart/form-data' },
  ACCESS_TOKEN: 'access_token',
  LOCAL_STORAGE: {
    LOGIN_INFO: 'loginInfo',
    MERCHANT_INFO: 'merchantInfo'
  },
  MUTATIONS: {
    SET_USER_LOGIN_INFO: 'SET_USER_LOGIN_INFO',
    SET_MERCHANT_INFO: 'SET_MERCHANT_INFO'
  },
  STATES: {
    USER_INFO: 'userInfo',
    MERCHANT_INFO: 'merchantInfo'
  },
  ACTIONS: {
    LOGIN: 'login',
    IS_LOGIN: 'isLogin',
    GET_USER: 'getUser',
    GET_USER_BY_ID: 'getUserById',
    GET_USER_LIST: 'getUserList',
    UPDATE_USER_INFO: 'updateAccount',
    UPDATE_MERCHANT_INFO: 'updateMerchantAccount',
    CREATE_USER: 'createAccount',
    DELETE_USER: 'deleteAccount',
    CHNAGE_PASSWORD: 'changePassword',
    GET_MERCHANT: 'getMerchant',
    GET_GOODS_LIST: 'getGoodsList',
    GET_CATEGORY_LIST: 'getGategoryList',
    GET_CATEGORY: 'getCategory',
    GET_GOODS_DETAIL: 'getGoodsDetail',
    ADD_SHOPPING_CART: 'addShoppingCart',
    GET_SHOPPING_CART_LIST: 'getShoppingCartList',
    DELETE_GOODS_FROM_CART: 'removeGoodsFromCart',
    UPDATE_SHOPPING_CART: 'updateShoppingCart',
    ADD_ADDRESS: 'addAddress',
    GET_ADDRESS_LIST: 'getAddressList',
    UPDATE_ADDRESS: 'updateAddress',
    DELETE_ADDRESS: 'removeAddress',
    ADD_ORDER: 'addOrder',
    GET_ORDER_LIST: 'getOrderList',
    GET_ORDER_DETAIL: 'getOrderDetail',
    UPDATE_ORDER_STATE: 'updateOrderState',
    UPDATE_ALL_ORDER_STATE: 'updateAllOrderState',
    UPDATE_ORDER_INFO: 'updateOrderInfo',
    ADD_GOODS: 'addGoods',
    GET_MERCHANT_GOODS_LIST: 'getMerchantGoodsList',
    UPDATE_MERCHANT_GOODS: 'updateMerchantGoods',
    GET_MERCHANT_GOODS_DETAIL: 'getMerchantGoodsDetail',
    DELETE_GOODS: 'removeGoods',
    DELETE_GOODS_ATTR: 'removeGoodsAttr',
    IS_UPLOAD: 'checkUpload',
    UPLOAD_AVATAR: 'uploadAvatar',
    UPLOAD_BANNER: 'uploadBanner',
    UPLOAD_GOODS_IMGS: 'uploadGoodsImgs',
    UPLOAD_GOODS_ATTR_IMAGE: 'uploadGoodsAttrImage'
  },
  USER_TYPE: {
    ADMIN: 'ADMIN',
    CUSTOMER: 'CUSTOMER',
    MERCHANT: 'MERCHANT'
  },
  USER_TYPE_ZH: {
    ADMIN: '管理员',
    CUSTOMER: '消费者',
    MERCHANT: '商户'
  },
  USER_STATUS_ZH: {
    0: '激活',
    1: '冻结'
  },
  // SUBMIT("提交订单，未付款", 0), PAID("已付款", 1),
  // ACCEPT("商家确认订单", 2), REFUSE("商家拒绝订单", 3),
  // DELIVERY("订单运送中", 4), CHECK("订单签收", 5), REJECT("拒收件", 6);
  ORDER_STATUS: {
    SUBMIT: 'SUBMIT',
    PAID: 'PAID',
    CANCEL: 'CANCEL',
    ACCEPT: 'ACCEPT',
    REFUSE: 'REFUSE',
    DELIVERY: 'DELIVERY',
    CHECK: 'CHECK',
    REJECT: 'REJECT',
    REQUEST_PAY_BACK: 'REQUEST_PAY_BACK',
    PAID_BACK: 'PAID_BACK'
  },
  ORDER_STATUS_ZH: {
    SUBMIT: '已提交',
    PAID: '已付款',
    CANCEL: '取消订单',
    ACCEPT: '商家确认',
    REFUSE: '商家拒单',
    DELIVERY: '订单运送',
    CHECK: '订单签收',
    REJECT: '拒收件',
    REQUEST_PAY_BACK: '请求退款',
    PAID_BACK: '退款成功'

  },
  ORDER_STATUS_COLOR: {
    SUBMIT: '#1E90FF',
    PAID: '#7CFC00',
    CANCEL: '#FF0000',
    ACCEPT: '#0000FF',
    REFUSE: '#990000',
    DELIVERY: '#66FFCC',
    CHECK: '#33FF33',
    REJECT: '#FF0000',
    REQUEST_PAY_BACK: '#FF0000',
    PAID_BACK: '#FF0000'
  },
  ORDER_STATUS_MAP: {
    CUSTOMER: {
      SUBMIT: [
        { name: '去付款', path: '/pay', value: 'PAID', type: 'success' },
        { name: '取消订单', value: 'CANCEL', type: 'info' }
      ],
      PAID: [
        { name: '申请退款', value: 'REQUEST_PAY_BACK', type: 'info' }
      ],
      CANCEL: [],
      ACCEPT: [
        { name: '申请退款', value: 'REQUEST_PAY_BACK', type: 'info' }
      ],
      REFUSE: [
        { name: '申请退款', value: 'REQUEST_PAY_BACK', type: 'info' }
      ],
      DELIVERY: [
        { name: '申请退款', value: 'REQUEST_PAY_BACK', type: 'info' },
        { name: '订单签收', value: 'CHECK', type: 'info' },
        { name: '拒绝收件', value: 'REJECT', type: 'info' }
      ],
      CHECK: [],
      REJECT: [
        { name: '申请退款', value: 'REQUEST_PAY_BACK', type: 'info' }
      ],
      REQUEST_PAY_BACK: [
        // { name: '申请退款', value: 'REQUEST_PAY_BACK', type: 'info' }
      ],
      PAID_BACK: []
    },
    MERCHANT: {
      SUBMIT: [],
      PAID: [
        { name: '确认订单', value: 'ACCEPT', type: 'info' },
        { name: '拒绝订单', value: 'REFUSE', type: 'error' }
      ],
      CANCEL: [],
      ACCEPT: [
        { name: '订单运送', value: 'DELIVERY', type: 'success' }
      ],
      REFUSE: [
      ],
      DELIVERY: [
      ],
      CHECK: [
      ],
      REJECT: [
      ],
      REQUEST_PAY_BACK: [
        { name: '允许退款', value: 'PAID_BACK', type: 'warning' }
      ],
      PAID_BACK: [
      ]
    }

  },
  ORDER_FINISHED_YET: (status) => {
    if (status === 'CANCEL' || status === 'PAID_BACK' || status === 'CHECK') {
      return true;
    }
    return false;
  },
  IS_IMAGE: (filename) => {
    if (filename) {
      var list = filename.split('.');
      var suffix = list[list.length - 1];
      if (suffix === 'jpg' || suffix === 'jpeg' || suffix === 'png') {
        return true;
      }
    }
    return false;
  }
};
