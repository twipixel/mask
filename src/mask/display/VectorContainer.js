import Vector from './../display/Vector';
import MaskVector from './../display/Vector';
import Calc from './../utils/Calculator';
import PointUtil from './../utils/PointUtil';
import CollisionRectangle from './CollisionRectangle';
import ShapeFactory from './../factory/ShapeFactory';
import TransformTool from './../transform/TransformTool';

// TEST
import Painter from './../utils/Painter';
import Echo from './../debug/Echo';


export default class VectorContainer extends PIXI.Container
{
    constructor()
    {
        super();

        this._initialize();
        this._addEvent();
    }


    _initialize()
    {
        this.vector = new Vector();
        this.addChild(this.vector);

        this._vectorHalfWidth = 0;
        this._vectorHalfHeight = 0;
        this.pivotOffset = new PIXI.Point();
    }


    _addEvent()
    {
        this._vectorLoadCompleteListener = this.onVectorLoadComplete.bind(this);
        this._vectorTextureUpdateListener = this.onVectorTextureUpdateComplete.bind(this);
        this._vectorTransfromCompleteListener = this.onVectorTransformComplete.bind(this);

        this.vector.on(Vector.LOAD_COMPLETE, this._vectorLoadCompleteListener);
        this.vector.on(Vector.TEXTURE_UPDATE, this._vectorTextureUpdateListener);
        this.on(TransformTool.TRANSFORM_COMPLETE, this._vectorTransfromCompleteListener);
    }


    load(maskVO)
    {
        const defaultSize = this.parseSize(maskVO.defaultSize);
        this.vector.load(maskVO.url, 0, 0, defaultSize.width, defaultSize.height);
    }


