<template>
  <div>
    <div class="header">
      <div class="form-box">
        <Form ref="searchForm" :model="searchParams">
          <Row :gutter="6">
            <i-col span="4">
              <FormItem prop="username">
                <i-input
                  type="text"
                  v-model="searchParams.username"
                  clearable
                  size="large"
                  placeholder="用户名匹配字段"
                >
                  <span slot="prepend">用户名</span>
                </i-input>
              </FormItem>
            </i-col>
            <i-col span="3">
              <FormItem prop="email">
                <i-input
                  type="text"
                  v-model="searchParams.email"
                  clearable
                  size="large"
                  placeholder="邮箱匹配字段"
                >
                  <span slot="prepend">邮箱</span>
                </i-input>
              </FormItem>
            </i-col>
            <i-col span="4">
              <FormItem prop="telephone">
                <i-input
                  type="text"
                  v-model="searchParams.telephone"
                  clearable
                  size="large"
                  placeholder="手机号匹配字段"
                >
                  <span slot="prepend">手机号</span>
                </i-input>
              </FormItem>
            </i-col>
            <i-col span="4">
              <!-- <FormItem prop="type"> -->
              <FormItem>
                <Row>
                  <i-col span="8">
                    <i-input size="large" type="hidden">
                      <div slot="prepend">用户类型</div>
                    </i-input>
                  </i-col>
                  <i-col span="16">
                    <Select
                      style="margin-top:1px"
                      v-model="searchParams.type"
                      size="large"
                    >
                      <Option
                        v-for="item in userTypeList"
                        :value="item.value"
                        :key="item.value"
                        >{{ item.label }}
                      </Option>
                    </Select>
                  </i-col>
                </Row>
              </FormItem>
            </i-col>
            <i-col span="3" class="prop-picker">
              <!-- 开始时间: -->
              <!-- @on-change="onStartTimeChange" -->
              <date-picker
                type="datetime"
                v-model="searchParams.startTime"
                placeholder="请选择开始时间"
                :options="startTimeOption"
                :transfer="true"
                size="large"
                style="margin-top:1px"
              ></date-picker>
            </i-col>
            <i-col span="3" class="prop-picker">
              <!-- 结束时间: -->
              <!-- @on-change="onEndTimeChange" -->
              <date-picker
                type="datetime"
                v-model="searchParams.endTime"
                placeholder="请选择结束时间"
                :options="endTimeOption"
                :transfer="true"
                size="large"
                style="margin-top:1px"
                F
              ></date-picker>
            </i-col>
            <i-col span="1">
              <FormItem>
                <Button @click="updateUserList" type="primary" size="large"
                  >查询</Button
                >
              </FormItem>
            </i-col>
            <i-col span="2">
              <FormItem style="text-align: center">
                <Button @click="showCreateModal" type="success" size="large"
                  >新建</Button
                >
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </div>
    </div>
    <!-- 用户列表 -->
    <div>
      <Table
        border
        :columns="columns"
        :data="userList"
        size="large"
        no-data-text="目前沒有用戶列表，快去添加新用户吧！"
      ></Table>
      <div class="page-size">
        <Page
          :total="totalNum"
          @on-change="pageNumChange"
          @on-page-size-change="pageSizeChange"
          show-sizer
          show-elevator
          show-total
        ></Page>
      </div>

      <Modal
        v-model="showUpdate"
        title="用户信息修改"
        @on-ok="updateUser(updateUserInfo)"
        @on-cancel="showUpdate = false"
      >
        <!-- 表单进行用户信息更新 -->
        <div class="form-box">
          <Form ref="updateForm" :model="updateUserInfo" :rules="userInfoRules">
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
            <FormItem prop="password">
              <i-input
                type="password"
                v-model="updateUserInfo.password"
                clearable
                size="large"
                placeholder="密码，不填写表示不修改"
              >
                <Icon type="ios-locked-outline" slot="prepend"> </Icon>
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
                <Icon type="iphone" slot="prepend"></Icon>
              </i-input>
            </FormItem>
            <Row>
              <i-col span="10">
                <FormItem prop="status">
                  <i-col span="12">
                    <div class="prop-label">
                      <span slot="prepend">用户状态 :</span>
                    </div>
                  </i-col>
                  <i-col span="12">
                    <div class="prop-switch">
                      <i-switch v-model="updateUserInfo.isActive" size="large">
                        <span slot="open">激活</span>
                        <span slot="close">冻结</span>
                        <!-- <Icon type="iphone" slot="prepend"></Icon> -->
                      </i-switch>
                    </div>
                  </i-col>
                </FormItem>
              </i-col>
              <i-col span="14">
                <FormItem prop="type">
                  <i-col span="8">
                    <div class="prop-label">
                      <span slot="prepend">用户类型 :</span>
                    </div>
                  </i-col>
                  <i-col span="16">
                    <div class="prop-switch">
                      <Select v-model="updateUserInfo.type">
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
              </i-col>
            </Row>
          </Form>
        </div>
      </Modal>
      <Modal
        v-model="showCreate"
        title="用户创建"
        @on-ok="createUser(addUserInfo)"
        @on-cancel="showCreate = false"
      >
        <!-- 表单进行新建用户 -->
        <div class="form-box">
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
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
// import store from '@/vuex/store';
import { mapActions } from 'vuex';
import constant from '../../util/constant';
import validator from '../../util/validator';
import time from '../../util/time';

