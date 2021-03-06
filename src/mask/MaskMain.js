import Size from './utils/Size';
import Calc from './utils/Calculator';
import Mask from './display/Mask';
import Mouse from './utils/Mouse';
import Bitmap from './display/Bitmap';
import DimmedMask from './display/DimmedMask';
import BackgroundImage from './display/BackgroundImage';
import TransformTool from './transform/TransformTool';
import CollisionManager from './manager/CollisionManager';
import ToolControlType from './transform/ToolControlType';
import MaskVO from './vo/MaskVO';
import {clone} from './utils/util';
import Config from './config/Config';


// TEST
import DatGui from './debug/DatGui';
import KeyCode from './consts/KeyCode';
import BitmapContainer from './display/BitmapContainer';




export default class MaskMain extends PIXI.utils.EventEmitter
{
    constructor(renderer, stageLayer, maskLayer, options = {useSnap: true, snapAngle: 5, useDelete: false})
    {
        super();

        Mouse.renderer = renderer;
        this.renderer = renderer;
        this.stageLayer = stageLayer;
        this.maskLayer = maskLayer;
        this.options = options;


        // TODO TEST 코드
        const maskVO = new MaskVO();
        //maskVO.setTestData(0);  //원
        //maskVO.setTestData(1);  //삼각
        //maskVO.setTestData(2);  //둥근사각
        //maskVO.setTestData(3);  //다각
        //maskVO.setTestData(4);  //별1
        maskVO.setTestData(5);  //별2
        //maskVO.setTestData(6);  //둥근별

        this.options.maskVO = maskVO;

        this.initialize(options);
    }


    /////////////////////////////////////////////////////////////////////////////
    //
    // 리사이즈 & 업데이트 & 초기화 함수
    //
    /////////////////////////////////////////////////////////////////////////////


    initialize(options)
    {
        // CheckOS 실행
        Config.instance;

        this.options = options;

        // 어플리케이션 시작 여부
        this.isStart = false;

        // 디버그용 그래픽스
        window.g = this.g = new PIXI.Graphics();
        this.stageLayer.addChild(this.g);

        // 마스크 레이어 업데이트
        this.maskLayer.updateTransform();

        // 뷰포트 생성
        const viewport = this.viewport = Size.windowSize;

        // 배경 이미지 생성
        const backgroundImage = this.backgroundImage = new BackgroundImage(Config.instance.backgroundImageURL, viewport);
        backgroundImage.on(Bitmap.READY, this.onBackgroundImageReady.bind(this));

        // 변형툴 생성
        this.transformTool = new TransformTool(this.stageLayer, this.maskLayer, this.options);

        // 디버그 키 등록
        window.addEventListener('keyup', this.onKeyUp.bind(this));
    }


    /**
     * 마스크 생성
     * @param maskVO {MaskVO}
     */
    createMask(maskVO)
    {
        if (maskVO) {
            const mask = this.mask = new Mask(maskVO);
            this._imageReadyListener = this.onMaskImageRady.bind(this);
            mask.on(Bitmap.READY, this._imageReadyListener);

            this._maskTransformCompleteListener = this.onMaskTransformComplete.bind(this);
            this.mask.on(TransformTool.TRANSFORM_COMPLETE, this._maskTransformCompleteListener);
        }
    }


    removeMask()
    {
        if (this.mask) {
            this.maskLayer.removeChild(this.mask);
            this.mask.off(Bitmap.READY, this._imageReadyListener);
            this.mask.off(TransformTool.TRANSFORM_COMPLETE, this._maskTransformCompleteListener);
            this._imageReadyListener = null;
            this._maskTransformCompleteListener = null;
            this.mask.destroy();
        }
    }


    /**
     * 마스크 변경
     * @param maskVO {MaskVO}
     */
    changeMask(maskVO)
    {
        if (this.transformTool) {
            this.transformTool.releaseTarget();
        }

        this.dimmedMask.stopRender();
        this.removeMask();
        this.createMask(maskVO);
    }


    /**
     * 마스크 첫 시작
     */
    startApplication()
    {
        this.isStart = true;

        this.addEvent();
        this.createDimmedMask();
        this.createCollisionManager();
        this.addDatGui();
    }


    addEvent()
    {
        window.document.addEventListener('mousedown', this.onStageDown.bind(this));
    }


