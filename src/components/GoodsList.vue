<template>
  <div>
    <Search></Search>
    <!-- <GoodsListNav></GoodsListNav> -->
    <div class="container">
      <div class="bread-crumb">
        <Breadcrumb>
          <BreadcrumbItem to="/">
            <Icon type="ios-home-outline"></Icon> 首页
          </BreadcrumbItem>
          <BreadcrumbItem to="/goodsList?sreachData=">
            <Icon type="bag"></Icon> {{ searchItem }}
          </BreadcrumbItem>
        </Breadcrumb>
      </div>

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
      <!-- 商品标签导航 -->
      <!-- <GoodsClassNav></GoodsClassNav> -->
      <!-- 商品展示容器 -->
      <div class="goods-box">
        <div class="goods-list-box">
          <!-- <div class="goods-list-tool">
            <ul>
              <li
                v-for="(item, index) in goodsTool"
                :key="index"
                @click="orderBy(item.en, index)"
              >
                <span :class="{ 'goods-list-tool-active': isAction[index] }"
                  >{{ item.title }} <Icon :type="icon[index]"></Icon
                ></span>
              </li>
            </ul>
          </div> -->
          <div class="goods-list">
            <div
              class="goods-show-info"
              v-for="(item, index) in goodsList"
              :key="index"
            >
              <div class="goods-show-img">
                <router-link
                  :to="{
                    path: '/goodsDetail',
                    name: 'GoodsDetail',
                    params: { id: item.id }
                  }"
                  ><img :src="item.imagePreview"
                /></router-link>
              </div>
              <div class="goods-show-price">
                <span>
                  <Icon type="social-yen text-danger"></Icon>
                  <span class="seckill-price text-danger">{{
                    item.price
                  }}</span>
                </span>
              </div>
              <div class="goods-show-name">
                <span>{{ item.name }}</span>
              </div>
              <div class="goods-show-detail">
                <span>{{ item.description }}</span>
              </div>
              <!-- <div class="goods-show-num">
                已有<span>{{ item.remarks }}</span
                >人评价
              </div> -->
              <div class="goods-show-seller">
                <span>{{ item.merchantName }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="goods-page">
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
    </div>
    <!-- <Spin size="large" fix v-if="isLoading"></Spin> -->
  </div>
</template>

<script>
import Search from '@/components/Search';
import store from '@/vuex/store';
import { mapActions } from 'vuex';
import constant from '../util/constant';
import time from '../util/time';

export default {
  name: 'GoodsList',
  beforeRouteEnter (to, from, next) {
    window.scrollTo(0, 0);
    next();
  },
  data () {
    return {
      searchItem: '',
      isAction: [true, false, false],
      icon: ['arrow-up-a', 'arrow-down-a', 'arrow-down-a'],
      goodsTool: [
        { title: '综合', en: 'sale' },
        { title: '评论数', en: 'remarks' },
        { title: '价格', en: 'price' }
      ],
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
      endTimeOption: {},
      goodsList: []
    };
  },
  methods: {
    ...mapActions([
      constant.ACTIONS.GET_GOODS_LIST,
      constant.ACTIONS.GET_CATEGORY_LIST
    ]),
    orderBy (data, index) {
      console.log(data);
      this.icon = ['arrow-down-a', 'arrow-down-a', 'arrow-down-a'];
      this.isAction = [false, false, false];
      this.isAction[index] = true;
      this.icon[index] = 'arrow-up-a';
      this.SET_GOODS_ORDER_BY(data);
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
      this.getGoodsList(params).then(result => {
        this.$log.d('获取商品列表数据结果!');
        this.$log.d(result);
        if (result.code === constant.OK_CODE) {
          this.$data.goodsList = result.data;
          this.$data.totalNum = result.totalNum;
          this.processPreviewImage();
        } else {
          this.$Message.error(result.message);
        }
      });
    },
    processPreviewImage () {
      for (let i = 0; i < this.$data.goodsList.length; i++) {
        var imgs = this.$data.goodsList[i].imgs;
        if (imgs) {
          this.$data.goodsList[i].imagePreview =
            constant.BASE_STATIC_URL[constant.ACTIVE] + imgs.split(',')[0];
        }
      }
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
  created () {
    this.$data.searchParams.goodsName =
      this.$route.query && this.$route.query.name ? this.$route.query.name : '';
    this.updateGoodsList();
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
  // mounted () {
  //   this.searchItem = this.$route.query.sreachData;
  // },
  components: {
    Search
  },
  store
};
</script>

<style scoped>
.container {
  margin: 15px auto;
  width: 93%;
  min-width: 1000px;
}
.text-danger {
  color: #a94442;
}
.seckill-price {
  margin-right: 5px;
  font-size: 25px;
  font-weight: bold;
}
.goods-box {
  display: flex;
}
.bread-crumb {
  margin-left: 10%;
}
/* ---------------商品栏开始------------------- */
.goods-list-box {
  margin-left: 10%;
  width: 80%;
}
.goods-list-tool {
  width: 100%;
  height: 38px;
  border: 1px solid #ccc;
  background-color: #f1f1f1;
}
.goods-list-tool ul {
  padding-left: 15px;
  list-style: none;
}
.goods-list-tool li {
  cursor: pointer;
  float: left;
}
.goods-list-tool span {
  padding: 5px 8px;
  border: 1px solid #ccc;
  border-left: none;
  line-height: 36px;
  background-color: #fff;
}
.goods-list-tool span:hover {
  border: 1px solid #e4393c;
}
.goods-list-tool i:hover {
  color: #e4393c;
}
.goods-list-tool-active {
  color: #fff;
  border-left: 1px solid #ccc;
  background-color: #e4393c !important;
}

.goods-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.goods-show-info {
  width: 240px;
  padding: 10px;
  margin: 15px 0px;
  border: 1px solid #fff;
  cursor: pointer;
}
.goods-show-info:hover {
  border: 1px solid #ccc;
  box-shadow: 0px 0px 15px #ccc;
}
.goods-show-price {
  margin-top: 6px;
}
/* .goods-show-detail {
  font-size: 12px;
  margin: 6px 0px;
} */

.goods-show-name {
  font-size: 12px;
  margin: 6px 0px;
  max-width: 20em;
  overflow: hidden; /** 隐藏超出的内容 **/
  word-break: break-all;
  text-overflow: ellipsis; /** 多行 **/
  display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
  -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
  -webkit-line-clamp: 2; /** 显示的行数 **/
}
.goods-show-detail {
  font-size: 10px;
  margin: 6px 0px;
  color: gray;
  max-width: 20em;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.goods-show-num {
  font-size: 12px;
  margin-bottom: 6px;
  color: #009688;
}
.goods-show-num span {
  color: #005aa0;
  font-weight: bold;
}
.goods-show-seller {
  font-size: 12px;
  color: #e4393c;
}
.goods-page {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.goods-container,
.goods-search,
.goods-page {
  margin: 15px auto 0 auto;
  width: 80%;
}
.goods-search button {
  width: 100%;
}

div.goods-show-img img {
  width: 220px;
  height: 220px;
}
/* ---------------商品栏结束------------------- */
</style>

<style>
div.goods-search
  div.ivu-col.ivu-col-span-7
  div.ivu-col.ivu-col-span-6
  .ivu-input.ivu-input-large {
  display: none;
}
</style>
