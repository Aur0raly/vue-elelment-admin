<template>
  <div class="login_container">
    <div class="login_box">
      <!--头像区域-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!--表单区域-->
      <el-form :model="from" :rules="loginFormRules" ref="loginFormRef" class="form_login">
        <!--账号-->
        <el-form-item prop="username">
          <el-input v-model="from.username" prefix-icon="iconfont icon-user-account-box
                    .icon-user-account-box"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input v-model="from.password" type="password" prefix-icon="iconfont icon-https-symbol
                    .icon-https-symbol"></el-input>
        </el-form-item>
        <!--登录-->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data () {
    return {
      from: {
        username: 'admin',
        password: '123456'
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
    resetLoginForm () {
      // console.log(this);
      this.$refs.loginFormRef.resetFields()
    },
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
  background-color: #3c405f;
}

.login_box {
  width: 450px;
  height: 300px;
  background: #fff;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #EEE;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  background-color: #fff;
  transform: translate(-50%, -50%);

  img {
    width: 100%;
    height: 100%;
    transform: scale(0.9);
  }
}

.btns {
  display: flex;
  justify-content: flex-end;
}

.form_login {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 10px 0 10px;
  box-sizing: border-box;
}
</style>
