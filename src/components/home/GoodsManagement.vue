<template>
  <div>
    <div class="goods-search">
      <div class="form-box">
        <Form ref="searchForm" :model="searchParams">
          <Row :gutter="6">
            <i-col span="4">
              <FormItem prop="name">
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
                placeholder="上新开始时间"
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
                placeholder="上新结束时间"
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
                  @click="updateGoodsList"
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
    <Table
      border
      :columns="columns"
      :data="goodsList"
      size="large"
      no-data-text="当前条件没有查询到商品信息，快去创建商品吧！"
    ></Table>
    <div class="page-size goods-page">
      <!-- :page-size-opts="pageSizeOpts" -->
      <Page
        :total="totalNum"
        :page-size="searchParams.pageSize"
        :current="1"
        show-sizer
        show-elevator
        show-total
        @on-change="pageNumChange"
        @on-page-size-change="pageSizeChange"
      ></Page>
    </div>
    <!-- @on-ok="updateGoods" @on-cancel="showModal = false" -->
    <Modal title="更新商品信息" v-model="showModal">
      <div class="form-box">
        <Row type="flex" justify="center">
          <i-col span="24">
            <!-- {{ updateGoodsInfo }} -->
            <Form
              ref="goodsForm"
              :model="updateGoodsInfo"
              :rules="goodsInfoRules"
            >
              <!-- :default-file-list="uploaded_tmp" -->
              <FormItem>
                <div
                  class="goods-img-upload-list"
                  v-for="(item, index) in updateGoodsInfo.imgs"
                  :key="index"
                >
                  <template v-if="item">
                    <!-- <div v-if="updateGoodsInfo.imgs[index]"> -->
                    <img
                      :src="updateGoodsInfo.previewImgs[index]"
                      alt="Not Found"
                    />
                    <div class="goods-img-upload-list-cover">
                      <Icon
                        type="ios-eye-outline"
                        @click.native="
                          handleView(updateGoodsInfo.previewImgs[index])
                        "
                      ></Icon>
                      <Icon
                        type="ios-trash-outline"
                        @click.native="handleRemove(index)"
                      ></Icon>
                    </div>
                    <!-- </div> -->
                  </template>
                </div>
                <Upload
                  multiple
                  type="drag"
                  :format="['jpg', 'jpeg', 'png']"
                  :before-upload="beforeUpdateGoodsImage"
                >
                  <div style="padding: 5px 0">
                    <Icon
                      type="ios-cloud-upload"
                      size="50"
                      style="color: #3399ff"
                    ></Icon>
                    <p style="font-size:12px">拖拽或点击上传商品图片</p>
                  </div>
                </Upload>
              </FormItem>
              <FormItem label="商品名称：" prop="name">
                <i-input
                  type="text"
                  v-model="updateGoodsInfo.name"
                  clearable
                  size="large"
                  placeholder="请输入商品名称"
                >
                </i-input>
              </FormItem>
              <FormItem label="商品标签：" prop="label">
                <i-input
                  type="text"
                  v-model="updateGoodsInfo.label"
                  clearable
                  size="large"
                  placeholder="请输入商品个性化标签，英文逗号隔开"
                >
                </i-input>
              </FormItem>
              <Row>
                <i-col span="8">
                  <FormItem label="商品价格：" prop="price">
                    <InputNumber
                      style="width:80%"
                      :min="0.0"
                      :step="0.01"
                      v-model="updateGoodsInfo.price"
                    ></InputNumber>
                  </FormItem>
                </i-col>
                <i-col span="8">
                  <FormItem label="商品优惠率：" prop="discountRate">
                    <InputNumber
                      style="width:80%"
                      :max="100"
                      v-model="updateGoodsInfo.discountRate"
                      :formatter="value => `${value}%`"
                      :parser="value => parseFloat(value.replace('%', ''))"
                    ></InputNumber>
                  </FormItem>
                </i-col>
                <i-col span="8">
                  <FormItem label="商品优惠额：" prop="discountAmount">
                    <InputNumber
                      style="width:80%"
                      :min="0.0"
                      :step="0.01"
                      v-model="updateGoodsInfo.discountAmount"
                    ></InputNumber>
                  </FormItem>
                </i-col>
                <i-col span="24">
                  <Alert show-icon class="tips-box">
                    <b style="font-size:12px">小提示</b>
                    <Icon type="ios-lightbulb-outline" slot="icon"></Icon>
                    <div style="margin-top: 5px;">
                      <span>
                        商品实际价格 &nbsp;= &nbsp;商品价格&nbsp; x&nbsp; (100%
                        &nbsp;- &nbsp;商品优惠率) &nbsp;- &nbsp;商品优惠额
                      </span>
                    </div>
                    <!-- font-size:14px;font-weight:bold -->
                    <div style="margin-top: 0px;">
                      <span>
                        本商品实际价格&nbsp; =&nbsp;
                        {{ updateGoodsInfo.price }} &nbsp;x &nbsp;(100%&nbsp;
                        -&nbsp; {{ updateGoodsInfo.discountRate }}%)
                        &nbsp;-&nbsp;
                        {{ updateGoodsInfo.discountAmount }} &nbsp;= &nbsp;
                        {{
                          (
                            updateGoodsInfo.price *
                              (1 - updateGoodsInfo.discountRate / 100) -
                            updateGoodsInfo.discountAmount
                          ).toFixed(2)
                        }}
                      </span>
                    </div>
                    <div style="margin-top: 0px;">
                      <span style="color:red">
                        <b>注意：</b>
                        <span>
                          当添加套餐时，商品定价信息会与套餐中实际价格最低的数据保持一致！
                          <br />
                          且商品存库会与所有套餐库存数量之和保持一致！
                        </span>
                      </span>
                    </div>
                  </Alert>
                </i-col>
              </Row>
              <Row>
                <!-- <FormItem label="产品类型："> -->
                <i-col span="8">
                  <FormItem label="产品库存：">
                    <InputNumber
                      style="width:80%"
                      :min="0"
                      :step="1"
                      v-model="updateGoodsInfo.storeNum"
                    ></InputNumber>
                  </FormItem>
                </i-col>
                <div style="margin: 7px 0">产品类型：</div>
                <i-col span="8">
                  <Select
                    style="width:80%"
                    v-model="updateGoodsInfo.categoryId1"
                    size="large"
                    placeholder="一级目录"
                    @on-change="changeUpdateGoodsCategory1"
                  >
                    <Option
                      v-for="item in updateGoodsCategoryList1"
                      :value="item.value"
                      :key="item.value"
                      >{{ item.label }}
                    </Option>
                  </Select>
                </i-col>
                <i-col span="8">
                  <Select
                    style="width:80%"
                    v-model="updateGoodsInfo.categoryId2"
                    size="large"
                    placeholder="二级目录"
                    @on-change="changeUpdateGoodsCategory2"
                  >
                    <Option
                      v-for="item in updateGoodsCategoryList2"
                      :value="item.value"
                      :key="item.value"
                      >{{ item.label }}
                    </Option>
                  </Select>
                </i-col>
                <!-- </FormItem> -->
              </Row>

              <FormItem label="商品介绍" prop="description">
                <i-input
                  v-model="updateGoodsInfo.description"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 10 }"
                  placeholder="输入商品的相关介绍内容..."
                  style="margin-bottom: 20px"
                ></i-input>
              </FormItem>
              <hr
                v-if="updateGoodsInfo.attrs.length > 0"
                align="center"
                width="100%"
                color="gray"
                size="1"
                style="margin-bottom:20px"
              />
              <div v-for="(item, index) in updateGoodsInfo.attrs" :key="index">
                <!-- {{ item }}<br />{{ index }} -->
                <div class="goods-attr-detail">
                  <div class="attr-header">
                    <div class="attr-action">
                      <!-- <span @click="edit(index)"><Icon type="edit"></Icon> 修改</span> -->
                      <span @click="delAttr(index)"
                        ><Icon type="trash-a"></Icon> 删除</span
                      >
                    </div>
                  </div>
                  <Row>
                    <i-col span="9">
                      <Upload
                        type="drag"
                        class="attr-upload"
                        :format="['jpg', 'jpeg', 'png']"
                        :before-upload="
                          file => {
                            beforeUploadGoodsAttrImage(file, index);
                          }
                        "
                      >
                        <div
                          v-if="updateGoodsInfo.attrs[index].image"
                          class="attr-upload-div"
                        >
                          <img
                            :src="updateGoodsInfo.attrs[index].imagePreview"
                            alt=""
                          />
                        </div>
                        <div v-else class="attr-upload-div">
                          <div style="text-align:center">
                            <Icon
                              type="ios-cloud-upload"
                              size="40"
                              style="color: #3399ff; margin-bottom: 10px"
                            ></Icon>
                            <p style="font-size:10px">拖拽或点击上传商品图片</p>
                          </div>
                        </div>
                      </Upload>
                    </i-col>
                    <i-col span="15">
                      <i-col span="8">
                        <FormItem label="套餐名称：" prop="name">
                          <i-input
                            style="width:80%"
                            type="text"
                            v-model="item.title"
                            clearable
                            size="small"
                            placeholder="请输入套餐名称"
                          >
                          </i-input>
                        </FormItem>
                      </i-col>
                      <i-col span="8">
                        <FormItem label="套餐编号：" prop="code">
                          <i-input
                            style="width:80%"
                            type="text"
                            v-model="item.code"
                            clearable
                            size="small"
                            placeholder="请输入套餐编号"
                            @on-change="item.isCodeChanged = true"
                          >
                          </i-input>
                        </FormItem>
                      </i-col>
                      <i-col span="8">
                        <FormItem label="产品库存：">
                          <InputNumber
                            style="width:80%"
                            :min="0"
                            :step="1"
                            v-model="item.storeNum"
                            @on-change="item.isStoreChanged = true"
                          ></InputNumber>
                        </FormItem>
                      </i-col>
                      <i-col span="8">
                        <FormItem label="商品价格：" prop="price">
                          <InputNumber
                            style="width:80%"
                            :min="0.0"
                            :step="0.01"
                            v-model="item.price"
                            @on-change="item.isPriceChanged = true"
                          ></InputNumber>
                        </FormItem>
                      </i-col>
                      <i-col span="8">
                        <FormItem label="商品优惠率：" prop="discountRate">
                          <InputNumber
                            style="width:80%"
                            :max="100"
                            v-model="item.discountRate"
                            :formatter="value => `${value}%`"
                            :parser="
                              value => parseFloat(value.replace('%', ''))
                            "
                            @on-change="item.isPriceChanged = true"
                          ></InputNumber>
                        </FormItem>
                      </i-col>
                      <i-col span="8">
                        <FormItem label="商品优惠额：" prop="discountAmount">
                          <InputNumber
                            style="width:80%"
                            :min="0.0"
                            :step="0.01"
                            v-model="item.discountAmount"
                            @on-change="item.isPriceChanged = true"
                          ></InputNumber>
                        </FormItem>
                      </i-col>
                    </i-col>
                    <i-col span="24">
                      <Alert show-icon class="tips-box">
                        <b style="font-size:10px">小提示</b>
                        <Icon type="ios-lightbulb-outline" slot="icon"></Icon>
                        <div style="margin-top: 0px;">
                          <span>
                            套餐实际价格 &nbsp;= &nbsp;套餐价格&nbsp; x&nbsp;
                            (100% &nbsp;- &nbsp;套餐优惠率) &nbsp;-
                            &nbsp;套餐优惠额
                          </span>
                        </div>
                        <!-- font-size:14px;font-weight:bold -->
                        <div style="margin-top: 0px;">
                          <span>
                            本套餐实际价格&nbsp; =&nbsp;
                            {{ item.price }} &nbsp;x &nbsp;(100%&nbsp; -&nbsp;
                            {{ item.discountRate }}%) &nbsp;-&nbsp;
                            {{ item.discountAmount }} &nbsp;= &nbsp;
                            {{
                              (
                                item.price * (1 - item.discountRate / 100) -
                                item.discountAmount
                              ).toFixed(2)
                            }}
                          </span>
                        </div>
                      </Alert>
                    </i-col>
                  </Row>
                </div>
              </div>
            </Form>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="text" @click="showModal = false">取消修改</Button>
        <Button type="warning" @click="addGoodsAttr">添加套餐</Button>
        <Button type="primary" @click="updateGoods">确认修改</Button>
      </div>
    </Modal>
    <Modal title="查看上传图片" v-model="visible">
      <img :src="selectedImg" v-if="visible" style="width: 100%" />
    </Modal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import constant from '../../util/constant';
