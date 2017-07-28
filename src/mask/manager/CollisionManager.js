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
    static hitTest(isMaskMoving = true)
    {
        const mask = this.mask;
        const back = this.backgroundImage;

        const rotation = -back.rotation;
        const maskRect = mask.getCollisionRect(rotation);
        const backRect = back.getCollisionRect(rotation);

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
        console.log('rotate(', Calc.toDegrees(rotation), ')');


        /**
         * 처리 프로세스
         * 1. backgroundImage 회전
         * 2. 회전된 backgroundImage 로 getCollisionRect 구하기
         * 3.
         */

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
        const maskRect = mask.getCollisionRect(rotation);
        const backRect = back.getCollisionRect(rotation);

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