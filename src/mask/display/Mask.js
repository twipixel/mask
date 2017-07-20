import Bitmap from './Bitmap';
import BitmapContainer from './BitmapContainer';
import TransformTool from './../transform/TransformTool';


export default class Mask extends BitmapContainer
{
    constructor(url)
    {
        super(url);
    }


    onReady()
    {
        //console.log('onReady(', this, ')');

        this.initialize();
    }


    initialize()
    {
        this.buttonMode = true;
        this.interactive = true;

        this.scaleSignX = 1;
        this.scaleSignY = 1;

        // restore 시 복원할 scaleSignX,Y 값
        this._restoreScaleSignX = -1;
        this._restoreScaleSignY = -1;

        this.childScaleX = 1;
        this.childScaleY = 1;

        this.transformCompleteListener = this.onTransformComplete.bind(this);
        this.on(TransformTool.TRANSFORM_COMPLETE, this.transformCompleteListener);
    }


    setPivot(localPoint) {
        this.pivot = localPoint;
    }


    /**
     * 이동 시에는 다시 canvg에서 다시 안그리도록 처리하고
     * 대신 updateTransform 하도록 TEXTURE_UPDATE 이벤트를 전달합니다.
     * 이동하고 회전하는 경우 updateTransform 이 안되어 이상 동작합니다.
     * @param e
     */
    onTransformComplete(e) {
        console.log('onTransformComplete', this.scale);
    }
}