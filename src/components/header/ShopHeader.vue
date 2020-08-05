<template>
  <div class="shop-box">
    <div class="shop-container">
      <div>
        <Row>
          <i-col span="12">
            <div class="shop-title">
              <div class="shop-title-icon">
                <Icon type="fireball"></Icon>
                <i class="fa fa-fire"></i>
              </div>
              <div class="shop-title-content">
                <p>
                  <router-link
                    :to="{
                      path: '/merchant',
                      name: 'Merchant',
                      query: { id: merchantInfo.id }
                    }"
                    class="shop-name"
                    >{{ merchantInfo.name }}</router-link
                  >
                </p>
                <p>
                  <router-link
                    :to ="{path:'/merchant',name:'Merchant',query:{id:merchantInfo.id}}"
                    class="shop-description">
                    介绍：{{ merchantInfo.description }}</router-link
                  >
                </p>
              </div>
            </div>
          </i-col>
          <i-col span="12">
            <div
              class="merchant-header-right"
              v-if="userInfo.type === 'MERCHANT'"
            >
              <Row style="width:100%" type="flex" justify="center">
                <i-col span="8">
                  <Button
                    type="ghost"
                    size="large"
                    shape="circle"
                    @click="$router.push('/home')"
                    >店户管理</Button
                  >
                </i-col>

                <i-col span="8">
                  <Button
                    type="ghost"
                    size="large"
                    shape="circle"
                    @click="$router.push('/home/goodsManagement')"
                    >商品管理</Button
                  >
                </i-col>
                <i-col span="8">
                  <Button
                    type="ghost"
                    size="large"
                    shape="circle"
                    @click="$router.push('/home/merchantOrder')"
                    >订单管理</Button
                  >
                </i-col>
              </Row>
            </div>
            <div v-else>
              <!-- <Button
                type="info"
                size="large"
                @click="
                  $router.push({
                    path: '/merchant',
                    name: 'Merchant',
                    params: { merchantId: 1 }
                  })
                "
                >点击</Button
              > -->
              <div class="shop-another-item">
                <div
                  class="shop-another-item-detail"
                  v-for="(item, index) in showGoods"
                  :key="index"
                >
                  <div class="shop-another-item-img">
                    <img :src="item.img" alt="" />
                  </div>
                  <div class="shop-anoter-item-intro">
                    <p>{{ item.intro[0] }}</p>
                    <p>{{ item.intro[1] }}</p>
                  </div>
                </div>
              </div>
            </div>
          </i-col>
        </Row>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/vuex/store';
import { mapState, mapMutations } from 'vuex';
import constant from '../../util/constant';

export default {
  name: 'ShopHeader',
  data () {
    return {
      // merchantInfo: {},
      showGoods: [
        {
          img: 'static/img/goodsList/item-show-1.jpg',
          intro: ['全身磨砂', '防指纹']
        },
        {
          img: 'static/img/goodsList/item-show-2.jpg',
          intro: ['环保PP材质', '不发黄']
        },
        {
          img: 'static/img/goodsList/item-show-3.jpg',
          intro: ['0.4mm纤细', '纤薄手感']
        }
      ]
    };
  },
  created: function () {
    // this.$data.userInfo = this.userInfo;
    this.$log.d('merchant header page！');
    this.$data.merchantInfo = this.merchantInfo;
  },
  computed: {
    ...mapState([constant.STATES.USER_INFO, constant.STATES.MERCHANT_INFO])
  },
  methods: {
    ...mapMutations([constant.MUTATIONS.SET_MERCHANT_INFO])
    // ...mapActions([constant.ACTIONS.GET_MERCHANT])
  },
  store
};
</script>

<style scoped>
/* 店铺介绍 */
.shop-box {
  width: 100%;
  height: 120px;
  background-color: #484848;
}

.shop-container {
  width: 80%;
  /* width: 100%; */
  height: 100%;
  margin: 0px auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: #fff;
}

.shop-container > div {
  width: 100%;
}

.shop-title {
  display: flex;
  flex-direction: row;
}

.shop-title-icon {
  font-size: 46px;
}

.shop-title-content {
  padding-top: 8px;
  margin-left: 15px;
}

.shop-title-content p {
  line-height: 26px;
  font-size: 20px;
}

.shop-title-content a {
  color: #fff;
}

.shop-another-item {
  display: flex;
  flex-direction: row;
}

.shop-another-item-detail {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 15px;
}

.shop-another-item-img {
  height: 80px;
  border-radius: 40px;
  overflow: hidden;
}

.shop-another-item-img img {
  width: 80px;
}

.shop-anoter-item-intro {
  margin-left: 15px;
}

.shop-title-content .shop-description {
  font-size: 12px;
}

.merchant-header-right {
  height: 70px;
  display: flex;
  align-items: center;
}

.merchant-header-right button {
  width: 80%;
  background: cornsilk;
  height: 50px;
  font-size: 14pt;
  font-weight: bold;
  font-style: grey;
}
</style>
