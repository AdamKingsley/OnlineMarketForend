<template>
  <div>
    <Search></Search>
    <ShopHeader></ShopHeader>
    <!-- <GoodsDetailNav></GoodsDetailNav> -->
    <!-- <div class="shop-item-path">
      <div class="shop-nav-container">
        <Breadcrumb>
          <BreadcrumbItem to="/">首页</BreadcrumbItem>
          <BreadcrumbItem to="/goodsList">手机壳</BreadcrumbItem>
          <BreadcrumbItem>手机保护套</BreadcrumbItem>
        </Breadcrumb>
      </div>
    </div> -->
    <!-- 商品信息展示 -->
    <ShowGoods :goodsDetail="goodsDetail"></ShowGoods>
    <!-- 商品详细展示 -->
    <ShowGoodsDetail :goodsDetail="goodsDetail"></ShowGoodsDetail>
    <Spin size="large" fix v-if="isLoading"></Spin>
  </div>
</template>

<script>
import Search from '@/components/Search';
// import GoodsDetailNav from '@/components/nav/GoodsDetailNav';
import ShopHeader from '@/components/header/ShopHeader';
import ShowGoods from '@/components/goodsDetail/ShowGoods';
import ShowGoodsDetail from '@/components/goodsDetail/ShowGoodsDetail';
import store from '@/vuex/store';
import { mapActions } from 'vuex';
import constant from '../util/constant';
export default {
  name: 'GoodsDetail',
  beforeRouteEnter (to, from, next) {
    window.scrollTo(0, 0);
    next();
  },
  created () {
    var goodsId = this.$route.params.id;
    this.$log.d('show the goods details !!!');
    this.$log.d(goodsId);
    this.updateGoodsDetail(goodsId);
  },
  data () {
    return {
      isLoading: true,
      goodsDetail: {}
    };
  },
  methods: {
    ...mapActions(['loadGoodsInfo', constant.ACTIONS.GET_GOODS_DETAIL]),
    updateGoodsDetail (goodsId) {
      // 获取商品详情
      this.getGoodsDetail({ goodsId: goodsId }).then(result => {
        this.$data.isLoading = false;
        this.$log.d('obtained goods details!');
        this.$log.d(result);
        if (result.code === constant.OK_CODE) {
          this.$data.goodsDetail = this.process(result.data);
        } else {
          this.$Message.error(result.message);
        }
      });
    },
    process (data) {
      var attrList = [];
      data.previewImgs = [];
      if (data.imgs) {
        var imgs = data.imgs.split(',');
        for (let i = 0; i < imgs.length; i++) {
          data.previewImgs.push(
            constant.BASE_STATIC_URL[constant.ACTIVE] + imgs[i]
          );
        }
      }
      // data.imgs = [
      //   'static/img/goodsDetail/item-detail-1.jpg',
      //   'static/img/goodsDetail/item-detail-2.jpg',
      //   'static/img/goodsDetail/item-detail-3.jpg',
      //   'static/img/goodsDetail/item-detail-4.jpg'
      // ];
      var rowAttrs = [];
      for (let i = 0; i < data.attrs.length; i++) {
        if (i % 3 === 0 && i !== 0) {
          attrList.push(rowAttrs);
          rowAttrs = [];
        }
        // data.attrs[i].previewImage = 'static/img/goodsDetail/pack/' + i + '.jpg';
        data.attrs[i].previewImage =
          constant.BASE_STATIC_URL[constant.ACTIVE] + data.attrs[i].image;
        rowAttrs.push(data.attrs[i]);
      }
      if (rowAttrs.length > 0) {
        attrList.push(rowAttrs);
      }
      data.attrs = attrList;
      return data;
    }
  },
  components: {
    Search,
    ShopHeader,
    // GoodsDetailNav,
    ShowGoods,
    ShowGoodsDetail
  },
  store
};
</script>

<style scoped>
.shop-item-path {
  height: 38px;
  background-color: rgb(236, 235, 235);
  line-height: 38px;
  color: #2c2c2c;
}
.shop-nav-container {
  margin: 0px auto;
  width: 80%;
}
</style>
