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
                placeholder="开始时间"
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
                placeholder="结束时间"
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
                  @click="updateOrderList"
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
      {{ orderList }}
    </div> -->
    <Table
      border
      :columns="columns"
      :data="orderList"
      size="large"
      no-data-text="你还没有订单，快点去购物吧"
    ></Table>
    <div class="page-size">
      <Page
        :total="totalNum"
        :page-size="searchParams.pageSize"
        :current="1"
        show-sizer
        show-elevator
        show-total
        :page-size-opts="pageSizeOpts"
        @on-change="pageNumChange"
        @on-page-size-change="pageSizeChange"
      ></Page>
    </div>
    <!-- @on-ok="createUser(addUserInfo)" -->

    <Modal
      scrollable
      class="order-detail-model"
      v-model="showModal"
      title="订单详情"
      @on-cancel="showModal = false"
    >
      <!-- 查看订单详情 -->
      <!-- <div class="form-box">
        <Form ref="createForm" :model="addUserInfo" :rules="userInfoRules">
          <FormItem prop="username">
            <i-input
              type="text"
              v-model="addUserInfo.username"
              clearable
              size="large"
              placeholder="用户名"
              required="true"
            >
              <Icon type="person" slot="prepend"></Icon>
            </i-input>
          </FormItem>
          <FormItem prop="password">
            <i-input
              type="password"
              v-model="addUserInfo.password"
              clearable
              size="large"
              placeholder="密码"
              required="true"
            >
              <Icon type="ios-locked-outline" slot="prepend"> </Icon>
            </i-input>
          </FormItem>
          <Row>
            <FormItem prop="type">
              <i-col span="8">
                <div class="prop-label">
                  <span slot="prepend">用户类型 :</span>
                </div>
              </i-col>
              <i-col span="16">
                <div class="prop-switch">
                  <Select v-model="addUserInfo.type">
                    <Option
                      v-for="item in userTypeList"
                      :value="item.value"
                      :key="item.value"
                      >{{ item.label }}</Option
                    >
                  </Select>
                </div>
              </i-col>
            </FormItem>
          </Row>
        </Form>
      </div> -->
      <div class="order-detail-list">
        <div>
          <div class="shop-title-icon">
            <router-link
              :to="{
                path: '/merchant',
                name: 'Merchant',
                query: { id: orderDetail.order.merchantId }
              }"
            >
              <Icon type="fireball"></Icon> <i class="fa fa-fire"></i>
              <span> {{ orderDetail.order.merchantName }} </span>
            </router-link>
          </div>
          <div class="order-code-col">
            <Row>
              <i-col class="label" span="4">
                <span>订单单号：</span>
              </i-col>
              <i-col class="content" span="20">
                <span>{{ orderDetail.order.code }}</span>
              </i-col>
            </Row>
          </div>
        </div>
        <div
          class="order-goods-detail"
          v-for="(item, index) in orderDetail.detail"
          :key="index"
        >
          <!-- <div>
            {{ item }}
          </div> -->
          <div>
            <Row>
              <i-col class="order-detail-goods-img" span="4">
                <img :src="item.imgPreview" alt="Not Found" />
              </i-col>
              <i-col span="20">
                <div class="order-detail-goods-title">
                  <div>
                    <i-col class="label" span="4">
                      商品标题：
                    </i-col>
                    <i-col class="content" span="19">
                      <span @click="gotoGoodsDetail(item.goodsId)">{{
                        item.title
                      }}</span>
                    </i-col>
                  </div>
                  <div>
                    <i-col class="label" span="4">
                      套餐标题：
                    </i-col>
                    <i-col class="content" span="19">
                      <span>{{ item.attrTitle }}</span>
                    </i-col>
                  </div>
                </div>
              </i-col>
            </Row>
          </div>
          <hr align="center" width="100%" color="#987cb9" size="1" />
          <div>
            <Row>
              <i-col span="12">
                <div class="order-detail-block">
                  <i-col class="label" span="8">
                    创建日期：
                  </i-col>
                  <i-col span="16">
                    {{ item.modifyTime }}
                  </i-col>
                </div>
              </i-col>
              <i-col span="11">
                <div class="order-detail-block">
                  <i-col class="label" span="12">
                    购买价格：
                  </i-col>
                  <i-col span="12">
                    <s>￥{{ item.price }}</s>
                    <span style="color:red"
                      >￥{{
                        (item.price - item.discountAmount).toFixed(2)
                      }}</span
                    >
                  </i-col>
                </div>
              </i-col>
            </Row>
          </div>
          <div>
            <Row>
              <i-col span="8">
                <div class="order-detail-block">
                  <i-col class="label" span="12">
                    订单状态：
                  </i-col>
                  <i-col span="12">
                    <!-- <Tag :color="item.orderStatusColor" style="margin:0">
                      {{ item.orderStatusZh }}
                    </Tag> -->
                    {{ item.orderStatusZh }}
                  </i-col>
                </div>
              </i-col>
              <i-col span="6">
                <div class="order-detail-block">
                  <i-col class="label" span="12">
                    收件人：
                  </i-col>
                  <i-col span="12">
                    <span>{{ item.name }}</span>
                  </i-col>
                </div>
              </i-col>

              <i-col span="6">
                <div class="order-detail-block">
                  <i-col class="label" span="12">
                    手机号：
                  </i-col>
                  <i-col span="12">
                    <span>{{ item.telephone }}</span>
                  </i-col>
                </div>
              </i-col>
            </Row>
          </div>
          <div class="footer">
            <Row>
              <div class="order-detail-block">
                <i-col class="label" span="4">
                  收货地址：
                </i-col>
                <i-col span="20">
                  {{ item.province + item.city + item.area + item.address }}
                  <!-- {{ item.address }} -->
                </i-col>
              </div>
            </Row>
          </div>
          <hr align="center" width="100%" color="#987cb9" size="1" />
          <div class="update-panel">
            <Row class="order-detail-block">
              <i-col span="5" style="margin-top:3px">
                <span class="label">更改订单状态：</span>
              </i-col>
              <i-col span="19">
                <div
                  v-if="item.orderStatusList && item.orderStatusList.length > 0"
                >
                  <div
                    v-for="(status, index) in item.orderStatusList"
                    :key="index"
                  >
                    <i-col span="6">
                      <Button
                        :type="status.type"
                        size="small"
                        @click="changeState(item, status)"
                      >
                        {{ status.name }}
                      </Button>
                    </i-col>
                  </div>
                </div>
                <div v-else>
                  <span>订单当前状态没有可操作的状态选项</span>
                </div>
              </i-col>
            </Row>
          </div>
        </div>
      </div>
      <!-- <div>{{ orderDetail }}</div> -->
      <p slot="footer" style="color:#f60;text-align:center"></p>
    </Modal>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import constant from '../../util/constant';
