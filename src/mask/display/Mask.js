import BitmapContainer from './BitmapContainer';


export default class Mask extends BitmapContainer
{
    /**
     *
     * @param maskVO {MaskVO}
     */
    constructor(maskVO)
    {
        super(maskVO.url);
        this.maskVO = maskVO;
    }


    /**
     * 마스크 이미지가 로드 완료되는 시점
     */
    onReady()
    {
        this.initialize();
    }


    initialize()
    {
        this.name = 'Mask';
        this.buttonMode = true;
        this.interactive = true;

        // 반전 여부
        this.scaleSignX = 1;
        this.scaleSignY = 1;

        // 마스크 기본 사이즈 설정
        this.bitmapWidth = this.defaultSizeX;
        this.bitmapHeight = this.defaultSizeY;
    }



    set maskVO(value)
    {
        this._maskVO = value;
        this.maxSize = value.maxSize;
        this.defaultSize = value.defaultSize;
        this.minSize = value.minSize;
    }

    get maskVO()
    {
        return this._maskVO;
    }



    /////////////////////////////////////////////////////////////////////////////
    //
    // 최대 / 기본 / 최소 사이즈 설정
    //
    /////////////////////////////////////////////////////////////////////////////


    /**
     * 최대 사이즈 설정
     * @param value {String} 예) 500x500
     */
    set maxSize(value)
    {
        if (value && value !== '') {
            this._maxSize = value;

            const size = value.split('x');
            this.maxSizeX = size[0];
            this.maxSizeY = size[1];
            console.log('max[', this.maxSizeX, this.maxSizeY, ']');
        }
    }

    get maxSize()
    {
        return this._maxSize;
    }


    /**
     * 기본 사이즈 설정
     * @param value {String} 예) 300x300
     */
    set defaultSize(value)
    {
        if (value && value !== '') {
            this._defaultSize = value;

            const size = value.split('x');
            this.defaultSizeX = size[0];
            this.defaultSizeY = size[1];
            console.log('default[', this.defaultSizeX, this.defaultSizeY, ']');
        }
    }

    get defaultSize()
    {
        return this._defaultSize;
    }


    /**
     * 최소 사이즈 설정
     * @param value {String} 예 100x100
     */
    set minSize(value)
    {
        if (value && value !== '') {
            this._minSize = value;

            const size = value.split('x');
            this.minSizeX = size[0];
            this.minSizeY = size[1];
            console.log('min[', this.minSizeX, this.minSizeY, ']');
        }
    }

    get minSize()
    {
        return this._minSize;
    }
}



