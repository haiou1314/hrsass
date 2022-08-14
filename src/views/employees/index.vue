<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools>
        <template #left-text :ishowLeft="false">
          <span>共{{total}}条记录</span>
        </template>

        <template #right>
          <el-button size="small" type="danger">普通excel导入</el-button>
          <el-button size="small" type="info">复杂表头excel导入</el-button>
          <el-button size="small" type="success" @click="$router.push('/import')">excel导入</el-button>
          <el-button @click.native="showAdd" size="small" type="primary"
            >新增员工</el-button
          >
        </template>
      </PageTools>

      <el-card>
        <el-table border :data="getemployees">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="头像">
            <template slot-scope="{ row }">
              <img
                :src="row.staffPhoto"
                alt=""
                v-imgErr="require('@/assets/common/head.jpg')"
                style="
                  border-radius: 50%;
                  width: 100px;
                  height: 100px;
                  padding: 10px;
                "
              />
            </template>
          </el-table-column>
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column
            label="聘用形式"
            sortable=""
            prop="formOfEmployment"
            :formatter="formatterFormOfEmployment"
          />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="">
            <template slot-scope="{ row }">
              {{ row.timeOfEntry | filterTime }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="enableState">
            <template slot-scope="{ row }">
              <el-switch
                :value="row.enableState === 1"
                active-color="#13ce66"
                inactive-color="#ff4949"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{ row }">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="onRemove(row.id)"
                >删除</el-button
              >
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
    <adddelEmployee :visible.sync="showAddEmployee" @add-success='getEmployeesList' />
  </div>
</template>

<script>
import { getEmployeesListApi, delEmployee } from '@/api/employees'
import employees from '@/constant/employees'
import adddelEmployee from './components/addEmployment.vue'
export default {
  name: 'Employees',
  data() {
    return {
      showAddEmployee: false,
      getemployees: [],
      total: 0,
      page: {
        page: 1,
        size: 5,
      },
    }
  },

  created() {
    this.getEmployeesList()
  },
  components: {
    adddelEmployee,
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
    formatterFormOfEmployment(row, column, cellValue, index) {
      const findIndex = employees.hireType.find((item) => item.id === cellValue)
      return findIndex ? findIndex.value : '未知'
    },
    // 删除员工
    async onRemove(id) {
      try {
        await this.$confirm('您确定删除该员工吗')
        await delEmployee(id)
        this.getEmployeesList()
        this.$message.success('删除员工成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 点击新增员工显示弹层
    showAdd() {
      this.showAddEmployee = true
    },
  },
}
</script>

<style scoped lang="less"></style>