import time from '../../util/time';
import encryption from '../../util/encryption';

export default {
  name: 'GoodsManagement',
  beforeRouteEnter (to, from, next) {
    window.scrollTo(0, 0);
    next();
  },
  data () {
    return {
      totalNum: 0,
      searchParams: {
        pageSize: 10,
        pageNum: 1,
        merchantId: '',
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
      updateGoodsCategoryList1: [],
      updateGoodsCategoryList2: [],
      goodsList: [],
      // 时间选择器
      startTimeOption: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now();
        }
      },
      endTimeOption: {},
      columns: [
        {
          title: '图片',
          key: 'img',
          width: 86,
          render: (h, params) => {
            return h('div', [
              h('img', {
                attrs: {
                  src: params.row.imgs
                    ? constant.BASE_STATIC_URL[constant.ACTIVE] +
                      params.row.imgs.split(',')[0]
                    : 'Not Found'
                },
                style: {
                  width: '40px',
                  height: '40px',
                  'border-radius': '5px'
                }
              })
            ]);
          },
          align: 'center'
        },
        {
          title: '商品标题',
          key: 'name',
          width: 390,
          align: 'center',
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
                        params: { id: params.row.id }
                      });
                    }
                  }
                },
                params.row.name
              )
            ]);
          }
        },

        {
          title: '标签',
          key: 'label',
          align: 'center',
          width: 168
        },
        {
          title: '价格',
          width: 120,
          key: 'price',
          align: 'center'
        },
        {
          title: '库存',
          key: 'storeNum',
          width: 100,
          align: 'center'
        },
        {
          title: '已售',
          width: 100,
          key: 'saledNum',
          align: 'center'
        },
        {
          title: '更新时间',
          width: 168,
          key: 'modifyTime',
          align: 'center'
        },
        {
          title: '操作',
          width: 126,
          key: 'id',
          render: (h, params) => {
            return h('div', { class: 'cell-button-container' }, [
              h(
                'Button',
                {
                  props: { type: 'primary', size: 'small' },
                  style: { margin: '2px' },
                  on: {
                    click: () => {
                      this.showUpdateModal(params.row);
                    }
                  }
                },
                '修改'
              ),
              h(
                'Button',
                {
                  props: { type: 'error', size: 'small' },
                  style: { margin: '2px' },
                  on: {
                    click: () => {
                      this.deleteGoods(params.row.id);
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
      showModal: false,
      visible: false,
      selectedImg: '',
      updateGoodsInfo: { imgs: [], attrs: [] },
      goodsInfoRules: {}
      // updateGoodsList: {},
      // selectedImg: ''
    };
  },
  created () {
    // 设置查询参数中的merchantId参数
    this.$data.searchParams.merchantId = this.merchantInfo.id;
    // 获取searchBox中的category选择项数据
    this.getGategoryList({ rootId: 0 }).then(result => {
      if (result.code === constant.OK_CODE) {
        this.$log.d('category list obtained');
        this.$log.d(result);
        this.$data.categoryList1 = this.processCategoryList(result.data);
      } else {
        this.$Message.error(result.message);
      }
    });
    this.updateGoodsList();
  },
  computed: {
    ...mapState([constant.STATES.MERCHANT_INFO])
  },
  methods: {
    ...mapActions([
      constant.ACTIONS.GET_MERCHANT_GOODS_LIST,
      constant.ACTIONS.GET_MERCHANT_GOODS_DETAIL,
      constant.ACTIONS.GET_CATEGORY_LIST,
      constant.ACTIONS.GET_CATEGORY,
      constant.ACTIONS.UPDATE_MERCHANT_GOODS,
      constant.ACTIONS.DELETE_GOODS,
      constant.ACTIONS.DELETE_GOODS_ATTR,
      constant.ACTIONS.ADD_GOODS,
      constant.ACTIONS.IS_UPLOAD,
      constant.ACTIONS.UPLOAD_GOODS_IMGS,
      constant.ACTIONS.UPLOAD_GOODS_ATTR_IMAGE
    ]),
    updateGoods () {
      this.preprocessGoodsInfo();
      this.$log.d('更新商品信息function执行中！！！');
      this.$log.d(this.updateGoodsInfo);
      this.$Loading.start();
      this.updateMerchantGoods(this.updateGoodsInfo).then(result => {
        this.$Loading.finish();
        if (result.code === constant.OK_CODE) {
          this.$Message.success(result.message);
          // 更新成功！
          this.updateGoodsList();
          this.$data.showModal = false;
        } else {
          this.$Message.error(result.message);
        }
      });
    },
    preprocessGoodsInfo () {
      // 确立good的最终显示的最低价
      // 遍历所有的attrs然后设置upload的price,discountAmount和discountRate
      if (this.updateGoodsInfo.attrs.length === 0) {
        return;
      }
      this.updateGoodsInfo.categoryId =
        this.updateGoodsInfo.categoryId2 === 0
          ? this.updateGoodsInfo.categoryId1
          : this.updateGoodsInfo.categoryId2;
      // var price = this.updateGoodsInfo.price;
      // var discountAmount = this.updateGoodsInfo.discountAmount;
      // var discountRate = this.updateGoodsInfo.discountRate;
      var price = this.updateGoodsInfo.attrs[0].price;
      var discountAmount = this.updateGoodsInfo.attrs[0].discountAmount;
      var discountRate = this.updateGoodsInfo.attrs[0].discountRate;
      var actualPrice = price * (1 - discountRate / 100) - discountAmount;
      var storeNum = 0;
      for (let i = 0; i < this.updateGoodsInfo.attrs.length; i++) {
        var attr = this.updateGoodsInfo.attrs[i];
        storeNum += attr.storeNum;
        var attrActualPrice =
          attr.price * (1 - attr.discountRate / 100) - attr.discountAmount;
        attr.actualPrice = attrActualPrice;
        if (attrActualPrice < actualPrice) {
          price = attr.price;
          actualPrice = attrActualPrice;
          discountAmount = attr.discountAmount;
          discountRate = attr.discountRate;
        }
      }
      this.updateGoodsInfo.storeNum = storeNum;
      this.updateGoodsInfo.price = price;
      this.updateGoodsInfo.discountAmount = discountAmount;
      this.updateGoodsInfo.discountRate = discountRate;
      this.updateGoodsInfo.actualPrice = actualPrice;
    },
    delAttr (index) {
      this.$Loading.start();
      this.removeGoodsAttr(this.updateGoodsInfo.attrs[index].id).then(
        result => {
          this.$Loading.finish();
          if (result.code === constant.OK_CODE) {
            this.$Message.success(result.message);
            // 删除成功！
            this.updateGoodsInfo.attrs.splice(index, 1);
          } else {
            this.$Message.error(result.message);
          }
        }
      );
    },
    handleView (url) {
      this.selectedImg = url;
      this.visible = true;
    },
    handleRemove (index) {
      this.updateGoodsInfo.imgs.splice(index, 1);
      this.updateGoodsInfo.previewImgs.splice(index, 1);
      this.updateGoodsInfo.md5.splice(index, 1);
    },
    showUpdateModal (data) {
      this.$log.d('this is showing update modal function!!!');
      this.$log.d(data);
      this.$data.showModal = true;
      // 请求后台获取商品详情，
      // 并开始渲染商品信息
      this.$Loading.start();

      this.getMerchantGoodsDetail(data.id).then(result => {
        this.$Loading.finish();
        if (result.code === constant.OK_CODE) {
          this.$log.d('this is obtain merchant goods detail function!!!!');
          this.$log.d(result);
          this.updateGoodsInfo = result.data;
          this.processUpdateGoodsInfo();

          this.processUpdateGoodsCategory();
        } else {
          this.$Message.error(result.message);
        }
      });
    },
    processUpdateGoodsInfo () {
      if (this.updateGoodsInfo.imgs) {
        var images = [];
        var previewImgs = [];
        var md5s = [];
        var imgs = this.updateGoodsInfo.imgs.split(',');
        for (let i = 0; i < imgs.length; i++) {
          images.push(imgs[i]);
          previewImgs.push(constant.BASE_STATIC_URL[constant.ACTIVE] + imgs[i]);
          md5s.push('');
        }
        this.updateGoodsInfo.imgs = images;
        this.updateGoodsInfo.previewImgs = previewImgs;
        this.updateGoodsInfo.md5s = md5s;
      }
      if (!this.updateGoodsInfo.attrs) {
        this.updateGoodsInfo.attrs = [];
      } else {
        for (let i = 0; i < this.updateGoodsInfo.attrs.length; i++) {
          this.updateGoodsInfo.attrs[i].imagePreview =
            constant.BASE_STATIC_URL[constant.ACTIVE] +
            this.updateGoodsInfo.attrs[i].image;
        }
      }
    },
    // this.processUpdateGoodsCategory();
    processUpdateGoodsCategory () {
      // 根据this.updateGoodsInfo来确定展示的两个选择框信息
      var categoryId = this.updateGoodsInfo.categoryId;
      // const father = this;
      this.getGategoryList({ rootId: 0 }).then(result => {
        if (result.code === constant.OK_CODE) {
          this.updateGoodsCategoryList1 = this.processCategoryList(result.data);
          // 确定List1后，首先判断categoryId1是否存在于其中
          if (this.containCategory(this.updateGoodsCategoryList1, categoryId)) {
            // 若存在
            this.updateGoodsInfo.categoryId1 = categoryId;
            this.updateGoodsInfo.categoryId2 = 0;
            this.updateGoodsInfo.categoryId = this.updateGoodsInfo.categoryId1;
          } else {
            this.getCategory(categoryId).then(result2 => {
              if (result2.code === constant.OK_CODE) {
                // var data = result2.data;
                this.updateGoodsInfo.categoryId1 = result2.data.parentId;
                this.updateGoodsInfo.categoryId2 = result2.data.id;
                this.updateGoodsInfo.categoryId = result2.data.id;
                this.getGategoryList({
                  rootId: this.updateGoodsInfo.categoryId1
                }).then(result3 => {
                  if (result3.code === constant.OK_CODE) {
                    this.updateGoodsCategoryList2 = this.processCategoryList(
                      result3.data
                    );
                  } else {
                    this.$Message.error(result3.message);
                  }
                });
              } else {
                this.$Message.error(result2.message);
              }
            });
            // 若不存在，查询后台该ID的parentId是谁，从中找到对应的list1中的元素选中
          }
        } else {
          this.$Message.error(result.message);
        }
      });
    },
    // 辅助上述方法的方法
    containCategory (list, value) {
      var flag = false;
      for (let i = 0; i < list.length; i++) {
        if (value === list[i].value) {
          flag = true;
          break;
        }
      }
      return flag;
    },

    deleteGoods (id) {
      this.$Loading.start();
      this.removeGoods(id).then(result => {
        this.$Loading.finish();
        if (result.code === constant.OK_CODE) {
          this.$Message.success(result.message);
          this.updateGoodsList();
        } else {
          this.$Message.error(result.message);
        }
      });
    },
    deleteGoodsAttr (id) {
      this.$Loading.start();
      this.removeGoodsAttr(id).then(result => {
        this.$Loading.finish();
        if (result.code === constant.OK_CODE) {
          this.$Message.success(result.message);
          // this.updateGoodsList();
        } else {
          this.$Message.error(result.message);
        }
      });
    },
    pageNumChange (pageNum) {
      this.$log.d('pageNum is ' + pageNum);
      this.$data.searchParams.pageNum = pageNum;
      this.updateGoodsList();
    },
    pageSizeChange (pageSize) {
      this.$log.d('pageSize is ' + pageSize);
      this.$data.searchParams.pageSize = pageSize;
      this.updateGoodsList();
    },
    updateGoodsList () {
      var params = this.$data.searchParams;
      // 格式化时间格式
      params.startTime = params.startTime
        ? time.formatTime(params.startTime)
        : params.startTime;
      params.endTime = params.endTime
        ? time.formatTime(params.endTime)
        : params.endTime;
      this.$Loading.start();
      this.getMerchantGoodsList(params).then(result => {
        this.$log.d('获取商品列表数据结果!');
        this.$log.d(result);
        this.$Loading.finish();
        if (result.code === constant.OK_CODE) {
          this.$data.goodsList = result.data;
          this.$data.totalNum = result.totalNum;
        } else {
          this.$Message.error(result.message);
        }
      });
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
      this.$data.searchParams.categoryId2 = 0;
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
    changeUpdateGoodsCategory1 (value) {
      this.$log.d('更改选择的类别');
      this.$log.d(value);
      // this.$log.d(this.$data.searchParams);
      this.$data.updateGoodsInfo.categoryId = value;
      this.$data.updateGoodsInfo.categoryId2 = 0;
      if (value) {
        this.getGategoryList({ rootId: value }).then(result => {
          if (result.code === constant.OK_CODE) {
            this.$data.updateGoodsCategoryList2 = this.processCategoryList(
              result.data
            );
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
    changeUpdateGoodsCategory2 (value) {
      this.$log.d('更改选择的类别');
      this.$log.d(value);
      // this.$log.d(this.$data.searchParams);
      this.$data.updateGoodsInfo.categoryId =
        value || this.$data.updateGoodsInfo.categoryId1;
    },
    beforeUpdateGoodsImage (file) {
      // console.log(file);
      // 预览
      if (!constant.IS_IMAGE(file.name)) {
        this.$Message.error('仅支持图片格式文件上传！');
        return;
      }
      let reader = new FileReader();

      // 读取操作结束时触发
      reader.onloadend = ev => {
        // 赋值给vue对象属性
        encryption.md5.fileMd5(file, md5Val => {
          this.checkUpload(md5Val).then(result => {
            // this.updateGoodsInfo.previewImgs.push(ev.target.result);
            // this.updateGoodsInfo.md5s.push(md5Val);
            this.$log.d('before avatar upload funciton！！！');
            this.$log.d(file);
            // var length = this.updateGoodsInfo.imgs.length;
            if (result.code === constant.OK_CODE && result.data) {
              // code = 200 且data有数据，表示后台有该文件
              // 直接赋值
              this.updateGoodsInfo.previewImgs.push(ev.target.result);
              this.updateGoodsInfo.md5s.push(md5Val);
              this.updateGoodsInfo.imgs.push(result.data);

              // this.updateGoodsInfo.imgs[length - 1] = result.data;
              this.$Message.success('后台已存在对应图片，默认选中！');
            } else {
              // 执行上传操作
              this.uploadGoodsImgs({ file: file, md5: md5Val }).then(
                result2 => {
                  if (result2.code === constant.OK_CODE) {
                    this.$Message.success('上传图片成功！');
                    this.updateGoodsInfo.previewImgs.push(ev.target.result);
                    this.updateGoodsInfo.md5s.push(md5Val);
                    this.updateGoodsInfo.imgs.push(result2.data);
                    // this.updateGoodsInfo.imgs[length - 1] = result2.data;
                  } else {
                    // this.updateGoodsInfo.imgs.push(null);
                    this.$Message.error(result2.message);
                  }
                }
              );
            }
          });
        });
      };
      // 开始读取文件内容
      reader.readAsDataURL(file);
      return false;
    },
    beforeUploadGoodsAttrImage (file, index) {
      this.$log.d('beforeUploadGoodsAttrImage function!');
      this.$log.d(file);
      this.$log.d(index);
      if (!constant.IS_IMAGE(file.name)) {
        this.$Message.error('仅支持图片格式文件上传！');
        return;
      }
      let reader = new FileReader();
      // 读取操作结束时触发
      reader.onloadend = ev => {
        // 赋值给vue对象属性
        encryption.md5.fileMd5(file, md5Val => {
          this.checkUpload(md5Val).then(result => {
            this.updateGoodsInfo.attrs[index].imagePreview = ev.target.result;
            this.updateGoodsInfo.attrs[index].image = null;
            this.updateGoodsInfo.attrs[index].md5 = md5Val;
            this.$log.d('before attr upload funciton！！！');
            // this.$log.d(file);
            // var length = this.updateGoodsInfo.imgs.length;
            if (result.code === constant.OK_CODE && result.data) {
              // code = 200 且data有数据，表示后台有该文件
              // 直接赋值
              this.updateGoodsInfo.attrs[index].image = result.data;
              this.$Message.success('后台已存在对应图片，默认选中！');
            } else {
              // 执行上传操作
              this.uploadGoodsImgs({ file: file, md5: md5Val }).then(
                result2 => {
                  if (result2.code === constant.OK_CODE) {
                    this.updateGoodsInfo.attrs[index].image = result2.data;
                    this.$Message.success('上传图片成功！');
                  } else {
                    this.$Message.error(result2.message);
                  }
                }
              );
            }
          });
        });
      };
      // 开始读取文件内容
      reader.readAsDataURL(file);
      return false;
    },
    addGoodsAttr () {
      this.$log.d('here is the add goods attr function!!!');
      this.$data.updateGoodsInfo.attrs.push({
        title: '',
        image: '',
        md5: '',
        imagePreview: '',
        code: '',
        price: 0,
        discountAmount: 0,
        discountRate: 0,
        storeNum: 0,
        description: ''
      });
      this.$log.d(this.$data.updateGoodsInfo);
      // this.$forceUpdate();
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

/* .ivu-modal-body {
  width: 1000px;
} */

.attr-upload {
  margin: 10px;
}
.attr-upload-div {
  padding: 10px 10px;
  width: 100x;
  height: 100px;
  margin: 10px 10px;
  /*flex 布局*/
  display: flex;
  /*实现垂直居中*/
  align-items: center;
  /*实现水平居中*/
  justify-content: center;
  text-align: justify;
}

.goods-attr-detail {
  margin-bottom: 10px;
  border: 5px solid #96c2f1;
  background: #eff7ff;
  border-radius: 10px;
}

.attr-action span {
  margin-left: 15px;
  font-size: 14px;
  color: #2d8cf0;
  cursor: pointer;
}

.attr-header {
  height: 35px;
  display: flex;
  justify-content: space-between;
  color: #232323;
  font-size: 18px;
}

.goods-img-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.goods-img-upload-list img {
  width: 100%;
  height: 100%;
}
.goods-img-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.goods-img-upload-list:hover .goods-img-upload-list-cover {
  display: block;
}
.goods-img-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}

.ivu-form-item {
  font-size: 5px;
  margin-bottom: 5px;
}

.tips-box div {
  margin: 0;
  font-size: 5px;
}

.attr-upload-div img {
  width: 70px;
  height: 70px;
  border: 1px solid;
  border-radius: 10px;
  transition: 0.5s;
  -webkit-transition: 0.5s;
  -moz-transition: 0.5s;
  -ms-transition: 0.5s;
  -o-transition: 0.5s;
  -webkit-box-shadow: 0px 3px 5px #3399ff;
  box-shadow: 0px 3px 5px #3399ff;
}
</style>
