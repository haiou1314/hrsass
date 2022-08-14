import dayjs from 'dayjs'
export const filterTime = (val) => {
  return dayjs(val).format('YYYY-MM-DD')
}
