<template>
  <div class="container">
    <Layout class="layout">
      <Sider
        class="side-bar"
        :style="{
          //height: 'calc(100vh)',
          height: 'calc(100vh + 100px)',
          background: '#fff',
          overflow: 'auto'
        }"
        ref="side"
        :collapsed-width="78"
      >
        <Menu
          active-name="myInfo"
          theme="light"
          width="auto"
          @on-select="onSelect"
        >
          <div class="user-icon">
            <div class="user-img">
              <img :src="avatarPreview" />
            </div>
            <p>{{ userInfo.username }}</p>
          </div>
          <Submenu name="1">
            <template slot="title">
              <Icon type="information"></Icon>
              <span>账户管理</span>
            </template>
            <MenuItem name="myInfo">{{
              userInfo.type != "MERCHANT" ? "个人信息" : "本店信息"
            }}</MenuItem>
            <!-- <MenuItem v-show="userInfo.type==='MERCHANT'" name="merchantInfo">本店信息</MenuItem> -->
            <MenuItem v-show="userInfo.type === 'ADMIN'" name="userManagement"
              >用户管理</MenuItem
            >
          </Submenu>
          <Submenu v-show="userInfo.type === 'CUSTOMER'" name="2">
            <template slot="title">
              <Icon type="location"></Icon>
              <span>收货地址</span>
            </template>
            <MenuItem name="myAddress">我的收货地址</MenuItem>
            <MenuItem name="addAddress">添加收货地址</MenuItem>
          </Submenu>
          <Submenu v-show="userInfo.type != 'ADMIN'" name="3">
            <template slot="title">
              <Icon type="clipboard"></Icon>
              <span>购物订单</span>
            </template>
            <MenuItem v-show="userInfo.type === 'CUSTOMER'" name="myOrder"
              >我的订单</MenuItem
            >
            <MenuItem v-show="userInfo.type === 'MERCHANT'" name="merchantOrder"
              >本店订单</MenuItem
            >
          </Submenu>
          <Submenu v-show="userInfo.type === 'CUSTOMER'" name="4">
            <template slot="title">
              <Icon type="ios-cart"></Icon>
              <span>购物车</span>
            </template>
            <MenuItem name="myShoppingCart">我的购物车</MenuItem>
          </Submenu>
          <Submenu v-show="userInfo.type === 'MERCHANT'" name="5">
            <template slot="title">
              <Icon type="ios-cart"></Icon>
              <span>库存管理</span>
            </template>
            <MenuItem name="addGoods">商品上新</MenuItem>
            <MenuItem name="goodsManagement">商品管理</MenuItem>
          </Submenu>
        </Menu>
      </Sider>
      <Layout class="layout">
        <Header :style="{ background: '#fff' }">
          <h2>{{ activeTitle }}</h2>
        </Header>
        <Content class="content">
          <transition mode="out-in">
            <router-view></router-view>
          </transition>
        </Content>
        <Footer class="layout-footer-center">2020 &copy; Adam</Footer>
      </Layout>
    </Layout>
  </div>
</template>

<script>
import store from '@/vuex/store';
import { mapState, mapActions } from 'vuex';
import constant from '../util/constant';

export default {
  name: 'Home',
  data () {
    return {
      // activeTitle: '个人信息',
      bar: {
        myInfo: '个人信息',
        userManagement: '用户管理',
        myAddress: '我的收货地址',
        addAddress: '添加收货地址',
        myOrder: '我的订单',
        merchantOrder: '本店订单',
        myShoppingCart: '我的购物车',
        addGoods: '商品上新',
        goodsManagement: '商品管理'
      }
    };
  },
  created () {
    this.isLogin();
    if (!this.userInfo.avatar) {
      this.getUserById();
    }
    this.$data.activeTitle =
      this.userInfo.type === constant.USER_TYPE.MERCHANT
        ? '本店信息'
        : '个人信息';
  },
  computed: {
    ...mapState([constant.STATES.USER_INFO]),
    activeTitle () {
      var name = this.$route.path.replace('/home/', '');
      var value =
        this.userInfo.type === constant.USER_TYPE.MERCHANT
          ? '本店信息'
          : '个人信息';
      if (name === 'myInfo') {
        return value;
      }
      return this.bar[name] ? this.bar[name] : value;
    },
    avatarPreview () {
      return constant.BASE_STATIC_URL[constant.ACTIVE] + this.userInfo.avatar;
    }
  },
  methods: {
    ...mapActions([constant.ACTIONS.IS_LOGIN, constant.ACTIONS.GET_USER_BY_ID]),
    onSelect (name) {
      // this.activeTitle = this.bar[name];
      // if (name === 'myInfo') {
      //   this.$data.activeTitle =
      //     this.userInfo.type === constant.USER_TYPE.MERCHANT
      //       ? '本店信息'
      //       : '个人信息';
      // }
      this.$log.d(this.activeTitle);
      this.$router.push(`/home/${name}`);
    }
  },
  store
};
</script>

<style scoped>
.side-bar a {
  color: #232323;
}
.user-icon {
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.user-icon span {
  font-size: 96px;
}
.user-img {
  margin-bottom: 15px;
}
.user-img img {
  width: 96px;
  height: 96px;
  border-radius: 48px;
  overflow: hidden;
}
.content {
  margin: 15px;
  background-color: #fff;
  padding: 15px;
}
.layout-footer-center {
  padding: 0px 15px;
  padding-bottom: 15px;
  text-align: center;
}
</style>
