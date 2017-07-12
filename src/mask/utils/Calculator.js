export default class Calc
{
    constructor()
    {

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
        const scale = Calc.getScale(backgroundImage, viewport);
        return new PIXI.Rectangle(0, 0, scale.min * backgroundImage.width, scale.min * backgroundImage.height);
    };
}