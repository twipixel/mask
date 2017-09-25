import Size from './../utils/Size';
import Calc from './../utils/Calculator';
import Echo from './../debug/Echo';
import Config from './../config/Config';


//TODO TEST
import Mouse from './../utils/Mouse';


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

        this.backgroundImage = backgroundImage;
        this.maskImage = maskImage;

        this.initialize();
    }


    initialize()
    {
        this.isStop = false;
        this.dimmedAlpha = 1;
        this.dimmedColor = '#000000';

        this.canvas = document.createElement('canvas');
        this.canvas.width = Size.canvasLimitWidth;
        this.canvas.height = Size.canvasLimitHeight;
        this.ctx = this.context = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);

        // 이미지 smoothed 설정
        const imageSmoothingEnabled = Config.imageSmoothingEnabled;
        this.ctx.imageSmoothingEnabled = imageSmoothingEnabled;
        this.ctx.oImageSmoothingEnabled = imageSmoothingEnabled;
        this.ctx.msImageSmoothingEnabled = imageSmoothingEnabled;
        this.ctx.mozImageSmoothingEnabled = imageSmoothingEnabled;
        this.ctx.webkitImageSmoothingEnabled = imageSmoothingEnabled;

        this.dimmed = new PIXI.Sprite(PIXI.Texture.fromCanvas(this.canvas));
        this.addChild(this.dimmed);

        this.rotationPivot = new PIXI.Point(0, 0);

        // TODO 실제 마스크 영역을 출력하기 위한 테스트 상태 변수
        this.isDisplayRealSize = false;
        this.isDisplayVisibleSize = false;
    }


    reset()
    {
        this.isDisplayRealSize = false;
        this.isDisplayVisibleSize = false;

        if (this.backCanvas) {
            //document.body.removeChild(this.backCanvas);
            document.body.removeChild(this.maskCanvas);

            this.backCanvas = null;
            this.maskCanvas = null;
        }
    }


    update(ms)
    {
        this.render();

        // TODO 테스트
        if (this.isDisplayRealSize === true ) {
            this.showMaskRealSize();
        }
        else if (this.isDisplayVisibleSize === true) {
            this.showMaskVisibleSize();
        }

        // TODO 테스트
        if (this.isDisplayRealSize || this.isDisplayVisibleSize) {
            this.getTransform();
        }
    }


    render()
    {
        if (this.isStop === false) {
            this.clearCanvas();
            //this.drawBackground();
            this.drawDimmedBackground();
            this.drawMask();
        }
    }


    startRender()
    {
        this.isStop = false;
    }


    stopRender()
    {
        this.isStop = true;
        this.isDisplayRealSize = false;
        this.isDisplayVisibleSize = false;
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

        // 이미지 좌상단을 0, 0으로 위치 시키기
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
        //this.backgroundImage.updateTransform();
        //this.backgroundImage.displayObjectUpdateTransform();

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
        if (this.maskImage.bitmap) {
            this.ctx.drawImage(this.maskImage.bitmap.imageElement,
                0, 0, this.maskImage.scale.x * this.maskImage.bitmapWidth, this.maskImage.scale.y * this.maskImage.bitmapHeight);
        }
        else {
            this.ctx.drawImage(this.maskImage.vector.canvgCanvas,
                0, 0, this.maskImage.width, this.maskImage.height);
        }

        // 이전 상태 복원
        this.ctx.restore();
    }


    /**
     * 마스크 이미지 변경
     * @param maskImage
     */
    setMaskImage(maskImage)
    {
        this.maskImage = maskImage;
    }


    /**
     * 결과 보여주기 위한 캔버스 생성
     */
    createMaskCanvas()
    {
        if (!this.backCanvas) {

            // 배경 이미지를 위치 시키기 위한 캔버스
            const backCanvas = this.backCanvas = document.createElement('canvas');
            backCanvas.id = 'backCanvas';
            backCanvas.style.top = '0px';
            backCanvas.style.left = '0px';
            backCanvas.style.position = 'absolute';
            backCanvas.style.position = 'absolute';
            backCanvas.style.border = 'thin solid #ff3300';
            backCanvas.style.opacity = 0.5;
            //document.body.appendChild(backCanvas);
            this.backCtx = backCanvas.getContext('2d');

            // 실제 마스크 이미지를 그리기 위한 캔버스
            const maskCanvas = this.maskCanvas = document.createElement('canvas');
            maskCanvas.id = 'mask';
            maskCanvas.style.top = '0px';
            maskCanvas.style.left = '0px';
            maskCanvas.style.position = 'absolute';
            maskCanvas.style.border = 'thin solid #ff3300';
            document.body.appendChild(maskCanvas);
            this.maskCtx = maskCanvas.getContext('2d');
        }
    }



    /**
     * 화면에 보이는 사이즈로 마스크를 보여줍니다.
     *
     * 표시 단계
     * 0. 안보이는 캔버스에 마스크 영역만큼 이미지를 위치 시킵니다. (1 ~ 4번 과정)
     * 1. 중심 회전을 위해 배경 이미지 중점 만큼 뒤로 이동
     * 2. 중심 회전
     * 3. 중심에서 마스크 lt 사이즈만큼 이동
     * 4. 회전해서 발생한 offset 거리만큼 이동
     * 5. 실제 마스크로 출력할 캔버스에 출력할 사이즈를 조절하서 그립니다.
     */
    showMaskVisibleSize()
    {
        this.createMaskCanvas();

        const mask = this.maskImage;

        let maskOriginalSize,
            maskScaleX,
            maskScaleY,
            maskActualWidth,
            maskActualHeight;

        // 마스크 이미지가 비트맵인 경우
        if (this.maskImage.bitmap) {
            maskOriginalSize = mask.originalImageSize;
            maskScaleX = maskOriginalSize.width / mask.width;
            maskScaleY = maskOriginalSize.height / mask.height;
            maskActualWidth = mask.width * maskScaleX;
            maskActualHeight = mask.height * maskScaleY;
        }
        else {
            maskActualWidth = mask.width;
            maskActualHeight = mask.height;
        }

        // 배경 이미지 실제 사이즈
        const back = this.backgroundImage;
        const backOriginalSize = back.originalImageSize;
        const backScaleX = backOriginalSize.width / back.width;
        const backScaleY = backOriginalSize.height / back.height;
        const backActualWidth = back.width * backScaleX;
        const backActualHeight = back.height * backScaleY;

        const resultMaskWidth = mask.width;
        const resultMaskHeight = mask.height;

        this.backCanvas.width = back.width;
        this.backCanvas.height = back.height;

        // 마스크 사이즈가 계속 변화하니까 업데이트에 유의해야합니다.
        this.maskCanvas.width = resultMaskWidth;
        this.maskCanvas.height = resultMaskHeight;

        // 마스크 랜더링 시작
        this.backCtx.save();
        this.backCtx.clearRect(0, 0, this.backCanvas.width, this.backCanvas.heigh);

        // 1. 중심 회전을 위해 배경 이미지 중점 만큼 뒤로 이동
        const offsetX = mask.globalPivot.x - back.lt.x;
        const offsetY = mask.globalPivot.y - back.lt.y;

        this.backCtx.translate(-offsetX, -offsetY);

        // 2. 중심 회전
        this.backCtx.rotate(back.rotation);

        // 3. 중심에서 마스크 lt 사이즈만큼 이동
        const maskLt = mask.lt;
        const maskPivot = mask.globalPivot;
        const distanceX = maskPivot.x - maskLt.x;
        const distanceY = maskPivot.y - maskLt.y;
        this.backCtx.translate(distanceX, distanceY);

        // 4. 회전해서 생긴 offset 만큼 이동시켜주기
        const rotationLt = Calc.getRotationPointWithPivot(mask.globalPivot, mask.lt, -Calc.toDegrees(back.rotation));
        const rotationOffsetX = mask.lt.x - rotationLt.x;
        const rotationOffsetY = mask.lt.y - rotationLt.y;
        this.backCtx.translate(rotationOffsetX, rotationOffsetY);
        this.backCtx.drawImage(back.bitmap.imageElement, 0, 0, backActualWidth, backActualHeight, 0, 0, back.width, back.height);
        this.backCtx.restore();

        // 마스크 그리기
        this.maskCtx.save();
        this.maskCtx.clearRect(0, 0, resultMaskWidth, resultMaskHeight);

        // 보이는 사이즈로 출력
        this.maskCtx.drawImage(this.backCanvas, 0, 0);
        this.maskCtx.globalCompositeOperation = 'destination-in';

        if (this.maskImage.bitmap) {
            this.maskCtx.drawImage(mask.bitmap.imageElement, 0, 0, maskActualWidth, maskActualHeight, 0, 0, resultMaskWidth, resultMaskHeight);
        }
        else {
            this.maskCtx.drawImage(mask.vector.canvgCanvas, 0, 0, maskActualWidth, maskActualHeight, 0, 0, resultMaskWidth, resultMaskHeight);
        }

        this.maskCtx.restore();
    }


    /**
     * 배경 이미지 기준으로 실제 이미지 사이즈로 마스크를 보여줍니다.
     *
     * 표시 단계
     * 0. 안보이는 캔버스에 마스크 영역만큼 이미지를 위치 시킵니다. (1 ~ 4번 과정)
     * 1. 중심 회전을 위해 배경 이미지 중점 만큼 뒤로 이동
     * 2. 중심 회전
     * 3. 중심에서 마스크 lt 사이즈만큼 이동
     * 4. 회전해서 발생한 offset 거리만큼 이동
     * 5. 실제 마스크로 출력할 캔버스에 출력할 사이즈를 조절하서 그립니다.
     *
     */
    showMaskRealSize()
    {
        this.createMaskCanvas();

        const mask = this.maskImage;

        let maskOriginalSize,
            maskScaleX,
            maskScaleY,
            maskActualWidth,
            maskActualHeight;

        // 마스크 이미지가 비트맵인 경우
        if (this.maskImage.bitmap) {
            maskOriginalSize = mask.originalImageSize;
            maskScaleX = maskOriginalSize.width / mask.width;
            maskScaleY = maskOriginalSize.height / mask.height;
            maskActualWidth = mask.width * maskScaleX;
            maskActualHeight = mask.height * maskScaleY;
        }
        else {
            maskActualWidth = mask.width;
            maskActualHeight = mask.height;
        }

        // 배경 이미지 실제 사이즈
        const back = this.backgroundImage;
        const backOriginalSize = back.originalImageSize;
        const backScaleX = backOriginalSize.width / back.width;
        const backScaleY = backOriginalSize.height / back.height;
        const backActualWidth = back.width * backScaleX;
        const backActualHeight = back.height * backScaleY;

        const maskActualImageWidth = mask.width * backScaleX;
        const maskActualImageHeight = mask.height * backScaleY;

        const resultMaskWidth = maskActualImageWidth;
        const resultMaskHeight = maskActualImageHeight;

        this.backCanvas.width = backActualWidth;
        this.backCanvas.height = backActualHeight;

        // 마스크 사이즈가 계속 변화하니까 업데이트에 유의해야합니다.
        this.maskCanvas.width = resultMaskWidth;
        this.maskCanvas.height = resultMaskHeight;

        // 마스크 랜더링 시작
        this.backCtx.save();
        this.backCtx.clearRect(0, 0, backActualWidth, backActualHeight);

        // 1. 중심 회전을 위해 배경 이미지 중점 만큼 뒤로 이동
        const offsetX = (mask.globalPivot.x - back.lt.x) * backScaleX;
        const offsetY = (mask.globalPivot.y - back.lt.y) * backScaleY;

        this.backCtx.translate(-offsetX, -offsetY);

        // 2. 중심 회전
        this.backCtx.rotate(back.rotation);

        // 3. 회전해서 발생한 offset 거리만큼 이동
        const maskLt = mask.lt;
        const maskPivot = mask.globalPivot;
        const distanceX = (maskPivot.x - maskLt.x) * backScaleX;
        const distanceY = (maskPivot.y - maskLt.y) * backScaleY;
        this.backCtx.translate(distanceX, distanceY);

        // 4. 회전해서 생긴 offset 만큼 이동시켜주기
        const rotationLt = Calc.getRotationPointWithPivot(mask.globalPivot, mask.lt, -Calc.toDegrees(back.rotation));
        const rotationOffsetX = (mask.lt.x - rotationLt.x) * backScaleX;
        const rotationOffsetY = (mask.lt.y - rotationLt.y) * backScaleY;
        this.backCtx.translate(rotationOffsetX, rotationOffsetY);
        this.backCtx.drawImage(back.bitmap.imageElement, 0, 0);
        this.backCtx.restore();

        // 마스크 그리기
        this.maskCtx.save();
        this.maskCtx.clearRect(0, 0, resultMaskWidth, resultMaskHeight);

        // 보이는 사이즈로 출력
        this.maskCtx.drawImage(this.backCanvas, 0, 0);
        this.maskCtx.globalCompositeOperation = 'destination-in';

        if (this.maskImage.bitmap) {
            this.maskCtx.drawImage(mask.bitmap.imageElement, 0, 0, maskActualWidth, maskActualHeight, 0, 0, resultMaskWidth, resultMaskHeight);
        }
        else {
            this.maskCtx.drawImage(mask.vector.canvgCanvas, 0, 0, maskActualWidth, maskActualHeight, 0, 0, resultMaskWidth, resultMaskHeight);
        }

        this.maskCtx.restore();
    }


    /**
     * 마스크 연동시 전달해야할 값
     * maskWidht: 마스크 넓이
     * maskHeight: 마스크 높이
     * x: 배경 이미지 x 값
     * y: 배경 이미지 y 값
     * offsetX: 마스크 시작 위치 X
     * offsetY: 마스크 시작 위치 Y
     * scaleX: 배경 이미지 스케일 X
     * scaleY: 배경 이미지 스케일 Y
     * radian: 배경 이미지 회전값
     */
    getTransform()
    {
        const mask = this.maskImage;
        const back = this.backgroundImage;
        const backOriginalSize = back.originalImageSize;
        const backScaleX = backOriginalSize.width / back.width;
        const backScaleY = backOriginalSize.height / back.height;
        const maskActualImageWidth = mask.width * backScaleX;
        const maskActualImageHeight = mask.height * backScaleY;

        // ** displayObjectUpdateTransform 하지 않으면 offset에 오류가 발생합니다.
        back.bitmap.displayObjectUpdateTransform();
        back.bitmap.image.displayObjectUpdateTransform();

        const offset = back.bitmap.image.toLocal(mask.lt);

        const transform = {
            maskWidth: maskActualImageWidth,
            maskHeight: maskActualImageHeight,
            x: 0,
            y: 0,
            offsetX: offset.x,
            offsetY: offset.y,
            scaleX: 1,
            scaleY: 1,
            radian: back.rotation
        };

        return transform;
    }


    getTransformWithBitmapData(bitmapdata)
    {
        const mask = this.maskImage;
        const back = this.backgroundImage;
        const maskPoints = mask.points;
        const canvasMatrix = bitmapdata.worldTransform.matrix;
        const convertCanvasMatrix = Calc.convertCanvasMatrixToPixiMatrix(canvasMatrix);

        // ** displayObjectUpdateTransform 하지 않으면 offset에 오류가 발생합니다.
        back.bitmap.displayObjectUpdateTransform();
        back.bitmap.image.displayObjectUpdateTransform();

        const imageWorldTransform = back.bitmap.image.worldTransform.clone();
        imageWorldTransform.append(convertCanvasMatrix);

        const inversedPoints = Calc.toLocalPoints(imageWorldTransform, maskPoints);
        const imageSize = Calc.getSizeByPoints(inversedPoints);
        var maskWidth = imageSize.width;
        var maskHeight = imageSize.height;
        maskWidth = (maskWidth + 0.5) | 0;
        maskHeight = (maskHeight + 0.5) | 0;

        var offsetX = Math.round(inversedPoints.lt.x);
        var offsetY = Math.round(inversedPoints.lt.y);
        offsetX = (offsetX < 0) ? 0 : offsetX;
        offsetY = (offsetY < 0) ? 0 : offsetY;

        const transform = {
            maskWidth: maskWidth,
            maskHeight: maskHeight,
            x: 0,
            y: 0,
            offsetX: offsetX,
            offsetY: offsetY,
            scaleX: 1,
            scaleY: 1,
            radian: back.rotation
        };

        return transform;
    }
}