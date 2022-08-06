<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <el-card class="box-card">
        <!-- title -->
        <treeTools :isRoot="true" :treeNode="company" @add="showadd" />
        <!-- ppp -->
        <br />
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <!-- 作用域插槽 -->
          <template v-slot="{ data }">
            <treeTools
              @edit="showedit"
              :treeNode="data"
              @add="showadd"
              @remove="loadDepts"
            />
          </template>
        </el-tree>
      </el-card>
    </div>
    <!-- 弹框 -->
    <addDept
      ref="edit"
      @add="loadDepts"
      :visible.sync="dialogVisible"
      :currentNode="currentTrnode"
    />
  </div>
</template>

<script>
import treeTools from './components/tree-tools.vue'
import { getDepartments } from '@/api/departments.js'
import { tranListToTreeData } from '@/utils'
import addDept from './components/add_dept.vue'
export default {
  components: {
    treeTools,
    addDept,
  },
  data() {
    return {
      company: { name: '传智教育', manager: '负责人' },
      defaultProps: {
        label: 'name',
      },
      departs: [
        { name: '总裁办', children: [{ name: '董事会' }] },
        { name: '行政部' },
        { name: '人事部' },
      ],
      dialogVisible: false,
      currentTrnode: {},
    }
  },

  created() {
    this.loadDepts()
  },

  methods: {
    // 获取所有部门
    async loadDepts() {
      this.loading = true
      const res = await getDepartments()
      this.departs = tranListToTreeData(res.depts, '')
      this.loading = false
    },
    // 添加部门
    showadd(val) {
      this.dialogVisible = true
      this.currentTrnode = val
    },
    // 编辑部门
    showedit(val) {
      this.dialogVisible = true
      this.$refs.edit.getDeptByid(val.id)
    },
  },
}
</script>

<style scoped lang="less"></style>
