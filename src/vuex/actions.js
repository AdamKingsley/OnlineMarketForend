import http from '../util/http';
import constant from '../util/constant';
import resultUtil from '../util/resultUtil';
import encryption from '../util/encryption';

// TODO 最后要把密码明文传递改成加密传递
// 1. 用户登录
export const login = ({ commit }, data) => {
  // 拼接对应的请求URI
  var url = [constant.PREFIX.OAUTH, 'oauth/token'].join('/');
  // 获取token的参数固化
  var params = {
    'client_id': 'client_2',
    'client_secret': '123456',
    'grant_type': 'password',
    'username': data.username,
    // 密码加密
    // 'password': data.password
    'password': encryption.md5.encrypt(data.password)
  };
  // URL BODY PARAMS HEADER
  return http.post(url, {}, params, constant.HEADERS_JSON).then(response => {
    console.log(response);
    var result = resultUtil.error(false, 500, '登录失败，请检查用户名和密码后重试！');
    if (response.status === constant.OK_CODE) {
      data = { username: params.username, accessToken: response.data.value };
      // 更新用户信息，主要是获取token
      localStorage.setItem(constant.LOCAL_STORAGE.LOGIN_INFO, encryption.aes.encrypt(JSON.stringify(data)));
      commit(constant.MUTATIONS.SET_USER_LOGIN_INFO, data);
      result = resultUtil.success(200, data, '登录成功，检测账户类型进行跳转！');
    }
    return result;
  }).catch(error => {
    console.log(error);
    return resultUtil.error(500, '登录失败，请检查用户名和密码后重试！');
  });
};

// 2. 获取用户数据
export const getUser = ({ commit, state }) => {
  // 拼接对应的请求URI
  var url = [constant.PREFIX.OAUTH, 'oauth/user'].join('/');
  console.log(state);
  var accessToken = state.userInfo.accessToken;
  console.log(accessToken);
  var params = { access_token: accessToken };
  // URL BODY PARAMS HEADER
  return http.get(url, params, constant.HEADERS_JSON).then(response => {
    var result = null;
    if (response.status === constant.OK_CODE) {
      var data = response.data;
      if (data && data.code === constant.OK_CODE) {
        // 设置用户信息
        result = data.data;
        result.accessToken = accessToken;
        // 更新用户信息，保存用户的基础信息
        // sessionStorage.setItem(constant.USER_INFO_KEY, encrypt());
        localStorage.setItem(constant.LOCAL_STORAGE.LOGIN_INFO, encryption.aes.encrypt(JSON.stringify(result)));
        commit(constant.MUTATIONS.SET_USER_LOGIN_INFO, result);
        result = resultUtil.success(200, result, '正在跳转...');
      } else {
        // 获取用户失败
        result = resultUtil.error(500, '获取用户数据失败！');
      }
    }
    return result;
  }).catch(error => {
    console.log(error);
    return resultUtil.error(500, '获取用户数据失败！');
  });
};

// getUserById

export const getUserById = ({ commit, state }) => {
  // 拼接对应的请求URI
  var url = [constant.PREFIX.OAUTH, 'oauth/user/id'].join('/');
  console.log(state);
  var accessToken = state.userInfo.accessToken;
  console.log(accessToken);
  var params = { access_token: accessToken };
  // URL BODY PARAMS HEADER
  return http.get(url, params, constant.HEADERS_JSON).then(response => {
    var result = null;
    if (response.status === constant.OK_CODE) {
      var data = response.data;
      if (data && data.code === constant.OK_CODE) {
        // 设置用户信息
        result = data.data;
        result.accessToken = accessToken;
        // 更新用户信息，保存用户的基础信息
        // sessionStorage.setItem(constant.USER_INFO_KEY, encrypt());
        // if (result.avatar) {
        //   result.avatarPreview = constant.BASE_STATIC_URL(constant.ACTIVE) + result.avatar;
        // }
        localStorage.setItem(constant.LOCAL_STORAGE.LOGIN_INFO, encryption.aes.encrypt(JSON.stringify(result)));
        commit(constant.MUTATIONS.SET_USER_LOGIN_INFO, result);
        result = resultUtil.success(200, result, '正在跳转...');
      } else {
        // 获取用户失败
        result = resultUtil.error(500, '获取用户数据失败！');
      }
    }
    return result;
  }).catch(error => {
    console.log(error);
    return resultUtil.error(500, '获取用户数据失败！');
  });
};
// 判断是否登陆
export const isLogin = ({
  commit
}) => {
  var user = encryption.aes.decrypt(localStorage.getItem(constant.LOCAL_STORAGE.LOGIN_INFO));
  if (localStorage.getItem(constant.LOCAL_STORAGE.MERCHANT_INFO)) {
    var merchantInfo = encryption.aes.decrypt(localStorage.getItem(constant.LOCAL_STORAGE.MERCHANT_INFO));
  }
  if (user) {
    commit(constant.MUTATIONS.SET_USER_LOGIN_INFO, JSON.parse(user));
  }
  if (merchantInfo) {
    commit(constant.MUTATIONS.SET_MERCHANT_INFO, JSON.parse(merchantInfo));
  }
};

// 3. admin 获取用户列表数据（支持查询）
export const getUserList = ({ commit, state }, params) => {
  // 拼接对应的请求URI
  var url = [constant.PREFIX.ADMIN, 'account/list'].join('/');
  var accessToken = state.userInfo.accessToken;
  console.log(accessToken);
  // params 中增加token字段用于鉴权
  params.access_token = accessToken;
  // URL BODY PARAMS HEADER
  return http.get(url, params, constant.HEADERS_JSON).then(response => {
    return resultUtil.process(response, 500, '获取用户列表数据失败！');
  }).catch(error => {
    console.log(error);
    return resultUtil.error(500, '获取用户列表数据失败！');
  });
};

// 4. 更新用户数据（更改个人信息t_user表）
export const updateAccount = ({ commit, state }, body) => {
  // 拼接对应的请求URI
  var params = {};
  var url = [constant.PREFIX.ADMIN, 'account/update'].join('/');
  var accessToken = state.userInfo.accessToken;
  console.log(accessToken);
  // params 中增加token字段用于鉴权
  params.access_token = accessToken;
  // URL BODY PARAMS HEADER
  return http.put(url, body, params, constant.HEADERS_JSON).then(response => {
    return resultUtil.process(response, 500, '更新用户信息失败！');
  }).catch(error => {
    console.log(error);
    return resultUtil.error(500, '更新用户信息失败！');
  });
};

