import DatGuiData from './DatGuiData';

const singleton = Symbol();
const singletonEnforcer = Symbol();


export default class DatGui extends PIXI.utils.EventEmitter
{
    static get CHAGE_MASK() {return 'changeMask';}


    constructor(enforcer)
    {
        super();

        if (enforcer !== singletonEnforcer) {
            throw new Error('DatGui :: Cannot construct singleton');
        }
    }


    static get instance()
    {
        if (!this[singleton]) {
            this[singleton] = new DatGui(singletonEnforcer);
        }
        return this[singleton];
    }


    /**
     *
     * @param options 초기값
     */
    initialize(options)
    {
        // dat 객체가 없는 경우 처리
        if (typeof dat === 'undefined') {
            return;
        }

        const gui = this.gui = new dat.GUI({autoPlace: true});
        //document.getElementById('datGuiHolder').appendChild(gui.domElement);

        const data = this.data = new DatGuiData(options);
        const maskSelect = this.maskSelect = gui.addFolder('MASK SELECT');

        // add(data instance, property name, property value);
        const maskSelectControl = maskSelect.add(data, 'mask', data.maskList).listen();
        maskSelectControl.onFinishChange((maskURL) => {
            this.emit(DatGui.CHAGE_MASK, maskURL);
        });
        maskSelect.open();
    }
}