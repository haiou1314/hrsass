<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-tabs v-model="activeName">
        <el-tab-pane label="角色管理" name="first">
          <el-button type="primary" @click="close">新增角色</el-button>
          <!-- 表格 -->
          <el-table :data="tableData" style="width: 100%">
            <el-table-column type="index" label="序号" width="180">
            </el-table-column>
            <el-table-column prop="name" label="角色" width="180">
            </el-table-column>
            <el-table-column prop="description" label="描述"> </el-table-column>
            <el-table-column prop="address" label="操作">
              <template slot-scope="{ row }">
                <el-button size="small" type="success">分配权限</el-button>
                <el-button size="small" type="primary">编辑</el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click="removeReol(row.id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            layout="sizes,prev, pager, next"
            :total="total"
            :page-size="pagesize"
            @current-change="currentChange"
            @size-change="handleSizeChange"
            :page-sizes="[2, 5, 8, 10]"
          >
          </el-pagination>
        </el-tab-pane>

        <el-tab-pane label="公司信息" name="second">
          <el-alert
            class="tishi"
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            type="info"
            show-icon
            :closable="false"
          >
          </el-alert>
          <el-form ref="form" label-width="80px">
            <el-form-item label="公司名称">
              <el-input v-model="companyInfo.name" disabled></el-input>
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input
                v-model="companyInfo.companyAddress"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="公司邮箱">
              <el-input v-model="companyInfo.mailbox" disabled></el-input>
            </el-form-item>

            <el-form-item label="备注">
              <el-input v-model="companyInfo.remarks" disabled></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 弹框 -->
    <el-dialog
      title="提示"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="dialogClos"
    >
      <el-form
        ref="form"
        :model="addRoleForm"
        :rules="addRoleFormRules"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="addRoleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="addRoleForm.description"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleApi, addRoleApi, deleteRoleApi } from '@/api/role'
import { getCompanyInfoApi } from '@/api/setting'
export default {
  data() {
    return {
      activeName: 'first',
      tableData: [],
      total: 0,
      pagesize: 5,
      page: 1,
      addDialogVisible: false,
      addRoleForm: {
        name: '',
        description: '',
      },
      addRoleFormRules: {
        name: [{ required: true, message: '请填写手机号' }],
        description: [{ required: true, message: '请填写手机号' }],
      },
      companyInfo: {},
    }
  },

  created() {
    this.getRole()
    this.getCompanyInfo()
  },

  methods: {
    // 获取所有数据
    async getRole() {
      const { rows, total } = await getRoleApi({
        page: this.page,
        pagesize: this.pagesize,
      })
      this.total = total
      this.tableData = rows
    },
    // 监听第几页
    currentChange(val) {
      this.page = val
      this.getRole()
    },
    // 监听每页显示多少条
    handleSizeChange(val) {
      this.pagesize = val
      this.getRole()
    },
    // 关闭弹窗
    close() {
      this.addDialogVisible = true
    },
    // 添加角色
    async addRole() {
      try {
        await this.$refs.form.validate()
        await addRoleApi(this.addRoleForm)
        this.$message.success('添加成功')
        this.addDialogVisible = false
        this.getRole()
      } catch (error) {}
    },
    // 监听弹窗关闭事件
    dialogClos() {
      this.$refs.form.resetFields()
    },
    async removeReol(id) {
      //  提示
      try {
        await this.$confirm('确认删除该角色吗', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
        // 只有点击了确定 才能进入到下方
        await deleteRoleApi(id) // 调用删除接口
        this.getRole() // 重新加载数据
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error)
      }
    },
    async getCompanyInfo() {
      const res = await getCompanyInfoApi(
        this.$store.state.user.userinfo.companyId,
      )
      this.companyInfo = res
      console.log(res)
    },
  },
}
</script>

<style scoped lang="scss">
.tishi{
  margin-bottom: 50px;
}
</style>