// 5. 创建用户账户
export const createAccount = ({ commit, state }, body) => {
  // 拼接对应的请求URI

  var params = {};
  var url = [constant.PREFIX.ADMIN, 'account/add'].join('/');
  var accessToken = state.userInfo.accessToken;
  console.log(accessToken);
  // params 中增加token字段用于鉴权
  params.access_token = accessToken;
  // URL BODY PARAMS HEADER
  return http.post(url, body, params, constant.HEADERS_JSON).then(response => {
    return resultUtil.process(response, 500, '新增用户失败！');
  }).catch(error => {
    console.log(error);
    return resultUtil.error(500, '新增用户失败！');
  });
};

// 6. 删除用户账户
export const deleteAccount = ({ commit, state }, userId) => {
  // 拼接对应的请求URI

  var params = {};
  var url = [constant.PREFIX.ADMIN, 'account/' + userId].join('/');
  var accessToken = state.userInfo.accessToken;
  console.log(accessToken);
  // params 中增加token字段用于鉴权
  params.access_token = accessToken;
  // URL BODY PARAMS HEADER
  return http.del(url, params, constant.HEADERS_JSON).then(response => {
    return resultUtil.process(response, 500, '删除用户失败！');
  }).catch(error => {
    console.log(error);
    return resultUtil.error(500, '删除用户失败！');
  });
};

// 7. 更改登录账户密码
export const changePassword = ({ commit, state }, body) => {
  var url = [constant.PREFIX.ADMIN, 'account/update/password'].join('/');
  var params = {};
  var accessToken = state.userInfo.accessToken;
  // params 中增加token字段用于鉴权
  params.access_token = accessToken;
  body.password = encryption.md5.encrypt(body.password);
  body.confirmPassword = encryption.md5.encrypt(body.confirmPassword);
  return http.put(url, body, params).then(response => {
    return resultUtil.process(response, 500, '更新用户密码失败！');
  }).catch(error => {
    console.log(error);
    return resultUtil.error(500, '更新用户密码操作失败！');
  });
};

// 7. 获取商户信息（支持用户通过商户id查询和商户自查）
export const getMerchant = ({ commit, state }, id = null) => {
  // 拼接对应的请求URI
  // id是否为null决定了请求的URL
  var url = [constant.PREFIX.MERCHANT, id ? 'account' : 'account/info'].join('/');
  console.log(state);
  var accessToken = state.userInfo.accessToken;
  console.log(accessToken);
  var params = { access_token: accessToken, id: id };
  // URL BODY PARAMS HEADER
  return http.get(url, params, constant.HEADERS_JSON).then(response => {
    var result = null;
    if (response.status === constant.OK_CODE) {
      var data = response.data;
      if (data && data.code === constant.OK_CODE) {
        // 设置用户信息
        result = data.data;
        // result.accessToken = accessToken;
        localStorage.setItem(constant.LOCAL_STORAGE.MERCHANT_INFO, encryption.aes.encrypt(JSON.stringify(result)));
        commit(constant.MUTATIONS.SET_MERCHANT_INFO, result);
        result = resultUtil.success(200, result, '获取商户信息成功！');
      } else {
        // 获取用户失败
        result = resultUtil.error(500, '获取商户信息失败！');
      }
    }
    return result;
  }).catch(error => {
    console.log(error);
    return resultUtil.error(500, '获取商户信息失败！');
  });
};

// 7. 更改商户信息
export const updateMerchantAccount = ({ commit, state }, body) => {
  // 拼接对应的请求URI
  var params = {};
  var url = [constant.PREFIX.MERCHANT, 'account/update'].join('/');
  var accessToken = state.userInfo.accessToken;
  console.log(accessToken);
  // params 中增加token字段用于鉴权
  params.access_token = accessToken;
  // URL BODY PARAMS HEADER
  return http.put(url, body, params, constant.HEADERS_JSON).then(response => {
    return resultUtil.process(response, 500, '更新商户信息失败！');
  }).catch(error => {
    console.log(error);
    return resultUtil.error(500, '更新商户信息失败！');
  });
};

// 获取商品分类标签列表
export const getGategoryList = ({ commit, state }, params) => {
  // 拼接对应的请求URI
  // id是否为null决定了请求的URL
  var url = [constant.PREFIX.GOODS, 'goods/category/list'].join('/');
  console.log(state);
  var accessToken = state.userInfo.accessToken;
  console.log(accessToken);
  params.access_token = accessToken;
  // URL BODY PARAMS HEADER
  return http.get(url, params, constant.HEADERS_JSON).then(response => {
    return resultUtil.process(response, 500, '获取分类信息失败！');
  }).catch(error => {
    console.log(error);
    return resultUtil.error(500, '获取分类信息失败！');
  });
};

export const getCategory = ({ commit, state }, id) => {
  // 拼接对应的请求URI
  // id是否为null决定了请求的URL
  var url = [constant.PREFIX.GOODS, 'goods/category', id].join('/');
  console.log(state);
  var accessToken = state.userInfo.accessToken;
  console.log(accessToken);
  var params = { access_token: accessToken };
  // URL BODY PARAMS HEADER
  return http.get(url, params, constant.HEADERS_JSON).then(response => {
    return resultUtil.process(response, 500, '获取分类信息失败！');
  }).catch(error => {
    console.log(error);
    return resultUtil.error(500, '获取分类信息失败！');
  });
};
// 8. 上新产品（商户）（产品，产品属性，库存等）

// 9. 查询产品列表（用户+商户）（查询条件组合）
export const getGoodsList = ({ commit, state }, params) => {
  // 拼接对应的请求URI
  var url = [constant.PREFIX.GOODS, 'goods/list'].join('/');
  var accessToken = state.userInfo.accessToken;
  console.log(accessToken);
  // params 中增加token字段用于鉴权
  params.access_token = accessToken;
  // URL BODY PARAMS HEADER
  return http.get(url, params, constant.HEADERS_JSON).then(response => {
    return resultUtil.process(response, 500, '获取商品列表数据失败！');
  }).catch(error => {
    console.log(error);
    return resultUtil.error(500, '获取商品列表数据失败！');
  });
};

// 10. 删除产品（产品下架）（商户）

