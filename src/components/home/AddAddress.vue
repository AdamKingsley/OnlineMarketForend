<template>
  <div>
    <div class="add-container">
      <div class="add-title">
        <h1>添加收货地址</h1>
      </div>
      <div class="add-box">
        <Form
          :model="formData"
          label-position="left"
          :label-width="100"
          :rules="ruleInline"
          ref="addressForm"
        >
          <FormItem label="收件人" prop="name">
            <i-input v-model="formData.name" size="large"></i-input>
          </FormItem>
          <FormItem label="收件地区" prop="address">
            <Distpicker
              :province="formData.province"
              :city="formData.city"
              :area="formData.area"
              @province="getProvince"
              @city="getCity"
              @area="getArea"
            ></Distpicker>
          </FormItem>
          <FormItem label="收件地址" prop="address">
            <i-input v-model="formData.address" size="large"></i-input>
          </FormItem>
          <FormItem label="手机号码" prop="telephone">
            <i-input v-model="formData.telephone" size="large"></i-input>
          </FormItem>
          <FormItem label="邮政编码" prop="postalCode">
            <i-input v-model="formData.postalCode" size="large"></i-input>
          </FormItem>
        </Form>
      </div>
      <div class="add-submit">
        <Button type="primary" @click="add">添加地址</Button>
      </div>
    </div>
  </div>
</template>

<script>
import Distpicker from 'v-distpicker';
import { mapActions } from 'vuex';
import constant from '../../util/constant';
export default {
  name: 'AddAddress',
  data () {
    return {
      formData: {
        name: '',
        address: '',
        telephone: '',
        postalCode: '',
        province: '广东省',
        city: '广州市',
        area: '天河区'
      },
      ruleInline: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
        postalCode: [
          { required: true, message: '请输入邮政编码', trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            type: 'string',
            pattern: /^1[3|4|5|7|8][0-9]{9}$/,
            message: '手机号格式出错',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  methods: {
    ...mapActions([constant.ACTIONS.ADD_ADDRESS, constant.ACTIONS.IS_LOGIN]),
    add () {
      this.$refs.addressForm.validate(valid => {
        if (valid) {
          this.$log.d('this is add address function!!!!!!');
          this.$log.d(this.formData);
          this.$Loading.start();
          this.addAddress(this.formData).then(result => {
            if (result.code === constant.OK_CODE) {
              this.$Message.success('添加成功！');
              this.$Loading.finish();
              this.$router.push('/home/myAddress');
            } else {
              this.$Message.error(result.message);
            }
          });
        } else {
          this.$Message.error('添加失败，请检查输入字段的格式！');
        }
      });
    },
    getProvince (data) {
      this.formData.province = data.value;
    },
    getCity (data) {
      this.formData.city = data.value;
    },
    getArea (data) {
      this.formData.area = data.value;
    }
  },
  components: {
    Distpicker
  }
};
</script>

<style scoped>
.add-container {
  margin: 15px auto;
  width: 60%;
  min-width: 600px;
}
.add-title {
  margin-bottom: 15px;
  text-align: center;
}
.add-submit {
  display: flex;
  justify-content: center;
}
</style>
