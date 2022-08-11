<template>
  <el-card class="box-card">
    <el-row type="flex">
      <el-col>
        <el-tag v-if="ishowLeft">
          <i :class="leftIcon"></i>
          <slot name="left-text"
        /></el-tag>
      </el-col>
      <el-col>
        <el-row type="flex" justify="end">
          <slot name="right" />
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'PageTools',
  props: {
    ishowLeft: {
      type: Boolean,
      default: true,
    },
    leftIcon: {
      type: String,
      default: 'el-icon-warning',
    },
  },
  data() {
    return {}
  },

  created() {},

  methods: {},
}
</script>

<style scoped></style>