// 11. 查看产品详情
export const getGoodsDetail = ({ commit, state }, params) => {
  var url = [constant.PREFIX.GOODS, 'goods/detail'].join('/');
  console.log(state);
  var accessToken = state.userInfo.accessToken;
  console.log(accessToken);
  params.access_token = accessToken;
  // URL BODY PARAMS HEADER
  return http.get(url, params, constant.HEADERS_JSON).then(response => {
    return resultUtil.process(response, 500, '获取商品详情信息失败！');
  }).catch(error => {
    console.log(error);
    return resultUtil.error(500, '获取商品详情信息失败！');
  });
};

// 12. 添加购物车(用户)
export const addShoppingCart = ({ commit, state }, body) => {
  // 拼接对应的请求URI
  var url = [constant.PREFIX.GOODS, 'cart/add'].join('/');
  var accessToken = state.userInfo.accessToken;
  console.log(accessToken);
  // params 中增加token字段用于鉴权
  var params = { access_token: accessToken };
  // URL BODY PARAMS HEADER
  return http.post(url, body, params, constant.HEADERS_JSON).then(response => {
    return resultUtil.process(response, 500, '添加购物车操作失败！');
  }).catch(error => {
    console.log(error);
    return resultUtil.error(500, '添加购物车操作失败！');
  });
};

// 13. 查看购物车(用户)
export const getShoppingCartList = ({ commit, state }, params) => {
  // 拼接对应的请求URI
  var url = [constant.PREFIX.GOODS, 'cart/list'].join('/');
  var accessToken = state.userInfo.accessToken;
  console.log(accessToken);
  // params 中增加token字段用于鉴权
  params.access_token = accessToken;
  // URL BODY PARAMS HEADER
  return http.get(url, params, constant.HEADERS_JSON).then(response => {
    return resultUtil.process(response, 500, '查询购物车数据失败！');
  }).catch(error => {
    console.log(error);
    return resultUtil.error(500, '查询购物车数据失败！');
  });
};

// 从购物车删除商品
export const removeGoodsFromCart = ({ commit, state }, id) => {
  // 拼接对应的请求URI
  var url = [constant.PREFIX.GOODS, 'cart', id].join('/');
  var accessToken = state.userInfo.accessToken;
  console.log(accessToken);
  // params 中增加token字段用于鉴权
  var params = { access_token: accessToken };
  // URL BODY PARAMS HEADER
  return http.del(url, params, constant.HEADERS_JSON).then(response => {
    return resultUtil.process(response, 500, '从购物车中删除商品失败！');
  }).catch(error => {
    console.log(error);
    return resultUtil.error(500, '从购物车中删除商品失败！');
  });
};

// 更新购物车的商品数据
export const updateShoppingCart = ({ commit, state }, body) => {
  // 拼接对应的请求URI
  var url = [constant.PREFIX.GOODS, 'cart/update'].join('/');
  var accessToken = state.userInfo.accessToken;
  console.log(accessToken);
  // params 中增加token字段用于鉴权
  var params = { access_token: accessToken };
  // URL BODY PARAMS HEADER
  return http.put(url, body, params, constant.HEADERS_JSON).then(response => {
    return resultUtil.process(response, 500, '更新购物车信息失败！');
  }).catch(error => {
    console.log(error);
    return resultUtil.error(500, '更新购物车信息失败！');
  });
};

// 添加用户收件地址
export const addAddress = ({ commit, state }, body) => {
  // 拼接对应的请求URI
  var url = [constant.PREFIX.ADMIN, 'address/add'].join('/');
  var accessToken = state.userInfo.accessToken;
  console.log(accessToken);
  // params 中增加token字段用于鉴权
  var params = { access_token: accessToken };
  // URL BODY PARAMS HEADER
  return http.post(url, body, params, constant.HEADERS_JSON).then(response => {
    return resultUtil.process(response, 500, '添加收件地址操作失败！');
  }).catch(error => {
    console.log(error);
    return resultUtil.error(500, '添加收件地址操作失败！');
  });
};

// 获取用户收件地址列表
export const getAddressList = ({ commit, state }) => {
  // 拼接对应的请求URI
  var url = [constant.PREFIX.ADMIN, 'address/list'].join('/');
  var accessToken = state.userInfo.accessToken;
  console.log(accessToken);
  // params 中增加token字段用于鉴权
  var params = { access_token: accessToken };
  // URL BODY PARAMS HEADER
  return http.get(url, params, constant.HEADERS_JSON).then(response => {
    return resultUtil.process(response, 500, '获取用户收件地址列表数据失败！');
  }).catch(error => {
    console.log(error);
    return resultUtil.error(500, '获取用户收件地址列表数据失败！');
  });
};

// 更新用户收件地址
export const updateAddress = ({ commit, state }, body) => {
  // 拼接对应的请求URI
  var url = [constant.PREFIX.ADMIN, 'address/update'].join('/');
  var accessToken = state.userInfo.accessToken;
  console.log(accessToken);
  // params 中增加token字段用于鉴权
  var params = { access_token: accessToken };
  // URL BODY PARAMS HEADER
  return http.put(url, body, params, constant.HEADERS_JSON).then(response => {
    return resultUtil.process(response, 500, '更新收件地址数据失败！');
  }).catch(error => {
    console.log(error);
    return resultUtil.error(500, '更新收件地址数据失败！');
  });
};

// 删除用户收件地址
export const removeAddress = ({ commit, state }, id) => {
  // 拼接对应的请求URI
  var url = [constant.PREFIX.ADMIN, 'address', id].join('/');
  var accessToken = state.userInfo.accessToken;
  console.log(accessToken);
  // params 中增加token字段用于鉴权
  var params = { access_token: accessToken };
  // URL BODY PARAMS HEADER
  return http.del(url, params, constant.HEADERS_JSON).then(response => {
    return resultUtil.process(response, 500, '删除用户收件地址操作失败！');
  }).catch(error => {
    console.log(error);
    return resultUtil.error(500, '删除用户收件地址操作失败！');
  });
};

// 16. 下单（用户）
export const addOrder = ({ commit, state }, body) => {
  // 拼接对应的请求URI
  var url = [constant.PREFIX.ORDER, 'order/add'].join('/');
  var accessToken = state.userInfo.accessToken;
  console.log(accessToken);
  // params 中增加token字段用于鉴权
  var params = { access_token: accessToken };
  // URL BODY PARAMS HEADER
  return http.post(url, body, params, constant.HEADERS_JSON).then(response => {
    return resultUtil.process(response, 500, '提交订单数据操作失败！');
  }).catch(error => {
    console.log(error);
    return resultUtil.error(500, '提交订单数据操作失败！');
  });
};

