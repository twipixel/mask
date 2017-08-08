import BitmapContainer from './BitmapContainer';


export default class BackgroundImage extends BitmapContainer
{
    constructor(url)
    {
        super(url);
    }


    onReady()
    {
        this.initialize();
    }


    initialize()
    {
        this.name = 'BackgroundImage';
        this.buttonMode = true;
        this.interactive = true;

        // 회전 가능 여부 (false이면 회전하지 않습니다)
        this.rotable = true;

        // 최대 회전 각도
        this.maxRotation = 45;

        // 반전 여부
        this.scaleSignX = 1;
        this.scaleSignY = 1;
    }
}