<template>
  <div class="container">
    <div class="tabs-style">
      <Tabs type="card">
        <TabPane label="账户信息">
          <!-- 用户个人信息更新的表单 -->
          <div class="form-box">
            <Row type="flex" justify="center">
              <i-col span="8"><div></div></i-col>
              <i-col span="8">
                <Form
                  ref="userForm"
                  :model="updateUserInfo"
                  :rules="userInfoRules"
                >
                  <FormItem>
                    <div class="prop-avatar">
                      <Tooltip content="点击头像进行上传" placement="top">
                        <!-- 后续将src绑定为用户头像avatar -->
                        <img
                          :src="updateUserInfo.avatarPreview"
                          alt="Not Found"
                          @click="showUploadAvatarModal"
                        />
                      </Tooltip>
                    </div>
                    <Modal v-model="showUploadAvatar" title="用户头像上传">
                      <!-- 进行用户头像上传 -->
                      <!-- <Upload
                        type="drag"
                        action="//jsonplaceholder.typicode.com/posts/"
                        :before-upload="beforeAvatarUpload"
                      > -->
                      <Upload
                        type="drag"
                        :format="['jpg', 'jpeg', 'png']"
                        :before-upload="beforeAvatarUpload"
                      >
                        <div v-if="userAvatarPreview" class="upload-div avatar">
                          <img :src="userAvatarPreview" alt="" />
                        </div>
                        <div v-else class="upload-div">
                          <Icon type="ios-cloud-upload" size="100"></Icon>
                          <p>点击或拖拽进行图片上传</p>
                        </div>
                      </Upload>
                      <div slot="footer">
                        <Button type="text" @click="showUploadAvatar = false"
                          >取消</Button
                        >
                        <Button type="primary" @click="uploadAvatarImage"
                          >确定</Button
                        >
                      </div>
                    </Modal>
                  </FormItem>
                  <FormItem prop="username">
                    <i-input
                      type="text"
                      v-model="updateUserInfo.username"
                      clearable
                      size="large"
                      placeholder="用户名"
                    >
                      <Icon type="person" slot="prepend"></Icon>
                    </i-input>
                  </FormItem>
                  <FormItem prop="email">
                    <i-input
                      type="text"
                      v-model="updateUserInfo.email"
                      clearable
                      size="large"
                      placeholder="邮箱"
                    >
                      <Icon type="at" slot="prepend"></Icon>
                    </i-input>
                  </FormItem>
                  <FormItem prop="telephone">
                    <i-input
                      type="text"
                      v-model="updateUserInfo.telephone"
                      clearable
                      size="large"
                      placeholder="手机号"
                    >
                      <Icon type="calculator" slot="prepend"></Icon>
                    </i-input>
                  </FormItem>
                  <!-- <FormItem prop="description"> -->
                  <i-input
                    v-model="updateUserInfo.description"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 10 }"
                    placeholder="输入个人自我介绍..."
                    style="margin-bottom: 20px"
                  ></i-input>
                  <!-- </FormItem> -->
                  <Row class="button-row">
                    <i-col span="12">
                      <FormItem prop="button">
                        <Button
                          type="default"
                          @click="cancelUpdateUser"
                          size="large"
                          >取消修改</Button
                        >
                      </FormItem>
                    </i-col>
                    <i-col span="12">
                      <FormItem prop="button">
                        <Button type="info" @click="updateUser" size="large"
                          >确认修改</Button
                        >
                      </FormItem>
                    </i-col>
                  </Row>
                </Form>
              </i-col>
              <i-col span="8"><div></div></i-col>
            </Row>
          </div>
        </TabPane>
        <!-- v-bind:closable="userInfo.type!='MERCHANT'" -->
        <TabPane
          v-if="userInfo.type === 'MERCHANT'"
          ref="merchantInfo"
          label="商户信息"
        >
          <Alert
            v-if="Object.keys(updateMerchantInfo).length === 0"
            type="warning"
            show-icon
            >当前尚未创建店铺信息，请及时完善店铺基础信息</Alert
          >
          <div class="form-box">
            <Row type="flex" justify="center">
              <i-col span="6"><div></div></i-col>
              <i-col span="12">
                <Form
                  ref="merchantForm"
                  :model="updateMerchantInfo"
                  :rules="userInfoRules"
                >
                  <FormItem>
                    <div class="prop-banner">
                      <Tooltip content="点击banner进行上传" placement="top">
                        <!-- 后续将src绑定为商户banner -->
                        <img
                          :src="updateMerchantInfo.bannerPreview"
                          alt="Not Found"
                          @click="showUploadMerchantBannerModal"
                        />
                      </Tooltip>
                    </div>
                    <Modal v-model="showUploadBanner" title="店铺banner上传">
                      <!-- 进行商户banner上传 -->
                      <Upload
                        type="drag"
                        :format="['jpg', 'jpeg', 'png']"
                        :before-upload="beforeBannerUpload"
                      >
                        <div
                          v-if="merchantBannerPreview"
                          class="upload-div banner"
                        >
                          <img :src="merchantBannerPreview" alt="" />
                        </div>
                        <div v-else class="upload-div">
                          <Icon type="ios-cloud-upload" size="100"></Icon>
                          <p>点击或拖拽进行图片上传</p>
                        </div>
                      </Upload>
                      <div slot="footer">
                        <Button type="text" @click="showUploadBanner = false"
                          >取消</Button
                        >
                        <Button type="primary" @click="uploadBannerImage"
                          >确定</Button
                        >
                      </div>
                    </Modal>
                  </FormItem>
                  <FormItem prop="name">
                    <i-input
                      type="text"
                      v-model="updateMerchantInfo.name"
                      clearable
                      size="large"
                      placeholder="商户店名"
                    >
                      <Icon type="person" slot="prepend"></Icon>
                    </i-input>
                  </FormItem>
                  <FormItem prop="email">
                    <i-input
                      type="text"
                      v-model="updateMerchantInfo.email"
                      clearable
                      size="large"
                      placeholder="客服邮箱"
                    >
                      <Icon type="at" slot="prepend"></Icon>
                    </i-input>
                  </FormItem>
                  <FormItem prop="telephone">
                    <i-input
                      type="text"
                      v-model="updateMerchantInfo.telephone"
                      clearable
                      size="large"
                      placeholder="客服电话"
                    >
                      <Icon type="iphone" slot="prepend"></Icon>
                    </i-input>
                  </FormItem>
                  <FormItem prop="address">
                    <Row>
                      <i-col class="prop-address-label" span="3">
                        <span>店铺地区：</span>
                      </i-col>
                      <i-col span="21">
                        <Distpicker
                          :province="updateMerchantInfo.province"
                          :city="updateMerchantInfo.city"
                          :area="updateMerchantInfo.area"
                          @province="getProvince"
                          @city="getCity"
                          @area="getArea"
                        ></Distpicker
                      ></i-col>
                    </Row>
                  </FormItem>
                  <FormItem prop="address">
                    <Row>
                      <i-col span="3" class="prop-address-label"
                        ><span>店铺地址：</span></i-col
                      >
                      <i-col span="21">
                        <i-input
                          v-model="updateMerchantInfo.address"
                          size="large"
                        ></i-input
                      ></i-col>
                    </Row>
                  </FormItem>
                  <i-input
                    v-model="updateMerchantInfo.description"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 10 }"
                    placeholder="输入店铺介绍..."
                    style="margin-bottom: 20px"
                  ></i-input>

                  <Row class="button-row">
                    <i-col span="12">
                      <FormItem prop="button">
                        <Button
                          type="default"
                          @click="cancelUpdateMerchant"
                          size="large"
                          >取消修改</Button
                        >
                      </FormItem>
                    </i-col>
                    <i-col span="12">
                      <FormItem prop="button">
                        <Button type="info" @click="updateMerchant" size="large"
                          >确认修改</Button
                        >
                      </FormItem>
                    </i-col>
                  </Row>
                </Form>
              </i-col>
              <i-col span="6"><div></div></i-col>
            </Row>
          </div>
        </TabPane>
        <TabPane label="修改密码">
          <div class="form-box">
            <Row type="flex" justify="center">
              <i-col span="8"><div></div></i-col>
              <i-col span="8">
                <Form
                  ref="passwordForm"
                  :model="passwordInfo"
                  :rules="userInfoRules"
                >
                  <FormItem prop="password">
                    <span class="input-label">修改密码：</span>
                    <i-input
                      type="password"
                      v-model="passwordInfo.password"
                      clearable
                      size="large"
                      placeholder="输入修改后的密码"
                    >
                      <Icon type="ios-locked-outline" slot="prepend"></Icon>
                    </i-input>
                  </FormItem>
                  <FormItem prop="password">
                    <span class="input-label">确认密码：</span>
                    <i-input
                      type="password"
                      v-model="passwordInfo.confirmPassword"
                      clearable
                      size="large"
                      placeholder="确认修改后的密码"
                    >
                      <Icon type="ios-locked-outline" slot="prepend"> </Icon>
                    </i-input>
                  </FormItem>
                  <Row class="button-row">
                    <i-col span="12">
                      <FormItem prop="button">
                        <Button
                          type="default"
                          @click="cancelModifyPassword"
                          size="large"
                          >取消修改</Button
                        >
                      </FormItem>
                    </i-col>
                    <i-col span="12">
                      <FormItem prop="button">
                        <Button type="info" @click="modifyPassword" size="large"
                          >确认修改</Button
                        >
                      </FormItem>
                    </i-col>
                  </Row>
                </Form>
              </i-col>
              <i-col span="8"><div></div></i-col>
            </Row>
          </div>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