// 17. 更新订单[状态：付款（用户） | 发货/退单（商户）] [基础信息：在未发货之前，商家可以更改地址]
export const updateOrderState = ({ commit, state }, body) => {
  // 拼接对应的请求URI
  var url = [constant.PREFIX.ORDER, 'order/update/state'].join('/');
  var accessToken = state.userInfo.accessToken;
  console.log(accessToken);
  // params 中增加token字段用于鉴权
  var params = { access_token: accessToken };
  // URL BODY PARAMS HEADER
  return http.put(url, body, params, constant.HEADERS_JSON).then(response => {
    return resultUtil.process(response, 500, '更新订单状态失败！');
  }).catch(error => {
    console.log(error);
    return resultUtil.error(500, '更新订单状态失败！');
  });
};

// updateAllOrderState
export const updateAllOrderState = ({ commit, state }, body) => {
  // 拼接对应的请求URI
  var url = [constant.PREFIX.ORDER, 'order/update/all/state'].join('/');
  var accessToken = state.userInfo.accessToken;
  console.log(accessToken);
  // params 中增加token字段用于鉴权
  var params = { access_token: accessToken };
  // URL BODY PARAMS HEADER
  return http.put(url, body, params, constant.HEADERS_JSON).then(response => {
    return resultUtil.process(response, 500, '更新订单状态失败！');
  }).catch(error => {
    console.log(error);
    return resultUtil.error(500, '更新订单状态失败！');
  });
};
export const updateOrderInfo = ({ commit, state }, body) => {
  // 拼接对应的请求URI
  var url = [constant.PREFIX.ORDER, 'order/update/info'].join('/');
  var accessToken = state.userInfo.accessToken;
  console.log(accessToken);
  // params 中增加token字段用于鉴权
  var params = { access_token: accessToken };
  // URL BODY PARAMS HEADER
  return http.put(url, body, params, constant.HEADERS_JSON).then(response => {
    return resultUtil.process(response, 500, '更新订单信息失败！');
  }).catch(error => {
    console.log(error);
    return resultUtil.error(500, '更新订单信息失败！');
  });
};

// 14. 查看订单列表（用户+商户）
export const getOrderList = ({ commit, state }, params) => {
  // 拼接对应的请求URI
  var url = [constant.PREFIX.ORDER, 'order/list'].join('/');
  var accessToken = state.userInfo.accessToken;
  console.log(accessToken);
  // params 中增加token字段用于鉴权
  // var params = { access_token: accessToken };
  params.access_token = accessToken;
  // URL BODY PARAMS HEADER
  return http.get(url, params, constant.HEADERS_JSON).then(response => {
    return resultUtil.process(response, 500, '查询用户订单列表数据失败！');
  }).catch(error => {
    console.log(error);
    return resultUtil.error(500, '查询用户订单列表数据失败！');
  });
};

// 15. 查看订单详情
export const getOrderDetail = ({ commit, state }, id) => {
  // 拼接对应的请求URI
  var url = [constant.PREFIX.ORDER, 'order/detail', id].join('/');
  var accessToken = state.userInfo.accessToken;
  console.log(accessToken);
  // params 中增加token字段用于鉴权
  var params = { access_token: accessToken, id: id };
  // params.access_token = accessToken;
  // URL BODY PARAMS HEADER
  return http.get(url, params, constant.HEADERS_JSON).then(response => {
    return resultUtil.process(response, 500, '查询用户订单详情数据失败！');
  }).catch(error => {
    console.log(error);
    return resultUtil.error(500, '查询用户订单详情数据失败！');
  });
};

// 商户添加商品
export const addGoods = ({ commit, state }, body) => {
  // 拼接对应的请求URI
  var url = [constant.PREFIX.MERCHANT, 'goods/add'].join('/');
  var accessToken = state.userInfo.accessToken;
  console.log(accessToken);
  // params 中增加token字段用于鉴权
  var params = { access_token: accessToken };
  // URL BODY PARAMS HEADER
  return http.post(url, body, params, constant.HEADERS_JSON).then(response => {
    return resultUtil.process(response, 500, '添加商品数据失败！');
  }).catch(error => {
    console.log(error);
    return resultUtil.error(500, '添加商品数据失败！');
  });
};

export const getMerchantGoodsList = ({ commit, state }, params) => {
  // 拼接对应的请求URI
  var url = [constant.PREFIX.MERCHANT, 'goods/list'].join('/');
  var accessToken = state.userInfo.accessToken;
  console.log(accessToken);
  // params 中增加token字段用于鉴权
  params.access_token = accessToken;
  // URL BODY PARAMS HEADER
  return http.get(url, params, constant.HEADERS_JSON).then(response => {
    return resultUtil.process(response, 500, '获取商品列表数据失败！');
  }).catch(error => {
    console.log(error);
    return resultUtil.error(500, '获取商品列表数据失败！');
  });
};
// GET_MERCHANT_GOODS_LIST: 'getMerchantGoodsList',

