import Config from './../config/Config';


/**
 * 마스크 구현 테스트
 */
export default class MaskTest extends PIXI.utils.EventEmitter
{
    constructor(renderer, rootLayer, maskLayer)
    {
        super();

        this.renderer = renderer;
        this.rootLayer = rootLayer;
        this.maskLayer = maskLayer;

        const backgroundImage = new Image();
        const maskImage = new Image();
        backgroundImage.src = './../assets/img/background0.png';

        backgroundImage.onload = () => {
            maskImage.src = './../assets/img/mask-oval.png';

            maskImage.onload = () => {
                this.initialize(backgroundImage, maskImage);
            }
        };
    }


    /////////////////////////////////////////////////////////////////////////////
    //
    // 리사이즈 & 업데이트 & 초기화 함수
    //
    /////////////////////////////////////////////////////////////////////////////


    update (ms)
    {
        if (this.updateFunction) {
            this.updateFunction();
        }
    }


    resize()
    {
        // NOTHING
    }


    initialize(backgroundImage, maskImage)
    {
        this.maskImage = maskImage;
        this.backgroundImage = backgroundImage;

        //const sprite = PIXI.Sprite.fromImage('./../assets/img/mask0.png');

        //this.testPixiShapeMask();
        //this.testGlobalCompositeOperation(backgroundImage, maskImage);
        //this.testBlendMode();
        //this.testDrawPolygon();
        //this.testDrawStar();
        //this.testCreateStar();
        this.testImageMask();
    }


    /////////////////////////////////////////////////////////////////////////////
    //
    // 테스트 함수
    //
    /////////////////////////////////////////////////////////////////////////////


    testPixiShapeMask()
    {
        const backgroundImage = PIXI.Sprite.fromImage('./../assets/img/background0.png');
        backgroundImage.width = this.canvasWidth;
        backgroundImage.height = this.canvasHeight;

        const circleShape = new PIXI.Graphics();
        circleShape.beginFill(0x000000);
        circleShape.drawCircle(100, 100, 100);
        circleShape.endFill();

        this.rootLayer.addChild(backgroundImage);
        /**
         * http://pixijs.download/release/docs/PIXI.Sprite.html#mask
         * For the moment, PIXI.CanvasRenderer doesn't support PIXI.Sprite as mask.
         * @type {PIXI.Sprite|PIXI.BaseTexture|PIXI.Texture|PIXI.extras.TilingSprite|*}
         */
        backgroundImage.mask = circleShape;

    }


    testGlobalCompositeOperation(backgroundImage, maskImage)
    {
        const pixiCanvas = document.getElementById('canvas');
        document.body.removeChild(pixiCanvas);

        const width = this.canvasWidth,
            height = this.canvasHeight;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        document.body.appendChild(canvas);

        const context = canvas.getContext('2d');
        context.drawImage(maskImage, 0, 0, width, height);
        context.globalCompositeOperation = 'source-atop';
        context.drawImage(backgroundImage, 0, 0, width, height);
    }


    testBlendMode()
    {
        const width = this.canvasWidth,
            height = this.canvasHeight;

        const circleShape = new PIXI.Graphics();
        circleShape.beginFill(0x000000);
        circleShape.drawCircle(500, 100, 100);
        circleShape.endFill();
        this.rootLayer.addChild(circleShape);

        const maskImage = PIXI.Sprite.fromImage('./../assets/img/mask-oval.png');
        this.rootLayer.addChild(maskImage);

        const backgroundImage = PIXI.Sprite.fromImage('./../assets/img/background0.png');
        backgroundImage.width = this.canvasWidth;
        backgroundImage.height = this.canvasHeight;
        this.rootLayer.addChild(backgroundImage);

        //backgroundImage.blendMode = PIXI.BLEND_MODES.NORMAL;
        //backgroundImage.blendMode = PIXI.BLEND_MODES.ADD;
        //backgroundImage.blendMode = PIXI.BLEND_MODES.MULTIPLY;
        //backgroundImage.blendMode = PIXI.BLEND_MODES.SCREEN;
        //backgroundImage.blendMode = PIXI.BLEND_MODES.OVERLAY;
        //backgroundImage.blendMode = PIXI.BLEND_MODES.DARKEN;
        //backgroundImage.blendMode = PIXI.BLEND_MODES.LIGHTEN;
        //backgroundImage.blendMode = PIXI.BLEND_MODES.COLOR_DODGE;
        //backgroundImage.blendMode = PIXI.BLEND_MODES.COLOR_BURN;
        //backgroundImage.blendMode = PIXI.BLEND_MODES.HARD_LIGHT;
        backgroundImage.blendMode = PIXI.BLEND_MODES.SOFT_LIGHT;
        //backgroundImage.blendMode = PIXI.BLEND_MODES.DIFFERENCE;
        //backgroundImage.blendMode = PIXI.BLEND_MODES.EXCLUSION;
        //backgroundImage.blendMode = PIXI.BLEND_MODES.HUE;
        //backgroundImage.blendMode = PIXI.BLEND_MODES.SATURATION;
        //backgroundImage.blendMode = PIXI.BLEND_MODES.COLOR;
        //backgroundImage.blendMode = PIXI.BLEND_MODES.LUMINOSITY;
    }


