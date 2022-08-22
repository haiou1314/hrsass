<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools>
        <template #left-text :ishowLeft="false">
          <span>共{{ total }}条记录</span>
        </template>
        <template #right>
          <el-button size="small" type="danger" @click="onExcel"
            >普通excel导出</el-button
          >
          <el-button size="small" type="info">复杂表头excel导出</el-button>
          <el-button
            size="small"
            type="success"
            @click="$router.push('/import')"
            >excel导入</el-button
          >
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
                @click="shwImg(row.staffPhoto)"
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
              <el-button
                type="text"
                size="small"
                @click="$router.push('/employees/detail/' + row.id)"
                >查看</el-button
              >
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)"
                >角色</el-button
              >
              <el-button type="text" size="small" @click="onRemove(row.id)" v-if="isHas(points.employees.del)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <assigonRole
          :visible.sync="showAssignRole"
          :userId="userId"
        ></assigonRole>
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
    <adddelEmployee
      :visible.sync="showAddEmployee"
      @add-success="getEmployeesList"
    />
    <!-- 点击头像显示二维码 -->

    <el-dialog width="16%" title="用户二维码" :visible.sync="previewImgDialog">
      <canvas ref="myCanvas" />
    </el-dialog>
  </div>
</template>

<script>
import { getEmployeesListApi, delEmployee } from '@/api/employees'
import employees from '@/constant/employees'
const { hireType, exportExcelMapPath } = employees
import adddelEmployee from './components/addEmployment.vue'
import QrCode from 'qrcode'
import assigonRole from './components/assignRole.vue'
import mixinsPermission from '@/mixins/permission.js'
export default {
  name: 'Employees',
  mixins:[mixinsPermission],
  data() {
    return {
      userId: '',
      showAssignRole: false,
      previewImgDialog: false,
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
    assigonRole,
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
    async onExcel() {
      const { export_json_to_excel } = await import('@/vendor/Export2Excel')
      const { rows, total } = await getEmployeesListApi({
        page: 1,
        size: this.total,
      })
      const header = Object.keys(exportExcelMapPath)
      const data = rows.map((item) => {
        return header.map((h) => {
          if (h === '聘用形式') {
            const findItem = hireType.find((hire) => {
              return hire.id === item[exportExcelMapPath[h]]
            })
            return findItem ? findItem.value : '未知'
          } else {
            return item[exportExcelMapPath[h]]
          }
        })
      })
      console.log(data)

      export_json_to_excel({
        header,
        data,
        filename: '员工信息表',
        autoWidth: true,
        bookType: 'xlsx',
        multiHeader: [['手机号', '其他信息', '', '', '', '', '部门']],
        merges: ['A1:A2', 'B1:F1', 'G1:G2'],
      })
    },
    // 点击二维码显示头像
    shwImg(staffPhoto) {
      if (!staffPhoto) return this.$message.error('用户没有上传头像')
      this.previewImgDialog = true
      this.$nextTick(() => {
        QrCode.toCanvas(this.$refs.myCanvas, staffPhoto) // 将地址转化成二维码
      })
    },
    async editRole(id) {
      this.userId = id // props传值 是异步的
      // await this.$refs.assignRole.getUserDetailById(id) // 父组件调用子组件方法
      this.showAssignRole = true
    },
  
  },
}
</script>

<style scoped lang="less"></style>