export const updateMerchantGoods = ({ commit, state }, body) => {
  // 拼接对应的请求URI
  var url = [constant.PREFIX.MERCHANT, 'goods/update'].join('/');
  var accessToken = state.userInfo.accessToken;
  console.log(accessToken);
  // params 中增加token字段用于鉴权
  var params = { access_token: accessToken };
  // URL BODY PARAMS HEADER
  return http.put(url, body, params, constant.HEADERS_JSON).then(response => {
    return resultUtil.process(response, 500, '更新商品数据失败！');
  }).catch(error => {
    console.log(error);
    return resultUtil.error(500, '更新商品数据失败！');
  });
};
// UPDATE_GOODS: 'updateGoods',
// GET_MERCHANT_GOODS_DETAIL: 'getMerchantGoodsDetail',
export const getMerchantGoodsDetail = ({ commit, state }, id) => {
  // 拼接对应的请求URI
  var url = [constant.PREFIX.MERCHANT, 'goods/detail', id].join('/');
  var accessToken = state.userInfo.accessToken;
  console.log(accessToken);
  // params 中增加token字段用于鉴权
  var params = { access_token: accessToken };
  // URL BODY PARAMS HEADER
  return http.get(url, params, constant.HEADERS_JSON).then(response => {
    return resultUtil.process(response, 500, '获取商品详情数据失败！');
  }).catch(error => {
    console.log(error);
    return resultUtil.error(500, '获取商品详情数据失败！');
  });
};
// DELETE_GOODS: 'removeGoods',
export const removeGoods = ({ commit, state }, id) => {
  // 拼接对应的请求URI
  var url = [constant.PREFIX.MERCHANT, 'goods/remove', id].join('/');
  var accessToken = state.userInfo.accessToken;
  console.log(accessToken);
  // params 中增加token字段用于鉴权
  var params = { access_token: accessToken };
  // URL BODY PARAMS HEADER
  return http.del(url, params, constant.HEADERS_JSON).then(response => {
    return resultUtil.process(response, 500, '删除商品数据失败！');
  }).catch(error => {
    console.log(error);
    return resultUtil.error(500, '删除商品数据失败！');
  });
};
// DELETE_GOODS_ATTR: 'removeGoodsAttr'
export const removeGoodsAttr = ({ commit, state }, id) => {
  // 拼接对应的请求URI
  var url = [constant.PREFIX.MERCHANT, 'goods/remove/attr', id].join('/');
  var accessToken = state.userInfo.accessToken;
  console.log(accessToken);
  // params 中增加token字段用于鉴权
  var params = { access_token: accessToken };
  // URL BODY PARAMS HEADER
  return http.del(url, params, constant.HEADERS_JSON).then(response => {
    return resultUtil.process(response, 500, '删除商品套餐数据失败！');
  }).catch(error => {
    console.log(error);
    return resultUtil.error(500, '删除商品套餐数据失败！');
  });
};
// 19. 上传图片(user avatar/merchant banner/goods/goods_attr)
// IS_UPLOAD: 'checkUpload',
export const checkUpload = ({ commit, state }, md5) => {
  // 拼接对应的请求URI
  var url = [constant.PREFIX.UPLOAD, 'isUpload', md5].join('/');
  var accessToken = state.userInfo.accessToken;
  console.log(accessToken);
  // params 中增加token字段用于鉴权
  var params = { access_token: accessToken, md5: md5 };
  // URL BODY PARAMS HEADER
  // 非上传请求，get 且json header
  return http.get(url, params, constant.HEADERS_JSON).then(response => {
    return resultUtil.process(response, 500, '获取上传状态失败，默认以未上传处理！');
  }).catch(error => {
    console.log(error);
    return resultUtil.error(500, '获取上传状态失败，默认以未上传处理！');
  });
};
// UPLOAD_AVATAR: 'uploadAvatar',
export const uploadAvatar = ({ commit, state }, body) => {
  // 拼接对应的请求URI
  var url = [constant.PREFIX.UPLOAD, 'avatar'].join('/');
  var accessToken = state.userInfo.accessToken;
  console.log(accessToken);
  // params 中增加token字段用于鉴权
  var params = { access_token: accessToken, md5: body.md5 };
  var formdata = new FormData();
  formdata.append('file', body.file);
  // URL BODY PARAMS HEADER
  return http.post(url, formdata, params, constant.HEADERS_UPLOAD).then(response => {
    return resultUtil.process(response, 500, '上传图片失败！');
  }).catch(error => {
    console.log(error);
    return resultUtil.error(500, '上传图片失败！');
  });
};
// UPLOAD_BANNER: 'uploadBanner',
export const uploadBanner = ({ commit, state }, body) => {
  // 拼接对应的请求URI
  var url = [constant.PREFIX.UPLOAD, 'banner'].join('/');
  var accessToken = state.userInfo.accessToken;
  console.log(accessToken);
  // params 中增加token字段用于鉴权
  var params = { access_token: accessToken, md5: body.md5 };
  var formdata = new FormData();
  formdata.append('file', body.file);
  // URL BODY PARAMS HEADER
  return http.post(url, formdata, params, constant.HEADERS_UPLOAD).then(response => {
    return resultUtil.process(response, 500, '上传图片失败！');
  }).catch(error => {
    console.log(error);
    return resultUtil.error(500, '上传图片失败！');
  });
};
// UPLOAD_GOODS_IMGS: 'uploadGoodsImgs',
export const uploadGoodsImgs = ({ commit, state }, body) => {
  // 拼接对应的请求URI
  var url = [constant.PREFIX.UPLOAD, 'goods'].join('/');
  var accessToken = state.userInfo.accessToken;
  console.log(accessToken);
  // params 中增加token字段用于鉴权
  var params = { access_token: accessToken, md5: body.md5 };
  var formdata = new FormData();
  formdata.append('file', body.file);
  // URL BODY PARAMS HEADER
  return http.post(url, formdata, params, constant.HEADERS_UPLOAD).then(response => {
    return resultUtil.process(response, 500, '上传图片失败！');
  }).catch(error => {
    console.log(error);
    return resultUtil.error(500, '上传图片失败！');
  });
};
// UPLOAD_GOODS_ATTR_IMAGE: 'uploadGoodsAttrImage'
export const uploadGoodsAttrImage = ({ commit, state }, body) => {
  // 拼接对应的请求URI
  var url = [constant.PREFIX.UPLOAD, 'goods'].join('/');
  var accessToken = state.userInfo.accessToken;
  console.log(accessToken);
  // params 中增加token字段用于鉴权
  var params = { access_token: accessToken, md5: body.md5 };
  var formdata = new FormData();
  formdata.append('file', body.file);
  return http.post(url, formdata, params, constant.HEADERS_UPLOAD).then(response => {
    return resultUtil.process(response, 500, '上传图片失败！');
  }).catch(error => {
    console.log(error);
    return resultUtil.error(500, '上传图片失败！');
  });
};

// 20. 退出登录
export const signOut = ({ commit, state }) => {
  var accessToken = state.userInfo.accessToken;
  console.log(accessToken);
  localStorage.removeItem(constant.LOCAL_STORAGE.LOGIN_INFO);
  localStorage.removeItem(constant.LOCAL_STORAGE.MERCHANT_INFO);
  commit(constant.MUTATIONS.SET_USER_LOGIN_INFO, {});
};

// -------------------------------------------------------------------

