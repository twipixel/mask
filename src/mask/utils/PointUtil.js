export default class PointUtil
{
    static add(point1, point2)
    {
        return new PIXI.Point(point1.x + point2.x, point1.y + point2.y);
    }

    static subtract(point1, point2)
    {
        return new PIXI.Point(point1.x - point2.x, point1.y - point2.y);
    }

    static distance(point1, point2)
    {
        return this.calcDistance(point1, point2);
    }

    static calcDistance(point1, point2)
    {
        return Math.sqrt((point1.x - point2.x) * (point1.x - point2.x) + (point1.y - point2.y) * (point1.y - point2.y));
    }

    static getAddedInterpolate(point1, point2, addLength)
    {
        const distance = PointUtil.calcDistance(point1, point2);
        var f = (distance + addLength) / distance;
        return PointUtil.interpolate(point1, point2, f);
    }

    /**
     * 지정한 두 점 사이에서 한 점을 정합니다. (보간법)
     * http://help.adobe.com/ko_KR/as2/reference/flashlite/WS5A22C182-B974-4b7e-9979-5BD0B43389F0.html
     * @param point1
     * @param point2
     * @param f 두 점 사이의 삽입 수준입니다. pt1과 pt2 사이의 직선상에서 새 점의 위치를 나타냅니다. f =0이면 pt1이 반환되고, f =1이면 pt2가 반환됩니다.
     * @returns {PIXI.Point|*}
     */
    static interpolate(point1, point2, f)
    {
        return new PIXI.Point(point2.x + f * (point1.x - point2.x), point2.y + f * (point1.y - point2.y));
    }

    /**
     * (0,0)과 현재 포인트 사이의 선분을 설정된 길이로 조절합니다. (벡터 정규화)
     * http://help.adobe.com/ko_KR/as2/reference/flashlite/WSB22C5AE6-750E-4274-BBF4-C10BD879207C.html
     * @param point
     * @param length
     * @returns {*}
     */
    static normalize(point, length)
    {
        if (point.x == 0 && point.y == 0) {
            return point;
        }

        var norm = length / Math.sqrt(point.x * point.x + point.y * point.y);
        point.x *= norm;
        point.y *= norm;
        return point;
    }
}