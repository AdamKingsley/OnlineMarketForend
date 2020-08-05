<template>
  <div class="container">
    <!-- 用户个人信息更新的表单 -->
    <div class="form-box">
      <Row type="flex" justify="center">
        <i-col span="3"><div></div></i-col>
        <i-col span="18">
          <!-- {{ uploadGoodsInfo }} -->
          <Form
            ref="goodsForm"
            :model="uploadGoodsInfo"
            :rules="goodsInfoRules"
          >
            <!-- :default-file-list="uploaded_tmp" -->
            <FormItem>
              <div
                class="goods-img-upload-list"
                v-for="(item, index) in uploadGoodsInfo.imgs"
                :key="index"
              >
                <template v-if="item">
                  <!-- <div v-if="uploadGoodsInfo.imgs[index]"> -->
                  <img
                    :src="uploadGoodsInfo.previewImgs[index]"
                    alt="Not Found"
                  />
                  <div class="goods-img-upload-list-cover">
                    <Icon
                      type="ios-eye-outline"
                      @click.native="
                        handleView(uploadGoodsInfo.previewImgs[index])
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
              <!-- action="//jsonplaceholder.typicode.com/posts/" -->
              <Upload
                multiple
                type="drag"
                :format="['jpg', 'jpeg', 'png']"
                :before-upload="beforeUploadGoodsImage"
              >
                <div style="padding: 20px 0">
                  <Icon
                    type="ios-cloud-upload"
                    size="100"
                    style="color: #3399ff"
                  ></Icon>
                  <p style="font-size:15px">拖拽或点击上传商品图片</p>
                </div>
              </Upload>
            </FormItem>
            <FormItem label="商品名称：" prop="name">
              <i-input
                type="text"
                v-model="uploadGoodsInfo.name"
                clearable
                size="large"
                placeholder="请输入商品名称"
              >
              </i-input>
            </FormItem>
            <FormItem label="商品标签：" prop="label">
              <i-input
                type="text"
                v-model="uploadGoodsInfo.label"
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
                    v-model="uploadGoodsInfo.price"
                  ></InputNumber>
                </FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="商品优惠率：" prop="discountRate">
                  <InputNumber
                    style="width:80%"
                    :max="100"
                    v-model="uploadGoodsInfo.discountRate"
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
                    v-model="uploadGoodsInfo.discountAmount"
                  ></InputNumber>
                </FormItem>
              </i-col>
              <i-col span="24">
                <Alert show-icon class="tips-box">
                  <b style="font-size:14px">小提示</b>
                  <Icon type="ios-lightbulb-outline" slot="icon"></Icon>
                  <div style="margin-top:10px;">
                    <span>
                      商品实际价格 &nbsp;= &nbsp;商品价格&nbsp; x&nbsp; (100%
                      &nbsp;- &nbsp;商品优惠率) &nbsp;- &nbsp;商品优惠额
                    </span>
                  </div>
                  <!-- font-size:14px;font-weight:bold -->
                  <div style="margin-top:10px;">
                    <span>
                      本商品实际价格&nbsp; =&nbsp;
                      {{ uploadGoodsInfo.price }} &nbsp;x &nbsp;(100%&nbsp;
                      -&nbsp; {{ uploadGoodsInfo.discountRate }}%) &nbsp;-&nbsp;
                      {{ uploadGoodsInfo.discountAmount }} &nbsp;= &nbsp;
                      {{
                        (
                          uploadGoodsInfo.price *
                            (1 - uploadGoodsInfo.discountRate / 100) -
                          uploadGoodsInfo.discountAmount
                        ).toFixed(2)
                      }}
                    </span>
                  </div>
                  <div style="margin-top:10px;">
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
                    v-model="uploadGoodsInfo.storeNum"
                  ></InputNumber>
                </FormItem>
              </i-col>
              <div style="margin: 7px 0">产品类型：</div>
              <i-col span="8">
                <Select
                  style="width:80%"
                  v-model="categoryId1"
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
              <i-col span="8">
                <Select
                  style="width:80%"
                  v-model="categoryId2"
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
              <!-- </FormItem> -->
            </Row>

            <FormItem label="商品介绍" prop="description">
              <i-input
                v-model="uploadGoodsInfo.description"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 10 }"
                placeholder="输入商品的相关介绍内容..."
                style="margin-bottom: 20px"
              ></i-input>
            </FormItem>
            <hr
              v-if="uploadGoodsInfo.attrs.length > 0"
              align="center"
              width="100%"
              color="gray"
              size="1"
              style="margin-bottom:20px"
            />
            <div v-for="(item, index) in uploadGoodsInfo.attrs" :key="index">
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
                    <!-- action="//jsonplaceholder.typicode.com/posts/" -->
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
                        v-if="uploadGoodsInfo.attrs[index].image"
                        class="attr-upload-div"
                      >
                        <img
                          :src="uploadGoodsInfo.attrs[index].imagePreview"
                          alt=""
                        />
                      </div>
                      <div v-else class="attr-upload-div">
                        <div style="text-align:center">
                          <Icon
                            type="ios-cloud-upload"
                            size="80"
                            style="color: #3399ff"
                          ></Icon>
                          <p style="font-size:12px">拖拽或点击上传商品图片</p>
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
                          v-model="item.discountAmount"
                        ></InputNumber>
                      </FormItem>
                    </i-col>
                    <i-col span="24">
                      <Alert show-icon class="tips-box">
                        <b style="font-size:14px">小提示</b>
                        <Icon type="ios-lightbulb-outline" slot="icon"></Icon>
                        <div style="margin-top:10px;">
                          <span>
                            套餐实际价格 &nbsp;= &nbsp;套餐价格&nbsp; x&nbsp;
                            (100% &nbsp;- &nbsp;套餐优惠率) &nbsp;-
                            &nbsp;套餐优惠额
                          </span>
                        </div>
                        <!-- font-size:14px;font-weight:bold -->
                        <div style="margin-top:10px;">
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
                  </i-col>
                </Row>
              </div>
            </div>
            <FormItem prop="button" class="confirm-btn">
              <Row type="flex" justify="center">
                <i-col span="12">
                  <Button type="warning" @click="addGoodsAttr" size="large">
                    添加商品套餐
                  </Button>
                </i-col>
                <i-col span="12">
                  <Button type="info" @click="addGoodsInfo" size="large"
                    >确认创建商品
                  </Button>
                </i-col>
              </Row>
            </FormItem>
          </Form>
        </i-col>
        <i-col span="3"><div></div></i-col>
      </Row>
    </div>
    <Modal title="查看上传图片" v-model="visible">
      <img :src="selectedImg" v-if="visible" style="width: 100%" />
    </Modal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import constant from '../../util/constant';