    createDimmedMask()
    {
        const dimmedMask = this.dimmedMask = new DimmedMask(this.backgroundImage, this.mask);
        dimmedMask.alpha = 0.82;
        //dimmedMask.alpha = 0.32;
        dimmedMask.visible = true;
        this.maskLayer.addChild(dimmedMask);
    }


    createCollisionManager()
    {
        if (this.mask && this.backgroundImage) {
            CollisionManager.initialize(this.mask, this.backgroundImage);
        }
    }


    /////////////////////////////////////////////////////////////////////////////
    //
    // Public Function
    //
    /////////////////////////////////////////////////////////////////////////////


    resize()
    {
        if (Size.isAvailable) {

            const viewport = this.viewport = Size.windowSize;
            Size.initialize(this.backgroundImage, viewport);

            if (this.backgroundImage) {

                const offsetX = Size.initializedBackgroundImageSize.x - this.backgroundImage.x;
                const offsetY = Size.initializedBackgroundImageSize.y - this.backgroundImage.y;

                this.backgroundImage.resize();
                this.backgroundImage.x = Size.initializedBackgroundImageSize.x;
                this.backgroundImage.y = Size.initializedBackgroundImageSize.y;

                this.mask.x += offsetX;
                this.mask.y += offsetY;
            }
        }
    }


    update (ms)
    {
        if (this.dimmedMask) {
            this.dimmedMask.update(ms);
        }
    }


    /**
     * 변형이후 가운데로 이동시켜 줍니다.
     */
    maskMoveToCenter(event)
    {
        if (event.type === ToolControlType.MIDDLE_CENTER) {
            const target = this.transformTool.target;
            const centerX = Size.viewportCenterX;
            const centerY = Size.viewportCenterY;
            const offsetX = centerX - this.mask.x;
            const offsetY = centerY - this.mask.y;

            const duration = 0.3;
            // Back, Bounc, Circ, Circular, Cubic,
            // Elastic, Expo, Exponential, Linear,
            // Physical, Quad, Quadratic, Quart,
            // Quartic, Quint, Quintic, Sine

            //const easing = Quart.easeOut;
            //const easing = Quad.easeOut;
            //const easing = Quadratic.easeOut;
            //const easing = Quart.easeOut;
            //const easing = Quartic.easeOut;
            //const easing = Quint.easeOut;
            const maskEasing = Exponential.easeOut;
            const backEasing = Exponential.easeOut;

            const mask = this.maskTween = Be.to(this.mask, {x:centerX, y:centerY}, duration, maskEasing);

            mask.onUpdate = () => {
                this.transformTool.activeTarget(target);
            };
            mask.onComplete = () => {
                this.transformTool.activeTarget(target);
            };
            mask.play();

            const background = this.backgroundTween = Be.to(this.backgroundImage, {x:this.backgroundImage.x + offsetX, y:this.backgroundImage.y + offsetY}, duration, backEasing);
            background.play();
        }
    }


    stopMotion()
    {
        if (this.maskTween) {
            this.maskTween.stop();
        }

        if (this.backgroundTween) {
            this.backgroundTween.stop();
        }
    }


    reset()
    {
        this.dimmedMask.reset();

        this.backgroundImage.setPivot(this.backgroundImage.registrationPoint);
        this.backgroundImage.x = Size.windowCenterX;
        this.backgroundImage.y = Size.windowCenterY;
        this.backgroundImage.rotation = 0;
        this.backgroundImage.scale.x = 0.8;
        this.backgroundImage.scale.y = 0.8;

        this.mask.x = Size.windowCenterX;
        this.mask.y = Size.windowCenterY;

        this.transformTool.releaseTarget();
    }


    /////////////////////////////////////////////////////////////////////////////
    //
    // Event Functions
    //
    /////////////////////////////////////////////////////////////////////////////


