import Calc from './../utils/Calculator';
import Painter from './../utils/Painter';
import CollisionVO from './../vo/CollisionVO';
import CollisionType from './../consts/CollisionType';


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
     *
     * @param changeX 이동한 x값
     * @param changeY 이동한 y값
     * @param isMaskMoving 마스크가 이동했는지 여부
     */
    static move(changeX, changeY, isMaskMoving = true)
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

        return this.isOut(maskCollisionRect, backCollisionRect, this.backgroundImage.rotation);
    }


    /**
     * TransformTool.onRotate 에서 사용
     * 회전을 시켜보고 출돌이 나면 회전 되지 않도록 처리하기 위해 충돌 부분만 분리
     *
     * @param mask
     * @param backgroundImage
     * @param rotation
     */
    static rotate(rotation)
    {
        /**
         * 처리 프로세스
         * 1. backgroundImage를 미리 회전 시킨 사각형 구하기
         * 2. 회전된 backgroundImage CollisionRect 구하기
         * 3. Mask CollisionRect 구하기
         * 4. 충돌 확인
         */
        return this.isOut(this.mask.collisionRect, this.backgroundImage.getRotatedRect(rotation), rotation);
    }


    static scale(scale)
    {
        //
    }


    /**
     * 밖으로 나갔는지 여부 체크
     * @param mask {CollisionRectangle} 마스크의 collisionRectangle
     * @param backgroundImage {CollisionRectangle} 배경이미지의 collisionRectangle
     * @param rotation {Number] 라디안
     * @returns {CollisionVO|*}
     */
    static isOut(mask, backgroundImage, rotation)
    {
        const r = -rotation;

        mask.rotate(r);
        backgroundImage.rotate(r);

        const maskBounds = mask.bounds;
        const backBounds = backgroundImage.bounds;
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

        const offset = 0.1;


        if (ml < bl) {
            this.vo.type = CollisionType.LEFT;
            this.vo.offset = (bl - ml) + offset;
            return this.vo;
        }

        if (mt < bt) {
            this.vo.type = CollisionType.TOP;
            this.vo.offset = (bt - mt) + offset;
            return this.vo;
        }

        if (mr > br) {
            this.vo.type = CollisionType.RIGHT;
            this.vo.offset = (br - mr) - offset;
            return this.vo;
        }

        if (mb > bb) {
            this.vo.type = CollisionType.BOTTOM;
            this.vo.offset = (bb - mb) - offset;
            return this.vo;
        }

        this.vo.type = CollisionType.NONE;
        this.vo.offset = 0;
        return this.vo;
    }



    /**
     * 충돌을 감지하고 충돌시 움직임을 수정합니다.
     * @param isMaskMoving 마스크 객체가 이동하는지 여부
     */

    /*
    static hitTest(isMaskMoving = true)
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

        Painter.drawRectByBounds(window.g, {
            x: bl,
            y: bt,
            width: br - bl,
            height: bb - bt
        }, false, 2);


        if (isMaskMoving) {
            if (ml < bl) {
                mask.x += (bl - ml);
            }

            if (mt < bt) {
                mask.y += (bt - mt);
            }

            if (mb > bb) {
                mask.y += (bb - mb);
            }

            if (mr > br) {
                mask.x += (br - mr);
            }
        }
        else {
            if (bl > ml) {
                back.x += (ml - bl);
            }

            if (bt > mt) {
                back.y += (mt - bt);
            }

            if (mb > bb) {
                back.y += (mb - bb);
            }

            if (mr > br) {
                back.x += (mr - br);
            }
        }
    }
    */


    static test()
    {
        //CollisionManager.drawBounds();
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



}