import encryption from '../../util/encryption';
export default {
  name: 'AddGoods',
  data () {
    return {
      visible: false,
      selectedImg: '',
      uploadGoodsInfo: {
        name: '',
        price: 0,
        discountAmount: 0,
        discountRate: 0,
        categoryId: 0,
        storeNum: 0,
        attrs: [],
        imgs: [],
        previewImgs: [],
        md5s: [],
        description: '',
        label: ''
        // actualPrice: 0
      },
      goodsInfoRules: {},
      categoryList1: [],
      categoryList2: [],
      // categoryId: 0, // 商品类别
      categoryId1: 0,
      categoryId2: 0
    };
  },
  computed: {
    ...mapState([constant.STATES.MERCHANT_INFO])
  },
  watch: {
    // uploadGoodsInfo (val) {
    //   // 遍历所有的attrs然后设置upload的price,discountAmount和discountRate
    //   var price = this.uploadGoodsInfo.price;
    //   var discountAmount = this.uploadGoodsInfo.discountAmount;
    //   var discountRate = this.uploadGoodsInfo.discountRate;
    //   var actualPrice = price * (1 - discountRate / 100) - discountAmount;
    //   for (let i = 0; i < this.uploadGoodsInfo.attrs.length; i++) {
    //     var attr = this.uploadGoodsInfo.attrs[i];
    //     var attrActualPrice =
    //       attr.price * (1 - attr.discountRate / 100) - attr.discountAmount;
    //     attr.actualPrice = attrActualPrice;
    //     if (attrActualPrice < actualPrice) {
    //       price = attr.price;
    //       actualPrice = attrActualPrice;
    //       discountAmount = attr.discountAmount;
    //       discountRate = attr.discountRate;
    //     }
    //   }
    //   this.uploadGoodsInfo.price = price;
    //   this.uploadGoodsInfo.discountAmount = discountAmount;
    //   this.uploadGoodsInfo.discountRate = discountRate;
    //   this.uploadGoodsInfo.actualPrice = actualPrice;
    // }
  },
  created () {
    // 设置级联category查询的数据
    this.$data.uploadGoodsInfo.merchantId = this.merchantInfo.id;
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
  methods: {
    ...mapActions([
      constant.ACTIONS.ADD_GOODS,
      constant.ACTIONS.GET_CATEGORY_LIST,
      constant.ACTIONS.IS_UPLOAD,
      constant.ACTIONS.UPLOAD_GOODS_IMGS,
      constant.ACTIONS.UPLOAD_GOODS_ATTR_IMAGE
    ]),
    // TODO 新增上传商品
    addGoodsInfo () {
      // 开始上新商品
      this.$Loading.start();
      this.preprocessGoodsInfo();
      this.addGoods(this.uploadGoodsInfo).then(result => {
        this.$Loading.finish();
        if (result.code === constant.OK_CODE) {
          this.$Message.success(result.message);
          this.$router.push('/home/goodsManagement');
        } else {
          this.$Message.error(result.message);
        }
      });
    },
    preprocessGoodsInfo () {
      // 确立good的最终显示的最低价
      // 遍历所有的attrs然后设置upload的price,discountAmount和discountRate
      if (this.uploadGoodsInfo.attrs.length === 0) {
        return;
      }
      // var price = this.uploadGoodsInfo.price;
      // var discountAmount = this.uploadGoodsInfo.discountAmount;
      // var discountRate = this.uploadGoodsInfo.discountRate;
      var price = this.uploadGoodsInfo.attrs[0].price;
      var discountAmount = this.uploadGoodsInfo.attrs[0].discountAmount;
      var discountRate = this.uploadGoodsInfo.attrs[0].discountRate;
      var actualPrice = price * (1 - discountRate / 100) - discountAmount;
      var storeNum = 0;
      for (let i = 0; i < this.uploadGoodsInfo.attrs.length; i++) {
        var attr = this.uploadGoodsInfo.attrs[i];
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
      this.uploadGoodsInfo.storeNum = storeNum;
      this.uploadGoodsInfo.price = price;
      this.uploadGoodsInfo.discountAmount = discountAmount;
      this.uploadGoodsInfo.discountRate = discountRate;
      this.uploadGoodsInfo.actualPrice = actualPrice;
    },
    processCategoryList (data) {
      let result = [{ value: 0, label: '未选择' }];
      for (let i = 0; i < data.length; i++) {
        result.push({ value: data[i].id, label: data[i].name });
      }
      return result;
    },
    addGoodsAttr () {
      this.$data.uploadGoodsInfo.attrs.push({
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
    },
    changeCategory1 (value) {
      this.$log.d('更改选择的类别');
      this.$log.d(value);
      this.$data.uploadGoodsInfo.categoryId = value;
      this.$data.categoryId2 = 0;
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
      this.$data.uploadGoodsInfo.categoryId =
        value || this.$data.uploadGoodsInfo.categoryId1;
    },
    delAttr (index) {
      this.uploadGoodsInfo.attrs.splice(index, 1);
    },
    handleView (url) {
      this.selectedImg = url;
      this.visible = true;
    },
    handleRemove (index) {
      this.uploadGoodsInfo.imgs.splice(index, 1);
      this.uploadGoodsInfo.previewImgs.splice(index, 1);
      this.uploadGoodsInfo.md5.splice(index, 1);
    },
    beforeUploadGoodsImage (file) {
      if (!constant.IS_IMAGE(file.name)) {
        this.$Message.error('仅支持图片格式文件上传！');
        return;
      }
      // console.log(file);
      // 预览
      let reader = new FileReader();

      // 读取操作结束时触发
      reader.onloadend = ev => {
        // 赋值给vue对象属性
        encryption.md5.fileMd5(file, md5Val => {
          this.checkUpload(md5Val).then(result => {
            // this.uploadGoodsInfo.previewImgs.push(ev.target.result);
            // this.uploadGoodsInfo.md5s.push(md5Val);
            this.$log.d('before avatar upload funciton！！！');
            this.$log.d(file);
            // var length = this.uploadGoodsInfo.imgs.length;
            if (result.code === constant.OK_CODE && result.data) {
              // code = 200 且data有数据，表示后台有该文件
              // 直接赋值
              this.uploadGoodsInfo.previewImgs.push(ev.target.result);
              this.uploadGoodsInfo.md5s.push(md5Val);
              this.uploadGoodsInfo.imgs.push(result.data);

              // this.uploadGoodsInfo.imgs[length - 1] = result.data;
              this.$Message.success('后台已存在对应图片，默认选中！');
            } else {
              // 执行上传操作
              this.uploadGoodsImgs({ file: file, md5: md5Val }).then(
                result2 => {
                  if (result2.code === constant.OK_CODE) {
                    this.$Message.success('上传图片成功！');
                    this.uploadGoodsInfo.previewImgs.push(ev.target.result);
                    this.uploadGoodsInfo.md5s.push(md5Val);
                    this.uploadGoodsInfo.imgs.push(result2.data);
                    // this.uploadGoodsInfo.imgs[length - 1] = result2.data;
                  } else {
                    // this.uploadGoodsInfo.imgs.push(null);
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
            this.uploadGoodsInfo.attrs[index].imagePreview = ev.target.result;
            this.uploadGoodsInfo.attrs[index].image = null;
            this.uploadGoodsInfo.attrs[index].md5 = md5Val;
            this.$log.d('before attr upload funciton！！！');
            // this.$log.d(file);
            // var length = this.uploadGoodsInfo.imgs.length;
            if (result.code === constant.OK_CODE && result.data) {
              // code = 200 且data有数据，表示后台有该文件
              // 直接赋值
              this.uploadGoodsInfo.attrs[index].image = result.data;
              this.$Message.success('后台已存在对应图片，默认选中！');
            } else {
              // 执行上传操作
              this.uploadGoodsImgs({ file: file, md5: md5Val }).then(
                result2 => {
                  if (result2.code === constant.OK_CODE) {
                    this.uploadGoodsInfo.attrs[index].image = result2.data;
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
.confirm-btn {
  text-align: center;
}
.confirm-btn button {
  width: 300px;
}

.attr-upload {
  margin: 10px;
}
.attr-upload-div {
  padding: 10px 10px;
  width: 100x;
  height: 230px;
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