// 获取秒杀数据
export const loadSeckillsInfo = ({
  commit
}) => {
  return new Promise((resolve, reject) => {
    const data = [{
      intro: '【赠小风扇】维他 柠檬茶250ml*32盒 礼品装 整箱',
      img: 'static/img/index/seckill/seckill-item1.jpg',
      price: 71.9,
      realPrice: 89.6
    },
    {
      intro: 'Kindle Paperwhite 全新升级版6英寸护眼非反光电子墨水',
      img: 'static/img/index/seckill/seckill-item2.jpg',
      price: 989.0,
      realPrice: 1299.0
    },
    {
      intro: '粮悦 大吃兄糯米锅巴 安徽特产锅巴糯米原味400g*2盒',
      img: 'static/img/index/seckill/seckill-item3.jpg',
      price: 21.8,
      realPrice: 49.0
    },
    {
      intro: '【京东超市】清风（APP）抽纸 原木纯品金装系列 3层',
      img: 'static/img/index/seckill/seckill-item4.jpg',
      price: 49.9,
      realPrice: 59.0
    },
    {
      intro: 'NIKE耐克 男子休闲鞋 AIR MAX 90 ESSENTIAL 气垫',
      img: 'static/img/index/seckill/seckill-item5.jpg',
      price: 559.9,
      realPrice: 759.9
    }
    ];
    const date = new Date();
    const hours = date.getHours();
    const minute = date.getMinutes();
    const seconds = date.getSeconds();
    console.log([hours, minute, seconds]);
    // 距离开始秒杀时间
    const deadline = {
      hours: 1,
      minute: 38,
      seconds: 36
    };
    commit('SET_SECKILLS_INFO', [data, deadline]);
  });
};

// 获取轮播(营销)图片
export const loadCarouselItems = ({
  commit
}) => {
  return new Promise((resolve, reject) => {
    const data = {
      carouselItems: [
        'static/img/nav/1.jpg',
        'static/img/nav/2.jpg',
        'static/img/nav/3.jpg',
        'static/img/nav/4.jpg',
        'static/img/nav/5.jpg'
      ],
      activity: [
        'static/img/nav/nav_showimg1.jpg',
        'static/img/nav/nav_showimg2.jpg'
      ]
    };
    commit('SET_CAROUSELITEMS_INFO', data);
  });
};

// 加载电脑专栏数据
export const loadComputer = ({
  commit
}) => {
  return new Promise((resolve, reject) => {
    const computer = {
      title: '电脑数码',
      link: ['电脑馆', '游戏极品', '装机大师', '职场焕新', '女神频道', '虚拟现实', '二合一平板', '电子教育', '万物周刊'],
      detail: [{
        bigImg: 'static/img/index/computer/item-computer-1.jpg',
        itemFour: [{
          title: '电脑馆',
          intro: '笔记本999元限量秒！',
          img: 'static/img/index/computer/item-computer-2.jpg'
        },
        {
          title: '外设装备',
          intro: '1000减618',
          img: 'static/img/index/computer/item-computer-1-3.jpg'
        },
        {
          title: '电脑配件',
          intro: '联合满减最高省618',
          img: 'static/img/index/computer/item-computer-1-4.jpg'
        },
        {
          title: '办公生活',
          intro: '5折神券 精品文具',
          img: 'static/img/index/computer/item-computer-1-5.jpg'
        }
        ],
        itemContent: [
          'static/img/index/computer/item-computer-1-6.jpg',
          'static/img/index/computer/item-computer-1-7.jpg',
          'static/img/index/computer/item-computer-1-8.jpg'
        ]
      },
      {
        bigImg: 'static/img/index/computer/item-computer-2-1.jpg',
        itemFour: [{
          title: '平板电脑',
          intro: '爆款平板12期免息',
          img: 'static/img/index/computer/item-computer-2-2.jpg'
        },
        {
          title: '智能酷玩',
          intro: '抢999减666神券',
          img: 'static/img/index/computer/item-computer-2-3.jpg'
        },
        {
          title: '娱乐影音',
          intro: '大牌耳机低至5折',
          img: 'static/img/index/computer/item-computer-2-4.jpg'
        },
        {
          title: '摄影摄像',
          intro: '大牌相机5折抢',
          img: 'static/img/index/computer/item-computer-2-5.jpg'
        }
        ],
        itemContent: [
          'static/img/index/computer/item-computer-2-6.jpg',
          'static/img/index/computer/item-computer-2-7.jpg',
          'static/img/index/computer/item-computer-2-8.jpg'
        ]
      }
      ]
    };
    commit('SET_COMPUTER_INFO', computer);
  });
};

// 加载爱吃专栏数据
export const loadEat = ({
  commit
}) => {
  return new Promise((resolve, reject) => {
    const eat = {
      title: '爱吃',
      link: ['休闲零食', '坚果', '牛奶', '饮料冲调', '食用油', '大米', '白酒', '红酒', '烧烤食材', '牛排', '樱桃'],
      detail: [{
        bigImg: 'static/img/index/eat/item-eat-1-1.jpg',
        itemFour: [{
          title: '粮油调味',
          intro: '买2免1',
          img: 'static/img/index/eat/item-eat-1-2.jpg'
        },
        {
          title: '饮料冲调',
          intro: '第二件半价',
          img: 'static/img/index/eat/item-eat-1-3.jpg'
        },
        {
          title: '休闲零食',
          intro: '满99减40',
          img: 'static/img/index/eat/item-eat-1-4.jpg'
        },
        {
          title: '中外名酒',
          intro: '满199减100',
          img: 'static/img/index/eat/item-eat-1-5.jpg'
        }
        ],
        itemContent: [
          'static/img/index/eat/item-eat-1-6.jpg',
          'static/img/index/eat/item-eat-1-7.jpg',
          'static/img/index/eat/item-eat-1-8.jpg'
        ]
      },
      {
        bigImg: 'static/img/index/eat/item-eat-2-1.jpg',
        itemFour: [{
          title: '东家菜',
          intro: '丰富好味',
          img: 'static/img/index/eat/item-eat-2-2.jpg'
        },
        {
          title: '东家菜',
          intro: '丰富好味',
          img: 'static/img/index/eat/item-eat-2-2.jpg'
        },
        {
          title: '东家菜',
          intro: '丰富好味',
          img: 'static/img/index/eat/item-eat-2-2.jpg'
        },
        {
          title: '东家菜',
          intro: '丰富好味',
          img: 'static/img/index/eat/item-eat-2-2.jpg'
        }
        ],
        itemContent: [
          'static/img/index/eat/item-eat-2-6.jpg',
          'static/img/index/eat/item-eat-2-7.jpg',
          'static/img/index/eat/item-eat-2-8.jpg'
        ]
      }
      ]
    };
    commit('SET_EAT_INFO', eat);
  });
};

