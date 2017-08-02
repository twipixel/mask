import CollisionType from './../consts/CollisionType';


export default class CollisionVO
{
    /**
     * 충돌한 부분과 offset값을 전달합니다.
     * @param type LEFT or RIGTH or TOP or BOTTOM or NONE
     * @param offset 충돌지점까지 떨어진 거리
     */
    constructor(type = CollisionType.NONE, offsetX = 0, offsetY = 0)
    {
        this.type = type;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }


    reset()
    {
        this.offsetX = 0;
        this.offsetY = 0;
        this._type = CollisionType.NONE;
    }


    set type(value)
    {
        if (this._type === CollisionType.NONE) {
            this._type = value;
        }
        else {
            this._type = this._type + (value.substr(0, 1).toUpperCase() + value.substr(1));
        }
    }


    get type()
    {
        return this._type;
    }
}