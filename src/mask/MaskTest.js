/**
 * 마스크 구현 테스트
 */
export default class MaskMain extends PIXI.utils.EventEmitter
{
    constructor(renderer, rootLayer, maskLayer)
    {
        super();

        this.renderer = renderer;
        this.rootLayer = rootLayer;
        this.maskLayer = maskLayer;

        const backgroundImage = new Image();
        const maskImage = new Image();
        backgroundImage.src = './../assets/img/background.jpeg';

        backgroundImage.onload = () => {
            maskImage.src = './../assets/img/image01.png';

            maskImage.onload = () => {
                this._initialize(backgroundImage, maskImage);
            }
        };
    }


    resize() {}


    _initialize(backgroundImage, maskImage)
    {
        //const sprite = PIXI.Sprite.fromImage('./../assets/img/image00.png');

        //this.testPixiShapeMask();
        //this.testGlobalCompositeOperation(backgroundImage, maskImage);
        //this.testBlendMode();
        //this.testDrawPolygon();
        //this.testDrawStar();
        this.testCreateStar();
    }


    /////////////////////////////////////////////////////////////////////////////
    //
    // 테스트 함수
    //
    /////////////////////////////////////////////////////////////////////////////


    testPixiShapeMask()
    {
        const backgroundImage = PIXI.Sprite.fromImage('./../assets/img/background.jpeg');
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

        const maskImage = PIXI.Sprite.fromImage('./../assets/img/image01.png');
        this.rootLayer.addChild(maskImage);

        const backgroundImage = PIXI.Sprite.fromImage('./../assets/img/background.jpeg');
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
        const backgroundImage = PIXI.Sprite.fromImage('./../assets/img/background.jpeg');
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
        const backgroundImage = PIXI.Sprite.fromImage('./../assets/img/background.jpeg');
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
        const backgroundImage = PIXI.Sprite.fromImage('./../assets/img/background.jpeg');
        backgroundImage.width = this.canvasWidth;
        backgroundImage.height = this.canvasHeight;
        this.rootLayer.addChild(backgroundImage);

        const polygonPoints = this.getStarPoints(0, 0, 40, 200, 180);

        const star = new PIXI.Sprite();
        const starGraphics = this.getGraphicsByPolygonPoints(polygonPoints);
        star.addChild(starGraphics);

        this.rootLayer.addChild(star);
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


    getGraphicsByPolygonPoints(polygonPoints)
    {
        const graphics = new PIXI.Graphics();
        graphics.beginFill('0x000000', 0.5);
        graphics.moveTo(polygonPoints[0], polygonPoints[1]);

        for(var i = 0; i < polygonPoints.length; i += 2) {
            graphics.lineTo(polygonPoints[i], polygonPoints[i + 1]);
        }

        graphics.endFill();
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