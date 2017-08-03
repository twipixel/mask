export default class CollisionType
{
    static get LEFT() {return 'left';}
    static get RIGHT() {return 'right';}
    static get TOP() {return 'top';}
    static get BOTTOM() {return 'bottom';}
    static get NONE() {return 'none';}

    static get LEFT_TOP() {return 'leftTop';}
    static get LEFT_BOTTOM() {return 'leftBottom';}
    static get RIGHT_TOP() {return 'rightTop';}
    static get RIGHT_BOTTOM() {return 'rightBottom';}

    static get TOP_BOTTOM() {return 'topBottom';}
    static get BOTTOM_TOP() {return 'bottomTop';}
    static get LEFT_RIGHT() {return 'leftRight';}
    static get RIGHT_LEFT() {return 'rightLeft';}

    /**
     * 현재 사용 않함
     * CollisionManager.getFixPosition 함수에서
     * left, right 먼저 검사 후 top, bottom 을 추가하고 있어
     * top, bottom 이 먼저 나오지 않습니다.
     */
    static get TOP_LEFT() {return 'topLeft';}
    static get TOP_RIGHT() {return 'topRight';}
    static get BOTTOM_LEFT() {return 'bottomLeft';}
    static get BOTTOM_RIGHT() {return 'bottomRight';}
}