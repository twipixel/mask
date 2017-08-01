import CollisionType from './../consts/CollisionType';


export default class CollisionVO
{
    /**
     * 충돌한 부분과 offset값을 전달합니다.
     * @param type LEFT or RIGTH or TOP or BOTTOM or NONE
     * @param offset 충돌지점까지 떨어진 거리
     */
    constructor(type = CollisionType.NONE, offset = 0)
    {
        this.type = type;
        this.offset = offset;
    }
}