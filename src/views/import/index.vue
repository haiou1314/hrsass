<template>
  <div class="dashboard-container">
    <div class="app-container">
      <UploadExcel :beforeUpload="excelSuccess" :onSuccess="onSuccess" />
    </div>
  </div>
</template>

<script>
import UploadExcel from '@/components/UploadExcel'
import employees from '@/constant/employees'
const { employeesMapKeyPath } = employees
import { filterTime } from '@/filter'
import { importEmployeeApi } from '@/api/employees'
export default {
  data() {
    return {}
  },

  created() {},

  methods: {
    excelSuccess({ name }) {
      if (!name.endsWith('xlsx')) {
        this.$message.success('请选择xlsx')
        return false
      }
      return true
    },
    async onSuccess({ header, results }) {
      const arr = results.map((item) => {
        let obj = {}
        for (const key in employeesMapKeyPath) {
          if (key === '入职日期' || key === '转正日期') {
            const timestamp = item[key]
            const date = new Date((timestamp - 1) * 24 * 3600000)
            date.setFullYear(date.getFullYear() - 70)
            obj[employeesMapKeyPath[key]] = filterTime(date)
          } else {
            obj[employeesMapKeyPath[key]] = item[key]
          }
        }
        return obj
      })
      await importEmployeeApi(arr)
      this.$message.success('导入成功')
      this.$router.go(-1)
    },
  },
  components: {
    UploadExcel,
  },
}
</script>

<style scoped></style>
