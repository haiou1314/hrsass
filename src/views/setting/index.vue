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
                <el-button
                  size="small"
                  type="success"
                  @click="showPermissionList(row.id)"
                  >分配权限</el-button
                >
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
    <!-- 权限对话框 -->
    <el-dialog
      @close="onclose"
      title="提示"
      :visible.sync="showPermission"
      width="30%"
    >
      <el-tree
        ref="tree"
        v-if="showPermission"
        default-expand-all
        show-checkbox
        node-key="id"
        :data="permission"
        :default-checked-keys="difaultCheckKeys"
        :props="{ label: 'name' }"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onclose">取 消</el-button>
        <el-button type="primary" @click="onpermission">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleApi,
  addRoleApi,
  deleteRoleApi,
  getRolesInfo,
  assignPerm,
} from '@/api/role'
import { getCompanyInfoApi } from '@/api/setting'
import { getPermissionList } from '@/api/permission'
import { tranListToTreeData } from '@/utils/index'
export default {
  data() {
    return {
      showPermission: false,
      activeName: 'first',
      tableData: [],
      total: 0,
      pagesize: 10,
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
      permission: [],
      difaultCheckKeys: [],
      roleId: '',
    }
  },

  created() {
    this.getRole()
    this.getCompanyInfo()
    this.getPermissionList()
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
    },
    // 获取所有权限列表
    async getPermissionList() {
      const res = await getPermissionList()
      const treePermission = tranListToTreeData(res, '0')
      this.permission = treePermission
    },
    // 点击开启分配角色弹框
    async showPermissionList(id) {
      this.roleId = id
      this.showPermission = true
      const res = await getRolesInfo(id)
      this.difaultCheckKeys = res.permIds
      console.log(res)
    },
    //关闭弹窗
    onclose() {
      this.showPermission = false
      this.difaultCheckKeys = []
    },
    // 点击确定
    async onpermission() {
      // console.log(this.roleId)
      // console.log(this.$refs.tree.getCheckedKeys())
      await assignPerm({
        id: this.roleId,
        permIds: this.$refs.tree.getCheckedKeys(),
      })
      this.$message.success('分配成功')
      this.showPermission = false
    },
  },
}
</script>

<style scoped lang="scss">
.tishi {
  margin-bottom: 50px;
}
</style>
