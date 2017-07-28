import Size from './utils/Size';
import Calc from './utils/Calculator';
import Mask from './display/Mask';
import Mouse from './utils/Mouse';
import Bitmap from './display/Bitmap';
import DimmedMask from './display/DimmedMask';
import BackgroundImage from './display/BackgroundImage';
import TransformTool from './transform/TransformTool';
import CollisionManager from './manager/CollisionManager';
import {clone} from './utils/util';


export default class MaskMain extends PIXI.utils.EventEmitter
{
    constructor(renderer, stageLayer, maskLayer, options = {useSnap: true, snapAngle: 5})
    {
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
        // 디버그용 그래픽스
        window.g = this.g = new PIXI.Graphics();
        this.stageLayer.addChild(this.g);

        this.maskLayer.updateTransform();

        //this.testBitmap();
        this.testCreate();

        this.createTransformTool();
    }


    resize()
    {
        if (Size.isAvailable) {

            const viewport = this.viewport = Size.windowSize;
            Size.initialize(this.backgroundImage, viewport);

            if (this.backgroundImage) {
                this.backgroundImage.resize();
                this.backgroundImage.x = Size.initializedBackgroundImageSize.x;
                this.backgroundImage.y = Size.initializedBackgroundImageSize.y;
            }

            if (this.dimmedMask) {
                this.dimmedMask.resize();
            }
        }
    }


    update (ms)
    {
        if (this.dimmedMask) {
            this.dimmedMask.update(ms);
        }

        /*if (this.transformTool) {
            this.transformTool.updateGraphics();
            this.transformTool.drawCenter();
            this.transformTool.updatePrevTargetLt();
        }*/


        if (this._hitTest) {
            this._hitTest();
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

        const mask = this.mask = new Bitmap('./../assets/img/mask1.png');
        this.maskLayer.addChild(mask);
    }


    testCreate()
    {
        const viewport = this.viewport = Size.windowSize;

        const backgroundImage = this.backgroundImage =
            new BackgroundImage('./../assets/img/background0.png', viewport);
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

        this._maskTransformCompleteListener = this.onMaskTransformComplete.bind(this);
        this.mask.on(TransformTool.TRANSFORM_COMPLETE, this._maskTransformCompleteListener);

        this._backgroundImageTransformCompleteListener = this.onBackgroundImageTransformComplete.bind(this);
        this.backgroundImage.on(TransformTool.TRANSFORM_COMPLETE, this._backgroundImageTransformCompleteListener);
    }


    onMaskImageRady()
    {
        const maskDefaultSize = new PIXI.Rectangle(0, 0, 174, 188);
        this.mask.bitmapWidth = maskDefaultSize.width;
        this.mask.bitmapHeight = maskDefaultSize.height;
        this.mask.x = Size.windowCenterX - 200;
        this.mask.y = Size.windowCenterY - 100;
        //this.mask.alpha = 0.0;
        //this.mask.alpha = 0.1;
        this.mask.visible = false;
        this.maskLayer.addChild(this.mask);

        this.start();
    }


    start()
    {
        //this._maskMouseDownListener = this.onMaskDown.bind(this);
        //this.mask.mousedown = this._maskMouseDownListener;

        //this._backgroundImageMouseDownListener = this.onBackgroundImageMouseDown.bind(this);
        //this.backgroundImage.mousedown = this._backgroundImageMouseDownListener;

        window.document.addEventListener('mousedown', this.onStageDown.bind(this));

        const dimmedMask = this.dimmedMask = new DimmedMask(this.backgroundImage, this.mask);
        dimmedMask.alpha = 0.82;
        //dimmedMask.alpha = 0.32;
        dimmedMask.visible = true;
        this.maskLayer.addChild(dimmedMask);

        //this.maskLayer.swapChildren(this.mask, this.dimmedMask);

        CollisionManager.initialize(this.mask, this.backgroundImage);
    }


    /////////////////////////////////////////////////////////////////////////////
    //
    // TransformTool
    //
    /////////////////////////////////////////////////////////////////////////////


    createTransformTool()
    {
        this.transformTool = new TransformTool(this.stageLayer, this.maskLayer, this.options);
    }



    /////////////////////////////////////////////////////////////////////////////
    //
    // Event Functions
    //
    /////////////////////////////////////////////////////////////////////////////


    onStageDown(event)
    {
        //control 이 클릭 되었으면 리턴
        const isOverControl = this.transformTool.isOverControl;

        if (isOverControl === true) {
            return;
        }

        const global = Mouse.global;
        const isHitMask = this.mask.hitTestWithGlobalPoint(global);

        if (isHitMask) {
            event.stopPropagation();
            const cloneEvent = clone(event);
            cloneEvent.target = this.mask;
            cloneEvent.stopPropagation = function(){};
            this.onMaskDown(cloneEvent);
        }
        else {
            const isHitBackgroundImage = this.backgroundImage.hitTestWithGlobalPoint(global);

            if (isHitBackgroundImage) {
                event.stopPropagation();
                const cloneEvent = clone(event);
                cloneEvent.target = this.backgroundImage;
                cloneEvent.stopPropagation = function(){};
                this.onBackgroundImageMouseDown(cloneEvent);
            }
        }
    }


    onMaskDown(event)
    {
        this.transformTool.setTarget(event);
        //this._hitTest = CollisionManager.drawBounds.bind(this);
        //this._hitTest = CollisionManager.hitTest.bind(this, true);
    }


    onMaskTransformComplete(event)
    {
        //this._hitTest = null;
        this.transformTool.setPivotByControl(new PIXI.Point(0, 0));
        this.transformTool.update();
        this.transformTool.drawCenter();
    }


    onBackgroundImageMouseDown(event)
    {
        this.transformTool.setTarget(event);
        //this._hitTest = CollisionManager.drawBounds.bind(this);
        //this._hitTest = CollisionManager.hitTest.bind(this, false);
    }


    onBackgroundImageTransformComplete(event)
    {
        //this._hitTest = null;
        this.transformTool.setPivotByControl(new PIXI.Point(0, 0));
        this.transformTool.update();
        this.transformTool.drawCenter();
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