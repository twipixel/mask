import Size from './../utils/Size';
import Bitmap from './../display/Bitmap';
import Calc from './../utils/Calculator';


export default class BitmapContainer extends PIXI.Container
{
    /**
     * 중심좌표를 가운데 두기 위해서 Bitmap을 로드하여 가운데 정렬합니다.
     * Bitmap은 넓이와 높이만 변경하고 스케일, 회전은 컨테이너를 변경합니다.
     *
     * @param url
     */
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
        const w = Size.initializedBackgroundImageSize.width;
        const y = Size.initializedBackgroundImageSize.height;
        //this.scale.x = this.width / w;
        //this.scale.y = this.height / h;
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


    /**
     * global 좌표가로 충돌여부 체크 (마우스 클릭 되었는지 파악)
     * @param globalPoint Mouse.global
     * @returns {boolean} 객체가 선택되었는지 여부
     */
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


    /**
     * 비트맵 넓이를 변경합니다.
     * 중심점을 가운데로 하기 위해
     * 컨테이너나 비트맵을 접근해서 처리하지 않고
     * 반드시 bitmapWidth 속성을 이용해서 사이즈를 조절합니다.
     * @param value
     */
    set bitmapWidth(value)
    {
        this.bitmap.width = value;
        this._bitmapHalfWidth = this.bitmap.width / 2;
        this.bitmap.x = -this.bitmapHalfWidth;
        this.prevBitmapRegistrationPoint = this.bitmapLt;
    }

    get bitmapWidth()
    {
        return this.bitmap.width;
    }


    get bitmapHalfWidth()
    {
        return this._bitmapHalfWidth;
    }


    /**
     * 비트맵 높이를 변경합니다.
     * 중심점을 가운데로 하기 위해
     * 컨테이너나 비트맵을 접근해서 처리하지 않고
     * 반드시 bitmapHeight 속성을 이용해서 사이즈를 조절합니다.
     * @param value
     */
    set bitmapHeight(value)
    {
        this.bitmap.height = value;
        this._bitmapHalfHeight = this.bitmap.height / 2;
        this.bitmap.y = -this.bitmapHalfHeight;
        this.prevBitmapRegistrationPoint = this.bitmapLt;
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
        const current = this.bitmapLt;
        const prev = this.prevBitmapRegistrationPoint;
        this.pivotOffset = new PIXI.Point(current.x - prev.x, current.y - prev.y);
    }


    get bitmapRotation()
    {
        return this.rotation;
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
    // Points
    //
    /////////////////////////////////////////////////////////////////////////////


    /**
     * 좌상단 포인트를 글로벌 좌표로 반환합니다.
     * @returns {PIXI.Point}
     */
    get lt()
    {
        return this.toGlobal(this.bitmapLt);
    }

    /**
     * 우상단 포인트를 글로벌 좌표로 반환합니다.
     * @returns {PIXI.Point}
     */
    get rt()
    {
        return this.toGlobal(this.bitmapRt);
    }

    /**
     * 우하단 포인트를 글로벌 좌표로 반환합니다.
     * @returns {PIXI.Point}
     */
    get rb()
    {
        return this.toGlobal(this.bitmapRb);
    }

    /**
     * 좌하단 포인트를 글로벌 좌표로 반환합니다.
     * @returns {PIXI.Point}
     */
    get lb()
    {
        return this.toGlobal(this.bitmapLb);
    }



    /**
     * 비트맵 좌상단 포인트를 로컬 좌표로 반환합니다.
     * @returns {PIXI.Point}
     */
    get bitmapLt()
    {
        return this.toLocal(this.bitmap.lt, this.bitmap);
    }

    /**
     * 비트맵 우상단 포인트를 로컬 좌표로 반환합니다.
     * @returns {PIXI.Point}
     */
    get bitmapRt()
    {
        return this.toLocal(this.bitmap.rt, this.bitmap);
    }

    /**
     * 비트맵 우하단 포인트를 로컬 좌표로 반환합니다.
     * @returns {PIXI.Point}
     */
    get bitmapRb()
    {
        return this.toLocal(this.bitmap.rb, this.bitmap);
    }

    /**
     * 비트맵 좌하단 포인트를 로컬 좌표로 반환합니다.
     * @returns {PIXI.Point}
     */
    get bitmpLb()
    {
        return this.toLocal(this.bitmap.lb, this.bitmap);
    }


    /**
     * 중심점과 좌상단의 거리
     * @returns {svg.Point|PIXI.Point|*}
     */
    get distanceBetweenLtAndCenter()
    {
        if (!this.registrationPoint) {
            return new PIXI.Point(0, 0);
        }

        const bitmapRegistrationPoint = this.bitmapLt;

        return new PIXI.Point(
            this.registrationPoint.x - bitmapRegistrationPoint.x,
            this.registrationPoint.y - bitmapRegistrationPoint.y,
        );
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
        this.graphics.x = -this.bitmapHalfWidth;
        this.graphics.y = -this.bitmapHalfHeight;
        this.addChild(this.graphics);
    }


}