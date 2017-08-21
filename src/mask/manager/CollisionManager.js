import Calc from './../utils/Calculator';
import Painter from './../utils/Painter';
import CollisionVO from './../vo/CollisionVO';
import CollisionType from './../consts/CollisionType';
import Mask from './../display/Mask';
import MaskVector from './../display/MaskVector';
import BackgroundImage from './../display/BackgroundImage';

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
     * 오차가 발생합니다. 오차 범위가 0.06 정도 발생합니다.
     * @param scale 변화하고자 하는 스케일
     * @param isMaskScaling
     * @returns {CollisionVO|*}
     */
    static virtualScaleCollisionCheck(scale, isMaskScaling = true, space = 0.1)
    {
        console.log('virtualScaleCollisionCheck(', scale, ')');
        var mask, back, rotation = this.backgroundImage.rotation;

        if (isMaskScaling === true) {
            mask = this.mask.getScaledRect(scale);
            back = this.back.collisionRect;
        } else {
            mask = this.mask.collisionRect;
            back = this.back.getScaledRect(scale);
        }

        console.log('mask', mask, 'back', back, 'scale', scale);
        return this.getFixPosition(mask, back, rotation, space);
    }


    /**
     * 충돌 스케일을 구합니다.
     * offset만 가지고 스케일을 구하면 오차가 발생합니다.
     * 그래서 fitScale을 구하고 그 근처에서 scale을 변경하면서 실제 충돌 스케일을 구합니다.
     * @param target
     */
    static getFitScale(target)
    {
        // mask면 스케일이 커지고, backgroundImage이면 스케일이 작아지고
        const mask = this.mask.collisionRect;
        const back = this.back.collisionRect;
        const rotation = this.back.rotation;
        const vo = this.getScaleFirstCollisionVO(mask, back, rotation);

        const type = vo.type;
        const isSelectMask = target instanceof Mask || target instanceof MaskVector;

        var firstFitScale;
        var target = this.mask;
        var offsetX = vo.offsetX * 2;
        var offsetY = vo.offsetY * 2;

        // 타겟이 마스크면 offset 만큼 커지면 되고 타겟이 배경이미지면 offset 만큼 작아지면 된다.
        if (isSelectMask === false) {
            target = this.backgroundImage;
            offsetX *= -1;
            offsetY *= -1;
        }

        if (type.indexOf(CollisionType.LEFT) > -1 || type.indexOf(CollisionType.RIGHT) > -1) {
            firstFitScale = target.getScale(target.width + offsetX, 0).scaleX;
        }
        else {
            firstFitScale = target.getScale(0, target.height + offsetY).scaleY;
        }

        //console.log('----------------------------------------------------------------------------------');
        //console.log('[' + type.toUpperCase() + ']', 'firstFitScale', firstFitScale, 'offset[', offsetX, ',', offsetY, ']');
        //console.log('----------------------------------------------------------------------------------');

        const step = 0.002;
        const scaleRange = 0.3;

        let startScale;
        let fitScale = target.scale.x; // 기본값으로 현재 스케일을 적용

        console.log('firstFitScale', firstFitScale,'offsetX', offsetX, 'offsetY', offsetY, ':::::::: getFitScale');

        if (isSelectMask) {
            // 마스크는 스케일을 키워가면서 충돌검사를 합니다.
            startScale = firstFitScale - scaleRange;

            console.log('-> isSelectMask', 'startScale', startScale, 'fitScale', fitScale, 'target.scale.x', target.scale.x);

            // 오차를 감안해서 스케일을 더 키워 검사합니다.
            firstFitScale = firstFitScale + 1;

            let count = 0;

            for (var i = startScale; i < firstFitScale; i += step) {
                if (this.virtualScaleCollisionCheck(i, isSelectMask, 0).type !== CollisionType.NONE) {
                    console.log('count', count++);
                    break;
                }
                fitScale = i;
            }

        }
        else {
            // 배경이미지는 스케일을 줄여가면서 충돌검사를 합니다.
            startScale = firstFitScale + scaleRange;

            // 오차를 감안해서 스케일을 더 줄여 검사합니다.
            firstFitScale = firstFitScale - 1;

            for (var i = startScale; i > firstFitScale; i -= step) {
                if (this.virtualScaleCollisionCheck(i, isSelectMask, 0).type !== CollisionType.NONE) {
                    break;
                }
                fitScale = i;
            }
        }

        return fitScale;
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

        // TODO DEBUG
        const maskBounds = mask.bounds;
        const backBounds = backgroundImage.bounds;
        maskBounds.y -= 300;
        backBounds.y -= 300;
        Painter.drawRectByBounds(window.g, maskBounds, false, 1);
        Painter.drawRectByBounds(window.g, backBounds, false, 1);

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
            console.log('!!!!!!!!!!!!!!!!! TOP', 'mt', mt, 'bt', bt);
            this.vo.type = CollisionType.TOP;
            this.vo.offsetY = (bt - mt) + space;
        }

        if (mb > bb) {
            console.log('!!!!!!!!!!!!!!!!! BOTTOM', 'mb', mb, 'bb', bb);
            this.vo.type = CollisionType.BOTTOM;
            this.vo.offsetY = (bb - mb) - space;
        }

        console.log('getFixPosition', this.vo);

        return this.vo;
    }


    /**
     * 마스크와 배경 이미지가 스케일시 최초 부딪히게 되면 면에 대한 offset값을 반환합니다.
     * @param mask {CollisionRectangle} 마스크의 collisionRectangle
     * @param backgroundImage {CollisionRectangle} 배경이미지의 collisionRectangle
     * @param rotation {Number] backgroundImage 회전값 (라디안)
     * @param space {Number] offset 값에 여백을 주고 싶을때 사용
     * @returns {CollisionVO|*}
     */
    static getScaleFirstCollisionVO(mask, backgroundImage, rotation, space = 0)
    {
        const r = -rotation;

        mask.rotate(r);
        backgroundImage.rotate(r);

        // 배경이미지에서 마스크의 사격형을 빼서 offset을 구하고 가장 작은 offset의 scale을 구하면 충돌지점에 스케일값이다.
        const backL = backgroundImage.left;
        const backR = backgroundImage.right;
        const backT = backgroundImage.top;
        const backB = backgroundImage.bottom;

        const maskL = mask.left;
        const maskR = mask.right;
        const maskT = mask.top;
        const maskB = mask.bottom;

        /*Painter.drawRectByBounds(window.g, {
            x: backL,
            y: backT,
            width: backR - backL,
            height: backB - backT
        }, true, 2, 0x00FF00);

        Painter.drawRectByBounds(window.g, {
            x: maskL,
            y: maskT,
            width: maskR - maskL,
            height: maskB - maskT
        }, false, 2);*/


        const offsetL = Math.abs(backL - maskL);
        const offsetR = backR - maskR;
        const minLR = Math.min(offsetL, offsetR);

        const offsetT = Math.abs(backT - maskT);
        const offsetB = backB - maskB;
        const minTB = Math.min(offsetT, offsetB);

        // 좌우가 먼저 충돌
        if (minLR < minTB) {
            return new CollisionVO((minLR === offsetL ? CollisionType.LEFT : CollisionType.RIGHT), minLR);
        }

        return new CollisionVO((minTB === offsetT ? CollisionType.TOP : CollisionType.BOTTOM), 0, minTB);
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