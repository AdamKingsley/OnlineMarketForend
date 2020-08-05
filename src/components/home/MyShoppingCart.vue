<template>
  <div>
    <div class="goods-search">
      <div class="form-box">
        <Form ref="searchForm" :model="searchParams">
          <Row :gutter="6">
            <i-col span="4">
              <FormItem prop="username">
                <i-input
                  type="text"
                  v-model="searchParams.goodsName"
                  clearable
                  size="large"
                  placeholder="产品名匹配字段"
                >
                  <span slot="prepend">产品名</span>
                </i-input>
              </FormItem>
            </i-col>
            <i-col span="3">
              <FormItem prop="label">
                <i-input
                  type="text"
                  v-model="searchParams.label"
                  clearable
                  size="large"
                  placeholder="产品标签匹配"
                >
                  <span slot="prepend">标签</span>
                </i-input>
              </FormItem>
            </i-col>
            <i-col span="7">
              <!-- <FormItem prop="type"> -->
              <FormItem>
                <Row>
                  <i-col span="6">
                    <i-input size="large" type="text" hidden>
                      <div slot="prepend">产品类型</div>
                    </i-input>
                  </i-col>
                  <i-col span="9">
                    <Select
                      style="margin-top:1px"
                      v-model="searchParams.categoryId1"
                      size="large"
                      placeholder="一级目录"
                      @on-change="changeCategory1"
                    >
                      <Option
                        v-for="item in categoryList1"
                        :value="item.value"
                        :key="item.value"
                        >{{ item.label }}
                      </Option>
                    </Select>
                  </i-col>
                  <i-col span="9">
                    <Select
                      style="margin-top:1px"
                      v-model="searchParams.categoryId2"
                      size="large"
                      placeholder="二级目录"
                      @on-change="changeCategory2"
                    >
                      <Option
                        v-for="item in categoryList2"
                        :value="item.value"
                        :key="item.value"
                        >{{ item.label }}
                      </Option>
                    </Select>
                  </i-col>
                </Row>
              </FormItem>
            </i-col>
            <i-col span="4" class="prop-picker">
              <!-- 开始时间: -->
              <!-- @on-change="onStartTimeChange" -->
              <date-picker
                type="datetime"
                v-model="searchParams.startTime"
                placeholder="输入开始时间"
                :options="startTimeOption"
                :transfer="true"
                size="large"
                style="margin-top:1px"
              ></date-picker>
            </i-col>
            <i-col span="4" class="prop-picker">
              <!-- 结束时间: -->
              <!-- @on-change="onEndTimeChange" -->
              <date-picker
                type="datetime"
                v-model="searchParams.endTime"
                placeholder="输入结束时间"
                :options="endTimeOption"
                :transfer="true"
                size="large"
                style="margin-top:1px"
              ></date-picker>
            </i-col>
            <i-col type="flex" justify="center" span="2">
              <FormItem>
                <Button
                  shape="circle"
                  icon="ios-search"
                  @click="updateCartList"
                  type="primary"
                  size="large"
                  >查询
                </Button>
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </div>
    </div>
    <!-- <div>
      {{ shoppingCartList }}
    </div> -->
    <Table
      border
      ref="selection"
      :columns="columns"
      :data="shoppingCartList"
      size="large"
      no-data-text="您的购物车没有商品，请先添加商品到购物车再点击购买"
      @on-selection-change="changeSelection"
    ></Table>
    <div class="footer">
      <div class="page-size">
        <Page
          :total="totalNum"
          @on-change="pageNumChange"
          @on-page-size-change="pageSizeChange"
          show-sizer
          show-elevator
          show-total
        >
        </Page>
      </div>
      <div class="go-to">
        <Button @click="gotoPay" type="primary">去付款</Button>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/vuex/store';