import store from '@/vuex/store';
import { mapActions, mapState, mapMutations } from 'vuex';
import constant from '../../util/constant';
import validator from '../../util/validator';
import Distpicker from 'v-distpicker';
import encryption from '../../util/encryption';
// import time from '../../util/time';
export default {
  name: 'MyInfo',
  data () {
    return {
      userAvatar: '',
      userAvatarPreview: '',
      merchantBanner: '',
      merchantBannerPreview: '',
      showUploadAvatar: false,
      showUploadBanner: false,
      updateUserInfo: {},
      updateMerchantInfo: {},
      passwordInfo: {},
      // 表单验证规则
      userInfoRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' }
        ],
        password: [
          { required: false, message: '请输入密码', trigger: 'change' },
          {
            type: 'string',
            min: 5,
            message: '密码不能少于5位',
            trigger: 'change'
          }
        ],
        email: [
          {
            required: false,
            validator: validator.emailValidator,
            message: '请检查输入邮件信息的格式',
            trigger: 'change'
          }
        ],
        telephone: [
          {
            required: false,
            validator: validator.phoneValidator,
            message: '请检查手机号信息是否正确',
            trigger: 'change'
          }
        ]
      },
      uploadAvatarInfo: {},
      uploadBannerInfo: {}
    };
  },
  created: function () {
    // let father = this;
    // 构造下拉选项
    this.$log.d('myInfo page rendered!');
    // this.$log.d(this.userInfo);
    // this.userAvatar = this.userInfo.avatar;
    // if (this.userInfo.type !== constant.USER_TYPE.MERCHANT) {
    //   this.$refs.merchantInfo.remove();
    // }
    this.getUserById().then(result => {
      this.$log.d('query user info result!');
      this.$log.d(result);
      this.userAvatar = result.data.avatar;
      this.$data.updateUserInfo = JSON.parse(JSON.stringify(result.data));
      this.updateUserInfo.avatarPreview =
        constant.BASE_STATIC_URL[constant.ACTIVE] + this.userInfo.avatar;
    });

    if (this.userInfo.type === constant.USER_TYPE.MERCHANT) {
      this.getMerchant().then(result => {
        this.$log.d('query merchant info result!');
        this.$log.d(result);
        // 虽然是imgs字段，但是只有一个图
        this.merchantBanner = result.data.imgs;
        this.$data.updateMerchantInfo = JSON.parse(JSON.stringify(result.data));
        this.updateMerchantInfo.bannerPreview =
          constant.BASE_STATIC_URL[constant.ACTIVE] + this.merchantInfo.imgs;
      });
    }
  },
  computed: {
    ...mapState([constant.STATES.USER_INFO, constant.STATES.MERCHANT_INFO])
  },
  methods: {
    ...mapMutations([
      constant.MUTATIONS.SET_USER_LOGIN_INFO,
      constant.MUTATIONS.SET_MERCHANT_INFO
    ]),
    ...mapActions([
      constant.ACTIONS.IS_UPLOAD,
      constant.ACTIONS.UPDATE_USER_INFO,
      constant.ACTIONS.CHNAGE_PASSWORD,
      constant.ACTIONS.UPDATE_MERCHANT_INFO,
      constant.ACTIONS.GET_USER,
      constant.ACTIONS.GET_USER_BY_ID,
      constant.ACTIONS.GET_MERCHANT,
      constant.ACTIONS.UPLOAD_AVATAR,
      constant.ACTIONS.UPLOAD_BANNER
    ]),
    showUploadAvatarModal () {
      this.$data.showUploadAvatar = true;
    },
    showUploadMerchantBannerModal () {
      this.$data.showUploadBanner = true;
    },
    cancelUpdateUser () {
      this.$data.updateUserInfo = JSON.parse(JSON.stringify(this.userInfo));
      this.updateUserInfo.avatarPreview =
        constant.BASE_STATIC_URL[constant.ACTIVE] + this.userInfo.avatar;
    },
    updateUser () {
      this.$refs['userForm'].validate(valid => {
        if (valid) {
          this.$Loading.start();
          this.$log.d('更新个人信息！');
          this.$log.d(this.$data.updateUserInfo);
          this.updateAccount(this.$data.updateUserInfo).then(result => {
            this.$Loading.finish();
            if (result.code === constant.OK_CODE) {
              // var token = this.$data.updateUserInfo.accessToken;
              this.$Message.success(result.message);
              // this.$data.updateUserInfo = result.data;
              // this.$data.updateUserInfo.accessToken = token;
              this.$data.updateUserInfo.avatarPreview =
                constant.BASE_STATIC_URL[constant.ACTIVE] +
                this.$data.updateUserInfo.avatar;

              store.commit(
                constant.MUTATIONS.SET_USER_LOGIN_INFO,
                this.$data.updateUserInfo
              );
            } else {
              this.$Message.error(result.message);
            }
          });
        } else {
          this.$Message.error('请检查输入内容的格式是否符合要求！');
        }
      });
    },
    cancelUpdateMerchant () {
      this.$data.updateMerchantInfo = JSON.parse(
        JSON.stringify(this.merchantInfo)
      );
      this.updateMerchantInfo.bannerPreview =
        constant.BASE_STATIC_URL[constant.ACTIVE] + this.merchantInfo.imgs;
    },
    updateMerchant () {
      this.$refs['merchantForm'].validate(valid => {
        if (valid) {
          this.$Loading.start();
          this.$log.d('开始更新店铺信息！');
          this.$log.d(this.$data.updateMerchantInfo);
          this.updateMerchantAccount(this.$data.updateMerchantInfo).then(
            result => {
              this.$Loading.finish();
              if (result.code === constant.OK_CODE) {
                this.$Message.success(result.message);
                // 通过获取用户信息，更新一下用户
                this.getMerchant();
              } else {
                this.$Message.error(result.message);
              }
            }
          );
        } else {
          this.$Message.error('请检查输入内容的格式是否符合要求！');
        }
      });
    },
    cancelModifyPassword () {
      // 清空输入的历史
      this.$data.passwordInfo = {};
    },
    modifyPassword () {
      var passwordInfo = this.$data.passwordInfo;
      this.$refs['passwordForm'].validate(valid => {
        if (valid) {
          if (
            passwordInfo.password &&
            passwordInfo.confirmPassword &&
            passwordInfo.password === passwordInfo.confirmPassword
          ) {
            // 只有这样才可以更新用户密码
            this.$Loading.start();
            this.changePassword(passwordInfo).then(result => {
              this.$Loading.finish();
              result.code === constant.OK_CODE
                ? this.$Message.success(result.message)
                : this.$Message.error(result.message);
            });
          } else {
            this.$Message.error('请检查输入密码的格式！');
          }
        } else {
          this.$Message.error('请检查输入密码的格式！');
        }
      });
    },
    beforeAvatarUpload (file) {
      if (!constant.IS_IMAGE(file.name)) {
        this.$Message.error('仅支持图片格式文件上传！');
        return;
      }
      this.uploadAvatarInfo = {
        file: file
      };
      // 预览
      let reader = new FileReader();
      // 开始读取文件内容
      reader.readAsDataURL(file);
      // 读取操作结束时触发
      reader.onloadend = ev => {
        // 赋值给vue对象属性
        this.userAvatarPreview = ev.target.result;
      };
      // 在上传前判断该文件之前是否上传过
      this.$log.d('before avatar upload funciton！！！');
      this.$log.d(file);
      encryption.md5.fileMd5(file, md5Val => {
        this.uploadAvatarInfo.md5 = md5Val;
        this.checkUpload(md5Val).then(result => {
          if (result.code === constant.OK_CODE && result.data) {
            // code = 200 且data有数据，表示后台有该文件
            // 直接赋值
            this.uploadAvatarInfo.path = result.data;
            this.$Message.success('后台已存在对应图片，默认选中！');
          }
        });
      });
      return false;
    },
    beforeBannerUpload (file) {
      if (!constant.IS_IMAGE(file.name)) {
        this.$Message.error('仅支持图片格式文件上传！');
        return;
      }
      this.uploadBannerInfo = {
        file: file
      };
      // 预览
      let reader = new FileReader();
      // 开始读取文件内容
      reader.readAsDataURL(file);
      // 读取操作结束时触发
      reader.onloadend = ev => {
        // 赋值给vue对象属性
        this.merchantBannerPreview = ev.target.result;
      };
      // 在上传前判断该文件之前是否上传过
      this.$log.d('before banner upload funciton！！！');
      this.$log.d(file);
      encryption.md5.fileMd5(file, md5Val => {
        this.uploadBannerInfo.md5 = md5Val;
        this.checkUpload(md5Val).then(result => {
          if (result.code === constant.OK_CODE && result.data) {
            // code = 200 且data有数据，表示后台有该文件
            // 直接赋值
            this.uploadBannerInfo.path = result.data;
            this.$Message.success('后台已存在对应图片，默认选中！');
          }
        });
      });
    },
    uploadAvatarImage () {
      // this.$log.d('upload avatar function!!!');
      this.showUploadAvatar = true;
      if (this.uploadAvatarInfo.path) {
        // 已经上传过了
        this.userAvatar = this.uploadAvatarInfo.path;
        this.updateUserInfo.avatar = this.userAvatar;
        this.updateUserInfo.avatarPreview =
          constant.BASE_STATIC_URL[constant.ACTIVE] + this.userAvatar;
        this.showUploadAvatar = false;
      } else {
        this.$Loading.start();
        this.uploadAvatar(this.uploadAvatarInfo).then(result => {
          this.$Loading.finish();
          if (result.code === constant.OK_CODE) {
            // 上传成功
            this.userAvatar = result.data;
            this.updateUserInfo.avatar = this.userAvatar;
            this.updateUserInfo.avatarPreview =
              constant.BASE_STATIC_URL[constant.ACTIVE] + this.userAvatar;
            this.$Message.success(result.message);
            this.showUploadAvatar = false;
            this.userAvatar = '';
            this.userAvatarPreview = '';
          } else {
            this.$Message.error(result.message);
          }
        });
      }
    },
    uploadBannerImage () {
      // this.$log.d('upload banner function!!!');
      this.showUploadBanner = true;
      if (this.uploadBannerInfo.path) {
        // 已经上传过了
        this.merchantBanner = this.uploadBannerInfo.path;
        this.updateMerchantInfo.imgs = this.merchantBanner;
        this.updateMerchantInfo.bannerPreview =
          constant.BASE_STATIC_URL[constant.ACTIVE] + this.merchantBanner;
        this.showUploadBanner = false;
      } else {
        this.$Loading.start();
        this.uploadBanner(this.uploadAvatarInfo).then(result => {
          this.$Loading.finish();
          if (result.code === constant.OK_CODE) {
            this.merchantBanner = result.data;
            this.updateMerchantInfo.imgs = this.merchantBanner;
            this.updateMerchantInfo.bannerPreview =
              constant.BASE_STATIC_URL[constant.ACTIVE] + this.merchantBanner;

            this.$Message.success(result.message);
            this.showUploadBanner = false;
            this.merchantBanner = '';
            this.merchantBannerPreview = '';
          } else {
            this.$Message.error(result.message);
          }
        });
      }
    },
    getProvince (data) {
      this.updateMerchantInfo.province = data.value;
    },
    getCity (data) {
      this.updateMerchantInfo.city = data.value;
    },
    getArea (data) {
      this.updateMerchantInfo.area = data.value;
    }
  },
  components: {
    Distpicker
  }
};
</script>

