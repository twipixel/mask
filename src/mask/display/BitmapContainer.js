import Size from './../utils/Size';
import Bitmap from './../display/Bitmap';
import Calc from './../utils/Calculator';


export default class BitmapContainer extends PIXI.Container
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

        this.pivotOffset = new PIXI.Point(0, 0);
    }


    addEvent()
    {
        this.bitmap.on(Bitmap.READY, this.onReadyBitmap.bind(this));
    }


    resize()
    {
        this.bitmapWidth = Size.initializedBackgroundImageSize.width;
        this.bitmapHeight = Size.initializedBackgroundImageSize.height;
    }


    /**
     * 이미지가 준비되면 중앙정렬을 위해 준비되었다고 알려준다.
     */
    onReadyBitmap()
    {
        // 가운데 정렬
        this.bitmap.x = -(this.bitmap.width / 2);
        this.bitmap.y = -(this.bitmap.height / 2);
        this.emit(Bitmap.READY);

        console.log('bitmapRegistrationPoint', this.bitmapRegistrationPoint);

        if (this.onReady) {
            this.onReady();
        }

        this.drawBounds();
        this.drawRegistrationPoint();
    }


    /////////////////////////////////////////////////////////////////////////////
    //
    // Bitmap Functions
    //
    /////////////////////////////////////////////////////////////////////////////


    set bitmapWidth(value)
    {
        this.bitmap.width = value;
        this.bitmap.x = this.bitmapLeftTopX;
        this.prevBitmapRegistrationPoint = this.bitmapRegistrationPoint;
    }

    get bitmapWidth()
    {
        return this.bitmap.width;
    }


    set bitmapHeight(value)
    {
        this.bitmap.height = value;
        this.bitmap.y = this.bitmapLeftTopY;
        this.prevBitmapRegistrationPoint = this.bitmapRegistrationPoint;
    }

    get bitmapHeight()
    {
        return this.bitmap.height;
    }


    set bitmapRotation(radians)
    {
        console.log('!!!!! bitmapRotation(', Calc.toDegrees(radians), ')');

        this.rotation = radians;

        const current = this.bitmapRegistrationPoint;
        const prev = this.prevBitmapRegistrationPoint;
        this.pivotOffset = new PIXI.Point(current.x - prev.x, current.y - prev.y);

        console.log('current[', current.x, current.y, ']', 'prev[', prev.x, prev.y, ']', 'offset[', this.pivotOffset.x, this.pivotOffset.y, ']');
    }


    get bitmapRotation()
    {
        return this.rotation;
    }


    get bitmapRegistrationPoint()
    {
        return this.toLocal(this.bitmap.registrationPoint, this.bitmap);
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


    /////////////////////////////////////////////////////////////////////////////
    //
    // Pivot Functions
    //
    /////////////////////////////////////////////////////////////////////////////


    get bitmapLeftTopX()
    {
        return -(this.bitmap.width / 2);
    }


    get bitmapLeftTopY()
    {
        return -(this.bitmap.height / 2);
    }


    /////////////////////////////////////////////////////////////////////////////
    //
    // 최초 이미지 사이즈
    //
    /////////////////////////////////////////////////////////////////////////////


    /**
     * 비트맵 처음 로드된 사이즈 (실제 이미지 사이즈)
     * @returns {*}
     */
    get originalImageSize()
    {
        return this.bitmap.originalImageSize;
    }


    /////////////////////////////////////////////////////////////////////////////
    //
    // Debug & Test Functions
    //
    /////////////////////////////////////////////////////////////////////////////


    drawBounds()
    {
        this.graphics = new PIXI.Graphics();
        this.graphics.beginFill(0xFF3300, 0);
        this.graphics.lineStyle(1, 0xFF3300);
        this.graphics.drawRect(0, 0, this.bitmap.width, this.bitmap.height);
        this.graphics.endFill();
        this.graphics.x = this.bitmapLeftTopX;
        this.graphics.y = this.bitmapLeftTopY;
        this.addChild(this.graphics);
    }


    drawRegistrationPoint()
    {
        this.registrationPoint = new PIXI.Graphics();
        this.registrationPoint.beginFill(0xFF3300, 1);
        this.registrationPoint.drawCircle(0, 0, 5);
        this.registrationPoint.endFill();
        this.addChild(this.registrationPoint);
    }
}