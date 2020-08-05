// 设置用户登录信息
export const SET_USER_LOGIN_INFO = (state, data) => {
  state.userInfo = data;
};

// 设置商户具体信息
export const SET_MERCHANT_INFO = (state, data) => {
  state.merchantInfo = data;
};

// ------------------------------- end ------------------------------------------

// 设置加载状态
export const SET_LOAD_STATUS = (state, status) => {
  state.isLoading = status;
};

// 设置轮播(营销)图
export const SET_CAROUSELITEMS_INFO = (state, { carouselItems, activity }) => {
  state.marketing.CarouselItems = carouselItems;
  state.marketing.activity = activity;
};

// 设置电脑专栏数据
export const SET_COMPUTER_INFO = (state, computer) => {
  state.computer = computer;
};

// 设置爱吃专栏数据
export const SET_EAT_INFO = (state, eat) => {
  state.eat = eat;
};

// 设置商品列表(搜索)
export const SET_GOODS_LIST = (state, data) => {
  state.goodsList = data.goodsList;
  state.asItems = data.asItems;
};

// 设置商品列表排序
export const SET_GOODS_ORDER_BY = (state, data) => {
  state.orderBy = data;
};

// 设置商品详细信息
export const SET_GOODS_INFO = (state, data) => {
  state.goodsInfo = data;
};
