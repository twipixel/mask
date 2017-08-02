


export default class Echo
{
    /**
     * 소숫점 자리를 끊어줍니다.
     * @param convertNumber
     * @param digitNumber
     * @returns {number}
     */
    static _digit(convertNumber, digitNumber = 1)
    {
        if (digitNumber === 0) {
            digitNumber = 1;
        }

        const pow = Math.pow(10, digitNumber);
        return parseInt(convertNumber * pow) / pow;
    }


    /**
     * 숫자 앞에 '0'을 붙혀줍니다.
     * @param number
     * @param zeros
     * @returns {string}
     */
    static _leadingZeros(number, zeros = 4)
    {
        var zero = '';
        number = number.toString();

        if (number.length < zeros) {
            for (var i = 0; i < zeros - number.length; i++) {
                zero += '0';
            }
        }
        return zero + number;
    }


    /**
     * 숫자를 4자
     * @param number
     * @returns {*}
     */
    static number(number, zeros = 4)
    {
        return this._leadingZeros(parseInt(number), zeros)
    }


    /**
     * lt, rt, rb, lb 있는 사각형의 점좌표를 출력합니다.
     * @param rect
     */
    static rect(rect, isReturnLog = false)
    {
        var log = '' +
            'lt[' + this._digit(rect.lt.x) + ', ' + this._digit(rect.lt.y) + '] ' +
            'rt[' + this._digit(rect.rt.x) + ', ' + this._digit(rect.rt.y) + '] ' +
            'rb[' + this._digit(rect.rb.x) + ', ' + this._digit(rect.rb.y) + '] ' +
            'lb[' + this._digit(rect.lb.x) + ', ' + this._digit(rect.lb.y) + '] ';

        if (isReturnLog) {
            return log;
        }

        console.log(log);
    }
}