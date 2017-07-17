export default class Calc
{
    static get DEG_TO_RAD() {
        if (this._DEG_TO_RAD)
            return this._DEG_TO_RAD;

        this._DEG_TO_RAD = Math.PI / 180;
        return this._DEG_TO_RAD;
    }

    static get RAD_TO_DEG() {
        if (this._RAD_TO_DEG)
            return this._RAD_TO_DEG;

        this._RAD_TO_DEG = 180 / Math.PI;
        return this._RAD_TO_DEG;
    }

    static get DEG180_TO_RAD() {
        if (this._DEG180_TO_RAD)
            return this._DEG180_TO_RAD;

        this._DEG180_TO_RAD = 180 * Math.PI / 180;
        return this._DEG180_TO_RAD;
    }

    static toRadians(degree) {
        return degree * this.DEG_TO_RAD;
    }

    static toDegrees(radians) {
        return radians * this.RAD_TO_DEG;
    }


    /**
     * viewport와 backgroundImage비율을 구합니다.
     * 화면 사이즈에 맞춰 이미지 사이즈를 구할때 사용합니다.
     * min 비율로 이미지 사이즈를 구하면 화면 안에 이미지가 모두 노출되고
     * max 비율로 이미지 사이즈를 구하면 화면에 꽉 차게 노출됩니다.
     * @param backgroundImage
     * @param viewport
     * @returns {{min: number, max: number}}
     */
    static getScale(backgroundImage, viewport)
    {
        const scaleX = viewport.width / backgroundImage.width;
        const scaleY = viewport.height / backgroundImage.height;

        if (scaleX < scaleY) {
            return {min: scaleX, max: scaleY};
        }
        else {
            return {min: scaleY, max: scaleX};
        }
    };


    /**
     * 화면 사이즈에 맞도록 이미지 비율을 구해 사이즈를 설정합니다.
     * @param backgroundImage 배경이미지 사진
     * @param viewport 현재 화면 사이즈
     * @returns {PIXI.Rectangle}
     */
    static getSizeFitInBounds(backgroundImage, viewport)
    {
        const scale = this.getScale(backgroundImage, viewport);
        return new PIXI.Rectangle(0, 0, scale.min * backgroundImage.width, scale.min * backgroundImage.height);
    };


    /**
     * anchor가 중앙인 객체 좌표를 anchor가 0,0인 좌표로 변환합니다.
     * @param shape {PIXI.Point|*}
     */
    static convertCenterPointToLeftTopPoint(shape)
    {
        return new PIXI.Point(shape.x - shape.width / 2, shape.y - shape.height / 2);
    }


    /**
     * 회전하는 좌표 구하기
     * @param pivot 사각형의 중심점
     * @param point 계산하고 싶은 포인트
     * @param angle 회전각 degrees
     * @returns {{x: (number|*), y: (number|*)}}
     */
    static getRotationPoint(pivot, point, angle) {
        const diffX = point.x - pivot.x;
        const diffY = point.y - pivot.y;
        const dist = Math.sqrt(diffX * diffX + diffY * diffY);
        const ca = Math.atan2(diffY, diffX) * 180 / Math.PI;
        const na = ((ca + angle) % 360) * Math.PI / 180;
        const x = (pivot.x + dist * Math.cos(na) + 0.5) | 0;
        const y = (pivot.y + dist * Math.sin(na) + 0.5) | 0;
        return {x: x, y: y};
    }
}