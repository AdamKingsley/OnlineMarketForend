<template>
  <!-- 登录页面 -->
  <div>
    <Row class="container">
      <i-col span="13"
             offset="2"
             class="login-img-box">
        <img src="static/img/sale.jpg"
             alt="" />
      </i-col>
      <i-col span="7"
             class="login-box">
        <div class="login-container">
          <div class="login-header">
            <p>欢迎登录</p>
          </div>
          <div class="form-box">
            <Form ref="formInline"
                  :model="formData"
                  :rules="ruleInline">
              <FormItem prop="username">
                <i-input type="text"
                         v-model="formData.username"
                         clearable
                         size="large"
                         placeholder="用户名">
                  <Icon type="person"
                        slot="prepend"></Icon>
                </i-input>
              </FormItem>
              <FormItem prop="password">
                <i-input type="password"
                         v-model="formData.password"
                         clearable
                         size="large"
                         placeholder="密码">
                  <Icon type="ios-locked-outline"
                        slot="prepend"> </Icon>
                </i-input>
              </FormItem>
              <FormItem>
                <Button type="error"
                        size="large"
                        @click="handleSubmit('formInline')"
                        long>登录</Button>
              </FormItem>
            </Form>
          </div>
        </div>
      </i-col>
    </Row>
  </div>
</template>

<script>
import store from '@/vuex/store';
import { mapMutations, mapActions } from 'vuex';
import constant from '../util/constant';

export default {
  name: 'Login',
  data () {
    return {
      formData: {
        username: '',
        password: ''
      },
      ruleInline: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            type: 'string',
            min: 5,
            message: '密码不能少于5位',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  created: function () {
    // this.$options.methods.obtainUser(this);
    // const father = this;
    // this.getUser().then(result2 => {
    //   father.$log.d(result2);
    //   if (result2.code === constant.OK_CODE) {
    //     this.$Message.success(result2.message);
    //     // 获取用户类型，进行跳转逻辑
    //     var userType = result2.data.type;
    //     if (userType === constant.USER_TYPE.ADMIN) {
    //       // admin页面
    //       father.$router.push('/home');
    //     } else if (userType === constant.USER_TYPE.MERCHANT) {
    //       // merchant 页面
    //       father.$router.push('/merchant');
    //     } else {
    //       father.$router.push('/');
    //     }
    //   } else {
    //     this.$Message.error(result2.message);
    //     father.$$router.push('/login');
    //   }
    // });
    // console.group('created 创建完毕');
    // console.log('el: ' + this.$el);
    // console.log('data: ' + this.$data + JSON.stringify(this.$data));
    // console.log('message: ' + this.message);
  },
  methods: {
    ...mapMutations([constant.MUTATIONS.SET_USER_LOGIN_INFO]),
    ...mapActions([constant.ACTIONS.LOGIN, constant.ACTIONS.GET_USER]),
    handleSubmit (name) {
      const father = this;
      // log debug 打印
      this.$log.d(name);
      this.$log.d(father.formData);
      this.$refs[name].validate(valid => {
        if (valid) {
          this.login(father.formData).then(result => {
            father.$log.d(result);
            if (result.code === constant.OK_CODE) {
              this.$Message.success(result.message);
              father.$log.d(result);
              // father.$options.methods.obtainUser(father);
              // father.$router.push('/');
              this.getUser().then(result2 => {
                father.$log.d(result2);
                if (result2.code === constant.OK_CODE) {
                  this.$Message.success(result2.message);
                  // 获取用户类型，进行跳转逻辑
                  var userType = result2.data.type;
                  if (userType === constant.USER_TYPE.ADMIN) {
                    // admin页面
                    father.$router.push('/home');
                  } else if (userType === constant.USER_TYPE.MERCHANT) {
                    // merchant 页面
                    father.$router.push('/merchant');
                  } else {
                    father.$router.push('/');
                  }
                } else {
                  this.$Message.error(result2.message);
                }
              });
            } else {
              this.$Message.error(result.message);
            }
          });
        } else {
          this.$Message.error('请填写正确的用户名或密码');
        }
      });
    }
  },
  store
};
</script>

<style scoped>
.container {
  margin-top: 30px;
  height: 485px;
  background-color: #fff;
}
.login-img-box {
  height: 485px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-img-box > img {
  width: 68%;
}
.login-box {
  height: 485px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-container {
  width: 80%;
  height: 280px;
  border: #ed3f14 solid 1px;
}
.login-header {
  height: 50px;
  font-size: 20px;
  text-align: center;
  line-height: 50px;
  letter-spacing: 5px;
  color: #fff;
  background-color: #ed3f14;
}
.form-box {
  width: 80%;
  margin: 30px auto;
}
</style>
