<template>
  <div>
    <div class="pay-container">
      <Alert show-icon>
        扫码支付
        <Icon type="qr-scanner" slot="icon"></Icon>
        <template slot="desc">请扫描右边二维码进行支付</template>
      </Alert>
      <div class="pay-box">
        <div class="pay-demo">
          <img src="static/img/pay/pay-demo.png" />
        </div>
        <div class="pay-qr-scan">
          <div class="pay-tips">
            <a @click="pay(false)"><p>点击我, 取消支付</p></a>
          </div>
          <img src="static/img/pay/pay-qrscan.png" />
          <div class="pay-tips">
            <a @click="pay(true)"><p>点击我, 完成支付</p></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/vuex/store';
import { mapActions } from 'vuex';
import constant from '../util/constant';
export default {
  name: 'Pay',
  data () {
    return {};
  },
  created () {
    var params = this.$route.params;
    this.$log.d('this is pay page created function!!!');
    this.$log.d(params);
  },
  methods: {
    ...mapActions([
      constant.ACTIONS.UPDATE_ORDER_STATE,
      constant.ACTIONS.UPDATE_ALL_ORDER_STATE
    ]),
    pay (state) {
      if (state) {
        var params = this.$route.params;
        var body = {};
        // 付款成功，需要更新订单状态
        this.$Loading.start();
        if (params.orderIds) {
          body = {
            orderStatus: constant.ORDER_STATUS.PAID,
            ids: params.orderIds
          };
          this.updateAllOrderState(body).then(result => {
            this.$Loading.finish();
            if (result.code === constant.OK_CODE) {
              this.$Message.success(result.message);
            } else {
              this.$Message.error(result.message);
            }
          });
        } else {
          body = {
            code: params.code,
            goodsId: params.goodsId,
            attrId: params.attrId,
            orderStatus: constant.ORDER_STATUS.PAID
          };
          this.updateOrderState(body).then(result => {
            this.$Loading.finish();
            if (result.code === constant.OK_CODE) {
              this.$Message.success(result.message);
            } else {
              this.$Message.error(result.message);
            }
          });
        }
      }
      this.$router.push({
        path: '/payDone',
        name: 'PayDone',
        query: { state: state }
      });
    }
  },
  store
};
</script>

<style scoped>
.pay-container {
  margin: 15px auto;
  width: 80%;
  min-width: 1000px;
}
.pay-box {
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.pay-demo {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.pay-demo img {
  height: 80%;
}
.pay-qr-scan {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.pay-tips {
  width: 50%;
  text-align: center;
  font-size: 14px;
  line-height: 30px;
}
.pay-tips a {
  color: #999999;
}
</style>
