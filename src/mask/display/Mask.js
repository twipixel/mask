import Bitmap from './Bitmap';
import BitmapContainer from './BitmapContainer';


export default class Mask extends BitmapContainer
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