import ShapeFactory from './../factory/ShapeFactory';


export default class Bitmap extends PIXI.Container
{
    static READY()
    {
        return 'ready';
    }

    /**
     * 이미지를 로드하고 PIXI.Sprite 로 화면에 표시하고
     * DimmedMask에 사용할 ImageElement를 같이 가지고 있습니다.
     * lt, rt, rb, lb 포인트로 충돌 계산을 합니다.
     * @param url
     */
    constructor(url) {
        super();

        this.url = url;
        this.initialize();
    }


    initialize() {
        this._image = PIXI.Sprite.fromImage(this.url);
        this.addChild(this._image);

        this._imageElement = new Image();
        this._imageElement.src = this.url;
        this._imageElement.onload = this.onImageLoadComplete.bind(this);
    }


    onImageLoadComplete() {
        // 살짝 딜레이를 주지 않으면 랜더링에 문제가 될 수 있습니다.
        setTimeout(() => {
            this._originalImageWidth = this._image.width;
            this._originalImageHeight = this._image.height;
            this._originalImageSize = new PIXI.Rectangle(0, 0, this.originalImageWidth, this.originalImageHeight);

            const size = 10;
            // leftTop, rightTop, rightBottom, leftBottom, registrationPoint 생성
            this.lt = this.registrationPoint = ShapeFactory.getRectangle(0, 0, size);
            this.rt = ShapeFactory.getRectangle(-size, 0, size);
            this.rb = ShapeFactory.getRectangle(-size, -size, size);
            this.lb = ShapeFactory.getRectangle(0, -size, size);
            this.rt.x = this.rb.x = this._image.width;
            this.rb.y = this.lb.y = this._image.height;
            this.addChild(this.lt);
            this.addChild(this.rt);
            this.addChild(this.rb);
            this.addChild(this.lb);

            this.emit(Bitmap.READY);
        }, 10);
    }


    /**
     * 이미지 넓이
     * @param value
     */
    set width(value)
    {
        this._image.width = value;
        this.rt.x = this.rb.x = value;
    }

    get width()
    {
        return this._image.width;
    }


    /**
     * 이미지 높이
     * @param value
     */
    set height(value)
    {
        this._image.height = value;
        this.rb.y = this.lb.y = value;
    }

    get height()
    {
        return this._image.height;
    }


    /**
     * 실제 이미지 객체
     * @returns {Image}
     */
    get imageElement() {
        return this._imageElement;
    }


    /**
     *
     * @returns {Sprite.fromImage|BaseTexture.fromImage|Texture.fromImage|TilingSprite.fromImage|i.fromImage|*}
     */
    get image() {
        return this._image;
    }

    /**
     * 최초 로드된 이미지의 실제 사이즈
     * @returns {*|PIXI.Rectangle}
     */
    get originalImageSize() {
        return this._originalImageSize;
    }

    /**
     * 최초 로드된 이미지 넓이
     * @returns {number|*}
     */
    get originalImageWidth() {
        return this._originalImageWidth;
    }

    /**
     * 최초 로드된 이미지 높이
     * @returns {number|*}
     */
    get originalImageHeight() {
        return this._originalImageHeight;
    }
}