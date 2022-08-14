<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName" @tab-click="activeTabs">
          <el-tab-pane name="account" label="登录账户设置">
            <!-- 放置表单 -->
            <el-form
              label-width="120px"
              style="margin-left: 120px; margin-top: 30px"
            >
              <el-form-item label="姓名:">
                <el-input v-model="fromDatail.username" style="width: 300px" />
              </el-form-item>
              <el-form-item label="密码:">
                <el-input
                  v-model="fromDatail.password"
                  style="width: 300px"
                  type="password"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSove">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane name="userinfo" label="个人详情">
            <userinfo />
          </el-tab-pane>
          <el-tab-pane name="job" label="岗位信息" />
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { userinfoDateil, saveUserDetailById } from '@/api/user'
import userinfo from './components/user-info.vue'
import Cookies from 'js-cookie'
export default {
  data() {
    return {
      fromDatail: {},
      activeName: Cookies.get('activeName') || 'account',
    }
  },

  created() {
    this.layoutUserdetail()
  },
  components: {
    userinfo,
  },

  methods: {
    // 获取员工个人信息
    async layoutUserdetail() {
      const res = await userinfoDateil(this.$route.params.id)
      this.fromDatail = res
    },
    // 更新用信息
    async onSove() {
      await saveUserDetailById(this.fromDatail)
      this.$message.success('更新用户成功')
    },
    // 存入Cookies
    activeTabs() {
      Cookies.set('activeName', this.activeName)
    },
  },
}
</script>

<style scoped></style>
