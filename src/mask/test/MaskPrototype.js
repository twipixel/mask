import Bitmap from './../display/Bitmap';
import ScreenManager from './../manager/ScreenManager';


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
        // NOTHING
    }


    update (ms)
    {
        if (this.updateFunction) {
            this.updateFunction();
        }
    }


    initialize()
    {
        const canvas = this.renderer.view;
        const viewport = new PIXI.Rectangle(0, 0, this.canvasWidth, this.canvasHeight);
        ScreenManager.instance.initialize(canvas, viewport);
        this.createBitmapContainer();
    }


    /////////////////////////////////////////////////////////////////////////////
    //
    // 테스트
    //
    /////////////////////////////////////////////////////////////////////////////


    createBitmapContainer()
    {
        const background = new Bitmap('./../assets/img/background0.png');
        background.on(Bitmap.READY, () => {
            console.log('ready!');

            background.width = this.canvasWidth;
            background.height = this.canvasHeight;

            console.log('background[', background.width, background.height, ']', 'canvas[', this.canvasWidth, this.canvasHeight, ']');
            this.maskLayer.addChild(background);
        });

        const mask = new Bitmap('./../assets/img/mask0.png');
        this.maskLayer.addChild(mask);
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



    get canvasWidth()
    {
        return window.innerWidth * window.devicePixelRatio;
    }

    get canvasHeight()
    {
        return window.innerHeight * window.devicePixelRatio;
    }
}