export default class Bitmap extends PIXI.Container {

    static READY()
    {
        return 'ready';
    }


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
            this.emit(Bitmap.READY);
        }, 10);
    }


    set width(value)
    {
        this._image.width = value;
    }

    get width()
    {
        return this._image.width;
    }


    set height(value)
    {
        this._image.height = value;
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

    get originalImageSize() {
        return this._originalImageSize;
    }

    get originalImageWidth() {
        return this._originalImageWidth;
    }

    get originalImageHeight() {
        return this._originalImageHeight;
    }
}