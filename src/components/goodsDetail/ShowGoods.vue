<template>
  <div>
    <div class="item-detail-show">
      <div class="item-detail-left">
        <div class="item-detail-big-img">
          <img :src="goodsDetail.previewImgs[imgIndex]" alt="" />
        </div>
        <div class="item-detail-img-row">
          <div
            class="item-detail-img-small"
            v-for="(item, index) in goodsDetail.previewImgs"
            :key="index"
            @mouseover="showBigImg(index)"
          >
            <img :src="item" alt="" />
          </div>
        </div>
      </div>
      <div class="item-detail-right">
        <div class="item-detail-title">
          <p>
            <!-- <span class="item-detail-express">校园配送</span> -->
            {{ goodsDetail.name }}
          </p>
        </div>
        <!-- <div class="item-detail-tag">
          <p>
            <span v-for="(item, index) in goodsInfo.tags" :key="index"
              >【{{ item }}】</span
            >
          </p>
        </div> -->
        <div class="item-detail-price-row">
          <div class="item-price-left">
            <div class="item-price-row">
              <p>
                <span class="item-price-title">价格</span>
                <span class="item-price">￥{{ actualPrice.toFixed(2) }}</span>
                <s class="item-price-del">￥{{ price.toFixed(2) }}</s>
              </p>
            </div>
            <!-- <div class="item-price-row">
              <p>
                <span class="item-price-title">优 惠 价</span>
                <span
                  class="item-price-full-cut"
                  v-for="(item, index) in goodsInfo.discount"
                  :key="index"
                  >{{ item }}</span
                >
              </p>
            </div> -->
            <!-- <div class="item-price-row">
              <p>
                <span class="item-price-title"
                  >促&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;销</span
                >
                <span
                  class="item-price-full-cut"
                  v-for="(item, index) in goodsInfo.promotion"
                  :key="index"
                  >{{ item }}</span
                >
              </p>
            </div> -->
          </div>
          <div class="item-price-right">
            <div class="item-remarks-sum">
              <!-- <p>累计评价</p>
              <p>
                <span class="item-remarks-num"
                  >{{ goodsInfo.remarksNum }} 条</span
                >
              </p> -->
            </div>
          </div>
        </div>
        <!-- 选择颜色 -->
        <div class="item-select">
          <div class="item-select-title">
            <p>选择款式</p>
          </div>
          <div class="item-select-column">
            <div
              class="item-select-row"
              v-for="(items, index) in goodsDetail.attrs"
              :key="index"
            >
              <div
                class="item-select-box"
                v-for="(item, index1) in items"
                :key="index1"
                @click="select(index, index1)"
                :class="{
                  'item-select-box-active':
                    index * 3 + index1 === selectBoxIndex
                }"
              >
                <div class="item-select-img">
                  <img :src="item.previewImage" alt="" />
                </div>
                <div class="item-select-intro">
                  <p>{{ item.title }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
        <div class="add-buy-car-box">
          <div class="add-buy-car">
            <InputNumber :min="1" v-model="count" size="large"></InputNumber>
            <Button
              :disabled="disabled"
              type="error"
              size="large"
              @click="addShoppingCartBtn()"
              >加入购物车</Button
            >
            <Button
              :disabled="disabled"
              type="success"
              size="large"
              @click="gotoPay"
            >
              立即购买
            </Button>
            <div v-if="disabled">
              <Alert type="warning" style="margin-top:20px">
                <b>
                  提醒：
                </b>
                <template slot="desc">
                  <span style="margin-top:10px">
                    该商品售罄或已下架，如果问题请联系商家
                  </span>
                </template>
              </Alert>
            </div>
          </div>
        </div>
        <!-- <div>
          goodsDetail:{{ goodsDetail }}<br />
          price:{{ price }}<br />
          count:{{ count }}<br />
          selectBoxIndex:{{ selectBoxIndex }}<br />
          selectedGoods:{{ selectedGoods }}<br />
          merchantInfo:{{ merchantInfo }}<br />
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/vuex/store';
import { mapActions, mapState } from 'vuex';
import constant from '../../util/constant';
export default {
  name: 'ShowGoods',
  data () {
    return {
      price: 0,
      actualPrice: 0,
      count: 1,
      selectBoxIndex: 0,
      imgIndex: 0,
      selectedGoods: {},
      merchantInfo: {},
      disabled: false
    };
  },
  props: ['goodsDetail'],
  created () {
    this.$log.d('this is show goods component!');
    this.$log.d(this.$props.goodsDetail);
    // this.$data.price = this.$props.goodsDetail.price;
    // this.select(0, 0);
  },
  computed: {
    ...mapState([constant.STATES.USER_INFO, constant.STATES.MERCHANT_INFO])
  },
  watch: {
    goodsDetail: {
      handler (val) {
        this.goodsDetail = val;
        this.price = val.price;
        this.actualPrice =
          val.price * (1 - val.discountRate / 100.0) - val.discountAmount;
        if (val.attrs && val.attrs.length > 0) {
          this.select(0, 0);
          // this.price = val.attrs[0][0].price;
        }
        this.getMerchant(val.merchantId).then(result => {
          if (result.code === constant.OK_CODE) {
            this.$data.merchantInfo = result.data;
            this.$log.d('obtain merchant!');
            this.$log.d(result);
          } else {
            this.$Message.error(result.message);
          }
        });
      },
      deep: true
    }
  },
  methods: {
    ...mapActions([
      constant.ACTIONS.ADD_SHOPPING_CART,
      constant.ACTIONS.GET_MERCHANT
    ]),
    select (index1, index2) {
      this.$log.d('enter select function!');
      this.$log.d(this.goodsDetail);
      this.$log.d(index1, index2);
      this.$log.d(this.$data);
      this.selectBoxIndex = index1 * 3 + index2;
      var attr = this.goodsDetail.attrs[index1][index2];
      this.price = attr.price;
      this.actualPrice =
        attr.price * (1 - attr.discountRate / 100.0) - attr.discountAmount;
      if (
        !this.goodsDetail.attrs[index1][index2].selective ||
        !this.goodsDetail.selective
      ) {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
    },
    showBigImg (index) {
      this.imgIndex = index;
    },
    addShoppingCartBtn () {
      const index1 = parseInt(this.selectBoxIndex / 3);
      const index2 = this.selectBoxIndex % 3;
      const data = {
        goods_id: this.goodsDetail.id,
        title: this.goodsDetail.name,
        count: this.count,
        img: this.goodsDetail.imgs[0],
        merchantId: this.goodsDetail.merchantId
      };
      // 若有款式选择
      if (this.goodsDetail.attrs && this.goodsDetail.attrs.length > 0) {
        data.attrTitle = this.goodsDetail.attrs[index1][index2].title;
        data.attrId = this.goodsDetail.attrs[index1][index2].id;
        data.attrCode = this.goodsDetail.attrs[index1][index2].code;
        data.img = this.goodsDetail.attrs[index1][index2].image;
      }
      this.addShoppingCart(data).then(result => {
        if (result.code === constant.OK_CODE) {
          this.$log.d('obtian add shopping cart operation response!');
          this.$log.d(result);
          this.$Message.success(result.message);
        } else {
          this.$Message.error(result.message);
        }
      });
      // this.$router.push('/shoppingCart');
    },
    gotoPay () {
      if (this.userInfo.type !== constant.USER_TYPE.CUSTOMER) {
        this.$Message.error('购买商品仅支持消费者操作！');
        return;
      }
      var selectedGoods = {};
      // 构造对应的数据
      selectedGoods.title = this.goodsDetail.name;
      selectedGoods.count = parseInt(this.$data.count);
      selectedGoods.goodsId = this.goodsDetail.id;
      selectedGoods.merchantId = this.goodsDetail.merchantId;
      selectedGoods.merchantName = this.merchantInfo.name;
      var amount = 0;
      var rate = 0;
      // 设置钱相关
      if (this.goodsDetail.attrs && this.goodsDetail.attrs.length > 0) {
        const index1 = parseInt(this.selectBoxIndex / 3);
        const index2 = this.selectBoxIndex % 3;
        // const price = this.goodsDetail.attrs[index1][index2].price;
        amount = this.goodsDetail.attrs[index1][index2].discountAmount;
        rate = this.goodsDetail.attrs[index1][index2].discountRate;
        selectedGoods.img = this.goodsDetail.attrs[index1][index2].image;
        selectedGoods.attrId = this.goodsDetail.attrs[index1][index2].id;
        selectedGoods.attrTitle = this.goodsDetail.attrs[index1][index2].title;
      } else {
        amount = this.goodsDetail.discountAmount;
        rate = this.goodsDetail.discountRate;
        selectedGoods.img = this.goodsDetail.imgs[0];
      }
      selectedGoods.price = this.$data.price * this.$data.count;
      var discountAmount = amount * this.$data.count;
      // 折后减
      discountAmount =
        selectedGoods.price -
        (selectedGoods.price * (1 - rate / 100) - discountAmount);
      selectedGoods.price = parseFloat(selectedGoods.price.toFixed(2));
      selectedGoods.discountAmount = parseFloat(discountAmount.toFixed(2));
      this.$data.selectedGoods = selectedGoods;
      this.$router.push({
        path: '/order',
        name: 'Order',
        params: { goodsCheckList: [this.$data.selectedGoods], type: 'detail' }
      });
    }
  },
  store
};
</script>

<style scoped>
/******************商品图片及购买详情开始******************/
.item-detail-show {
  width: 64%;
  margin: 15px auto;
  display: flex;
  flex-direction: row;
  background-color: #fff;
}
.item-detail-left {
  width: 350px;
  margin-right: 30px;
}
.item-detail-big-img {
  width: 350px;
  height: 350px;
  box-shadow: 0px 0px 8px #ccc;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.item-detail-big-img img {
  width: 100%;
}
.item-detail-img-row {
  margin-top: 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.item-detail-img-small {
  width: 68px;
  height: 68px;
  box-shadow: 0px 0px 8px #ccc;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.item-detail-img-small img {
  width: 100%;
}
/*商品选购详情*/
.item-detail-right {
  display: flex;
  flex-direction: column;
}
.item-detail-title p {
  color: #666;
  font-size: 20px;
}
.item-detail-express {
  font-size: 14px;
  padding: 2px 3px;
  border-radius: 3px;
  background-color: #e4393c;
  color: #fff;
}
/*商品标签*/
.item-detail-tag {
  font-size: 12px;
  color: #e4393c;
}
/*价格详情等*/
.item-detail-price-row {
  padding: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: #f3f3f3;
}
.item-price-left {
  display: flex;
  flex-direction: column;
}
.item-price-title {
  color: #999999;
  font-size: 14px;
  margin-right: 15px;
}
.item-price-row {
  margin: 5px 0px;
}
.item-price {
  color: #e4393c;
  font-size: 23px;
  cursor: pointer;
}
item-price-del {
  margin-left: 10px;
  color: gray;
  font-size: 20px;
  cursor: pointer;
}
.item-price-full-cut {
  margin-right: 5px;
  padding: 3px;
  color: #e4393c;
  font-size: 12px;
  background-color: #ffdedf;
  border: 1px dotted #e4393c;
  cursor: pointer;
}
.item-remarks-sum {
  padding-left: 8px;
  border-left: 1px solid #ccc;
}
.item-remarks-sum p {
  color: #999999;
  font-size: 12px;
  line-height: 10px;
  text-align: center;
}
.item-remarks-num {
  line-height: 18px;
  color: #005eb7;
}
.item-select {
  display: flex;
  flex-direction: row;
  margin-top: 15px;
}
.item-select-title {
  color: #999999;
  font-size: 14px;
  margin-right: 15px;
}
.item-select-column {
  display: flex;
  flex-direction: column;
}
.item-select-row {
  display: flex;
  flex-direction: row;
  margin-bottom: 8px;
}
.item-select-box {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.item-select-img {
  width: 36px;
}
.item-select-box {
  padding: 5px;
  margin-right: 8px;
  background-color: #f7f7f7;
  border: 0.5px solid #ccc;
  cursor: pointer;
}
.item-select-box:hover {
  border: 0.5px solid #e3393c;
}
.item-select-box-active {
  border: 0.5px solid #e3393c;
}
.item-select-img img {
  width: 100%;
}
.item-select-intro p {
  margin: 0px;
  padding: 5px;
}
.item-select-class {
  padding: 5px;
  margin-right: 8px;
  background-color: #f7f7f7;
  border: 0.5px solid #ccc;
  cursor: pointer;
}
.item-select-class:hover {
  border: 0.5px solid #e3393c;
}
.add-buy-car-box {
  width: 100%;
  margin-top: 15px;
  border-top: 1px dotted #ccc;
}
.add-buy-car {
  margin-top: 15px;
}
/******************商品图片及购买详情结束******************/
</style>
