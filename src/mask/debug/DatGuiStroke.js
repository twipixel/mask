import DatGuiStrokeData from './DatGuiStrokeData';

const singleton = Symbol();
const singletonEnforcer = Symbol();


export default class DatGuiStroke extends PIXI.utils.EventEmitter
{
    static get TOGGLE_SHOW_BACKGROUND_IMAGE() {return 'toggleShowBackgroundImage';}
    static get CHAGE_STROKE_WIDTH() {return 'changeStrokeWidth';}
    static get CHANGE_STROKE_OPACITY() {return 'changeStrokeOpacity';}
    static get CHANGE_LINE_THICKNESS() {return 'changeLineThickness';}


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
            this[singleton] = new DatGuiStroke(singletonEnforcer);
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

        const data = this.data = new DatGuiStrokeData(options);

        // add(data instance, property name, property value);
        const showBackgroundImageControl = gui.add(data, 'showBackgroundImage').listen();
        showBackgroundImageControl.onFinishChange(() => {
            console.log('showBackgroundImage', data.showBackgroundImage);
            this.emit(DatGuiStroke.TOGGLE_SHOW_BACKGROUND_IMAGE);
        });

        const strokeWidthControl = gui.add(data, 'strokeWidth', 0, 50).listen();
        strokeWidthControl.onChange(() => {
            this.emit(DatGuiStroke.CHAGE_STROKE_WIDTH, parseInt(data.strokeWidth));
        });

        const strokeOpacityControl = gui.add(data, 'strokeOpacity', 0, 1).listen();
        strokeOpacityControl.onChange(() => {
            this.emit(DatGuiStroke.CHANGE_STROKE_OPACITY, data.strokeOpacity);
        });

        const lineThicknessControl = gui.add(data, 'lineThickness', 0, 50).listen();
        lineThicknessControl.onChange(() => {
            this.emit(DatGuiStroke.CHANGE_LINE_THICKNESS, parseInt(data.lineThickness));
        });
    }
}