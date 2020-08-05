<template>
  <div>
    <div v-if="!addressList || addressList.length === 0">
      <Alert show-icon class="tips-box">
        <Icon type="ios-lightbulb-outline" slot="icon"></Icon>
        <template slot="desc"
          >当前还没有地址列表，请及时添加收件人地址信息！</template
        >
      </Alert>
    </div>
    <div class="address-box" v-for="(item, index) in addressList" :key="index">
      <div class="address-header">
        <span>{{ item.name }}</span>
        <div class="address-action">
          <span @click="edit(index)"><Icon type="edit"></Icon> 修改</span>
          <span @click="del(index)"><Icon type="trash-a"></Icon> 删除</span>
        </div>
      </div>
      <div class="address-content">
        <p>
          <span class="address-content-title"> 收 货 人 :</span> {{ item.name }}
        </p>
        <p>
          <span class="address-content-title">手机号:</span>
          {{ item.telephone }}
        </p>
        <p>
          <span class="address-content-title">收货地区:</span>
          {{ item.province }} {{ item.city }} {{ item.area }}
        </p>
        <p>
          <span class="address-content-title">收货地址:</span>
          {{ item.address }}
        </p>
        <p>
          <span class="address-content-title">邮政编码:</span>
          {{ item.postalCode }}
        </p>
      </div>
    </div>
    <Modal v-model="modal" width="530">
      <p slot="header">
        <Icon type="edit"></Icon>
        <span>修改地址</span>
      </p>
      <div>
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
      <div slot="footer">
        <Button type="primary" size="large" long @click="editAddress"
          >修改</Button
        >
      </div>
    </Modal>
  </div>
</template>

<script>
import store from '@/vuex/store';
import { mapActions } from 'vuex';
import Distpicker from 'v-distpicker';
import constant from '../../util/constant';
export default {
  name: 'MyAddress',
  data () {
    return {
      modal: false,
      formData: {
        id: '',
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
      },
      addressList: []
    };
  },
  created () {
    this.loadAddress();
  },
  methods: {
    ...mapActions([
      constant.ACTIONS.GET_ADDRESS_LIST,
      constant.ACTIONS.UPDATE_ADDRESS,
      constant.ACTIONS.DELETE_ADDRESS
    ]),
    edit (index) {
      this.modal = true;
      this.formData.id = this.addressList[index].id;
      this.formData.province = this.addressList[index].province;
      this.formData.city = this.addressList[index].city;
      this.formData.area = this.addressList[index].area;
      this.formData.address = this.addressList[index].address;
      this.formData.name = this.addressList[index].name;
      this.formData.telephone = this.addressList[index].telephone;
      this.formData.postalCode = this.addressList[index].postalCode;
    },
    editAddress () {
      this.$refs.addressForm.validate(valid => {
        this.$log.d('表单检查结果！');
        this.$log.d(valid);
        if (valid) {
          this.$Loading.start();
          this.updateAddress(this.formData).then(result => {
            this.$Loading.finish();
            if (result.code === constant.OK_CODE) {
              this.$Message.success('修改成功');
              this.modal = false;
              this.loadAddress();
            } else {
              this.$Message.error('修改失败，请联系管理员！');
            }
          });
        } else {
          this.$Message.error('修改失败，请检查字段格式！');
        }
      });
    },
    del (index) {
      this.$Modal.confirm({
        title: '信息提醒',
        content: '你确定删除这个收货地址',
        onOk: () => {
          this.$Loading.start();
          this.removeAddress(this.addressList[index].id).then(result => {
            this.$Loading.finish();
            if (result.code === constant.OK_CODE) {
              this.$Message.success('删除成功！');
              this.modal = false;
              this.loadAddress();
            } else {
              this.$Message.error('删除失败，请联系管理员');
            }
          });
        },
        onCancel: () => {
          this.$Message.info('取消删除');
        }
      });
    },
    loadAddress () {
      this.$Loading.start();
      this.getAddressList().then(result => {
        this.$Loading.finish();
        if (result.code === constant.OK_CODE) {
          this.addressList = result.data;
        } else {
          this.$Message.error(result.message);
        }
      });
    }
  },
  components: {
    Distpicker
  },
  store
};
</script>

<style scoped>
.address-box {
  padding: 15px;
  margin: 15px;
  border-radius: 5px;
  box-shadow: 0px 0px 5px #ccc;
}
.address-header {
  height: 35px;
  display: flex;
  justify-content: space-between;
  /* float: right; */
  color: #232323;
  font-size: 18px;
}
.address-content {
  font-size: 14px;
}
.address-content-title {
  color: #999;
}
.address-action span {
  margin-left: 15px;
  font-size: 14px;
  color: #2d8cf0;
  cursor: pointer;
}
.tips-box {
  margin-bottom: 15px;
}
</style>
