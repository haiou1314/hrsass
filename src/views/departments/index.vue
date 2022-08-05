<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="box-card">
        <!-- title -->
        <treeTools :isRoot="true" :treeNode="company" />
        <!-- ppp -->
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <!-- 作用域插槽 -->
          <template v-slot="{ data }">
            <treeTools :treeNode="data" />
          </template>
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import treeTools from './components/tree-tools.vue'
export default {
  components: {
    treeTools,
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
    }
  },

  created() {},

  methods: {},
}
</script>

<style scoped lang="less"></style>