import { mapActions } from 'vuex';
import constant from '../../util/constant';
import time from '../../util/time';
export default {
  name: 'MyShoppingCart',
  data () {
    return {
      pageSizeOpts: [10, 20, 30, 50],
      totalNum: 0,
      selectedGoods: [],
      shoppingCartList: [],
      categoryList1: [],
      categoryList2: [],
      searchParams: {
        pageSize: 10,
        pageNum: 1,
        // merchantId: null,
        // 商品上新时间 范围筛选
        startTime: '',
        endTime: '',
        // 其他筛选条件
        goodsName: '', // 商品名称
        label: '', // 商品标签
        categoryId: 0, // 商品类别
        categoryId1: 0,
        categoryId2: 0,
        orderBy: 'modify_time'
      },
      columns: [
        {
          type: 'selection',
          width: 50,
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
          width: 156,
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
          width: 400,
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
          width: 166,
          key: 'attrTitle',
          align: 'center'
        },
        {
          title: '数量',
          key: 'currentCount',
          width: 110,
          render: (h, params) => {
            const vm = this;
            return h('InputNumber', {
              props: {
                min: 1,
                size: 'large',
                value: params.row.currentCount
              },
              style: {
                width: '50px'
              },
              on: {
                input: function (value) {
                  console.log('count on change!!');
                  console.log(value);
                  console.log(params.row);
                  // self.$emit('InputNumber', value);
                  params.row.currentCount = value;
                  params.row.currentPrice =
                    (params.row.price / params.row.count) *
                    params.row.currentCount;
                  params.row.currentDiscountAmount =
                    (params.row.discountAmount / params.row.count) *
                    params.row.currentCount;
                  params.row.currentPrice = params.row.currentPrice.toFixed(2);
                  params.row.currentDiscountAmount = params.row.currentDiscountAmount.toFixed(
                    2
                  );
                  console.log(vm.$data.shoppingCartList);
                  vm.$data.shoppingCartList[params.index] = params.row;
                  console.log(vm.$data.shoppingCartList);
                  // 强制更新
                  vm.$forceUpdate();
                }
              }
            });
          },
          align: 'center'
        },
        {
          title: '价格',
          width: 120,
          key: 'currentPrice',
          align: 'center',
          render: (h, params) => {
            var price = parseFloat(params.row.currentPrice);
            var discountAmount = parseFloat(params.row.currentDiscountAmount);
            return h('div', [
              h('span', '￥' + (price - discountAmount).toFixed(2), {
                style: { color: 'red' }
              }),
              h('br'),
              h('s', '￥' + price.toFixed(2), { style: { color: 'grey' } })
            ]);
          }
        },
        {
          title: '操作',
          width: 170,
          key: 'id',
          render: (h, params) => {
            return h('div', { class: 'cell-button-container' }, [
              h(
                'Button',
                {
                  props: { type: 'success', size: 'small' },
                  style: { margin: '2px' },
                  on: {
                    click: () => {
                      this.updateCartGoods(params.row);
                    }
                  }
                },
                '确认修改'
              ),
              h(
                'Button',
                {
                  props: { type: 'error', size: 'small' },
                  style: { margin: '2px' },
                  on: {
                    click: () => {
                      this.deleteCartGoods(params.row.id);
                    }
                  }
                },
                '删除'
              )
            ]);
          },
          align: 'center'
        }
      ],
      // 时间选择器
      startTimeOption: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now();
        }
      },
      endTimeOption: {}
    };
  },
  created () {
    this.isLogin();
    this.getGategoryList({ rootId: 0 }).then(result => {
      if (result.code === constant.OK_CODE) {
        this.$log.d('category list obtained');
        this.$log.d(result);
        this.$data.categoryList1 = this.processCategoryList(result.data);
      } else {
        this.$Message.error(result.message);
      }
    });
    this.updateCartList();
  },
  methods: {
    ...mapActions([
      constant.ACTIONS.GET_SHOPPING_CART_LIST,
      constant.ACTIONS.DELETE_GOODS_FROM_CART,
      constant.ACTIONS.UPDATE_SHOPPING_CART,
      constant.ACTIONS.GET_CATEGORY_LIST,
      constant.ACTIONS.IS_LOGIN
    ]),
    changeSelection (selection) {
      this.$log.d('change selection!');
      this.$log.d(selection);
      for (let i = 0; i < selection.length.size; i++) {
        selection.price = selection.currentPrice;
        selection.discountAmount = selection.currentDiscountAmount;
        selection.count = selection.currentCount;
      }
      this.$data.selectedGoods = selection;
    },
    gotoPay () {
      // 获取页面中选中的元素，进行付款
      // 对selection进行操作
      this.$router.push({
        path: '/order',
        name: 'Order',
        params: { goodsCheckList: this.$data.selectedGoods, type: 'cart' }
      });
    },
    pageNumChange (pageNum) {
      this.$log.d('pageNum is ' + pageNum);
      this.$data.searchParams.pageNum = pageNum;
      this.updateCartList();
    },
    pageSizeChange (pageSize) {
      this.$log.d('pageSize is ' + pageSize);
      this.$data.searchParams.pageSize = pageSize;
      this.updateCartList();
    },
    updateCartGoods (data) {
      var object = JSON.parse(JSON.stringify(data));
      object.count = object.currentCount;
      this.$Loading.start();
      this.updateShoppingCart(object).then(result => {
        this.$log.d('update result is ' + result);
        if (result.code === constant.OK_CODE) {
          this.$Loading.finish();
          this.$Message.success(result.message);
          this.updateCartList();
        } else {
          this.$Message.error(result.message);
        }
      });
    },
    deleteCartGoods (id) {
      this.$Loading.start();
      this.removeGoodsFromCart(id).then(result => {
        this.$log.d('remove result is ' + result);
        if (result.code === constant.OK_CODE) {
          this.$Loading.finish();
          this.$Message.success(result.message);
          this.updateCartList();
        } else {
          this.$Message.error(result.message);
        }
      });
    },
    updateCartList () {
      var params = this.$data.searchParams;
      // 格式化时间格式
      params.startTime = params.startTime
        ? time.formatTime(params.startTime)
        : params.startTime;
      params.endTime = params.endTime
        ? time.formatTime(params.endTime)
        : params.endTime;
      this.$Loading.start();
      this.getShoppingCartList(params).then(result => {
        this.$log.d('获取购物车列表数据结果!');
        this.$log.d(result);
        this.$Loading.finish();
        if (result.code === constant.OK_CODE) {
          this.$data.shoppingCartList = this.processShoppingCart(result.data);
          this.$data.totalNum = result.totalNum;
        } else {
          this.$Message.error(result.message);
        }
      });
    },
    processShoppingCart (carts) {
      for (let i = 0; i < carts.length; i++) {
        carts[i].currentCount = carts[i].count;
        carts[i].currentPrice = carts[i].price;
        carts[i].currentDiscountAmount = carts[i].discountAmount;
      }
      return carts;
    },
    onStartTimeChange (startTime, type) {
      this.endTimeOption = {
        disabledDate (endTime) {
          return endTime < new Date(startTime);
        }
      };
    },
    onEndTimeChange (endTime, type) {
      this.startTimeOption = {
        disabledDate (startTime) {
          return startTime > new Date(endTime) || startTime > Date.now();
        }
      };
    },
    processCategoryList (data) {
      let result = [{ value: 0, label: '未选择' }];
      for (let i = 0; i < data.length; i++) {
        result.push({ value: data[i].id, label: data[i].name });
      }
      return result;
    },
    changeCategory1 (value) {
      this.$log.d('更改选择的类别');
      this.$log.d(value);
      // this.$log.d(this.$data.searchParams);
      this.$data.searchParams.categoryId = value;
      if (value) {
        this.getGategoryList({ rootId: value }).then(result => {
          if (result.code === constant.OK_CODE) {
            this.$data.categoryList2 = this.processCategoryList(result.data);
          } else {
            this.$Message.error(result.message);
          }
        });
      }
    },
    changeCategory2 (value) {
      this.$log.d('更改选择的类别');
      this.$log.d(value);
      // this.$log.d(this.$data.searchParams);
      this.$data.searchParams.categoryId =
        value || this.$data.searchParams.categoryId1;
    }
  },
  store
};
</script>

<style scoped>
.footer {
  margin: 15px 0;
  display: flex;
  justify-content: flex-end;
}
.go-to {
  margin: 15px 0 15px 15px;
}

.page-size {
  margin: 15px 0px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
<style>
div.goods-search
  div.ivu-col.ivu-col-span-7
  div.ivu-col.ivu-col-span-6
  .ivu-input.ivu-input-large {
  display: none;
}
</style>
