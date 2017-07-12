import Size from './../utils/Size';
import Bitmap from './../display/Bitmap';


export default class Mask extends PIXI.Container
{
    constructor(url)
    {
        super();

        this.url = url;

        this.initialize();
        this.addEvent();
    }


    initialize()
    {
        this.bitmap = new Bitmap(this.url);
        this.addChild(this.bitmap);
    }


    addEvent()
    {
        this.bitmap.on(Bitmap.READY, this.onReadyBitmap.bind(this));
    }


    resize()
    {

    }


    /**
     * 이미지가 준비되면 중앙정렬을 위해 준비되었다고 알려준다.
     */
    onReadyBitmap()
    {
        this.emit(Bitmap.READY);
    }


    set bitmapWidth(value)
    {
        this.bitmap.width = value;
    }

    get bitmapWidth()
    {
        return this.bitmap.width;
    }


    set bitmapHeight(value)
    {
        this.bitmap.height = value;
    }

    get bitmapHeight()
    {
        return this.bitmap.height;
    }


    /**
     * 실제 보여지는 이미지 객체
     * @param value
     */
    set bitmap(value)
    {
        this._bitmap = value;
    }

    get bitmap()
    {
        return this._bitmap;
    }


    /**
     * 비트맵 처음 로드된 사이즈 (실제 이미지 사이즈)
     * @returns {*}
     */
    get originalImageSize()
    {
        return this.bitmap.originalImageSize;
    }
}