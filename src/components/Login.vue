<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区 -->
            <div class="avatar_box">
                <img src="../assets/hg.jpg" alt="">
            </div>

            <!-- 登录表单区 -->
            <el-form ref="loginFormRef" class="login_form" :model="loginForm" :rules="loginRules">
                <!-- 用户名区 -->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
                </el-form-item>
                
                <!-- 密码区 -->
                <el-form-item prop="password">
                    <el-input type="password" v-model="loginForm.password" prefix-icon="el-icon-lock"></el-input>
                </el-form-item>

                <!-- 按钮区 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click='login'>登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>

            </el-form>

        </div>
    </div>
</template>

<script>
export default {
  data(){
    return{
         //登录表单的数据绑定对象
        loginForm:{
            username: 'admin',
            password: '123456'
        },
        // 表单验证
        loginRules:{
            // 验证用户名 prop
            username: [
                { required: true, message: '请输入用户名', trigger: 'blur' },
                { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
            ],
            // 验证密码 prop
            password: [
                { required: true, message: '密码不能为空!', trigger: 'blur' },
                { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
            ]
        }

    }
  },
  methods:{
    //   表单重置 ref 引用
    resetLoginForm(){
        // console.log(this)
        this.$refs.loginFormRef.resetFields()
    },
    login(){
        this.$refs.loginFormRef.validate(async v => {
            if (!v) return;
            // 验证通过发送请求
            const {data:res} = await this.$http.post('login',this.loginForm);
            if (res.status !== 200) return this.$my_message.error('登录失败！');
            this.$my_message.success('登录成功');
            
            // 登录成功之后token保存到sessionStorage中
                // 1.1项目中出来登录接口外，其他的接口都要通过登录的token才能访问
                // 1.2 token只能在当前网站打开起见生效，所以将token保存在sessionStorage中，
            //2，通过导航跳转到后台主页，地址是 /home
            window.sessionStorage.setItem('token',res.token);
            this.$router.push('/home');
        })
    }
  }
}
</script>


<style lang="less" scoped>
.login_container{
    background-color: #2b4b6b;
    height: 100%
}
.login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    .avatar_box{
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 8px;
        box-shadow: 0 0 8px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: #fff;
        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
            }
        }
}
.btns{
    display: flex;
    justify-content: flex-end;
}
.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;
}
</style>
