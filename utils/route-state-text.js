import ROUTESTATE from '../enums/route-state'

export default (state) => {
  let text = ''
  switch (state) {
    case ROUTESTATE.CANCELED:
      text = '已取消'
      break
    case ROUTESTATE.EXPIRED:
      text = '已过期'
      break
    case ROUTESTATE.MATCHED:
      text = '待出行'
      break
    case ROUTESTATE.MATCHING:
      text = '发布中'
      break
  }
  return text
}