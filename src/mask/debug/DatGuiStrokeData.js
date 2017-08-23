import MaskVO from './../vo/MaskVO';


var instance = null;


export default class DatGuiData extends PIXI.utils.EventEmitter
{
    static get UNDO() {return 'undo';}
    static get REDO() {return 'redo';}
    static get RESET() {return 'reset';}
    static get SHOW_MASK_REAL_SIZE() {return 'showMaskRealSize';}
    static get SHOW_MASK_VISIBLE_SIZE() {return 'showMaskVisibleSize';}


    /**
     * 여러 곳에서 객체를 생성해도 싱글턴처럼 한개만 반환하도록 처리
     * @param options 초기값
     * @returns {*}
     */
    constructor(options = null)
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
        // 두께 넓이
        this.strokeWidth = 0;

        // 두께 투명도
        this.strokeOpacity = 1;

        // 6번 라인 두께 (맨 우측 하단 캔버스)
        this.lineThickness = 0;

        // 배경 이미지 표시 여부
        this.showBackgroundImage = false;
    }
}