<template>
  <div>
    <div class="goods-list-container">
      <Alert show-icon class="tips-box">
        小提示
        <Icon type="ios-lightbulb-outline" slot="icon"></Icon>
        <template slot="desc"
          >请点击商品前的选择框，选择想要付款的商品，点击付款即可。</template
        >
      </Alert>
      <Table
        border
        ref="selection"
        :columns="columns"
        :data="goodsCheckList"
        size="large"
        @on-selection-change="selectGoods"
        no-data-text="当前没有商品，请先添加商品到购物车再点击购买或直接通过商品详情界面购买"
      ></Table>
      <div class="address-container">
        <h3>收货人信息</h3>
        <div class="address-box">
          <div class="address-check">
            <div class="address-check-name">
              <span
                ><Icon type="ios-checkmark-outline"></Icon>
                {{ checkAddress.name }}</span
              >
            </div>
            <div class="address-detail">
              <p>{{ checkAddress.address }}</p>
            </div>
          </div>
          <Collapse>
            <Panel>
              选择地址
              <p slot="content">
                <RadioGroup
                  vertical
                  size="large"
                  v-model="selectedAddressId"
                  @on-change="changeAddress"
                >
                  <Radio
                    :label="item.id"
                    v-for="(item, index) in addressList"
                    :key="index"
                  >
                    <span
                      >{{ item.name }} {{ item.province }} {{ item.city }}
                      {{ item.address }} {{ item.telephone }}
                      {{ item.postalCode }}</span
                    >
                  </Radio>
                </RadioGroup>
              </p>
            </Panel>
          </Collapse>
        </div>
      </div>
      <div class="remarks-container">
        <h3>备注</h3>
        <i-input
          v-model="remarks"
          size="large"
          placeholder="在这里填写备注信息"
          class="remarks-input"
        ></i-input>
      </div>
      <div class="invoices-container">
        <h3>发票信息</h3>
        <p>该商品不支持开发票</p>
      </div>
      <div class="pay-container">
        <div class="pay-box">
          <p>
            <span>提交订单应付总额：</span>
            <span class="money"
              ><Icon type="social-yen"></Icon> {{ totalPrice.toFixed(2) }}</span
            >
          </p>
          <div class="pay-btn">
            <Button @click="cancelOrder" type="info" size="large"
              >取消订单</Button
            >
            <Button @click="submitOrder" type="error" size="large">
              支付订单
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/vuex/store';
import { mapActions } from 'vuex';
import constant from '../util/constant';
export default {
  name: 'Order',
  beforeRouteEnter (to, from, next) {
    window.scrollTo(0, 0);
    next();
  },
  created () {
    this.$data.goodsCheckList = this.$route.params.goodsCheckList;
    // 根据此type判断是不是需要删除购物车中的商品
    this.$data.type = this.$route.params.type;
    this.loadAddress();
  },
  data () {
    return {
      // 订单产品列表
      goodsCheckList: [],
      // 选择要付款的订单
      selectedGoods: [],
      addressList: [],
      type: '',
      columns: [
        {
          type: 'selection',
          width: 58,
          align: 'center'
        },
        {
          title: '图片',
          key: 'img',
          width: 86,
          render: (h, params) => {
            return h('div', [
              h('img', {
                attrs: {
                  src:
                    constant.BASE_STATIC_URL[constant.ACTIVE] + params.row.img
                },
                style: {
                  width: '40px',
                  height: '40px'
                }
              })
            ]);
          },
          align: 'center'
        },
        {
          title: '店铺',
          key: 'merchantName',
          align: 'center',
          width: 180,
          render: (h, params) => {
            const father = this;
            return h('div', [
              h(
                'a',
                {
                  style: { color: 'black', 'font-weight': 'bold' },
                  on: {
                    click: function () {
                      father.$router.push({
                        name: 'Merchant',
                        path: '/merchant',
                        query: { id: params.row.merchantId }
                      });
                    }
                  }
                },
                params.row.merchantName
              )
            ]);
          }
        },
        {
          title: '标题',
          key: 'title',
          align: 'center',
          width: 450,
          render: (h, params) => {
            const father = this;
            return h('div', [
              h(
                'a',
                {
                  style: { color: 'black' },
                  on: {
                    click: function () {
                      father.$router.push({
                        name: 'GoodsDetail',
                        path: '/goodsDetail',
                        params: { id: params.row.goodsId }
                      });
                    }
                  }
                },
                params.row.title
              )
            ]);
          }
        },
        {
          title: '套餐',
          width: 260,
          key: 'attrTitle',
          align: 'center'
        },
        {
          title: '数量',
          key: 'count',
          width: 80,
          align: 'center'
        },
        {
          title: '价格',
          width: 100,
          key: 'price',
          align: 'center',
          render: (h, params) => {
            var price = parseFloat(params.row.price);
            var discountAmount = parseFloat(params.row.discountAmount);
            return h('div', [
              h(
                'span',
                { style: { color: 'red' } },
                '￥' + (price - discountAmount).toFixed(2)
              ),
              h('br'),
              h('s', { style: { color: 'grey' } }, '￥' + price.toFixed(2))
            ]);
          }
        }
      ],
      selectedAddressId: '',
      checkAddress: {
        id: null,
        name: '未选择',
        address: '请选择地址'
      },
      remarks: ''
    };
  },
  computed: {
    // ...mapState(['address', 'shoppingCart']),
    totalPrice () {
      this.$log.d('this is total price calculate function!');
      this.$log.d(this.price);
      this.$log.d(this.discountAmount);
      this.$log.d(this.price - this.discountAmount);
      return this.price - this.discountAmount;
    },
    price () {
      let price = 0;
      this.selectedGoods.forEach(item => {
        price += item.price;
        // price += item.discountAmount;
      });
      return price;
    },
    discountAmount () {
      let discountAmount = 0;
      this.selectedGoods.forEach(item => {
        discountAmount += item.discountAmount;
        // price += item.discountAmount;
      });
      return discountAmount;
    }
  },
  methods: {
    ...mapActions([
      constant.ACTIONS.GET_ADDRESS_LIST,
      constant.ACTIONS.ADD_ORDER,
      constant.ACTIONS.DELETE_GOODS_FROM_CART
    ]),
    selectGoods (selection, row) {
      this.$data.selectedGoods = selection;
      // console.log('select some goods!');
      // console.log(selection);
      // console.log(row);
      // this.goodsCheckList = selection;
    },
    changeAddress (data) {
      const father = this;
      this.addressList.forEach(item => {
        if (item.id === data) {
          father.checkAddress.id = item.id;
          father.checkAddress.name = item.name;
          father.checkAddress.address = `${item.name} ${item.province} ${item.city} ${item.address} ${item.telephone} ${item.postalCode}`;
        }
      });
    },
    loadAddress () {
      this.$Loading.start();
      this.getAddressList().then(result => {
        this.$Loading.finish();
        if (result.code === constant.OK_CODE) {
          this.addressList = result.data;
          // 默认选择列表中第一个地址
          if (this.addressList && this.addressList.length > 0) {
            this.selectedAddressId = this.addressList[0].id;
            this.changeAddress(this.addressList[0].id);
          }
        } else {
          this.$Message.error(result.message);
        }
      });
    },
    submitOrder () {
      this.$log.d('提交选中的产品订单！');
      // this.$router.push({ path: '/pay', name: 'Pay', params: {} });
      this.$log.d(this.selectedGoods);
      // 请求后端添加订单
      var body = {
        addressId: this.checkAddress.id,
        address: this.checkAddress.address,
        price: this.price,
        discountAmount: this.discountAmount,
        orderGoodsList: this.selectedGoods
      };
      this.$Loading.start();
      this.addOrder(body).then(result => {
        this.$Loading.finish();
        if (result.code === constant.OK_CODE) {
          this.$Message.success(result.message);
          if (this.type === 'cart') {
            // 如果是从购物车过来付款的，需要删除购物车中对应的物品
            for (let i = 0; i < this.selectedGoods.length; i++) {
              this.removeGoodsFromCart(this.selectedGoods[i].id);
            }
          }
          // 成功的逻辑 params存储订单号、金额等基础相关信息
          // 基于result等数据配置params
          this.$router.push({
            path: '/pay',
            name: 'Pay',
            params: { orderIds: result.data, payPrice: this.totalPrice }
          });
        } else {
          this.$Message.error(result.message);
        }
      });
    },
    cancelOrder () {
      this.$router.push('/');
    }
  },
  mounted () {
    setTimeout(() => {
      this.$refs.selection.selectAll(true);
    }, 500);
  },
  store
};
</script>

