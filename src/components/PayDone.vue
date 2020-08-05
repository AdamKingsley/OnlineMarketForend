<template>
  <div>
    <div v-if="state" class="pay-done-box">
      <img src="static/img/pay-success.png" />
    </div>
    <div v-else class="pay-done-box pay-fail">
      <img src="static/img/pay-fail.png" />
    </div>
    <div class="seconds-tips">
      <span
        >等待 <b>{{ seconds }}</b> 秒后跳转到首页，或
        <!-- <router-link
          @click="cancelTimeout"
          to="/"
          >点击这里
          </router-link> -->
          <b @click="cancelTimeout" style="color:blue">点击这里</b>
        </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PayDone',
  data () {
    return {
      state: false,
      seconds: 5,
      timeout: null
    };
  },
  created () {
    // 设定筛选条件merchantId的值，
    // 兼容商家(state中获取)和用户查询(params中获取)的情况
    const father = this;
    this.$data.state = this.$route.query.state;
    // 定时跳转
    var interval = setInterval(() => {
      father.$data.seconds = father.$data.seconds - 1;
    }, 1000);
    this.$data.timeout = setTimeout(() => {
      father.$data.seconds = 0;
      clearInterval(interval);
      father.$router.push('/');
    }, 5000);
  },
  methods: {
    cancelTimeout () {
      if (this.$data.timeout) {
        clearTimeout(this.$data.timeout);
      }
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.pay-done-box {
  height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.pay-fail img {
  width: 500px;
  height: 500px;
}
.seconds-tips {
  width: 100%;
  text-align: center;
  font-size: 14pt;
}
</style>
