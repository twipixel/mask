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
        console.log('loadComplete');

        this.emit(Bitmap.READY);
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
}