export default {
  name: 'UserManagement',
  data () {
    return {
      totalNum: 0,
      searchParams: {
        pageSize: 10,
        pageNum: 1,
        username: '',
        email: '',
        telephone: '',
        type: '',
        status: '',
        startTime: '',
        endTime: ''
      },
      updateUserInfo: {},
      showUpdate: false,
      addUserInfo: { isActive: true, type: constant.USER_TYPE.CUSTOMER },
      showCreate: false,
      userTypeList: [],
      userList: [],
      columns: [
        {
          title: '用户id',
          key: 'id',
          width: 180,
          align: 'center'
        },
        {
          title: '用户名',
          key: 'username',
          width: 108,
          align: 'center'
        },
        {
          title: '头像',
          key: 'avatar',
          width: 90,
          render: (h, params) => {
            return h(
              'div',
              {
                class: 'user-img',
                attrs: {
                  style:
                    'margin-bottom: 3px; width: 50px; height: 50px;' +
                    'border-radius: 25px; overflow: hidden;'
                }
              },
              [
                h('img', {
                  attrs: { src: params.row.avatar, style: 'width: 100%;' }
                })
              ]
            );
          },
          align: 'center'
        },
        {
          title: '邮箱',
          width: 200,
          key: 'email',
          align: 'center'
        },
        {
          title: '手机号',
          width: 130,
          key: 'telephone',
          align: 'center'
        },
        {
          title: '用户类型',
          key: 'typeZh',
          width: 100,
          align: 'center'
        },
        {
          title: '创建时间',
          width: 180,
          key: 'createTime',
          align: 'center'
        },
        {
          title: '用户状态',
          width: 100,
          key: 'statusZh',
          align: 'center'
        },
        {
          title: '操作',
          width: 170,
          key: 'id',
          render: (h, params) => {
            return h('div', { class: 'cell-button-container' }, [
              params.row.isActive
                ? h(
                  'Button',
                  {
                    props: { type: 'info', size: 'small' },
                    style: { margin: '2px' },
                    on: {
                      click: () => {
                        this.changeUserStatus(params.row, 1);
                      }
                    }
                  },
                  '冻结'
                )
                : h(
                  'Button',
                  {
                    props: { type: 'warning', size: 'small' },
                    style: { margin: '2px' },
                    on: {
                      click: () => {
                        this.changeUserStatus(params.row, 0);
                      }
                    }
                  },
                  '解冻'
                ),
              h(
                'Button',
                {
                  props: { type: 'success', size: 'small' },
                  style: { margin: '2px' },
                  on: {
                    click: () => {
                      this.showModifyModal(params.row);
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
                      this.deleteUser(params.row.id);
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
      // 时间选择器
      startTimeOption: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now();
        }
      },
      endTimeOption: {}
    };
  },
  created: function () {
    // 构造下拉选项
    this.$data.userTypeList.push({ value: null, label: '未选择' });
    for (var item in constant.USER_TYPE_ZH) {
      this.$data.userTypeList.push({
        value: item,
        label: constant.USER_TYPE_ZH[item]
      });
    }
    this.$log.d(this.$data.userTypeList);
    // 请求数据
    this.updateUserList();
  },
  methods: {
    // 绑定异步请求数据方法
    ...mapActions([
      constant.ACTIONS.GET_USER_LIST,
      constant.ACTIONS.UPDATE_USER_INFO,
      constant.ACTIONS.CREATE_USER,
      constant.ACTIONS.DELETE_USER
    ]),
    pageNumChange (pageNum) {
      this.$log.d('pageNum is ' + pageNum);
      this.$data.searchParams.pageNum = pageNum;
      this.updateUserList();
    },
    pageSizeChange (pageSize) {
      this.$log.d('pageSize is ' + pageSize);
      this.$data.searchParams.pageSize = pageSize;
      this.updateUserList();
    },
    changeUserStatus (userInfo, status) {
      this.$log.d('this is change user status operation!');
      this.$log.d(userInfo);
      this.$log.d(status);
      userInfo.status = status;
      this.$Loading.start();
      this.updateAccount(userInfo).then(result => {
        this.$Loading.finish();
        if (result.code === constant.OK_CODE) {
          // this.$data.totalNum = 600;
          // this.process(result.data);
          this.$Message.success(result.message);
          // 更新后，刷新userList列表
          this.updateUserList();
        } else {
          this.$Message.error(result.message);
        }
      });
    },
    showModifyModal (userInfo) {
      this.$log.d('this is show modify user modal operation!');
      this.$log.d(userInfo);
      this.$data.updateUserInfo = JSON.parse(JSON.stringify(userInfo));
      this.$data.updateUserInfo.isActive = userInfo.status === 0;
      this.$data.showUpdate = true;
      this.$data.userInfoRules.password[0].required = false;
    },
    showCreateModal () {
      this.$log.d('this is show create user modal operation!');
      // this.$data.addUserInfo = {};
      this.$data.showCreate = true;
      // 创建用户的时候密码是必须的
      this.$data.userInfoRules.password[0].required = true;
    },
    deleteUser (id) {
      this.$log.d('this is deleted user operation!');
      this.$log.d(id);
      this.$Loading.start();
      this.deleteAccount(id).then(result => {
        this.$Loading.finish();
        if (result.code === constant.OK_CODE) {
          this.$Message.success(result.message);
          // 更新后，刷新userList列表
          this.updateUserList();
        } else {
          this.$Message.error(result.message);
        }
      });
    },
    // 发送更新用户请求
    updateUser (userinfo) {
      this.$log.d('进行更新用户信息！');
      this.$log.d(userinfo);
      userinfo.status = userinfo.isActive ? 0 : 1;
      this.$refs['updateForm'].validate(valid => {
        if (valid) {
          this.$Loading.start();
          this.updateAccount(userinfo).then(result => {
            this.$Loading.finish();
            if (result.code === constant.OK_CODE) {
              // this.$data.totalNum = 600;
              // this.process(result.data);
              this.$Message.success(result.message);
              // 更新后，刷新userList列表
              this.updateUserList();
            } else {
              this.$Message.error(result.message);
            }
          });
        } else {
          this.$Message.error('请检查填写字段的格式！');
        }
      });
    },
    // 发送创建用户请求
    createUser (userinfo) {
      this.$log.d('进行创建用户！');
      this.$log.d(userinfo);
      userinfo.status = 0;
      this.$refs['createForm'].validate(valid => {
        if (valid) {
          this.$Loading.start();
          this.createAccount(userinfo).then(result => {
            this.$Loading.finish();
            if (result.code === constant.OK_CODE) {
              // this.$data.totalNum = 600;
              // this.process(result.data);
              this.$Message.success(result.message);
              this.$data.addUserInfo = {};
              // 更新后，刷新userList列表
              this.updateUserList();
            } else {
              this.$Message.error(result.message);
            }
          });
        } else {
          this.$Message.error('请检查填写字段的格式！');
        }
      });
    },
    // 请求后端获取用户列表
    updateUserList () {
      this.$Loading.start();
      var params = this.$data.searchParams;
      // 格式化时间格式
      params.startTime = params.startTime
        ? time.formatTime(params.startTime)
        : params.startTime;
      params.endTime = params.endTime
        ? time.formatTime(params.endTime)
        : params.endTime;
      this.$log.d('查询用户列表的params');
      this.$log.d(params);
      this.getUserList(params).then(result => {
        this.$log.d('获取到用户列表数据');
        this.$log.d(result);
        this.$Loading.finish();
        if (result.code === constant.OK_CODE) {
          // this.$data.totalNum = 600;
          this.$data.totalNum = result.totalNum;
          this.process(result.data);
        } else {
          this.$Message.error(result.message);
          // this.$router.push('/login');
        }
      });
    },
    // 解析反馈的用户列表数据
    process (userList) {
      var list = [];
      for (let i = 0; i < userList.length; i++) {
        let user = userList[i];
        user.statusZh = constant.USER_STATUS_ZH[user.status];
        user.typeZh = constant.USER_TYPE_ZH[user.type];
        user.isActive = user.status === 0;
        // TODO 后续支持上传头像后修改此处
        user.avatar = 'static/img/head.png';
        list.push(user);
      }
      this.userList = list;
      this.$log.d(this.userList);
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
.prop-label {
  /* margin-top: 3px; */
  /* padding-top: 5px; */
  padding-left: 10px;
  width: 100%;
  font-size: 14px;
  /* text-align: center; */
}
.prop-switch .prop-select .prob-picker {
  /* margin-top: 3px; */
  padding-top: 5px;
  /* font-size: 11pt; */
}
</style>
<style>
.ivu-select-selection {
  border-radius: 0px 4px 4px 0px;
}
.goods-search .ivu-col.ivu-col-span-6 div input {
  display: none;
  }
</style>