// 请求获得商品详细信息
export const loadGoodsInfo = ({
  commit
}) => {
  commit('SET_LOAD_STATUS', true);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = {
        goodsImg: [
          'static/img/goodsDetail/item-detail-1.jpg',
          'static/img/goodsDetail/item-detail-2.jpg',
          'static/img/goodsDetail/item-detail-3.jpg',
          'static/img/goodsDetail/item-detail-4.jpg'
        ],
        title: '苹果8/7手机壳iPhone7 Plus保护壳全包防摔磨砂硬外壳',
        tags: ['满69-20元', '关注产品★送钢化膜', 'BIT配次日达'],
        discount: ['满148减10', '满218减20', '满288减30'],
        promotion: ['跨店满减', '多买优惠'],
        remarksNum: 6000,
        setMeal: [
          [{
            img: 'static/img/goodsDetail/pack/1.jpg',
            intro: '4.7英寸-深邃蓝',
            price: 28.0
          },
          {
            img: 'static/img/goodsDetail/pack/2.jpg',
            intro: '4.7英寸-星空黑',
            price: 29.0
          },
          {
            img: 'static/img/goodsDetail/pack/3.jpg',
            intro: '5.5英寸-香槟金',
            price: 28.5
          }
          ],
          [{
            img: 'static/img/goodsDetail/pack/4.jpg',
            intro: '5.5英寸-玫瑰金',
            price: 32.0
          },
          {
            img: 'static/img/goodsDetail/pack/5.jpg',
            intro: '5.5英寸-深邃蓝',
            price: 32.0
          },
          {
            img: 'static/img/goodsDetail/pack/6.jpg',
            intro: '5.5英寸-星空黑',
            price: 35.0
          }
          ],
          [{
            img: 'static/img/goodsDetail/pack/7.jpg',
            intro: '4.7英寸-香槟金',
            price: 26.0
          },
          {
            img: 'static/img/goodsDetail/pack/8.jpg',
            intro: '4.7英寸-玫瑰金',
            price: 25.0
          },
          {
            img: 'static/img/goodsDetail/pack/9.jpg',
            intro: '4.7英寸-中国红',
            price: 28.0
          }
          ]
        ],
        hot: [{
          img: 'static/img/goodsDetail/hot/1.jpg',
          price: 28.0,
          sale: 165076
        },
        {
          img: 'static/img/goodsDetail/hot/2.jpg',
          price: 36.0,
          sale: 135078
        },
        {
          img: 'static/img/goodsDetail/hot/3.jpg',
          price: 38.0,
          sale: 105073
        },
        {
          img: 'static/img/goodsDetail/hot/4.jpg',
          price: 39.0,
          sale: 95079
        },
        {
          img: 'static/img/goodsDetail/hot/5.jpg',
          price: 25.0,
          sale: 5077
        },
        {
          img: 'static/img/goodsDetail/hot/6.jpg',
          price: 20.0,
          sale: 3077
        }
        ],
        goodsDetail: [
          'static/img/goodsDetail/intro/1.jpg',
          'static/img/goodsDetail/intro/2.jpg',
          'static/img/goodsDetail/intro/3.jpg',
          'static/img/goodsDetail/intro/4.jpg'
        ],
        param: [{
          title: '商品名称',
          content: 'iPhone 7手机壳'
        },
        {
          title: '商品编号',
          content: '10435663237'
        },
        {
          title: '店铺',
          content: 'Gavin Shop'
        },
        {
          title: '商品毛重',
          content: '100.00g'
        },
        {
          title: '商品产地',
          content: '中国大陆'
        },
        {
          title: '机型',
          content: 'iPhone 7'
        },
        {
          title: '材质',
          content: 'PC/塑料'
        },
        {
          title: '款式',
          content: '软壳'
        },
        {
          title: '适用人群',
          content: '通用'
        }
        ],
        remarks: {
          goodAnalyse: 90,
          remarksTags: ['颜色可人', '实惠优选', '严丝合缝', '极致轻薄', '质量没话说', '比定做还合适', '完美品质', '正品行货', '包装有档次', '不容易发热', '已经买第二个', '是全覆盖'],
          remarksNumDetail: [2000, 3000, 900, 1],
          detail: [{
            username: 'p****1',
            values: 3,
            content: '颜色很好看，质量也不错！，还送了个指环，想不到哦！',
            goods: '4.7英寸-深邃蓝',
            create_at: '2018-05-15 09:20'
          },
          {
            username: '13****1',
            values: 5,
            content: '手感没的说，是硬壳，后背带有磨砂手感。很不错，很喜欢，还加送了钢化膜，支架环，物超所值，准备再买一个。很满意。物流很快。很愉快的一次购物！',
            goods: '5.5英寸-玫瑰金',
            create_at: '2018-05-13 15:23'
          },
          {
            username: '3****z',
            values: 4.5,
            content: '相当轻薄，店家还送了一大堆配件，*元非常值得！',
            goods: '4.7英寸-玫瑰金',
            create_at: '2018-05-05 12:25'
          },
          {
            username: 'gd****c',
            values: 3.5,
            content: '就是我想要的手机壳，壳子很薄，手感不错，就像没装手机壳一样，想要裸机手感的赶快下手了。',
            goods: '4.7英寸-中国红',
            create_at: '2018-04-06 16:23'
          },
          {
            username: 'r****b',
            values: 4.5,
            content: '壳子还不错，送的膜也可以，不过还是感觉膜小了那么一点，屏幕没法完全覆盖。对了，壳子稍微有点硬，可能会伤漆，所以不要频繁取壳就好。',
            goods: '4.7英寸-中国红',
            create_at: '2018-03-15 19:24'
          },
          {
            username: 'd****e',
            values: 5,
            content: '磨砂的，相当漂亮，尺寸非常合适！精工细作！',
            goods: '5.5英寸-星空黑',
            create_at: '2018-03-10 10:13'
          }
          ]
        }
      };
      commit('SET_GOODS_INFO', data);
      commit('SET_LOAD_STATUS', false);
    }, 300);
  });
};

