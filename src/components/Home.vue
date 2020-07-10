<template>
  <!-- <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>-->
  <el-container class="container">
    <el-header>
      <div>
        <img src="../assets/hg.jpg" height="60px" width="70px" />
        <span>王军的后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <el-container>
      <!-- 折叠时和不折叠时动态宽度 -->
      <el-aside :width="Iscollapse ? '64px' : '200px'">
        <!-- 添加折叠按钮 -->
        <div class="toggle-button" @click="zd">
          |||
        </div>
        <!-- 菜单栏 -->
        <!-- 取消动画，是否折叠 -->
        <el-menu :default-active='activepath' router :collapse-transition=false :collapse='Iscollapse' unique-opened background-color="#333744" text-color="#fff" active-text-color="#409EFF">
          <!-- 一级菜单 -->
          <el-submenu :index="'/' + item.path" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <i :class="icornObj[item.id]"></i>
              <span>{{item.name}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item @click="saveNavState(subitem.id)" :index="subitem.id" v-for="subitem in item.chard" :key="subitem.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subitem.cname}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <!-- <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">导航二</span>
          </el-menu-item>
          <el-menu-item index="3" disabled>
            <i class="el-icon-document"></i>
            <span slot="title">导航三</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-setting"></i>
            <span slot="title">导航四</span>
          </el-menu-item> -->
        </el-menu>
      </el-aside>

      <!-- 主体区 -->
      <el-main>
          <!-- 子组件 -->
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>


<script>
export default {
  data(){
    return{
      menulist:[],
      icornObj:{
        '01':"el-icon-user-solid",
        '02':"el-icon-lock",
        '03':"el-icon-data-line",
        '04':"el-icon-s-check"
      },
      Iscollapse:false,
      activepath:''
    }
  },
  created(){
    this.getMenuList(),
    this.activepath = window.sessionStorage.getItem('activePath')
  },

  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenuList(){
      const {data:res} = await this.$http.get('menus')
      // console.log(res.data)
      if (res.message !== 'OK') return this.$my_message.error(this.message)
        this.menulist = res.data
    },

    // 点击折叠的效果 取false 的反面True
    zd(){
      this.Iscollapse = !this.Iscollapse
    },

    //点击 保存激活状态栏
    saveNavState(activepath){
      window.sessionStorage.setItem('activePath',activepath)
    }

  }
};
</script>



<style lang="less" scoped>
.container {
  height: 100%;
}

.el-header {
  background: #303030;
  padding-left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background: #333744;
  .el-menu{
    border-right: none;
  }
}
.el-main {
  background: #10010023;
}
.toggle-button{
  background: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.4em;
  cursor: pointer;
}
</style>