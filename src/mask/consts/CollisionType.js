export default class CollisionType
{
    static get LEFT() {return 'left';}
    static get RIGHT() {return 'right';}
    static get TOP() {return 'top';}
    static get BOTTOM() {return 'bottom';}
    static get NONE() {return 'none';}


    // 실제 사용은 안함
    static get LEFT_TOP() {return 'leftTop';}
    static get LEFT_BOTTOM() {return 'leftBottom';}
    static get RIGHT_TOP() {return 'rightTop';}
    static get RIGHT_BOTTOM() {return 'rightBottom';}
    static get TOP_LEFT() {return 'topLeft';}
    static get TOP_RIGHT() {return 'topRight';}
    static get BOTTOM_LEFT() {return 'bottomLeft';}
    static get BOTTOM_RIGHT() {return 'bottomRight';}
}