import Calc from './../utils/Calculator';
import Painter from './../utils/Painter';


export default class CollisionManager
{
    /**
     * 충돌을 감지하고 충돌시 움직임을 수정합니다.
     * @param movingObject 현재 움직이고 있는 객체
     * @param fixedObject 고정되어 있는 객체
     * @param rotateObject 회전된 객체 (회전되지 않은 객체
     * @param isFixMovement 충돌시 움직임을 수정할지 여부
     */
    static hitTest(movingObject, fixedObject, rotateObject, isFixMovement = true) {

        const rotation = rotateObject.rotation;

        movingObject.rotation = -rotation;
        fixedObject.rotation = -rotation;

        const ml = movingObject.left;
        const mr = movingObject.right;
        const mt = movingObject.top;
        const mb = movingObject.bottom;

        Painter.drawBounds(window.g, {
            x: ml,
            y: mt,
            width: mr - ml,
            height: mb - mt
        }, true, 2);


        const fl = fixedObject.left;
        const fr = fixedObject.right;
        const ft = fixedObject.top;
        const fb = fixedObject.bottom;

        Painter.drawBounds(window.g, {
            x: fl,
            y: ft,
            width: fr - fl,
            height: fb - ft
        }, false, 2);

        movingObject.rotation = rotation;
        fixedObject.rotation = rotation;


        /*
        movingObject.rotation = -rotation;
        fixedObject.rotation = -rotation;

        const ml = movingObject.left;
        const mr = movingObject.right;
        const mt = movingObject.top;
        const mb = movingObject.bottom;

        Painter.drawBounds(window.g, {
            x: ml,
            y: mt,
            width: mr - ml,
            height: mb - mt
        }, true, 10);


        //Painter.drawBoundsPoints(window.g, movingObject, 5);

        const fl = fixedObject.left;
        const fr = fixedObject.right;
        const ft = fixedObject.top;
        const fb = fixedObject.bottom;

        if (isFixMovement === true) {
            if (ml > fl) {
                //movingObject.x = fl - ml;
            }

            if (mr < fr) {
                //movingObject.x = fr - mr;
            }

            if (mt > ft) {
                //movingObject.y = ft - mt;
            }

            if (mb < fb) {
                //movingObject.y = fb - mb;
            }
        }

        movingObject.rotation = rotation;
        fixedObject.rotation = rotation;
        */
    }
}