import time from '../../util/time';

export default {
  name: 'MyOrder',
  data () {
    return {
      columns: [
        {
          title: '订单号',
          key: 'code',
          width: 200,
          align: 'center'
        },
        {
          title: '店铺',
          key: 'merchantName',
          align: 'center',
          width: 136,
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
          title: '价格',
          width: 125,
          key: 'currentPrice',
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
        },
        {
          title: '收件地址',
          width: 162,
          key: 'address',
          align: 'center',
          render: (h, params) => {
            // const father = this;
            return h('div', [
              h(
                'span',
                params.row.province +
                  params.row.city +
                  params.row.area +
                  params.row.address
              )
            ]);
          }
        },
        {
          title: '收件手机号',
          width: 125,
          key: 'telephone',
          align: 'center'
        },
        {
          title: '收件人姓名',
          width: 120,
          key: 'name',
          align: 'center'
        },
        {
          title: '订单状态',
          width: 110,
          key: 'orderStatus',
          align: 'center',
          render: (h, params) => {
            // const father = this;
            // <Tag checkable color="green">标签二</Tag>
            return h('div', [
              h(
                'Tag',
                {
                  attrs: {
                    color: constant.ORDER_FINISHED_YET(params.row.orderStatus)
                      ? 'gray'
                      : '#1E90FF',
                    size: 'large'
                  }
                },
                constant.ORDER_FINISHED_YET(params.row.orderStatus)
                  ? '已完成'
                  : '进行中'
              )
            ]);
          }
        },
        {
          title: '购买时间',
          width: 180,
          key: 'modifyTime',
          align: 'center'
        },
        {
          title: '操作',
          width: 100,
          key: 'id',
          render: (h, params) => {
            return h('div', { class: 'cell-button-container' }, [
              h(
                'Button',
                {
                  props: { type: 'info', size: 'small' },
                  style: { margin: '2px' },
                  on: {
                    click: () => {
                      this.showDetailModal(params.row);
                    }
                  }
                },
                '查看详情'
              )
            ]);
          },
          align: 'center'
        }
      ],
      orderList: [],
      showModal: false,
      orderDetail: { order: {}, detail: [] },
      pageSizeOpts: [20, 50, 100, 200],
      totalNum: 0,
      searchParams: {
        pageSize: 20,
        pageNum: 1,
        merchantId: null,
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
      categoryList1: [],
      categoryList2: [],
      // goodsList: [],
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
    this.$log.d('this is customer order query management page!!!!!');
    this.$log.d(this.userInfo);
    this.updateOrderList();
    // this.$log.d(this.$data.searchParams.merchantId);
    // 设置级联category查询的数据
    this.getGategoryList({ rootId: 0 }).then(result => {
      if (result.code === constant.OK_CODE) {
        this.$log.d('category list obtained');
        this.$log.d(result);
        this.$data.categoryList1 = this.processCategoryList(result.data);
      } else {
        this.$Message.error(result.message);
      }
    });
  },
  computed: {
    ...mapState([constant.STATES.USER_INFO])
  },
  methods: {
    ...mapActions([
      constant.ACTIONS.GET_ORDER_LIST,
      constant.ACTIONS.GET_CATEGORY_LIST,
      constant.ACTIONS.GET_ORDER_DETAIL,
      constant.ACTIONS.UPDATE_ORDER_STATE,
      constant.ACTIONS.UPDATE_ORDER_INFO
    ]),
    showDetailModal (data) {
      this.$data.showModal = true;
      this.$log.d(data);
      this.$data.orderDetail = {
        order: data,
        detail: []
      };
      this.$Loading.start();
      this.getOrderDetail(data.code).then(result => {
        this.$Loading.finish();
        this.$log.d('this is obtain order detail object');
        this.$log.d(result);
        if (result.code === constant.OK_CODE) {
          this.$data.orderDetail.detail = this.processDetailList(result.data);
          this.processOrderStatusList();
        } else {
          this.$Message.error(result.message);
        }
      });
    },
    gotoGoodsDetail (id) {
      this.showDetailModal = false;
      this.$router.push({
        path: '/goodsDetail',
        name: 'GoodsDetail',
        params: { id: id }
      });
    },
    pageNumChange (pageNum) {
      this.$log.d('pageNum is ' + pageNum);
      this.$data.searchParams.pageNum = pageNum;
      this.updateOrderList();
    },
    pageSizeChange (pageSize) {
      this.$log.d('pageSize is ' + pageSize);
      this.$data.searchParams.pageSize = pageSize;
      this.updateOrderList();
    },
    updateOrderList () {
      var params = this.$data.searchParams;
      // 格式化时间格式
      params.startTime = params.startTime
        ? time.formatTime(params.startTime)
        : params.startTime;
      params.endTime = params.endTime
        ? time.formatTime(params.endTime)
        : params.endTime;
      this.$Loading.start();
      this.getOrderList(params).then(result => {
        this.$log.d('获取订单列表信息成功！');
        this.$log.d(result);
        this.$Loading.finish();
        if (result.code === constant.OK_CODE) {
          this.$data.orderList = result.data;
          this.$data.totalNum = result.totalNum;
        } else {
          this.$Message.error(result.message);
        }
      });
    },
    processDetailList (detailList) {
      var result = [];
      for (let i = 0; i < detailList.length; i++) {
        var detail = detailList[i];
        detail.orderStatusZh = constant.ORDER_STATUS_ZH[detail.orderStatus];
        detail.orderStatusColor =
          constant.ORDER_STATUS_COLOR[detail.orderStatus];
        detail.imgPreview =
          constant.BASE_STATIC_URL[constant.ACTIVE] + detail.img;
        result.push(detail);
      }
      this.$log.d(constant.ORDER_STATUS_COLOR);
      this.$log.d(constant.ORDER_STATUS_ZH);
      this.$log.d(result);
      return result;
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
    },
    processOrderStatusList () {
      // var orderStatusList = [];
      for (let i = 0; i < this.orderDetail.detail.length; i++) {
        var detail = this.orderDetail.detail[i];
        detail.orderStatusList =
          constant.ORDER_STATUS_MAP[this.userInfo.type][detail.orderStatus];
      }
    },
    changeState (item, status) {
      this.$log.d('订单详情请求更改状态！');
      this.$log.d(item);
      this.$log.d(status);
      var data = {};
      data.orderStatus = status.value;
      data.code = item.code;
      data.goodsId = item.goodsId;
      data.attrId = item.attrId;
      this.$log.d(data);
      // item.orderStatus =
      // 若要跳转
      if (status.path && status.path === '/pay') {
        this.$router.push({
          name: 'Pay',
          path: '/pay',
          params: {
            code: this.orderDetail.order.code,
            attrId: item.attrId,
            goodsId: item.goodsId
          }
        });
        return;
      }
      this.$Loading.start();
      this.updateOrderState(data).then(result => {
        this.$Loading.finish();
        // 检查是否需要更新整个order的info
        // this.checkStatus();
        if (result.code === constant.OK_CODE) {
          this.$Message.success(result.message);
          // 更改
          item.orderStatus = status.value;
          item.orderStatusList =
            constant.ORDER_STATUS_MAP[this.userInfo.type][item.orderStatus];
          this.checkStatus();
        } else {
          this.$Message.error(result.message);
        }
      });
    },
    checkStatus () {
      this.$log.d('this is check status function !!!');
      var details = this.orderDetail.detail;
      if (details) {
        var flag = true;
        for (let i = 0; i < details.length; i++) {
          if (!constant.ORDER_FINISHED_YET(details[i].orderStatus)) {
            flag = false;
            break;
          }
        }
        console.log(flag);
        if (flag) {
          this.orderDetail.order.orderStatus = constant.ORDER_STATUS.CHECK;
          // 需要更新
          var body = this.orderDetail.order;
          body.details = [];
          this.updateOrderInfo(body).then(result => {
            if (result.code === constant.OK_CODE) {
              this.$Message.success(result.message);
            } else {
              this.$Message.error(result.message);
            }
          });
        }
      }
    }
  }
};
</script>

<style scoped>
.page-size {
  margin: 15px 0px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.goods-container,
.goods-search,
.goods-page {
  margin: 15px auto;
  /* width: 80%; */
}
.goods-search button {
  width: 100%;
}

.shop-title-icon {
  font-size: 36px;
}

.shop-title-icon span {
  margin-left: 10px;
  font-size: 30px;
}

.order-code-col {
  margin: 10px 0;
  font-size: 14px;
}

.order-code-col .label {
  font-weight: bold;
}

.order-code-col .content {
  font-weight: bold;
}

.order-goods-detail {
  margin-bottom: 10px;
  border: 2px solid #96c2f1;
  background: #eff7ff;
  border-radius: 10px;
}

.order-goods-detail .order-detail-goods-img img {
  margin: 10px;
  width: 50px;
  height: 50px;
  border: 1px solid grey;
  border-radius: 5px;
}

.order-goods-detail .order-detail-goods-title {
  margin-top: 10px;
}

.order-goods-detail .order-detail-goods-title .label,
.order-detail-block .label {
  font-weight: bold;
}

.order-detail-block {
  margin: 10px;
}

.footer {
  margin-bottom: 10px;
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
