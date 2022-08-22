<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools :ishowLeft="false">
        <template slot="right">
          <el-button type="primary" @click="add('0', 1)">添加权限</el-button>
        </template>
      </PageTools>
      <el-table
        ref="table"
        row-key="id"
        :data="permission"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="name" label="名称" width="180">
          <template v-slot="{ row }">
            <i
              class="el-icon-folder-opened"
              v-if="row.children"
              @click="expoend(row)"
            ></i>
            {{ row.name }}
          </template>
        </el-table-column>
        <el-table-column prop="code" label="标识" width="180">
        </el-table-column>
        <el-table-column prop="description" label="描述"> </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button type="text" @click="add(row.id, 1)">添加</el-button>
            <el-button type="text">编辑</el-button>
            <el-button type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 放置一个弹层 用来编辑新增节点 -->
      <el-dialog :title="`添加权限点`" :visible="showDialog" @close="btnCancel">
        <!-- 表单 -->
        <el-form
          ref="perForm"
          :model="formData"
          :rules="rules"
          label-width="120px"
        >
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="formData.name" style="width: 90%" />
          </el-form-item>
          <el-form-item label="权限标识" prop="code">
            <el-input v-model="formData.code" style="width: 90%" />
          </el-form-item>
          <el-form-item label="权限描述">
            <el-input v-model="formData.description" style="width: 90%" />
          </el-form-item>
          <el-form-item label="开启">
            <el-switch
              v-model="formData.enVisible"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
        </el-form>
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" type="primary" @click="btnOK"
              >确定</el-button
            >
            <el-button size="small" @click="btnCancel">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getPermissionList, addPermission } from '@/api/permission'
import { tranListToTreeData } from '@/utils'
export default {
  data() {
    return {
      permission: [],
      list: [],
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0', // 开启
      },
      rules: {
        name: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' },
        ],
        code: [
          { required: true, message: '权限标识不能为空', trigger: 'blur' },
        ],
      },
      showDialog: false,
    }
  },

  created() {
    this.getPermissionList()
  },

  methods: {
    // 获取数据
    async getPermissionList() {
      const res = await getPermissionList()
      this.permission = tranListToTreeData(res, '0')
      console.log(this.permission)
    },
    // 展开
    expoend(row) {
      row.isTrue = !row.isTrue
      this.$refs.table.toggleRowExpansion(row, row.isTrue)
    },
    // 点击关闭
    btnCancel() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0', // 开启
      }
      this.$refs.perForm.resetFields()
      this.showDialog = false
    },
    // 点击确定
    btnOK(id, type) {
      this.$refs.perForm
        .validate()
        .then(() => {
          if (this.formData.id) {
            return updatePermission(this.formData)
          }
          return addPermission(this.formData)
        })
        .then(() => {
          //  提示消息
          this.$message.success('新增成功')
          this.getPermissionList()
          this.showDialog = false
        })
    },
    add(id, type) {
      this.formData.pid = id
      this.formData.type = type
      this.showDialog = true
    },
  },
}
</script>

<style scoped lang="scss">
::v-deep .el-icon-arrow-right {
  display: none;
}
</style>
