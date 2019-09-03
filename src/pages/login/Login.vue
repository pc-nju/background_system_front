<template>
  <div class="login-container">
    <!-- 在使用表单验证时，需要注意：
    1.必须给表单对象绑定一个对象：:model="loginForm"，而且不能写成：v-model="loginForm"
    2.所有的子控件的绑定对象必须是表单对象的内部对象，比如：v-model="loginForm.username"，否则总是验证失败
     -->
    <el-form class="login-form" :model="loginForm" ref="loginForm" 
    :rules="rules" label-position="left" v-loading="loading">
      <h3 class="login-title">系统登录</h3>
      <el-form-item prop="username">
        <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码" @keyup.enter.native="submitClick('loginForm')"></el-input>
      </el-form-item>
      <el-checkbox class="login-remember" v-model="checked">记住密码</el-checkbox>
      <el-form-item>
        <el-button class="login-button" type="primary" @click="submitClick('loginForm')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "Login",
  data() {
    return {
      rules: {
          username: [
              { required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          password: [
              { required: true, message: '请输入密码', trigger: 'blur'}
          ]
      },
      loginForm: {
        username: '',
        password: ''
      },
      checked: true,
      loading: false
    };
  },
  methods: {
    submitClick(formName) {
        // 表单验证
        this.$refs[formName].validate(valid => {
            if(valid) {
                var _this = this
                this.loading = true
                var url = '/login'
                var params = {
                    username: this.loginForm.username,
                    password: this.loginForm.password
                }
                this.postRequestByForm(url, params)
                .then(resp => {
                    _this.loading = false
                    if(resp && resp.status == 200) {
                        var data = resp.data
                        _this.$store.commit('login', data.obj)
                        // 得到登陆成功后要跳转的路径
                        var redirectPath = _this.$route.query.redirect
                        // 注意和上面 $route 写法不一样
                        _this.$router.replace({
                            path: redirectPath == '/' || redirectPath == undefined ? '/home' : redirectPath
                        })
                    }
                })
            } else {
                return false
            }
        })
    }
  }
};
</script>
<style lang="stylus" scoped>
  .login-container
    padding 0
    margin 0
    border 0
    .login-form
      position absolute
      top 50%
      left 50%
      width 350px
      transform translate(-50%,-55%)
      padding 35px 35px 15px 35px
      border 1px solid #eaeaea
      border-radius 15px
      box-shadow 0 0 25px #cac6c6
      background #fff
      .login-title
          margin 0 auto 40px auto
          text-align center
          color #505458
      .login-remember
          margin 0 0 35px 0
          text-align left 
      .login-button
          width 100%
</style>
