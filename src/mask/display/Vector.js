import ShapeFactory from './../factory/ShapeFactory';


/**
 * lt, rt, rb, lb 사각형 사이즈 (디버그용)
 * @type {number}
 */
const pointRectSize = 0;

/**
 * 캔버스 최대 사이즈가 IE Mobile 에서는 4,096 픽셀이며 IE 에서는 8,192 픽셀입니다.
 * @param canvasLimitSize
 */
const canvasLimitSize = 4000;


export default class Vector extends PIXI.Container {
    /**
     * Vector가 처음 로드 되었을 때 이벤트
     * @returns {string}
     * @constructor
     */
    static get LOAD_COMPLETE() {return 'drawComplete';}

    /**
     * 처음 이후 업데이트 되었을 때 이벤트
     * @returns {string}
     * @constructor
     */
    static get TEXTURE_UPDATE() {return 'textureUpdate';}



    constructor(url = '', x = 0, y = 0, width = 100, height = 100) {
        super();

        this.url = url;
        this.drawX = x;
        this.drawY = y;
        this.drawWidth = width;
        this.drawHeight = height;

        this.initialize();
        this.addEvent();

        if (url !== '') {
            this.load(url, x, y, width, height);
        }
    }


    initialize() {
        this.image = null;
        this.isFirstLoad = true;

        this.canvgCanvas = document.createElement('canvas');
        this.canvgCanvas.id = 'canvgCanvas';
        this.canvgContext = this.canvgCanvas.getContext('2d');
    };


    addEvent() {
        this.drawCompleteListener = this.onDrawComplete.bind(this);
        //this.transformCompleteListener = this.onTransformComplete.bind(this);
        //this.on(TransformTool.TRANSFORM_COMPLETE, this.transformCompleteListener);
    }


    removeEvent() {
        //this.off(TransformTool.TRANSFORM_COMPLETE, this.transformCompleteListener);
        this.drawCompleteListener = null;
        //this.transformCompleteListener = null;
    }


    load(url, x = 0, y = 0, width = 100, height = 100) {
        this.url = url;
        this.drawSvg(x, y, width, height);
    }


    drawSvg(x, y, width, height) {
        this.drawX = x;
        this.drawY = y;
        this.drawWidth = width;
        this.drawHeight = height;

        width = Math.abs(width);
        height = Math.abs(height);
        width = (width > canvasLimitSize) ? canvasLimitSize : width;
        height = (height > canvasLimitSize) ? canvasLimitSize : height;

        if (this._timeout) {
            clearTimeout(this._timeout);
        }

        // IE에서 웹폰트 안보이는 문제 때문에 body에 추가함.
        this.canvgCanvas.style.display = "none";
        document.body.appendChild(this.canvgCanvas);

        this.canvgCanvas.width = width;
        this.canvgCanvas.height = height;
        this.canvgContext.drawSvg(this.url, x, y, width, height, {
            renderCallback: () => {
                this.drawCompleteListener.call(this);
            }
        });
    }


    destroy() {
        this.removeEvent();
        this.interactive = false;

        if (this.image !== null) {
            this.removeChild(this.image);
            this.image.texture.destroy();
            this.image.texture = null;
            this.image.destroy();
            this.image = null;
        }

        if (this._timeout){
            clearTimeout(this._timeout);
            this._timeout = -1;
        }

        if (this.canvgCanvas.parentNode){
            document.body.removeChild(this.canvgCanvas);
        }

        this.canvgCanvas = null;
        this.canvgContext = null;
        this.drawCompleteListener = null;
        //this.transformCompleteListener = null;

        super.destroy();
    }


    /**
     * 이동 시에는 다시 canvg에서 다시 안그리도록 처리하고
     * 대신 updateTransform 하도록 TEXTURE_UPDATE 이벤트를 전달합니다.
     * 이동하고 회전하는 경우 updateTransform 이 안되어 이상 동작합니다.
     * @param e
     */
    /*onTransformComplete(e) {
        if( e.type == "middleCenter" ) {
            this.notifyTextureUpdate();
        } else {
            this.drawSvg(0, 0, this.width, this.height);
        }
    }*/


    onDrawComplete() {
        console.log('onDrawComplete');

        if (this.isFirstLoad === true) {
            this.isFirstLoad = false;
            this.createImage();
        } else {
            this.resetScale();
            this.notifyTextureUpdate();
        }

        this._timeout = setTimeout(() => {
            if (this.canvgCanvas.parentNode) {
                document.body.removeChild(this.canvgCanvas);
            }
        }, 500);
    }


    createImage() {
        this.image = new PIXI.Sprite(new PIXI.Texture.fromCanvas(this.canvgCanvas));
        this.addChild(this.image);

        // leftTop, rightTop, rightBottom, leftBottom, registrationPoint 생성
        this.lt = this.registrationPoint = ShapeFactory.getRectangle(0, 0, pointRectSize);
        this.rt = ShapeFactory.getRectangle(-pointRectSize, 0, pointRectSize);
        this.rb = ShapeFactory.getRectangle(-pointRectSize, -pointRectSize, pointRectSize);
        this.lb = ShapeFactory.getRectangle(0, -pointRectSize, pointRectSize);
        this.rt.x = this.rb.x = this.image.width;
        this.rb.y = this.lb.y = this.image.height;
        this.addChild(this.lt);
        this.addChild(this.rt);
        this.addChild(this.rb);
        this.addChild(this.lb);
        this.points = [this.lt, this.rt, this.rb, this.lb];

        this.emit(Vector.LOAD_COMPLETE, {target: this});
    }


    resetScale() {
        this.scale = new PIXI.Point(1, 1);
        this.image.scale = new PIXI.Point(1, 1);
        this.image.texture.update();
        this.image.updateTransform();
    }


    notifyTextureUpdate() {
        this.emit(Vector.TEXTURE_UPDATE, {target: this});
    }


    get snapshot() {
        return {
            url: this.url,
            x: this.drawX,
            y: this.drawY,
            width: this.drawWidth,
            height: this.drawHeight,

            transform: {
                x: this.x,
                y: this.y,
                pivotX: this.pivot.x,
                pivotY: this.pivot.y,
                rotation: this.rotation,
            }
        };
    }
}
