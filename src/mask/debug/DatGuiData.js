

var instance = null;


export default class DatGuiData
{
    /**
     * 여러 곳에서 객체를 생성해도 싱글턴처럼 한개만 반환하도록 처리
     * @param options 초기값
     * @returns {*}
     */
    constructor(options)
    {
        if (!instance) {
            instance = this;
            this.initialize(options);
        }
        return instance;
    }


    /**
     * 여기에 속성 이름과 값을 셋팅합니다. (property name = value)
     * @param options
     */
    initialize(options)
    {
        const maskURL = options.maskURL;

        if (maskURL) {
            for (var prop in this.maskList) {
                const value = this.maskList[prop];
                //const url = value.split('/');
                //const fileName = url[url.length - 1];

                if (maskURL === value) {
                    this.mask = value;
                }
            }
        }
        else {
            this.mask = './../assets/img/mask-triangle@3x.png';
        }
    }


    get maskList()
    {
        return {
            TRIANGLE: './../assets/img/mask-triangle@3x.png',
            CIRCLE: './../assets/img/mask-oval@3x.png',
            POLYGON: './../assets/img/mask-polygon@3x.png',
            STAR_1: './../assets/img/mask-star@3x.png',
            STAR_2: './../assets/img/mask-star-2@3x.png',
            ROUND_SQURE: './../assets/img/mask-round-squre@3x.png',
            ROUND_STAR: './../assets/img/mask-round-star@3x.png'
        };
    }
}