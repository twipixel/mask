import Calc from './../utils/Calculator';


const singleton = Symbol();
const singletonEnforcer = Symbol();

export default class ScreenManager
{
    /**
     *
     * @param canvas 사용하고 있는 캔버스
     * @param viewport 화면 영역 {PIXI.Rectangle}
     * @param paddingX 실제 화면 영역에 적용할 패딩X 값
     * @param paddingY 실제 화면 영역에 적용할 패딩Y 값
     */
    constructor(enforcer)
    {
        if (enforcer !== singletonEnforcer) {
            throw new Error('Cannot construct singleton');
        }
    }


    static get instance()
    {
        if (!this[singleton]) {
            this[singleton] = new ScreenManager(singletonEnforcer);
        }
        return this[singleton];
    }


    initialize(canvas, viewport)
    {
        console.log('ScreenManager.instance.initialize(', canvas, viewport, ')');
        this._canvas = canvas;
        this._viewport = viewport;
    }



    ///////////////////////////////////////////////////////////////////////////////
    //
    // Functions
    //
    /////////////////////////////////////////////////////////////////////////////////



    /**
     * 초기 이미지 사이즈
     */
    getInitializeImageSize()
    {
        var initSize = Calc.getSizeFitInBounds(this.canvas, this.screenBounds);
        initSize.x = this.centerX - initSize.width / 2;
        initSize.y = this.centerY - initSize.height / 2;
        return initSize;
    }



    ///////////////////////////////////////////////////////////////////////////////
    //
    // Getter & Setter
    //
    /////////////////////////////////////////////////////////////////////////////////



    /**
     * offset이나 padding이 적용된 실제 화면 영역을 반환합니다.
     * offset이나 padding 없으므로 그냥 리턴합니다.
     * @returns {*|PIXI.Rectangle}
     */
    get screenBounds()
    {
        if (!this._viewport) {
            throw new Error('ScreenManager must initialize.');
        }
        return this._viewport;
    }


    /**
     * 실제 화면 영역
     * @returns {*|PIXI.Rectangle}
     */
    get viewport()
    {
        if (!this._viewport) {
            throw new Error('ScreenManager must initialize.');
        }
        return this._viewport;
    }


    /**
     * 사용하고 있는 캔버스 엘리먼트
     * @returns {*}
     */
    get canvas()
    {
        if (!this._canvas) {
            throw new Error('ScreenManager must initialize.');
        }
        return this._canvas;
    }
}