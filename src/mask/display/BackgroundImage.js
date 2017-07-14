import Bitmap from './../display/Bitmap';
import BitmapContainer from './BitmapContainer';


export default class BackgroundImage extends BitmapContainer
{
    constructor(url)
    {
        super(url);
    }


    onReady()
    {
        //console.log('onReady(', this, ')');
    }
}