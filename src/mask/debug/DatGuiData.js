import MaskVO from './../vo/MaskVO';


var instance = null;


export default class DatGuiData extends PIXI.utils.EventEmitter
{
    static get RESET() {return 'reset';}
    static get SHOW_MASK_REAL_SIZE() {return 'showMaskRealSize';}
    static get SHOW_MASK_VISIBLE_SIZE() {return 'showMaskVisibleSize';}


    /**
     * 여러 곳에서 객체를 생성해도 싱글턴처럼 한개만 반환하도록 처리
     * @param options 초기값
     * @returns {*}
     */
    constructor(options)
    {
        super();
        if (!instance) {
            instance = this;
            this.initialize(options);
        }
        return instance;
    }


    /**
     * 여기에 속성 이름과 값을 셋팅합니다. (property name = value)
     * @param options
     */
    initialize(options)
    {
        /**
         * MaskVO.setTestData(index)에 사용할 index
         * 기본값 삼각형
         * @type {number}
         */
        this.maskDataIndex = 1;
    }


    reset()
    {
        this.emit(DatGuiData.RESET);
    }


    showRealSize()
    {
        this.emit(DatGuiData.SHOW_MASK_REAL_SIZE);
    }


    showVisibleSize()
    {
        this.emit(DatGuiData.SHOW_MASK_VISIBLE_SIZE);
    }


    get maskList()
    {
        return {
            CIRCLE: 0,
            TRIANGLE: 1,
            ROUND_SQURE: 2,
            POLYGON: 3,
            STAR_1: 4,
            STAR_2: 5,
            ROUND_STAR: 6
        };
    }
}