import Calc from './../utils/Calculator';
import VectorContainer from './VectorContainer';


export default class MaskVector extends VectorContainer
{
    /**
     * 준비 완료 알림
     * @returns {string}
     * @constructor
     */
    static get READY() {return 'ready';}


    constructor() {
        super();
    }


    onReady()
    {
        console.log('MaskVector.onReady');
        this.initialize();
        this.emit(MaskVector.READY);
    }


    initialize()
    {
        this.name = 'MaskVector';
        this.buttonMode = true;
        this.interactive = true;

        // 회전 가능 여부 (false이면 회전하지 않습니다)
        this.rotable = true;

        // 격자 표시 여부
        this.useGrid = false;

        // 최대 회전 각도 (라디안)
        this.maxRotation = Calc.toRadians(45);

        // 반전 여부
        this.scaleSignX = 1;
        this.scaleSignY = 1;
    }
}