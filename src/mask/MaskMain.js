import Size from './utils/Size';
import Calc from './utils/Calculator';
import Mask from './display/Mask';
import Mouse from './utils/Mouse';
import Bitmap from './display/Bitmap';
import DimmedMask from './display/DimmedMask';
import BackgroundImage from './display/BackgroundImage';
import TransformTool from './transform/TransformTool';



export default class MaskMain extends PIXI.utils.EventEmitter
{
    constructor(renderer, stageLayer, maskLayer, options = {useSnap: true, snapAngle: 5})
    {
        console.log('constructor(', renderer, stageLayer, maskLayer, options, ')');

        super();

        Mouse.renderer = renderer;

        this.renderer = renderer;
        this.stageLayer = stageLayer;
        this.maskLayer = maskLayer;
        this.options = options;

        this.initialize();
    }


    /////////////////////////////////////////////////////////////////////////////
    //
    // 리사이즈 & 업데이트 & 초기화 함수
    //
    /////////////////////////////////////////////////////////////////////////////


    initialize()
    {
        this.maskLayer.updateTransform();

        //this.testBitmap();
        this.testCreate();

        this.transformTool = new TransformTool(this.stageLayer, this.maskLayer, this.options);
    }


    resize()
    {
        if (Size.isAvailable && this.backgroundImage) {
            const viewport = this.viewport = Size.windowSize;
            Size.initialize(this.backgroundImage.originalImageSize, viewport);
            this.backgroundImage.resize();
            this.backgroundImage.x = Size.initializedBackgroundImageSize.x;
            this.backgroundImage.y = Size.initializedBackgroundImageSize.y;
        }
    }


    update (ms)
    {
        if (this.dimmedMask) {
            this.dimmedMask.update(ms);
        }
    }


    /////////////////////////////////////////////////////////////////////////////
    //
    // 테스트
    //
    /////////////////////////////////////////////////////////////////////////////


    testBitmap()
    {
        const backgroundImage = this.backgroundImage = new Bitmap('./../assets/img/background0.png');
        backgroundImage.on(Bitmap.READY, () => {

            const viewport = Size.windowSize;
            Size.initialize(backgroundImage, viewport);

            const imageSize = Size.initializedBackgroundImageSize;
            backgroundImage.x = imageSize.x;
            backgroundImage.y = imageSize.y;
            backgroundImage.width = imageSize.width;
            backgroundImage.height = imageSize.height;

            this.maskLayer.addChild(backgroundImage);
        });

        const mask = this.mask = new Bitmap('./../assets/img/mask0.png');
        this.maskLayer.addChild(mask);
    }


    testCreate()
    {
        const viewport = this.viewport = Size.windowSize;

        const backgroundImage = this.backgroundImage =
            new BackgroundImage('./../assets/img/background0.jpg', viewport);
            //new BackgroundImage('./../assets/img/background1.jpg', viewport);

        backgroundImage.on(Bitmap.READY, this.onBackgroundImageReady.bind(this));
    }


    onBackgroundImageReady()
    {
        // Size 객체 초기화, 배경 이미지 사이즈, 위치 설정
        Size.initialize(this.backgroundImage, this.viewport);

        const imageSize = Size.initializedBackgroundImageSize;
        this.backgroundImage.bitmapWidth = imageSize.width;
        this.backgroundImage.bitmapHeight = imageSize.height;

        this.backgroundImage.bitmapRotation = Calc.toRadians(10);
        this.backgroundImage.x = Size.windowCenterX;
        this.backgroundImage.y = Size.windowCenterY;

        /*this.backgroundImage.x = 600;
        this.backgroundImage.y = 900;
        this.backgroundImage.bitmapRotation = -Calc.toRadians(30);*/

        //this.backgroundImage.alpha = 0.3;
        //this.backgroundImage.visible = false;

        this.maskLayer.addChild(this.backgroundImage);

        const mask = this.mask = new Mask('./../assets/img/mask0.png');
        mask.on(Bitmap.READY, this.onMaskImageRady.bind(this));
    }


    onMaskImageRady()
    {
        const maskDefaultSize = new PIXI.Rectangle(0, 0, 200, 285);
        this.mask.bitmapWidth = maskDefaultSize.width;
        this.mask.bitmapHeight = maskDefaultSize.height;
        this.mask.x = Size.windowCenterX - 200;
        this.mask.y = Size.windowCenterY - 100;
        //this.mask.alpha = 0.001;
        this.mask.alpha = 0.4;
        //this.mask.visible = false;
        this.maskLayer.addChild(this.mask);

        this.start();
    }


    start()
    {
        console.log('start');

        this.maskMouseDownListener = this.onMaskDown.bind(this);
        this.mask.mousedown = this.maskMouseDownListener;
        this.mask.touchstart = this.maskMouseDownListener;

        const dimmedMask = this.dimmedMask = new DimmedMask(this.viewport, this.backgroundImage, this.mask);
        //dimmedMask.alpha = 0.82;
        dimmedMask.alpha = 0.32;
        dimmedMask.visible = true;
        this.maskLayer.addChild(dimmedMask);

        this.maskLayer.swapChildren(this.mask, this.dimmedMask);
    }


    /////////////////////////////////////////////////////////////////////////////
    //
    // Event Functions
    //
    /////////////////////////////////////////////////////////////////////////////


    onMaskDown(e)
    {
        const target = e.target;
        console.log('target', target);
        this.transformTool.setTarget(e);
    }


    /////////////////////////////////////////////////////////////////////////////
    //
    // 유틸 함수
    //
    /////////////////////////////////////////////////////////////////////////////



    /////////////////////////////////////////////////////////////////////////////
    //
    // Getter & Setter
    //
    /////////////////////////////////////////////////////////////////////////////




}