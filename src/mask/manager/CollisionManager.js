import Hit from './../consts/Hit';
import Calc from './../utils/Calculator';
import Painter from './../utils/Painter';


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
    }


    /**
     * 충돌을 감지하고 충돌시 움직임을 수정합니다.
     * @param isMaskMoving 마스크 객체가 이동하는지 여부
     */


    /**
     * 배경이미지안에 마스크가 밖으로 나갔는지 여부
     * @param mask
     * @param backgroundImage
     * @param rotation
     * @returns {boolean}
     */
    static isOut(mask, backgroundImage, rotation)
    {
        const r = -rotation;

        mask.rotate(r);
        backgroundImage.rotate(r);

        const maskBounds = mask.bounds;
        const backBounds = backgroundImage.bounds;
        Painter.drawRectByBounds(window.g, maskBounds, true, 1);
        Painter.drawRectByBounds(window.g, backBounds, false, 1);

        const ml = mask.left;
        const mr = mask.right;
        const mt = mask.top;
        const mb = mask.bottom;

        const bl = backgroundImage.left;
        const br = backgroundImage.right;
        const bt = backgroundImage.top;
        const bb = backgroundImage.bottom;

        if (ml < bl) {
            return Hit.LEFT;
        }

        if (mt < bt) {
            return Hit.TOP;
        }

        if (mr > br) {
            return Hit.RIGHT;
        }

        if (mb > bb) {
            return Hit.BOTTOM;
        }

        return Hit.NONE;
    }



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

        var isOut = this.isOut(this.mask.collisionRect, this.backgroundImage.getRotatedRect(rotation), rotation);

        // 만약 out 이면
        // 딱 떨어지는 회전각을 반환

        return isOut;

        //const points = Calc.getRotationPointsWith(this.backgroundImage.center, this.backgroundImage, rotation);
        //Painter.drawPointsByPoints(window.g, points, 5);
    }


    static scale(scale)
    {
        //
    }


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
}