    testDrawPolygon()
    {
        const backgroundImage = PIXI.Sprite.fromImage('./../assets/img/background0.png');
        backgroundImage.width = this.canvasWidth;
        backgroundImage.height = this.canvasHeight;
        this.rootLayer.addChild(backgroundImage);

        var polygonPoints = [0, 0, 100, 0, 100, 100, 50, 150, 0, 100];

        //var polygon = new PIXI.Graphics();
        //polygon.clear();
        //polygon.beginFill('0xEE82EE', .5);
        //polygon.lineStyle(2, '0x008000', 0.67);
        //polygon.drawPolygon(polygonPoints);
        //polygon.endFill();
        //polygon.x = 100;
        //polygon.y = 100;
        //polygon.scale.x = 2;
        //this.rootLayer.addChild(polygon);

        const w = this.canvasWidth;
        const h = this.canvasHeight;

        const dimed = new PIXI.Graphics();
        this.drawByPolygonPoints(dimed, w, h, polygonPoints);
        this.rootLayer.addChild(dimed);
    }


    testDrawStar()
    {
        const backgroundImage = PIXI.Sprite.fromImage('./../assets/img/background0.png');
        backgroundImage.width = this.canvasWidth;
        backgroundImage.height = this.canvasHeight;
        this.rootLayer.addChild(backgroundImage);

        const dimedWidth = this.canvasWidth;
        const dimedHeight = this.canvasHeight;
        //const polygonPoints = this.getStarPoints(300, 300, 5, 120, 40);
        //const polygonPoints = this.getStarPoints(400, 400, 20, 140, 80);
        const polygonPoints = this.getStarPoints(400, 400, 40, 200, 180);

        const dimed = new PIXI.Graphics();
        this.drawByPolygonPoints(dimed, dimedWidth, dimedHeight, polygonPoints);
        this.rootLayer.addChild(dimed);
    }


    testCreateStar()
    {
        console.log('createStar');
        const backgroundImage = PIXI.Sprite.fromImage('./../assets/img/background0.png');
        backgroundImage.width = this.canvasWidth;
        backgroundImage.height = this.canvasHeight;
        this.rootLayer.addChild(backgroundImage);

        const polygonPoints = this.getStarPoints(0, 0, 18, 50, 40);

        const star = new PIXI.Sprite();
        const starGraphics = this.getGraphicsByPolygonPoints(polygonPoints, 0x000000, 0.5);
        star.addChild(starGraphics);
        this.rootLayer.addChild(star);


        star.points = [];
        const total = polygonPoints.length;

        for(var i = 0; i < total; i+=2) {
            const point = this.getPoint(1);
            point.x = polygonPoints[i];
            point.y = polygonPoints[i + 1];
            star.addChild(point);
            star.points.push(point);
        }

        star.x = 200;
        star.y = 200;
        star.scale.x = 2;
        star.scale.y = 2;

        const scaledPoints = [];
        const pointsTotal = star.points.length;

        for(var i = 0; i < pointsTotal; i++) {
            const starPoint = star.points[i];
            let point = new PIXI.Point(starPoint.x, starPoint.y);
            point = star.toGlobal(point);
            scaledPoints.push(point.x - star.x);
            scaledPoints.push(point.y - star.y);
        }

        const newStar = new PIXI.Sprite();
        const newScaledStarGraphics = this.getGraphicsByPolygonPoints(scaledPoints, 0xFF3300, 0.4);
        newScaledStarGraphics.x = 0;
        newScaledStarGraphics.y = 0;
        newStar.addChild(newScaledStarGraphics);
        newStar.cacheAsBitmap = true;
    }


