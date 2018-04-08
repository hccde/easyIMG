import ORDERSTATE from '../enums/order-state'

export default (state) => {
  let text = ''
  switch (state) {
    case ORDERSTATE.CREATED:
      text = '发布中'
      break
    case ORDERSTATE.STARTED:
      text = '进行中'
      break
    case ORDERSTATE.WAITTING_PAY:
      text = '待支付'
      break
    case ORDERSTATE.WAITTING_EVALUATE:
      text = '待评价'
      break
    case ORDERSTATE.FINISHED:
      text = '已结束'
      break
    case ORDERSTATE.CANCELED:
      text = '已取消'
      break
    case ORDERSTATE.EXPIRED:
      text = '已过期'
      break
  }
  return text
}
