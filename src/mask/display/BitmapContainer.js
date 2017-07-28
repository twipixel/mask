import Size from './../utils/Size';
import Bitmap from './../display/Bitmap';
import Calc from './../utils/Calculator';
import PointUtil from './../utils/PointUtil';
import DummyCollisionRectangle from './DummyCollisionRectangle';


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
        this.pivotOffset = new PIXI.Point();
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


    createCollisionRect()
    {
        //this.collisionRectLt = new PIXI.Point();
        //this.collisionRectRt = new PIXI.Point();
        //this.collisionRectRb = new PIXI.Point();
        //this.collisionRectLb = new PIXI.Point();
        //this.collisionRect = new DummyCollisionRectangle(this.lt, this.rt, this.rb, this.lb);
    }


    getCollisionRect(rotation = null)
    {
        const rect = new DummyCollisionRectangle(this.lt, this.rt, this.rb, this.lb);

        if (rotation) {
            rect.rotate(rotation);
        }

        return rect;
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
        this.createCollisionRect();
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


    /**
     * pivot을 변경하면 객체가 이동하게 됩니다.
     * 객체를 이동시키지 않고 pivot을 변경하게 하려면
     * pivot을 변경하고 중심점이 이동한 만큼 객체를 이동시키면
     * pivot변경 후 에도 객체는 그자리에 있게됩니다.
     * Container.rotation으로 회전이 가능하지만
     * 중심점을 기록하기 위해 bitmapRotation을 사용합니다.
     * @param radians
     */
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
        //return this.toLocal(this.bitmap.lt, this.bitmap);
        return this.toLocal(this.bitmap.lt, this.bitmap, this.collisionRectLt);
    }

    /**
     * 비트맵 우상단 포인트를 로컬 좌표로 반환합니다.
     * @returns {PIXI.Point}
     */
    get bitmapRt()
    {
        //return this.toLocal(this.bitmap.rt, this.bitmap);
        return this.toLocal(this.bitmap.rt, this.bitmap, this.collisionRectRt);
    }

    /**
     * 비트맵 우하단 포인트를 로컬 좌표로 반환합니다.
     * @returns {PIXI.Point}
     */
    get bitmapRb()
    {
        //return this.toLocal(this.bitmap.rb, this.bitmap);
        return this.toLocal(this.bitmap.rb, this.bitmap, this.collisionRectRb);
    }

    /**
     * 비트맵 좌하단 포인트를 로컬 좌표로 반환합니다.
     * @returns {PIXI.Point}
     */
    get bitmapLb()
    {
        //return this.toLocal(this.bitmap.lb, this.bitmap);
        return this.toLocal(this.bitmap.lb, this.bitmap, this.collisionRectLb);
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


    /**
     * 사각형의 맨 좌측값 (충돌검사를 위한 값)
     * @returns {*}
     */
    get left()
    {
        const points = this.bitmap.points;
        var point = this.toGlobal(this.toLocal(points[0], this.bitmap));

        for (var i = 1; i < points.length; i++) {
            const other = this.toGlobal(this.toLocal(points[i], this.bitmap));

            if (other.x < point.x) {
                point = other;
            }
        }

        return point.x;
    }


    /**
     * 사각형의 맨 우측값 (충돌검사를 위한 값)
     * @returns {*}
     */
    get right()
    {
        const points = this.bitmap.points;
        var point = this.toGlobal(this.toLocal(points[0], this.bitmap));

        for (var i = 1; i < points.length; i++) {
            const other = this.toGlobal(this.toLocal(points[i], this.bitmap));

            if (other.x > point.x) {
                point = other;
            }
        }

        return point.x;
    }


    /**
     * 사각형의 맨 상단값 (충돌검사를 위한 값)
     * @returns {*}
     */
    get top()
    {
        const points = this.bitmap.points;
        var point = this.toGlobal(this.toLocal(points[0], this.bitmap));

        for (var i = 1; i < points.length; i++) {
            const other = this.toGlobal(this.toLocal(points[i], this.bitmap));

            if (other.y < point.y) {
                point = other;
            }
        }

        return point.y;
    }


    /**
     * 사각형의 맨 하단값 (충돌검사를 위한 값)
     * @returns {*}
     */
    get bottom()
    {
        const points = this.bitmap.points;
        var point = this.toGlobal(this.toLocal(points[0], this.bitmap));

        for (var i = 1; i < points.length; i++) {
            const other = this.toGlobal(this.toLocal(points[i], this.bitmap));

            if (other.y > point.y) {
                point = other;
            }
        }

        return point.y;
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