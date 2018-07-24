class Font{
    constructor(ctx){
        this.ctx = ctx;
    }
    normal(){
        // const grd = this.ctx.createCircularGradient(100, 100, 40)
        // grd.addColorStop(0, 'red')
        // grd.addColorStop(1, 'white')
        this.ctx.setFillStyle('white');
        // this.ctx.setShadow(3, 3, 20, 'blue')
        this.ctx.setStrokeStyle('rgba(133,55,166,0.7)')
        this.ctx.setLineWidth(2)
        this.ctx.setFontSize(20);
        this.ctx.strokeText("你好好好啊好啊", 100, 100, 300)
        this.ctx.fillText("你好好好啊好啊", 100, 100)

        this.ctx.draw()
    }
    pinkStroke(){
        this.ctx.setFillStyle('white');
        this.ctx.fontSize = '18px';
        this.ctx.setStrokeStyle('rgba(133,55,166,0.7)')
        this.ctx.setLineWidth(2)
        this.ctx.strokeText("你好好好啊好啊", 100, 100, 300)
        this.ctx.fillText("你好好好啊好啊", 100, 100)

        this.ctx.draw()
    }
}
export default Font;