<template>
  <div class="login_container">
    <div class="login">
      <div class="login_box">
<!--        &lt;!&ndash;头像区域&ndash;&gt;-->
<!--        <div class="avatar_box">-->
<!--          <img src="../assets/images/avatar.svg" alt="">-->
<!--        </div>-->
        <div class="login_text">
          欢迎登录
        </div>
        <!--表单区域-->
        <el-form :model="from" :rules="loginFormRules" ref="loginFormRef" class="form_login">
          <!--账号-->
          <el-form-item prop="username" style="margin-bottom: 50px">
            <i class="iconfont icon-username"></i>
            <el-input v-model="from.username" placeholder="请输入账号"></el-input>
          </el-form-item>
          <!--密码-->
          <el-form-item prop="password">
            <i class="iconfont icon-password"></i>
            <el-input v-model="from.password" type="password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <!--登录-->
          <el-form-item class="btns">
            <el-button round type="primary" @click="login" class="login_button">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data () {
    return {
      from: {
        username: '',
        password: ''
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 3, max: 18, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // resetLoginForm () {
    //   // console.log(this);
    //   this.$refs.loginFormRef.resetFields()
    // },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.from)
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('账户或密码错误，登录失败')
        this.$message.success('登录成功')
        // console.log(res.data.token)
        window.sessionStorage.setItem('token', res.data.token)
        await this.$router.push('/home')
      })
    }
  }
}
</script>

<style scoped="scoped" lang="less">
.login_container {
  height: 100%;
  background-image: url('~@/assets/images/bgimg.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: center;
}

.login {
  background-image: url("~@/assets/images/login_box.png");
  width: 1314px;
  height: 660px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-radius: 30px;
}

.login_text {
  font-size: 55px;
  font-weight: bold;
  color: #3e58c6;
  width: 330px;
  margin-bottom: 70px;
  height: 85px;
  text-align: center;
  border-bottom: 4px solid #6386ff;
}

.login_pic {
  transform: translate(15px, 0px);
  img {
    width: 500px;
    height: 600px;
  }
}

.login_box {
  width: 450px;
  height: 450px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transform: translate(65%, 0%);
}

.btns {
  display: flex;
  justify-content: flex-end;
  margin-top: 50px;
  .login_button {
    background-color: #3e58c6;
    height: 65px;
    width: 230px;
    border-radius: 115px;
    font-size: 25px;
    font-weight: bold;
    border: unset;
  }
}

.form_login {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 10px 0 10px;
  box-sizing: border-box;
  /deep/ .el-form-item__content {
    display: flex;
    align-items: center;
    .icon-username, .icon-password {
      font-size: 40px;
      color: #3e58c6;
      margin-right: 15px;
    }
  }
  .el-input {
    /deep/ .el-input__inner {
      background-color: #eeeff3;
      width: 390px;
      height: 60px;
      border-radius: 30px;
      border: unset;
      font-size: 20px;
    }
  }
}
</style>
