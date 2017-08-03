import Calc from './../utils/Calculator';
import Painter from './../utils/Painter';
import CollisionVO from './../vo/CollisionVO';
import CollisionType from './../consts/CollisionType';

import Echo from './../debug/Echo';


export default class CollisionManager
{
    /**
     * 초기화
     * @param mask
     * @param backgroundImage
     */
    static initialize(mask, backgroundImage)
    {
        this.mask = mask;
        this.back = this.backgroundImage = backgroundImage;
        this.vo = new CollisionVO();
    }


    /**
     * 마스크 변경
     * @param mask
     */
    static changeMask(mask)
    {
        this.mask = null;
        this.mask = mask;
    }


    /**
     * 미리 이동 시켜보고 충돌여부와 offset 값을 반환합니다.
     * @param changeX 이동한 x값
     * @param changeY 이동한 y값
     * @param isMaskMoving 마스크가 이동했는지 여부
     */
    static virtualMoveCollisionCheck(changeX, changeY, isMaskMoving = true)
    {
        var maskCollisionRect, backCollisionRect;

        if (isMaskMoving === true) {
            backCollisionRect = this.back.collisionRect;
            maskCollisionRect = this.mask.getMovedRect(changeX, changeY);
        }
        else {
            maskCollisionRect = this.mask.collisionRect;
            backCollisionRect = this.back.getMovedRect(changeX, changeY);
        }

        return this.getFixPosition(maskCollisionRect, backCollisionRect, this.backgroundImage.rotation);
    }


    /**
     * 미리 회전 시켜보고 충돌여부와 offset 값을 반환합니다.
     * @param rotation 현재 회전 각도 (라디안)
     * @returns {CollisionVO|*}
     */
    static virtualRotateCollisionCheck(rotation)
    {
        return this.getFixPosition(this.mask.collisionRect, this.backgroundImage.getRotatedRect(rotation), rotation);
    }


    /**
     * 미리 스케일링하고 충돌여부와 offset 값을 반환합니다.
     * @param scale 변화하고자 하는 스케일
     * @param isMaskScaling
     * @returns {CollisionVO|*}
     */
    static virtualScaleCollisionCheck(scale, isMaskScaling = true, space = 0.1)
    {
        var mask, back, rotation = this.backgroundImage.rotation;

        if (isMaskScaling === true) {
            mask = this.mask.getScaledRect(scale);
            back = this.back.collisionRect;
        } else {
            mask = this.mask.collisionRect;
            back = this.back.getScaledRect(scale);
        }

        return this.getFixPosition(mask, back, rotation, space);
    }


    /**
     * 현재 상태에서 충돌 결과를 반환합니다.
     */
    static getCollisionVO()
    {
        return this.getFixPosition(this.mask.collisionRect, this.back.collisionRect, this.back.rotation);
    }


    /**
     * 충돌되었으면 넘어가지 않도록 계산하여 이동할 위치를 반환합니다.
     * @param mask {CollisionRectangle} 마스크의 collisionRectangle
     * @param backgroundImage {CollisionRectangle} 배경이미지의 collisionRectangle
     * @param rotation {Number] backgroundImage 회전값 (라디안)
     * @param space {Number] offset 값에 여백을 주고 싶을때 사용
     * @returns {CollisionVO|*}
     */
    static getFixPosition(mask, backgroundImage, rotation, space = 0)
    {
        const r = -rotation;

        mask.rotate(r);
        backgroundImage.rotate(r);

        //const maskBounds = mask.bounds;
        //const backBounds = backgroundImage.bounds;
        //Painter.drawRectByBounds(window.g, maskBounds, true, 1);
        //Painter.drawRectByBounds(window.g, backBounds, false, 1);

        const ml = mask.left;
        const mr = mask.right;
        const mt = mask.top;
        const mb = mask.bottom;

        const bl = backgroundImage.left;
        const br = backgroundImage.right;
        const bt = backgroundImage.top;
        const bb = backgroundImage.bottom;

        this.vo.reset();

        if (ml < bl) {
            this.vo.type = CollisionType.LEFT;
            this.vo.offsetX = (bl - ml) + space;
        }

        if (mr > br) {
            this.vo.type = CollisionType.RIGHT;
            this.vo.offsetX = (br - mr) - space;
        }

        if (mt < bt) {
            this.vo.type = CollisionType.TOP;
            this.vo.offsetY = (bt - mt) + space;
        }

        if (mb > bb) {
            this.vo.type = CollisionType.BOTTOM;
            this.vo.offsetY = (bb - mb) - space;
        }

        return this.vo;
    }


    static drawBounds()
    {
        const mask = this.mask;
        const back = this.backgroundImage;
        const rotation = -back.rotation;
        const maskRect = mask.getRotatedRect(rotation);
        const backRect = back.getRotatedRect(rotation);

        const ml = maskRect.left;
        const mr = maskRect.right;
        const mt = maskRect.top;
        const mb = maskRect.bottom;

        const bl = backRect.left;
        const br = backRect.right;
        const bt = backRect.top;
        const bb = backRect.bottom;

        Painter.drawRectByBounds(window.g, {
            x: ml,
            y: mt,
            width: mr - ml,
            height: mb - mt
        }, true, 2, 0x00FF00);

        Painter.drawPoint(window.g, maskRect.center, 10, false);

        Painter.drawRectByBounds(window.g, {
            x: bl,
            y: bt,
            width: br - bl,
            height: bb - bt
        }, false, 2);

        Painter.drawPoint(window.g, backRect.center, 10, false);
    }


    /**
     * 마스크의 중점좌표를 배경 이미지의 pivot으로 사용하기 위해 배경 이미지의 로컬 좌표로 변환합니다.
     * @returns {PIXI.Point}
     */
    static get backgroundImageLocalPivot()
    {
        return this.backgroundImage.toLocal(this.mask.toGlobal(this.mask.registrationPoint));
    }


    /**
     * 배경 이미지 회전 여부
     * @returns {boolean}
     */
    static get isImageRotated()
    {
        return (Calc.toRoundDegreesByRadians(this.back.rotation) % 90 != 0);
    }

}