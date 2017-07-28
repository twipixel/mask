import Size from './../utils/Size';
import Calc from './../utils/Calculator';


export default class DimmedMask extends PIXI.Container
{
    /**
     *
     * Mask와 BackgroundImage를 받아 딤드화면을 생성합니다.
     * @param backgroundImage {BackgroundImage}
     * @param maskImage {Mask}
     */
    constructor(backgroundImage, maskImage)
    {
        super();

        this.dimmedAlpha = 1;
        this.dimmedColor = 0x000000;
        this.backgroundImage = backgroundImage;
        this.maskImage = maskImage;

        this.initialize();
        this.addEvent();
    }


    initialize()
    {
        this.canvas = document.createElement('canvas');
        this.canvas.width = Size.canvasLimitWidth;
        this.canvas.height = Size.canvasLimitHeight;
        this.ctx = this.context = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);

        // 이미지 smoothed 설정
        const useSmoothed = false;
        this.ctx.mozImageSmoothingEnabled = useSmoothed;
        this.ctx.webkitImageSmoothingEnabled = useSmoothed;
        this.ctx.msImageSmoothingEnabled = useSmoothed;
        this.ctx.imageSmoothingEnabled = useSmoothed;

        this.dimmed = new PIXI.Sprite(PIXI.Texture.fromCanvas(this.canvas));
        this.addChild(this.dimmed);

        this.rotationPivot = new PIXI.Point(0, 0);

        this.resize();
    }


    addEvent()
    {
        //
    }


    resize()
    {

    }


    update(ms)
    {
        this.clearCanvas();
        //this.drawBackground();
        this.drawDimmedBackground();
        this.drawMask();
    }


    clearCanvas()
    {
        // clear canvas
        this.canvas.width = this.canvas.width;
        this.canvas.height = this.canvas.height;
    }


    /**
     * 배경 이미지 자체를 그리기
     */
    drawBackground()
    {
        // 이전 상태 저장
        this.ctx.save();

        // 회전
        this.ctx.rotate(this.backgroundImage.rotation);

        // 이미지를 가운데 회전하기 위해 가운데 중심점으로 이동
        this.ctx.translate(-this.backgroundImage.bitmapHalfWidth, -this.backgroundImage.bitmapHalfHeight);

        // 이미지를 좌상단을 0, 0으로 위치 시키기
        const offset = this.backgroundImage.distanceBetweenLtAndCenter;
        this.ctx.translate(offset.x, offset.y);

        // 배경이미지의 좌상단 좌표 가져오기
        const leftTop = this.backgroundImage.lt;

        // context의 회전한 만큼 좌상단도 회전시키기
        const rotationLeftTop = Calc.getRotationPointWithPivot(this.rotationPivot, leftTop, -Calc.toDegrees(this.backgroundImage.bitmapRotation));

        this.ctx.translate(rotationLeftTop.x, rotationLeftTop.y);

        this.ctx.drawImage(this.backgroundImage.bitmap.imageElement,
            0, 0, this.backgroundImage.bitmapWidth, this.backgroundImage.bitmapHeight);

        // 디버그 이동 해야할 라인 그리기
        this.ctx.lineWidth = 5;
        this.ctx.strokeStyle = 'red';
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(leftTop.x, 0);
        this.ctx.lineTo(leftTop.x, leftTop.y);
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(rotationLeftTop.x, 0);
        this.ctx.lineTo(rotationLeftTop.x, rotationLeftTop.y);
        this.ctx.stroke();

        // 이전 상태 복원
        this.ctx.restore();
    }


    /**
     * 배경 이미지 형태만 따와서 딤드 배경 채우기
     */
    drawDimmedBackground()
    {
        // 이전 상태 저장
        this.ctx.save();

        // 회전
        this.ctx.rotate(this.backgroundImage.rotation);

        const sx = this.backgroundImage.scale.x;
        const sy = this.backgroundImage.scale.y;
        const w = this.backgroundImage.bitmapWidth * sx;
        const h = this.backgroundImage.bitmapHeight * sy;
        const hw = this.backgroundImage.bitmapHalfWidth * sx;
        const hh = this.backgroundImage.bitmapHalfHeight * sy;

        // 이미지를 가운데 회전하기 위해 가운데 중심점으로 이동
        this.ctx.translate(-hw, -hh);

        // 이미지를 좌상단을 0, 0으로 위치 시키기
        const offset = this.backgroundImage.distanceBetweenLtAndCenter;
        offset.x = offset.x * sx;
        offset.y = offset.y * sy;
        this.ctx.translate(offset.x, offset.y);

        // 배경이미지의 좌상단 좌표 가져오기
        const leftTop = this.backgroundImage.lt;

        // context의 회전한 만큼 좌상단도 회전시키기
        const rotationLeftTop = Calc.getRotationPointWithPivot(this.rotationPivot, leftTop, -Calc.toDegrees(this.backgroundImage.bitmapRotation));

        this.ctx.translate(rotationLeftTop.x, rotationLeftTop.y);

        this.ctx.globalAlpha = this.dimmedAlpha;
        this.ctx.fillStyle = this.dimmedColor;
        this.ctx.fillRect(0, 0, w, h);

        // 이전 상태 복원
        this.ctx.restore();
    }


    drawMask()
    {
        // 이전 상태 저장
        this.ctx.save();

        this.ctx.globalCompositeOperation = 'destination-out';

        // 배경이미지의 좌상단 좌표 가져오기
        const leftTop = this.maskImage.lt;

        this.ctx.translate(leftTop.x, leftTop.y);

        /**
         * WHY? maskImage.width, maskImage.height 하면 안될까?
         */
        this.ctx.drawImage(this.maskImage.bitmap.imageElement,
            //0, 0, this.maskImage.width, this.maskImage.height);
            0, 0, this.maskImage.scale.x * this.maskImage.bitmapWidth, this.maskImage.scale.y * this.maskImage.bitmapHeight);

        // 이전 상태 복원
        this.ctx.restore();
    }
}