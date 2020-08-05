import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import * as mutations from './mutations';
import * as getters from './getters';
import createLogger from 'vuex/dist/logger';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  state: {
    isLoading: true, // 是否展示loading动画
    orderBy: 'sale', // 根据什么字段排序
    // goodsInfo: { // 商品详情
    //   goodsImg: [],
    //   title: '',
    //   tags: [],
    //   discount: [],
    //   promotion: [],
    //   remarksNum: 0,
    //   setMeal: [],
    //   hot: [],
    //   goodsDetail: [],
    //   param: [],
    //   remarks: []
    // },
    userInfo: { // 用户信息
      username: '',
      email: '',
      telephone: '',
      type: '',
      accessToken: '',
      avatar: ''
    },
    merchantInfo: {
      // 商户信息
    },
    // signUpStep: 0, // 登陆步骤
    marketing: { // 营销
      CarouselItems: [], // 轮播图
      activity: [] // 活动
    },
    computer: {}, // 电脑专栏
    eat: {}, // 爱吃专栏
    asItems: [] // 广告
  },
  getters,
  actions,
  mutations,
  plugins: debug ? [createLogger()] : []
});
