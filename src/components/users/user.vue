<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户中心</el-breadcrumb-item>
      <el-breadcrumb-item>功能1</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button @click="getUserList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>

        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格区 -->
      <el-table :data="userList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <!-- 作用域插槽 -->
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              :active-value="1"
              :inactive-value="0"
              @change="changStated(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>

        <!-- 自定义作用域插槽 -->
        <el-table-column label="操作" width="175px">
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>

          <!-- 分配角色按钮 -->
          <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
          </el-tooltip>
        </el-table-column>
      </el-table>

      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 5]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 弹出的对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%">
      <!-- 内容信息 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>

        <el-form-item label="角色" prop="role_name">
          <el-select v-model="addForm.ops" placeholder="请选择">
            <el-option v-for="item in options" :key="item.ops" :label="item.ops" :value="item.ops"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //获取用户列表的对象
      queryInfo: {
        query: "",
        //当前页码
        pagenum: 1,
        //当前每页显示几条
        pagesize: 2
      },
      userList: [],
      total: 0,
      // 控制添加用户表单数据的显示
      dialogVisible: false,
      //用户表单信息绑定
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
        ops: ""
      },
      // 用户表单验证
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ],
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        mobile: [{ required: true, message: "请输入电话", trigger: "blur" }],
        role_name: [{ required: true, message: "请选择角色类型", trigger: "blur"}]
      },
      options: [{ ops: "超级管理员" }, { ops: "项目主管" }, { ops: "普通员工" }]
    };
  },

  created() {
    this.getUserList();
  },

  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      if (res.message !== "OK") {
        return this.$my_message.error("获取用户数据失败！");
      }
      this.userList = res.data.users;
      this.total = res.data.total;
      // console.log(res)
    },

    //监听pagesize改变的事件
    handleSizeChange(newSize) {
      console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },

    //将他页码值改变的事件
    handleCurrentChange(newpage) {
      console.log(newpage);
      this.queryInfo.pagenum = newpage;
      this.getUserList();
    },

    //修改用户状态请求
    async changStated(user) {
      const { data: res } = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      if (res.message !== "OK") {
        // 保证页面的数据不变
        user.mg_state = !user.mg_state;
        return this.$my_message.error("更新失败！");
      }
      this.$my_message.success("更新成功");
    }
  }
};
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
  font-size: 13px;
}
</style>