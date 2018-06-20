import Gif from '../../libs/gifjs/index.js';
const regeneratorRuntime = require('../../libs/regenerator-runtime');
import encode64 from '../../libs/base64.js';
Component({
  properties: {
    width: {
      type: Number
    },
    height: {
      type: Number
    }
  },
  ctx: null,
  data: {
  },
  methods: {
    toggle() {
      const that = this;
      this.triggerEvent('ready', {
        ctx: this.ctx,
        that: this,
        draw: this.draw.bind(this)
      })
    },
    async runBullet(bulletList, that, opt) {
      let outterLength = bulletList.length;
      let width = that.properties.width;
      //每一帧需要做的
      for (let i = 0; i < outterLength; i++) { //todo 等待优化
        let innerLength = bulletList[i].length;
        for (let j = 0; j < innerLength; j++) {
          bulletList[i][j].x = (opt.speed + bulletList[i][j].x); //from right to left
          bulletList[i][j]._x = width - bulletList[i][j].x
          that.ctx.setFontSize(opt.fontSize)
          that.ctx.fillText(bulletList[i][j].content, bulletList[i][j]._x, bulletList[i][j].y)
        }
      }
      await that.draw(false);
      let flag = false;
      for (let k = 0; k < outterLength; k++) {
        let item = bulletList[k];
        if (item[item.length-1].x <0) {
          flag = true;
        }
      }
      if (flag) {
        setTimeout(function () {
          that.runBullet(bulletList, that, opt);
        }, 0);
      }else{
        that.draw(true,true);
      }
    },
    initCanvas(opt) {
      if (!this.ctx) {
        let context = wx.createCanvasContext('stage/canvas', this);
        this.ctx = context
      }
      opt = opt ? opt : {
        repeat: 0,
        delay: 500,
        quality: 10
      }
      let gif = new Gif(this.properties.width, this.properties.height);
      gif.start();
      gif.setRepeat(opt.repeat);   // 0 for repeat, -1 for no-repeat
      gif.setDelay(1000);  // frame delay in ms
      gif.setQuality(16); // image quality. 10 is default.
      gif.setDispose(2);
      this.gif = gif;
      return this.ctx;
    },
    /**
   * reserver:bool //reserve last 
   * ctx:object //canvas context
   * postion:object //image postion object
   * finished:bool  //gif finished
   */
    async draw(reserve = false, finished = false, position = null, ctx) {
      if (!(this.ctx || ctx)) {
        throw Error('canvas-ctx  is null')
        await {
          success: false,
          content: ''
        }
        return;
      }
      ctx = ctx ? ctx : this.ctx;
      position = position ? position : {
        x: 0,
        y: 0,
        width: this.properties.width,
        height: this.properties.height,
      }
      let obj = await new Promise((reslove, reject) => {
        const that = this;
        ctx.draw(reserve, function () { //wx bug attetion
          wx.canvasGetImageData({
            x: position.x,
            y: position.y,
            width: position.width,
            height: position.height,
            canvasId: 'stage/canvas',
            success: function (res) {
              // that.gif.addFrame(res);
              let content = {
                gif: that.gif,
                image: ''
              };
              if (finished) {
                // that.gif.finish();
                // let out = 'data:image/gif;base64,' + encode64(that.gif.stream().getData());
                // content.image = out;
              }
              reslove({
                success: true,
                content: content,
                imagedata:res,
                msg: ''
              });
            },
            fail: function (err) {
              reject({
                success: false,
                content: err,
                msg: err
              });
            }
          }, that);

        });

      });
      return obj;
    },
    //arr bullettext array
    //opt bullettext set
    async bulletText(arr, that, opt = { fontSize: 27, speed: 120 }) {
      let heightStep = that.formatHeight(that.properties.width, that.properties.height, opt.fontSize * 12);
      let bulletList = heightStep.map(function (e) {
        return [{ x: 0, type: 'text', content: '', y: e }];
      })
      for (let i = 0; i < arr.length; i++) {
        let index = i % (bulletList.length);
        let currentHeightItem = bulletList[index];
        let lastTextObj = currentHeightItem[currentHeightItem.length - 1];
        currentHeightItem.push({
          ...arr[i],
          y: heightStep[index],
          x: lastTextObj.x - lastTextObj.content.length * opt.fontSize //两个弹幕之间随机距离 TODO
        })
      }
      that.ctx.drawImage('/assets/red-card.png',0,0,400,500);
      that.runBullet(bulletList, that, opt)
    }
  },
  attached() {
    this.formatHeight = formatHeight;
    this.draw = this.draw.bind(this)
    this.runBullet = this.runBullet.bind(this)
    this.initCanvas();
    this.toggle();
  },
});

function formatHeight(width, height, h = 36,minRow=10,maxRow=15) {
  let count = parseInt(height / h)
  if (count > maxRow) {
    return formatHeight(width, height, h + 8)
  } else if (count < minRow) {
    return formatHeight(width, height, h - 8)
  }
  let res = [];
  let d = parseInt(h / 2)//中线
  for (let i = 0; i < count; i++) {
    res.push(d + h * i);
  }
  return res;
}