    testImageMask()
    {
        const width = this.canvasWidth;
        const height = this.canvasHeight;

        this.mask = PIXI.Sprite.fromImage('./../assets/img/mask-oval.png');
        this.mask.anchor.set(0.5, 0.5);

        const w = this.maskImage.width,
            hw = w / 2,
            h = this.maskImage.height,
            hh = h / 2;

        this.maskCenterX = hw;
        this.maskCenterY = hh;

        this.maskGraphics = new PIXI.Graphics();
        this.maskGraphics.beginFill(0xFF3300);
        this.maskGraphics.lineStyle(0xFF3300);
        this.maskGraphics.drawCircle(0, 0, 5);
        this.mask.addChild(this.maskGraphics);

        const background = PIXI.Sprite.fromImage('./../assets/img/background0.png');
        background.width = width;
        background.height = height;

        this.rootLayer.addChild(background);
        this.rootLayer.addChild(this.mask);

        this.backgroundCanvas = document.createElement('canvas');
        this.backgroundCanvas.width = width;
        this.backgroundCanvas.height = height;

        const backgroundContext = this.backgroundCanvas.getContext('2d');
        backgroundContext.fillStyle = 'rgba(0, 0, 0, 0.5)';
        backgroundContext.fillRect(0, 0, width, height);


        this.dimedCanvas = document.createElement('canvas');
        this.dimedCanvas.width = width;
        this.dimedCanvas.height = height;

        this.dimedContext = this.dimedCanvas.getContext('2d');

        // 이미지 smoothed 설정
        const imageSmoothingEnabled = Config.imageSmoothingEnabled;

        /*if (this.ctx.imageSmoothingEnabled) {
            this.ctx.imageSmoothingEnabled = imageSmoothingEnabled;
        }
        else if (this.ctx.oImageSmoothingEnabled) {
            this.ctx.oImageSmoothingEnabled = imageSmoothingEnabled;
        }
        else if (this.ctx.msImageSmoothingEnabled) {
            this.ctx.msImageSmoothingEnabled = imageSmoothingEnabled;
        }
        else if (this.ctx.mozImageSmoothingEnabled) {
            this.ctx.mozImageSmoothingEnabled = imageSmoothingEnabled;
        }
        else if (this.ctx.webkitImageSmoothingEnabled) {
            this.ctx.webkitImageSmoothingEnabled = imageSmoothingEnabled;
        }*/

        const dimed = new PIXI.Sprite(PIXI.Texture.fromCanvas(this.dimedCanvas));
        this.rootLayer.addChild(dimed);


        const targetPoint = new PIXI.Graphics();
        targetPoint.beginFill(0xFF3300);
        targetPoint.drawCircle(0, 0, 5);
        targetPoint.x = 200 - 2.5;
        targetPoint.y = 200 - 2.5;
        this.rootLayer.addChild(targetPoint);


        const centerPoint = new PIXI.Graphics();
        centerPoint.beginFill(0xFF3300);
        centerPoint.drawCircle(0, 0, 5);
        centerPoint.x = width / 2 - 2.5;
        centerPoint.y = height / 2 - 2.5;
        this.rootLayer.addChild(centerPoint);


        this.mask.x = centerPoint.x;
        this.mask.y = centerPoint.y;
        this.mask.scale.x = 2;
        this.mask.scale.y = 2;
        //this.mask.alpha = 0.2;
        this.mask.visible = false;

        //console.log('cx[', this.cx, this.cy, ']');

        //var tween = Be.tween(this.mask, {x: 200, y: 200}, {x: this.mask.x, y: this.mask.y}, 5, Quad.easeOut);
        //tween.play();

        //var scaleWidth = this.maskImage.width * 3;
        //var scaleHeight = this.maskImage.height * 3;
        //var scale = Be.to(this.mask, {width: scaleWidth, height: scaleHeight}, 5, Quad.easeIn);
        //scale.play();

        this.updateFunction = this.imageMaskUpdateFunction.bind(this);
    }