    /**
     * 비트맵을 옮겨서 가운데가 중심점입니다.
     */
    addRegistrationPoint()
    {
        this.registrationPoint = ShapeFactory.getCircle(0, 0, 5, 0x4CAF50);
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
     * 피봇설정 (로컬좌표)
     * @param localPoint
     */
    setPivot(localPoint)
    {
        this.pivot = localPoint;
    }


    destroy()
    {
        if (this._vectorLoadCompleteListener) {
            this.vector.off(Vector.LOAD_COMPLETE, this._vectorLoadCompleteListener);
        }

        if (this._vectorTextureUpdateListener) {
            this.vector.off(Vector.TEXTURE_UPDATE, this._vectorTextureUpdateListener);
        }

        if (this._vectorTransfromCompleteListener) {
            this.vector.off(TransformTool.TRANSFORM_COMPLETE, this._vectorTransfromCompleteListener);
        }

        this.removeChild(this.vector);
        this.vector.destroy();
        this.vector = null;
        this.removeChild(this.registrationPoint);
        this.registrationPoint = null;

        super.destroy();
    }


    /**
     * 이미지가 준비되면 중앙정렬을 위해 준비되었다고 알려준다.
     */
    onVectorLoadComplete()
    {
        // 가운데 정렬
        this._vectorHalfWidth = this.vector.width / 2;
        this._vectorHalfHeight = this.vector.height / 2;
        this.vector.x = -(this.vectorHalfWidth);
        this.vector.y = -(this.vectorHalfHeight);
        this.addRegistrationPoint();

        if (this.onReady) {
            this.onReady();
        }
    }


    /**
     * 벡터 텍스쳐가 업데이트 되었을 때
     */
    onVectorTextureUpdateComplete()
    {
        this._vectorHalfWidth = this.vector.width / 2;
        this._vectorHalfHeight = this.vector.height / 2;
        this.vector.x = -(this.vectorHalfWidth);
        this.vector.y = -(this.vectorHalfHeight);
        this.scale = new PIXI.Point(1, 1);

        this.emit(TransformTool.TEXTURE_UPDATE);
    }



    onVectorTransformComplete(e)
    {
        if( e.type !== "middleCenter" ) {
            //this.scale = new PIXI.Point(1, 1);
            this.vector.drawSvg(0, 0, this.width, this.height);
        }
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
    set vectorWidth(value)
    {
        this.vector.width = value;
        this._vectorHalfWidth = this.vector.width / 2;
        this.vector.x = -this.vectorHalfWidth;
        this.prevVectorRegistrationPoint = this.localLt;
    }

    get vectorWidth()
    {
        return this.vector.width;
    }


    get vectorHalfWidth()
    {
        return this._vectorHalfWidth;
    }


    /**
     * 비트맵 높이를 변경합니다.
     * 중심점을 가운데로 하기 위해
     * 컨테이너나 비트맵을 접근해서 처리하지 않고
     * 반드시 bitmapHeight 속성을 이용해서 사이즈를 조절합니다.
     * @param value
     */
    set vectorHeight(value)
    {
        this.vector.height = value;
        this._vectorHalfHeight = this.vector.height / 2;
        this.vector.y = -this.vectorHalfHeight;
        this.prevVectorRegistrationPoint = this.localLt;
    }

    get vectorHeight()
    {
        return this.vector.height;
    }


    get vectorHalfHeight()
    {
        return this._vectorHalfHeight;
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
    set vectorRotation(radians)
    {
        this.rotation = radians;
        const current = this.localLt;
        const prev = this.prevVectorRegistrationPoint;
        this.pivotOffset = new PIXI.Point(current.x - prev.x, current.y - prev.y);
    }


    get vectorRotation()
    {
        return this.rotation;
    }


    /**
     * 실제 보여지는 이미지 객체
     * @param value
     */
    set vector(value)
    {
        this._vector = value;
    }

    get vector()
    {
        return this._vector;
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
        return this.toGlobal(this.localLt);
    }

    /**
     * 우상단 포인트를 글로벌 좌표로 반환합니다.
     * @returns {PIXI.Point}
     */
    get rt()
    {
        return this.toGlobal(this.localRt);
    }

    /**
     * 우하단 포인트를 글로벌 좌표로 반환합니다.
     * @returns {PIXI.Point}
     */
    get rb()
    {
        return this.toGlobal(this.localRb);
    }

    /**
     * 좌하단 포인트를 글로벌 좌표로 반환합니다.
     * @returns {PIXI.Point}
     */
    get lb()
    {
        return this.toGlobal(this.localLb);
    }


    get center()
    {
        return this.toGlobal(new PIXI.Point());
    }


    get globalPivot()
    {
        return this.toGlobal(this.pivot);
    }


    /**
     * 비트맵 좌상단 포인트를 로컬 좌표로 반환합니다.
     * @returns {PIXI.Point}
     */
    get localLt()
    {
        return this.toLocal(this.vector.lt, this.vector);
    }

    /**
     * 비트맵 우상단 포인트를 로컬 좌표로 반환합니다.
     * @returns {PIXI.Point}
     */
    get localRt()
    {
        return this.toLocal(this.vector.rt, this.vector);
    }

    /**
     * 비트맵 우하단 포인트를 로컬 좌표로 반환합니다.
     * @returns {PIXI.Point}
     */
    get localRb()
    {
        return this.toLocal(this.vector.rb, this.vector);
    }

    /**
     * 비트맵 좌하단 포인트를 로컬 좌표로 반환합니다.
     * @returns {PIXI.Point}
     */
    get localLb()
    {
        return this.toLocal(this.vector.lb, this.vector);
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

        const vectorRegistrationPoint = this.localLt;

        return new PIXI.Point(
            this.registrationPoint.x - vectorRegistrationPoint.x,
            this.registrationPoint.y - vectorRegistrationPoint.y,
        );
    }


    /**
     * 사각형의 맨 좌측값 (충돌검사를 위한 값)
     * @returns {*}
     */
    get left()
    {
        const points = this.vector.points;
        var point = this.toGlobal(this.toLocal(points[0], this.vector));

        for (var i = 1; i < points.length; i++) {
            const other = this.toGlobal(this.toLocal(points[i], this.vector));

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
        const points = this.vector.points;
        var point = this.toGlobal(this.toLocal(points[0], this.vector));

        for (var i = 1; i < points.length; i++) {
            const other = this.toGlobal(this.toLocal(points[i], this.vector));

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
        const points = this.vector.points;
        var point = this.toGlobal(this.toLocal(points[0], this.vector));

        for (var i = 1; i < points.length; i++) {
            const other = this.toGlobal(this.toLocal(points[i], this.vector));

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
        const points = this.vector.points;
        var point = this.toGlobal(this.toLocal(points[0], this.vector));

        for (var i = 1; i < points.length; i++) {
            const other = this.toGlobal(this.toLocal(points[i], this.vector));

            if (other.y > point.y) {
                point = other;
            }
        }

        return point.y;
    }


    /////////////////////////////////////////////////////////////////////////////
    //
    // Collision
    //
    /////////////////////////////////////////////////////////////////////////////


    /**
     * 충돌 검사 시 직접 이동하고 나서 조절하면 떨려 보여서
     * 이동한 점을 가지고 충돌 검사를합니다. (Global 좌표로 반환)
     * @param x
     * @param y
     * @returns {null}
     */
    getMovedRect(x, y)
    {
        var lt = this.lt;
        var rt = this.rt;
        var rb = this.rb;
        var lb = this.lb;

        lt.x += x;
        lt.y += y;
        rt.x += x;
        rt.y += y;
        rb.x += x;
        rb.y += y;
        lb.x += x;
        lb.y += y;

        return new CollisionRectangle(lt, rt, rb, lb);
    }


    /**
     * 충돌 검사 시 직접 회전 시키지 않고 미리 회전 시킨
     * 바운드로 가지고 충돌 검사를합니다. (Global 좌표로 봔환)
     * @param rotation rotation (라디안)
     * @returns {CollisionRectangle}
     */
    getRotatedRect(rotation)
    {
        const prevRotation = this.rotation;
        this.rotation = rotation;
        this.updateTransform();

        const lt = this.lt.clone();
        const rt = this.rt.clone();
        const rb = this.rb.clone();
        const lb = this.lb.clone();

        this.rotation = prevRotation;

        // TODO 디버그 삭제 Painter
        //Painter.drawPointsByPoints(window.g, new CollisionRectangle(lt, rt, rb, lb), false, 1);

        return new CollisionRectangle(lt, rt, rb, lb);
    }


    /**
     * 충돌 검사 시 미리 스케일된 값을 가지고 충돌 검사를 합니다.
     * 직접 스케일된 값을 가지고 조절을 하면 떨려 보입니다. (Global 좌표로 반환)
     * @param scale
     * @returns {null}
     */
    getScaledRect(scale)
    {
        const prevScale = this.scale.x;
        this.scale.x = scale;
        this.scale.y = scale;
        this.updateTransform();

        const lt = this.lt.clone();
        const rt = this.rt.clone();
        const rb = this.rb.clone();
        const lb = this.lb.clone();

        this.scale.x = prevScale;
        this.scale.y = prevScale;

        // TODO 디버그 삭제 Painter
        //Painter.drawPointsByPoints(window.g, new CollisionRectangle(lt, rt, rb, lb), false, 1);

        return new CollisionRectangle(lt, rt, rb, lb);
    }


    /**
     * 넓이와 높이에 맞는 scale 값을 반환합니다.
     * @param width
     * @param height
     * @returns {{scaleX: *, scaleY: *}}
     */
    getScale(width = 0, height = 0)
    {
        const prevWidth = this.width;
        const prevHeight = this.height;
        this.width = width;
        this.height = height;
        this.updateTransform();

        const scaleX = this.scale.x;
        const scaleY = this.scale.y;
        this.width = prevWidth;
        this.height = prevHeight;
        return {scaleX: scaleX, scaleY: scaleY};
    }


    parseSize(value)
    {
        if (value && value !== '') {
            const size = value.split('x');
            return new PIXI.Rectangle(0, 0, size[0], size[1]);
        }
    }


    get points()
    {
        return {
            lt: this.lt.clone(),
            rt: this.rt.clone(),
            rb: this.rb.clone(),
            lb: this.lb.clone()
        };
    }


    /**
     * 충돌검사에 사용하는 Rectangle을 반환합니다.
     * @returns {CollisionRectangle}
     */
    get collisionRect()
    {
        return new CollisionRectangle(this.lt, this.rt, this.rb, this.lb);
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
        this.graphics.drawRect(0, 0, this.vector.width, this.vector.height);
        this.graphics.endFill();
        this.graphics.x = -this.vectorHalfWidth;
        this.graphics.y = -this.vectorHalfHeight;
        this.addChild(this.graphics);
    }
}