<style scoped>
.tabs-style .ivu-tabs-card .ivu-tabs-content {
  height: 120px;
  margin-top: -16px;
}

.tabs-style .ivu-tabs-card .ivu-tabs-content .ivu-tabs-tabpane {
  background: #fff;
  padding: 16px;
}

.tabs-style .ivu-tabs.ivu-tabs-card .ivu-tabs-bar .ivu-tabs-tab {
  border-color: transparent;
}

.tabs-style .ivu-tabs-card .ivu-tabs-bar .ivu-tabs-tab-active {
  border-color: #fff;
}

.input-label {
  font-size: 12pt;
}

.button-row {
  text-align: center;
}

.prop-avatar img {
  height: 100px;
  width: 100px;
  border-radius: 50px;
  background-color: rgba(98, 194, 60, 0.8);
  bottom: 0;
  right: 0;
  transition: 0.5s;
  -webkit-transition: 0.5s;
  -moz-transition: 0.5s;
  -ms-transition: 0.5s;
  -o-transition: 0.5s;
  -webkit-box-shadow: 0px 3px 5px rgb(80, 245, 14);
  box-shadow: 0px 3px 5px rgb(73, 226, 12);
}
.prop-avatar {
  text-align: center;
  height: 100px;
}

.prop-banner {
  text-align: center;
  height: 100px;
}

.prop-banner img {
  height: 100px;
  width: 600px;
  border-radius: 10px;
  background-color: rgba(98, 194, 60, 0.8);
  bottom: 0;
  right: 0;
  transition: 0.5s;
  -webkit-transition: 0.5s;
  -moz-transition: 0.5s;
  -ms-transition: 0.5s;
  -o-transition: 0.5s;
  -webkit-box-shadow: 0px 3px 5px rgb(80, 245, 14);
  box-shadow: 0px 3px 5px rgb(73, 226, 12);
}

.upload-div {
  padding: 20px 0;
}

.upload-div i {
  color: #3399ff;
}

.upload-div p {
  font-size: 15px;
}
.prop-address-label {
  margin-top: 3px;
  font-size: 15px;
}

.upload-div.avatar img {
  width: 150px;
  height: 150px;
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

.upload-div.banner img {
  width: 450px;
  height: 57px;
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
