import Size from './../utils/Size';
import Bitmap from './../display/Bitmap';
import Calc from './../utils/Calculator';


export default class BitmapContainer extends PIXI.Container
{
    constructor(url)
    {
        super();

        this.url = url;

        this._initialize();
        this._addEvent();
    }


    _initialize()
    {
        this.bitmap = new Bitmap(this.url);
        //this.bitmap.anchor.x = 0.5;
        //this.bitmap.anchor.y = 0.5;
        this.addChild(this.bitmap);

        this._bitmapHalfWidth = 0;
        this._bitmapHalfHeight = 0;
        this.pivotOffset = new PIXI.Point(0, 0);
    }


    _addEvent()
    {
        this.bitmap.on(Bitmap.READY, this.onReadyBitmap.bind(this));
    }


    resize()
    {
        this.bitmapWidth = Size.initializedBackgroundImageSize.width;
        this.bitmapHeight = Size.initializedBackgroundImageSize.height;
    }


    /**
     * 비트맵을 옮겨서 가운데가 중심점입니다.
     */
    addRegistrationPoint()
    {
        this.registrationPoint = new PIXI.Graphics();
        this.registrationPoint.beginFill(0x4CAF50, 1);
        this.registrationPoint.drawCircle(0, 0, 5);
        this.registrationPoint.endFill();
        this.addChild(this.registrationPoint);
    }


    hitTestWithGlobalPoint(globalPoint)
    {
        const local = this.toLocal(globalPoint);
        const localBounds = this.getLocalBounds();

        if (local.x >= localBounds.x && local.x <= localBounds.x + localBounds.width &&
            local.y >= localBounds.y && local.y <= localBounds.y + localBounds.height ) {
            return true;
        }

        return false;
    }


    /**
     * 이미지가 준비되면 중앙정렬을 위해 준비되었다고 알려준다.
     */
    onReadyBitmap()
    {
        // 가운데 정렬
        this.bitmap.x = -(this.bitmapHalfWidth);
        this.bitmap.y = -(this.bitmapHalfHeight);
        this.emit(Bitmap.READY);

        if (this.onReady) {
            this.onReady();
        }

        this.addRegistrationPoint();
        this.drawBounds();
    }


    /////////////////////////////////////////////////////////////////////////////
    //
    // Bitmap Functions
    //
    /////////////////////////////////////////////////////////////////////////////


    set bitmapWidth(value)
    {
        this.bitmap.width = value;
        this._bitmapHalfWidth = this.bitmap.width / 2;
        this.bitmap.x = -this.bitmapHalfWidth;
        this.prevBitmapRegistrationPoint = this.bitmapRegistrationPoint;
    }

    get bitmapWidth()
    {
        return this.bitmap.width;
    }


    get bitmapHalfWidth()
    {
        return this._bitmapHalfWidth;
    }


    set bitmapHeight(value)
    {
        this.bitmap.height = value;
        this._bitmapHalfHeight = this.bitmap.height / 2;
        this.bitmap.y = -this.bitmapHalfHeight;
        this.prevBitmapRegistrationPoint = this.bitmapRegistrationPoint;
    }

    get bitmapHeight()
    {
        return this.bitmap.height;
    }


    get bitmapHalfHeight()
    {
        return this._bitmapHalfHeight;
    }


    set bitmapRotation(radians)
    {
        this.rotation = radians;

        const current = this.bitmapRegistrationPoint;
        const prev = this.prevBitmapRegistrationPoint;
        this.pivotOffset = new PIXI.Point(current.x - prev.x, current.y - prev.y);
    }


    get bitmapRotation()
    {
        return this.rotation;
    }


    get leftTopPoint()
    {
        return this.toGlobal(this.bitmapRegistrationPoint);
    }


    get bitmapRegistrationPoint()
    {
        return this.toLocal(this.bitmap.registrationPoint, this.bitmap);
    }


    get bitmapAndContainerRegistrationPointDistance()
    {
        if (!this.registrationPoint) {
            return new PIXI.Point(0, 0);
        }

        const bitmapRegistrationPoint = this.bitmapRegistrationPoint;

        return new PIXI.Point(
            this.registrationPoint.x - bitmapRegistrationPoint.x,
            this.registrationPoint.y - bitmapRegistrationPoint.y,
        );
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
        return -this.bitmapHalfWidth;
    }


    get bitmapLeftTopY()
    {
        return -this.bitmapHalfHeight;
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


}