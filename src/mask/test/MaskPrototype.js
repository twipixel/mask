import Size from './../utils/Size';
import Mask from './../display/Mask';
import Bitmap from './../display/Bitmap';
import BackgroundImage from './../display/BackgroundImage';


export default class MaskPrototype extends PIXI.utils.EventEmitter
{
    constructor(renderer, rootLayer, maskLayer)
    {
        super();

        this.renderer = renderer;
        this.rootLayer = rootLayer;
        this.maskLayer = maskLayer;

        this.initialize();
    }


    /////////////////////////////////////////////////////////////////////////////
    //
    // 리사이즈 & 업데이트 & 초기화 함수
    //
    /////////////////////////////////////////////////////////////////////////////


    resize()
    {
        console.log('resize');
        if (Size.isAvailable && this.backgroundImage) {
            const viewport = this.viewport = Size.windowRetinaAppliedSize;
            Size.initialize(this.backgroundImage.originalImageSize, viewport);
            this.backgroundImage.resize();
            this.backgroundImage.x = Size.initializedBackgroundImageSize.x;
            this.backgroundImage.y = Size.initializedBackgroundImageSize.y;
        }
    }


    update (ms)
    {
        //
    }


    initialize()
    {
        //this.testBitmap();
        this.testCreate();
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

            const viewport = Size.windowRetinaAppliedSize;
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
        const viewport = this.viewport = Size.windowRetinaAppliedSize;

        const backgroundImage = this.backgroundImage =
            new BackgroundImage('./../assets/img/background0.png', viewport);

        backgroundImage.on(Bitmap.READY, this.onBackgroundImageReady.bind(this));
        this.maskLayer.addChild(backgroundImage);
    }


    onBackgroundImageReady()
    {
        // Size 객체 초기화, 배경 이미지 사이즈, 위치 설정
        Size.initialize(this.backgroundImage, this.viewport);

        const imageSize = Size.initializedBackgroundImageSize;
        this.backgroundImage.bitmapWidth = imageSize.width;
        this.backgroundImage.bitmapHeight = imageSize.height;
        this.backgroundImage.x = imageSize.x;
        this.backgroundImage.y = imageSize.y;

        const mask = this.mask = new Mask('./../assets/img/mask0.png');
        this.maskLayer.addChild(mask);
        mask.on(Bitmap.READY, this.onMaskImageRady.bind(this));
    }


    onMaskImageRady()
    {
        const maskDefaultSize = new PIXI.Rectangle(0, 0, 200, 285);
        this.mask.bitmapWidth = maskDefaultSize.width;
        this.mask.bitmapHeight = maskDefaultSize.height;
        this.mask.x = Size.windowRetinaAppliedWidth / 2 - maskDefaultSize.width / 2;
        this.mask.y = Size.windowRetinaAppliedHeight / 2 - maskDefaultSize.height / 2;

        this.start();
    }


    start()
    {

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