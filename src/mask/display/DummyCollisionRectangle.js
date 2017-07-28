export default class DummyCollisionRectangle
{
    /**
     * 충돌검사를 위한 더미 사각형입니다.
     *
     * @param lt 좌상단 포인트의 글로벌 좌표입니다.
     * @param rt 우상단 포인트의 글로벌 좌표입니다.
     * @param rb 우하단 포인트의 글로벌 좌표입니다.
     * @param lb 좌하단 포인트의 글로벌 좌표입니다.
     */
    constructor(lt, rt, rb, lb)
    {
        console.log(typeof lt, lt);
        this.lt = lt;
        this.rt = rt;
        this.rb = rb;
        this.lb = lb;
        this.points = [this.lt, this.rt, this.rb, this.lb];
    }


    rotate(rotation)
    {
        const points = this.points;
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);

        for (var i = 0; i < points.length; i++) {
            const pt = points[i];
            const x = pt.x;
            const y = pt.y;
            pt.x = cos * x - sin * y;
            pt.y = sin * x + cos * y;
        }
    }


    /**
     * 사각형의 맨 좌측값 (충돌검사를 위한 값)
     * @returns {*}
     */
    get left()
    {
        const points = this.points;
        var point = points[0];

        for (var i = 1; i < points.length; i++) {
            const other = points[i];

            if (other.x < point.x) {
                point = other;
            }
        }

        return point.x;
    }


    /**
     * 사각형의 맨 우측값 (충돌검사를 위한 값)
     * @returns {*}
     */
    get right()
    {
        const points = this.points;
        var point = points[0];

        for (var i = 1; i < points.length; i++) {
            const other = points[i];

            if (other.x > point.x) {
                point = other;
            }
        }

        return point.x;
    }


    /**
     * 사각형의 맨 상단값 (충돌검사를 위한 값)
     * @returns {*}
     */
    get top()
    {
        const points = this.points;
        var point = points[0];

        for (var i = 1; i < points.length; i++) {
            const other = points[i];

            if (other.y > point.y) {
                point = other;
            }
        }

        return point.y;
    }


    /**
     * 사각형의 맨 하단값 (충돌검사를 위한 값)
     * @returns {*}
     */
    get bottom()
    {
        const points = this.points;
        var point = points[0];

        for (var i = 1; i < points.length; i++) {
            const other = points[i];

            if (other.y < point.y) {
                point = other;
            }
        }

        return point.y;
    }
}