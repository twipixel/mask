export default class Calculator
{
    constructor()
    {

    }


    /**
     * 바운드와 사이즈의 최소, 최대 비율을 구합니다
     * @param numerator 분자로 사용할 사이즈
     * @param denominator 분모로 사용할 사이즈
     * @returns {{min: number, max: number}}
     */
    static getScale(numerator, denominator)
    {
        const scaleX = denominator.width / numerator.width;
        const scaleY = denominator.height / numerator.height;

        if (scaleX < scaleY) {
            return {min: scaleX, max: scaleY};
        }
        else {
            return {min: scaleY, max: scaleX};
        }
    };


    /**
     * 최초 시작 시 이미지 사이즈를 구하기 위해
     *
     * outerRectangle안에 innerRectangle를 비율에 맞춰 넣을 수 있도록 사이즈를 반환합니다
     * @param innerRectangle inBounds 바운즈안에 넣을 화면(이미지) 사이즈
     * @param outerRectangle outBounds 바운드 넓이와 높이
     * @returns {PIXI.Rectangle}
     */
    static getSizeFitInBounds(innerRectangle, outerRectangle)
    {
        const scale = Calc.getScale(innerRectangle, outerRectangle);
        return new PIXI.Rectangle(0, 0, scale.min * innerRectangle.width, scale.min * innerRectangle.height);
    };
}