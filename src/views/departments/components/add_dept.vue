<template>
  <el-dialog @close="onClose" title="提示" :visible="visible" width="50%">
    <el-form
      ref="form"
      label-width="100px"
      :model="formData"
      :rules="formRules"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" placeholder="1-50个字符"></el-input>
      </el-form-item>

      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" placeholder="1-50个字符"></el-input>
      </el-form-item>

      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="formData.manager"
          style="width: 100%"
          placeholder="请选择部门负责人"
        >
          <el-option
            v-for="item in employees"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="活动形式" prop="introduce">
        <el-input
          v-model="formData.introduce"
          type="textarea"
          placeholder="1-300个字符"
        ></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">取 消</el-button>
      <el-button @click="onSove" type="primary">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getDepartments ,addDepartmentsApi} from '@/api/departments'
import { getEmployeesApi } from '@/api/employees.js'

export default {
  props: {
    visible: {
      type: Boolean,
      require: true,
    },
    currentNode: {
      type: Object,
      require: true,
    },
  },

  data() {
    // name校验
    const checkNameRepeat = (rule, value, callback) => {
      if (!this.currentNode.children) return callback()
      const isdept = this.currentNode.children.some(
        (item) => item.name === value,
      )
      isdept ? callback(new Error('部门重复')) : callback()
    }
    // code校验
    const checkCodeRepeat = async (rule, value, callback) => {
      const { depts } = await getDepartments()
      const isdept = depts.some((item) => item.code === value)
      isdept ? callback(new Error('部门编码重复')) : callback()
    }
    return {
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '', // 部门介绍
      },
      formRules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门名称要求1-50个字符',
            trigger: 'blur',
          },
          {
            validator: checkNameRepeat, // 自定义函数的形式校验
            trigger: 'blur',
          },
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门编码要求1-50个字符',
            trigger: 'blur',
          },
          {
            validator: checkCodeRepeat, // 自定义函数的形式校验
            trigger: 'blur',
          },
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'change' },
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          {
            trigger: 'blur',
            min: 1,
            max: 300,
            message: '部门介绍要求1-300个字符',
          },
        ],
      },
      employees: [],
    }
  },
  created() {
    this.getgEmployees()
  },
  methods: {
    async getgEmployees() {
      const res = await getEmployeesApi()
      this.employees = res
    },
    // 点击关闭
    onClose() {
      this.$emit('update:visible', false)
    },
    // 点击确
    async onSove() {
      await this.$refs.form.validate()
      try {
        this.formData.pid = this.currentNode.id
        await addDepartmentsApi(this.formData)
        this.$message.success('添加成功')
        this.$emit('add')
        this.onClose()
      } catch (error) {
        this.$message.error('添加失败')
      }
    },
  },
}
</script>

<style scoped></style>
