import permissions from '@/constant/permission'
export default {
  data() {
    return {
      points: permissions,
    }
  },
  methods: {
    isHas(val) {
      return this.$store.state.permission.points.includes(val)
    },
  },
}
