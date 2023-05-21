import Brush from "./Brush";

export default class Last extends Brush {
    // eslint-disable-next-line no-useless-constructor
    constructor(canvas) {
        super(canvas);
    }

    draw(x, y) {
            this.ctx.strokeStyle = 'white'
            this.ctx.lineTo(x,y)
            this.ctx.stroke()

    }
}