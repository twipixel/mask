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
        const backgroundImage = this.backgroundImage;
        const rotation = -backgroundImage.rotation;
        const maskRect = mask.getCollisionRect(rotation);
        const backRect = backgroundImage.getCollisionRect(rotation);

        const ml = maskRect.left;
        const mr = maskRect.right;
        const mt = maskRect.top;
        const mb = maskRect.bottom;

        const bl = backRect.left;
        const br = backRect.right;
        const bt = backRect.top;
        const bb = backRect.bottom;

        Painter.drawBounds(window.g, {
            x: ml,
            y: mt,
            width: mr - ml,
            height: mb - mt
        }, true, 2, 0x00FF00);

        Painter.drawBounds(window.g, {
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
                backgroundImage.x += (ml - bl);
            }

            if (bt > mt) {
                backgroundImage.y += (mt - bt);
            }

            if (mb > bb) {
                backgroundImage.y += (mb - bb);
            }

            if (mr > br) {
                backgroundImage.x += (mr - br);
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

    }



    static test()
    {
        //CollisionManager.drawBounds();
    }



    static drawBounds()
    {
        const mask = this.mask;
        const backgroundImage = this.backgroundImage;
        const rotation = -backgroundImage.rotation;
        const maskRect = mask.getCollisionRect(rotation);
        const backRect = backgroundImage.getCollisionRect(rotation);

        const ml = maskRect.left;
        const mr = maskRect.right;
        const mt = maskRect.top;
        const mb = maskRect.bottom;

        const bl = backRect.left;
        const br = backRect.right;
        const bt = backRect.top;
        const bb = backRect.bottom;

        Painter.drawBounds(window.g, {
            x: ml,
            y: mt,
            width: mr - ml,
            height: mb - mt
        }, true, 2, 0x00FF00);

        Painter.drawPoint(window.g, maskRect.center, 10, false);

        Painter.drawBounds(window.g, {
            x: bl,
            y: bt,
            width: br - bl,
            height: bb - bt
        }, false, 2);

        Painter.drawPoint(window.g, backRect.center, 10, false);
    }
}