<style scoped>
.goods-list-container {
  margin: 15px auto;
  width: 80%;
}
.tips-box {
  margin-bottom: 15px;
}
.address-container {
  margin-top: 15px;
}
.address-box {
  margin-top: 15px;
  padding: 15px;
  border: 1px #ccc dotted;
}
.address-check {
  margin: 15px 0px;
  height: 36px;
  display: flex;
  align-items: center;
}
.address-check-name {
  width: 120px;
  display: flex;
  justify-content: center;
  align-content: center;
  background-color: #ccc;
}
.address-check-name span {
  width: 120px;
  height: 36px;
  font-size: 14px;
  line-height: 36px;
  text-align: center;
  color: #fff;
  background-color: #f90013;
}
.address-detail {
  padding-left: 15px;
  font-size: 14px;
  color: #999999;
}
.remarks-container {
  margin: 15px 0px;
}
.remarks-input {
  margin-top: 15px;
}
.invoices-container p {
  font-size: 12px;
  line-height: 30px;
  color: #999;
}
.pay-container {
  margin: 15px;
  display: flex;
  justify-content: flex-end;
}
.pay-box {
  font-size: 18px;
  font-weight: bolder;
  color: #495060;
}
.money {
  font-size: 26px;
  color: #f90013;
}
.pay-btn {
  margin: 15px 0px;
  display: flex;
  justify-content: flex-end;
}
.pay-btn button {
  margin-right: 20px;
}
</style>