    onBackgroundImageReady()
    {
        // Size 객체 초기화, 배경 이미지 사이즈, 위치 설정
        Size.initialize(this.backgroundImage, this.viewport);

        // 배경 이미지 사이즈 초기화
        const imageSize = Size.initializedBackgroundImageSize;
        this.backgroundImage.bitmapWidth = imageSize.width;
        this.backgroundImage.bitmapHeight = imageSize.height;

        // 배경 이미지 테스트 설정
        //this.backgroundImage.bitmapRotation = Calc.toRadians(10);
        this.backgroundImage.x = Size.windowCenterX;
        this.backgroundImage.y = Size.windowCenterY;

        // TODO 테스트 코드
        this.backgroundImage.scale.x = 0.8;
        this.backgroundImage.scale.y = 0.8;
        //this.backgroundImage.alpha = 0.3;
        //this.backgroundImage.visible = false;

        // 배경 이미지 addChild
        this.maskLayer.addChild(this.backgroundImage);

        // 배경 이미지 이벤트 등록
        this._backgroundImageTransformCompleteListener = this.onBackgroundImageTransformComplete.bind(this);
        this.backgroundImage.on(TransformTool.TRANSFORM_COMPLETE, this._backgroundImageTransformCompleteListener);

        // 마스크 생성
        this.createMask(this.options.maskVO);
    }


    onMaskImageRady()
    {
        this.mask.x = Size.windowCenterX;
        this.mask.y = Size.windowCenterY;
        //this.mask.alpha = 0.0;
        //this.mask.alpha = 0.1;
        this.mask.visible = false;
        this.maskLayer.addChild(this.mask);

        // 처음 마스크를 로드한 경우
        if (this.isStart === false) {
            this.startApplication();
        }
        else {
            this.dimmedMask.setMaskImage(this.mask);
            this.dimmedMask.startRender();
            CollisionManager.changeMask(this.mask);
        }
    }


    onStageDown(event)
    {
        this.stopMotion();

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
        this.transformTool.setTargetByEvent(event);
    }


    /**
     * TransformTool에서 pivot을 설정할 수 있도록 마스크의 중심좌표를 maskLayer에 설정해 둡니다.
     * @param event
     */
    onMaskTransformComplete(event)
    {
        this.transformTool.update();
        this.transformTool.drawCenter();
        this.maskMoveToCenter(event);
    }


    onBackgroundImageMouseDown(event)
    {
        this.transformTool.setTargetByEvent(event);
    }


    /**
     * TransformTool에서 pivot을 설정할 수 있도록 마스크의 중심좌표를 maskLayer에 설정해 둡니다.
     * @param event
     */
    onBackgroundImageTransformComplete(event)
    {
        this.transformTool.update();
        this.transformTool.drawCenter();
    }


    /////////////////////////////////////////////////////////////////////////////
    //
    // Debugger
    //
    /////////////////////////////////////////////////////////////////////////////


    addDatGui()
    {
        this.datGui = DatGui.instance;
        this.datGui.initialize(this.options);
        this.datGui.on(DatGui.CHAGE_MASK, this.onChangeMask.bind(this));
        this.datGui.on(DatGui.RESET, this.onReset.bind(this));
        this.datGui.on(DatGui.SHOW_MASK_REAL_SIZE, this.onShowMaskRealSize.bind(this));
        this.datGui.on(DatGui.SHOW_MASK_VISIBLE_SIZE, this.onShowMaskVisibleSize.bind(this));
    }


    /////////////////////////////////////////////////////////////////////////////
    //
    // Test 함수
    //
    /////////////////////////////////////////////////////////////////////////////


    testBitmap()
    {
        const backgroundImage = this.backgroundImage = new Bitmap(Config.instance.backgroundImageURL);
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


    /**
     * 마스크 교체
     * @param maskTestDataIndex {Number} MaskVO.setTestData(index)에 사용할 index 넘버
     */
    onChangeMask(maskTestDataIndex)
    {
        this.reset();

        const maskVO = new MaskVO();
        maskVO.setTestData(maskTestDataIndex);
        this.changeMask(maskVO);
    }


    onReset()
    {
        this.reset();
    }


    onShowMaskRealSize()
    {
        this.dimmedMask.isDisplayRealSize = true;
        this.dimmedMask.isDisplayVisibleSize = false;
    }


    onShowMaskVisibleSize()
    {
        this.dimmedMask.isDisplayRealSize = false;
        this.dimmedMask.isDisplayVisibleSize = true;
    }


    onKeyUp(e)
    {
        switch (e.keyCode) {
            case KeyCode.ESCAPE:
                console.clear();

                if (window.g) {
                    window.g.clear();
                }

                break;
            case KeyCode.SPACE:
                //
                break;
            case KeyCode.NUMBER_1:
                //
                break;
            case KeyCode.NUMBER_2:
                //
                break;
        }
    }
}