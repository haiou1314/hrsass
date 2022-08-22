<template>
  <div>
    <el-dialog
      title="分配角色"
      :visible="visible"
      width="30%"
      :modal="false"
      @close="close"
      @open="onOpen"
    >
      <el-checkbox-group v-model="roleIds">
        <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
          {{ item.name }}
        </el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="btnOK">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleApi } from '@/api/role'
import { assignRoles } from '@/api/employees'
export default {
  props: {
    visible: {
      type: Boolean,
    },
    userId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      checkList: ['A'],
      list: [],
      roleIds: [],
    }
  },

  created() {},

  methods: {
    close() {
      this.roleIds = []
      this.$emit('update:visible', false)
    },
    async getRoleList() {
      const { rows } = await getRoleApi()
      console.log(rows)
      this.list = rows
    },
    onOpen() {
      this.getRoleList()
    },
    // 点击确定
    async btnOK() {
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      //   关闭窗体
      this.$emit('update:visible', false)
    },
  },
}
</script>

<style scoped></style>
