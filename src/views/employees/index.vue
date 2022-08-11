<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools>
        <template #left-text :ishowLeft="false">
          <span>dddddd</span>
        </template>

        <template #right>
          <el-button size="small" type="danger">普通excel导入</el-button>
          <el-button size="small" type="info">复杂表头excel导入</el-button>
          <el-button size="small" type="success">excel导入</el-button>
          <el-button size="small" type="primary">新增员工</el-button>
        </template>
      </PageTools>

      <el-card>
        <el-table border :data="getemployees">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column
            label="聘用形式"
            sortable=""
            prop="formOfEmployment"
          />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry" />
          <el-table-column label="账户状态" sortable="" prop="enableState" />
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template>
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style="height: 60px"
        >
          <el-pagination
            layout="prev, pager, next"
            :page-size="page.size"
            :current-page="page.page"
            :total="total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getEmployeesListApi } from '@/api/employees'

export default {
  name: 'Employees',
  data() {
    return {
      getemployees: [],
      total: 0,
      page: {
        page: 1,
        size: 10,
      },
    }
  },

  created() {
    this.getEmployeesList()
  },

  methods: {
    // 获取所有员工数据
    async getEmployeesList() {
      const { rows, total } = await getEmployeesListApi(this.page)
      this.getemployees = rows
      this.total = total
      console.log(rows)
    },
    // 点击实现切换页面
    changePage(val) {
      this.page.page = val
      this.getEmployeesList()
    },
  },
}
</script>

<style scoped lang="less"></style>
