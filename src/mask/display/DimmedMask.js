import Size from './../utils/Size';
import Calc from './../utils/Calculator';


export default class DimmedMask extends PIXI.Container
{
    /**
     *
     * @param viewport {PIXI.Rectangle|*}
     * @param backgroundImage {BackgroundImage}
     * @param maskImage {Mask}
     */
    constructor(viewport, backgroundImage, maskImage)
    {
        super();

        this.viewport = viewport;
        this.backgroundImage = backgroundImage;
        this.maskImage = maskImage;

        this.initialize();
        this.addEvent();
    }


    initialize()
    {
        this.alpha = 0.7;

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.viewport.width;
        this.canvas.height = this.viewport.height;
        this.ctx = this.context = this.canvas.getContext('2d');

        // 이미지 smoothed 설정
        const useSmoothed = false;
        this.ctx.mozImageSmoothingEnabled = useSmoothed;
        this.ctx.webkitImageSmoothingEnabled = useSmoothed;
        this.ctx.msImageSmoothingEnabled = useSmoothed;
        this.ctx.imageSmoothingEnabled = useSmoothed;

        this.dimmed = new PIXI.Sprite(PIXI.Texture.fromCanvas(this.canvas));
        this.addChild(this.dimmed);
    }


    addEvent()
    {

    }


    update(ms)
    {
        // clear canvas
        this.canvas.width = this.viewport.width;

        // 이전 상태 저장
        this.ctx.save();

        // 회전
        this.ctx.rotate(this.backgroundImage.rotation);

        console.log('pivotOffset[', this.backgroundImage.pivotOffset.x, this.backgroundImage.pivotOffset.y, ']');

        //원래 위치로 이동
        //this.ctx.translate(this.backgroundImage.x, this.backgroundImage.y);
        this.ctx.translate(
            this.backgroundImage.x - this.backgroundImage.pivotOffset.x + -(this.backgroundImage.bitmapWidth / 2),
            this.backgroundImage.y - this.backgroundImage.pivotOffset.y + -(this.backgroundImage.bitmapHeight / 2));

        this.ctx.drawImage(this.backgroundImage.bitmap.imageElement,
            0, 0, this.backgroundImage.bitmap.width, this.backgroundImage.bitmap.height);


        this.ctx.translate(0, 0);

        // 이전 상태 복원
        this.ctx.restore();
    }
}