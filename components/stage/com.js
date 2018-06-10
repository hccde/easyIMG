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
        draw: this.draw.bind(this)
      })
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
      gif.setDelay(opt.delay);  // frame delay in ms
      gif.setQuality(opt.quality); // image quality. 10 is default.
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
      return await new Promise((reslove, reject) => {
        console.log(this); //todo
        const that = this;
        ctx.draw(reserve, function () { //wx bug attetion
          wx.canvasGetImageData({
            x: position.x,
            y: position.y,
            width: position.width,
            height: position.height,
            canvasId: 'stage/canvas',
            success: function (res) {
              that.gif.addFrame(res);
              let content = {
                gif: that.gif,
                image: ''
              };
              if (finished) {
                that.gif.finish();
                let out = 'data:image/gif;base64,' + encode64(that.gif.stream().getData());
                content.image = out;
              }
              reslove({
                success: true,
                content: content,
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

      })
    },
  },
  attached() {
    this.initCanvas();
    this.toggle();
  },
})