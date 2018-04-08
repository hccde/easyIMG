// 【重要】名称不能修改
const regeneratorRuntime = require('../../libs/regenerator-runtime')

const log1 = (number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(number)
      const res = number === 2
      resolve(res)
    }, 1000)
  })
}

const log2 = (number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(number)
      const res = number === 2
      if(res) {
        resolve()
      } else{
        reject()
      }
    }, 1000)
  })
}

const log = log1

Page({
  onLoad: async function () {
    try {
      console.log('begin')
      await log(1)
      const res = await log(2)

      if(res) {
        await log(3)
      } else {
        await log(4)
      }

      await log(5)
      console.log('end')
    } catch(ex) {
      console.log('catch')
    } finally {
      console.log('finally')
    }
  }
})