    imageMaskUpdateFunction()
    {
        if (this.dimedContext) {

            // clear canvas
            this.dimedCanvas.width = this.canvasWidth;

            // 상태 저장
            this.dimedContext.save();

            // 배경 이미지 그리기
            this.dimedContext.drawImage(this.backgroundCanvas, 0, 0);

            //this.dimedContext.globalCompositeOperation = 'source-atop';
            //this.dimedContext.globalCompositeOperation = 'source-in';
            //this.dimedContext.globalCompositeOperation = 'source-out';
            //this.dimedContext.globalCompositeOperation = 'source-over';
            //this.dimedContext.globalCompositeOperation = 'destination-atop';
            //this.dimedContext.globalCompositeOperation = 'destination-in';
            this.dimedContext.globalCompositeOperation = 'destination-out';
            //this.dimedContext.globalCompositeOperation = 'destination-over';
            //this.dimedContext.globalCompositeOperation = 'lighter';
            //this.dimedContext.globalCompositeOperation = 'copy';
            //this.dimedContext.globalCompositeOperation = 'xor';

            // x, y 좌표로 이동
            this.dimedContext.translate(this.mask.x, this.mask.y);

            // 마스크 이미지 중심 좌표 만큼 뒤로 이동 (스케일값도 반영)
            this.dimedContext.translate(-this.maskCenterX * this.mask.scale.x, -this.maskCenterY * this.mask.scale.y);

            // 스케일
            this.dimedContext.scale(this.mask.scale.x, this.mask.scale.y);

            // 그리기
            this.dimedContext.drawImage(this.maskImage, 0, 0);

            // 이전 상태 복원
            this.dimedContext.restore();
        }
    }


    /////////////////////////////////////////////////////////////////////////////
    //
    // 유틸 함수
    //
    /////////////////////////////////////////////////////////////////////////////


    drawByPolygonPoints(graphics, dimedWidth, dimedHeight, polygonPoints)
    {
        graphics.clear();
        graphics.beginFill('0x000000', 0.5);
        graphics.moveTo(0, 0);
        graphics.lineTo(0, dimedHeight);
        graphics.lineTo(dimedWidth, dimedHeight);
        graphics.lineTo(dimedWidth, 0);
        graphics.lineTo(0, 0);

        for(var i = 0; i < polygonPoints.length; i += 2) {
            graphics.lineTo(polygonPoints[i], polygonPoints[i + 1]);
        }

        graphics.endFill();
    }


    /**
     * getStarPoints(75, 100, 5, 30, 15);
     * getStarPoints(175, 100, 12, 30, 10);
     * getStarPoints(75, 200, 6, 30, 15);
     * getStarPoints(175, 200, 20, 30, 25);
     *
     * @param cx
     * @param cy
     * @param spikes
     * @param outerRadius
     * @param innerRadius
     * @returns {Array}
     */
    getStarPoints(cx, cy, spikes, outerRadius, innerRadius)
    {
        const points = [];

        var rot = Math.PI / 2 * 3;
        var x = cx;
        var y = cy;
        var step = Math.PI / spikes;

        points.push(cx);
        points.push(cy - outerRadius);

        for (var i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            rot += step;

            points.push(x);
            points.push(y);

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;

            points.push(x);
            points.push(y);

            rot += step;
        }

        points.push(cx);
        points.push(cy - outerRadius);

        return points;
    }


    getGraphicsByPolygonPoints(polygonPoints, color = 0x000000, alpha = 0.5)
    {
        const graphics = new PIXI.Graphics();
        graphics.beginFill(color, alpha);
        graphics.moveTo(polygonPoints[0], polygonPoints[1]);

        for(var i = 0; i < polygonPoints.length; i += 2) {
            graphics.lineTo(polygonPoints[i], polygonPoints[i + 1]);
        }

        graphics.endFill();
        return graphics;
    }


    getPoint(radius, alpha = 1)
    {
        const graphics = new PIXI.Graphics();
        graphics.beginFill('0xFF3300', alpha);
        graphics.drawCircle(0, 0, radius);
        graphics.endFill();
        graphics.drawRoundedRect();
        return graphics;
    }


    /////////////////////////////////////////////////////////////////////////////
    //
    // Getter & Setter
    //
    /////////////////////////////////////////////////////////////////////////////



    get canvasWidth()
    {
        return window.innerWidth * window.devicePixelRatio;
    }

    get canvasHeight()
    {
        return window.innerHeight * window.devicePixelRatio;
    }
}