// 获取商品列表
export const loadGoodsList = ({
  commit
}) => {
  commit('SET_LOAD_STATUS', true);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = {
        asItems: [{
          img: 'static/img/goodsList/item-as-img-1.jpg',
          price: 39.9,
          intro: 'SKSK 苹果7/7plus手机壳 iPhone 7 Plus保护套全包硬',
          num: 3140,
          sale: 9000
        },
        {
          img: 'static/img/goodsList/item-as-img-2.jpg',
          price: 36.6,
          intro: '狮普 苹果7/7 Plus手机壳 电镀 超薄 全包 防摔 保护外',
          num: 6160,
          sale: 8900
        },
        {
          img: 'static/img/goodsList/item-as-img-1.jpg',
          price: 38.6,
          intro: 'SKSK 苹果7/7plus手机壳 iPhone 7 Plus保护套全包硬',
          num: 9160,
          sale: 8800
        },
        {
          img: 'static/img/goodsList/item-as-img-2.jpg',
          price: 35.6,
          intro: '狮普 苹果7/7 Plus手机壳 电镀 超薄 全包 防摔 保护外',
          num: 6160,
          sale: 7990
        },
        {
          img: 'static/img/goodsList/item-as-img-1.jpg',
          price: 38.6,
          intro: 'SKSK 苹果7/7plus手机壳 iPhone 7 Plus保护套全包硬',
          num: 9160,
          sale: 7600
        },
        {
          img: 'static/img/goodsList/item-as-img-2.jpg',
          price: 35.6,
          intro: '狮普 苹果7/7 Plus手机壳 电镀 超薄 全包 防摔 保护外',
          num: 6160,
          sale: 6900
        }
        ],
        goodsList: [{
          img: 'static/img/goodsList/item-show-1.jpg',
          price: 36.60,
          intro: 'SKSK 苹果7/7plus手机壳 iPhone 7 Plus保护套全包硬壳男女磨砂防摔 火影红(苹',
          remarks: 6160,
          shopName: '元亨利配件专营店',
          sale: 9900
        },
        {
          img: 'static/img/goodsList/item-show-2.jpg',
          price: 28.00,
          intro: '蒙奇奇 苹果6s手机壳磨砂防摔保护套 适用于iphone6/6s/6sPlus/6plus 6/6s 4.7英',
          remarks: 3000,
          shopName: 'monqiqi旗舰店',
          sale: 9600
        },
        {
          img: 'static/img/goodsList/item-show-3.jpg',
          price: 15.00,
          intro: 'BIAZE 苹果6/6s手机壳 苹果iphone6s 4.7英寸透明手机套 清爽系列',
          remarks: 2800,
          shopName: 'BIAZE官方旗舰店',
          sale: 8900
        },
        {
          img: 'static/img/goodsList/item-show-4.jpg',
          price: 29.90,
          intro: '慕臣 苹果6s手机壳全包防摔磨砂软保护套男女 适用于iPhone6splus',
          remarks: 9000,
          shopName: '歌乐力手配专营店',
          sale: 8600
        },
        {
          img: 'static/img/goodsList/item-show-5.jpg',
          price: 15.00,
          intro: 'BIAZE 苹果6/6s手机壳 苹果iphone6s 4.7英寸透明手机套 清爽系列',
          remarks: 6160,
          shopName: 'BIAZE官方旗舰店',
          sale: 8560
        },
        {
          img: 'static/img/goodsList/item-show-6.jpg',
          price: 28.00,
          intro: '慕臣 苹果6s手机壳全包防摔磨砂软保护套男女 适用于iPhone6splus',
          remarks: 9006,
          shopName: '歌乐力手配专营店',
          sale: 8530
        },
        {
          img: 'static/img/goodsList/item-show-7.jpg',
          price: 15.00,
          intro: 'BIAZE 苹果6/6s手机壳 苹果iphone6s 4.7英寸透明手机套 清爽系列',
          remarks: 8666,
          shopName: 'BIAZE官方旗舰店',
          sale: 8360
        },
        {
          img: 'static/img/goodsList/item-show-8.jpg',
          price: 29.90,
          intro: '慕臣 苹果6s手机壳全包防摔磨砂软保护套男女 适用于iPhone6splus',
          remarks: 6080,
          shopName: '歌乐力手配专营店',
          sale: 7560
        },
        {
          img: 'static/img/goodsList/item-show-1.jpg',
          price: 36.60,
          intro: 'SKSK 苹果7/7plus手机壳 iPhone 7 Plus保护套全包硬壳男女磨砂防摔 火影红(苹',
          remarks: 6160,
          shopName: '元亨利配件专营店',
          sale: 7360
        },
        {
          img: 'static/img/goodsList/item-show-2.jpg',
          price: 28.00,
          intro: '蒙奇奇 苹果6s手机壳磨砂防摔保护套 适用于iphone6/6s/6sPlus/6plus 6/6s 4.7英',
          remarks: 3000,
          shopName: 'monqiqi旗舰店',
          sale: 6960
        },
        {
          img: 'static/img/goodsList/item-show-3.jpg',
          price: 15.00,
          intro: 'BIAZE 苹果6/6s手机壳 苹果iphone6s 4.7英寸透明手机套 清爽系列',
          remarks: 2800,
          shopName: 'BIAZE官方旗舰店',
          sale: 6560
        },
        {
          img: 'static/img/goodsList/item-show-4.jpg',
          price: 29.90,
          intro: '慕臣 苹果6s手机壳全包防摔磨砂软保护套男女 适用于iPhone6splus',
          remarks: 9000,
          shopName: '歌乐力手配专营店',
          sale: 6360
        },
        {
          img: 'static/img/goodsList/item-show-5.jpg',
          price: 15.00,
          intro: 'BIAZE 苹果6/6s手机壳 苹果iphone6s 4.7英寸透明手机套 清爽系列',
          remarks: 6160,
          shopName: 'BIAZE官方旗舰店',
          sale: 5530
        },
        {
          img: 'static/img/goodsList/item-show-6.jpg',
          price: 28.00,
          intro: '慕臣 苹果6s手机壳全包防摔磨砂软保护套男女 适用于iPhone6splus',
          remarks: 9006,
          shopName: '歌乐力手配专营店',
          sale: 5560
        },
        {
          img: 'static/img/goodsList/item-show-7.jpg',
          price: 15.00,
          intro: 'BIAZE 苹果6/6s手机壳 苹果iphone6s 4.7英寸透明手机套 清爽系列',
          remarks: 8666,
          shopName: 'BIAZE官方旗舰店',
          sale: 5260
        },
        {
          img: 'static/img/goodsList/item-show-8.jpg',
          price: 29.90,
          intro: '慕臣 苹果6s手机壳全包防摔磨砂软保护套男女 适用于iPhone6splus',
          remarks: 6080,
          shopName: '歌乐力手配专营店',
          sale: 3560
        }
        ]
      };
      commit('SET_GOODS_LIST', data);
      commit('SET_LOAD_STATUS', false);
    });
  });
};
