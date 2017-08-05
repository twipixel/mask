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

        // 반전 여부
        this.scaleSignX = 1;
        this.scaleSignY = 1;
    }


}