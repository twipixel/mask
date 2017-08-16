import TransformTool from './../transform/TransformTool';


export default class VectorContainer extends PIXI.Container {

    /**
     * Vector가 처음 로드 되었을 때 이벤트
     * @returns {string}
     * @constructor
     */
    static get LOAD_COMPLETE() {
        return 'drawComplete';
    }

    /**
     * 처음 이후 업데이트 되었을 때 이벤트
     * @returns {string}
     * @constructor
     */
    static get TEXTURE_UPDATE() {
        return 'textureUpdate';
    }


    /**
     * 캔버스 최대 사이즈가 IE Mobile 에서는 4,096 픽셀이며 IE 에서는 8,192 픽셀입니다.
     * @param canvasLimitSize
     */
    constructor(canvasLimitSize = 4000) {
        super();
        this.canvasLimitSize = canvasLimitSize;
        this.initialize();
        this.addEvent();
    }


    initialize() {
        this.image = null;
        this.scaleSignX = 1;
        this.scaleSignY = 1;
        // restore 시 복원할 scaleSignX,Y 값
        this._restoreScaleSignX = -1;
        this._restoreScaleSignY = -1;

        this.interactive = true;
        this.isFirstLoad = true;
        this.renderableObject = true;

        this.childScaleX = 1;
        this.childScaleY = 1;

        this.canvgCanvas = document.createElement('CANVAS');
        this.canvgCanvas.id = 'canvgCanvas';
        this.canvgContext = this.canvgCanvas.getContext('2d');
    };


    addEvent() {
        this.drawCompleteListener = this.onDrawComplete.bind(this);
        this.transformCompleteListener = this.onTransformComplete.bind(this);
        this.on(TransformTool.TRANSFORM_COMPLETE, this.transformCompleteListener);
    }


    removeEvent() {
        this.off(TransformTool.TRANSFORM_COMPLETE, this.transformCompleteListener);
        this.drawCompleteListener = null;
        this.transformCompleteListener = null;
    }


    load(url, x = 0, y = 0, width = 100, height = 100) {
        this.url = url;
        this.originW = width;
        this.originH = height;
        this.drawSvg(x, y, width, height);
    }


    setSVG(dom, x = 0, y = 0, width = 100, height = 100) {
        this.svg = dom;
        this.originW = width;
        this.originH = height;
        this.drawSvg(x, y, width, height);
    }


    setPivot(localPoint) {
        this.pivot = localPoint;
    }


    drawSvg(x, y, width, height) {
        this.drawX = x;
        this.drawY = y;
        this.drawWidth = width;
        this.drawHeight = height;

        var signX = (width < 0) ? -1 : 1;
        var signY = (height < 0) ? -1 : 1;
        this.scaleSignX = this.scaleSignX * signX;
        this.scaleSignY = this.scaleSignY * signY;
        width = Math.abs(width);
        height = Math.abs(height);
        width = (width > this.canvasLimitSize) ? this.canvasLimitSize : width;
        height = (height > this.canvasLimitSize) ? this.canvasLimitSize : height;

        if (this._timeout){
            clearTimeout(this._timeout);
        }
        // IE에서 웹폰트 안보이는 문제 때문에 body에 추가함.
        this.canvgCanvas.style.display = "none";
        document.body.appendChild(this.canvgCanvas);

        this.canvgCanvas.width = width;
        this.canvgCanvas.height = height;
        this.canvgContext.drawSvg(this.url || this.svg, x, y, width, height, {
            renderCallback: this.drawCompleteListener.call(this)
        });
    }


    delete() {
        this.removeEvent();
        this.interactive = false;

        if (this.image !== null) {
            this.image.texture.destroy();
            this.image.texture = null;
            this.removeChild(this.image);
            this.image.renderableObject = false;
            this.image.destroy();
            this.image = null;
        }

        this.destroy();
        if(this.svg && this.svg.parentNode){
            this.svg.parentNode.removeChild(this.svg);
        }

        if (this._timeout){
            clearTimeout(this._timeout);
            this._timeout = -1;
        }

        if (this.canvgCanvas.parentNode){
            document.body.removeChild(this.canvgCanvas);
        }

        this.svg = null;
        this.canvgCanvas.svg = null;
        this.canvgCanvas = null;
        this.canvgContext = null;
        this.drawCompleteListener = null;
        this.transformCompleteListener = null;
    }


    checkAlphaPoint(globalMPoint) {
        let point = this.worldTransform.applyInverse(globalMPoint);
        let data = this.canvgContext.getImageData(point.x, point.y, 1, 1);

        if (data.data[3] == 0) {
            return true;
        }
        return false;
    }


    /**
     * 이동 시에는 다시 canvg에서 다시 안그리도록 처리하고
     * 대신 updateTransform 하도록 TEXTURE_UPDATE 이벤트를 전달합니다.
     * 이동하고 회전하는 경우 updateTransform 이 안되어 이상 동작합니다.
     * @param e
     */
    onTransformComplete(e) {
        if( e.type == "middleCenter" ) {
            this.notifyTextureUpdate();
        } else {
            this.drawSvg(0, 0, this.width, this.height);
        }
    }


    onDrawComplete() {
        if (this.isFirstLoad === true) {
            this.isFirstLoad = false;
            this.createImage();
        } else {
            this.resetScale();
            this.notifyTextureUpdate();
        }

        this._timeout = setTimeout((function(){
            if (this.canvgCanvas.parentNode){
                document.body.removeChild(this.canvgCanvas);
            }
        }).bind(this), 500);
    }


    createImage() {
        this.image = new PIXI.Sprite(new PIXI.Texture.fromCanvas(this.canvgCanvas));
        this.image.renderableObject = true;
        this.addChild(this.image);
        this.emit(VectorContainer.LOAD_COMPLETE, {target: this});
    }


    resetScale() {
        this.scale = {x: 1, y: 1};
        this.image.scale = {x: this.scaleSignX, y: this.scaleSignY};
        this.image.texture.update();
        this.image.updateTransform();
    }


    notifyTextureUpdate() {
        this.emit(VectorContainer.TEXTURE_UPDATE, {
            target: this,
            scaleSignX: this.scaleSignX,
            scaleSignY: this.scaleSignY
        });
    }


    get ID() {
        return this._id;
    }

    set ID(id) {
        this._id = id;
    }

    get scaleForOrigin() {
        return {x: this.width / this.originW, y: this.height / this.originH};
    }

    get snapshot() {
        return {
            url: this.url,
            svg: this.svg,

            x: this.drawX,
            y: this.drawY,

            width: this.drawWidth,
            height: this.drawHeight,

            transform: {
                x: this.x,
                y: this.y,
                scaleX: this.scale.x,
                scaleY: this.scale.y,
                pivotX: this.pivot.x,
                pivotY: this.pivot.y,
                rotation: this.rotation,
                childIndex: this.parent.getChildIndex(this),
                childScaleX: this.image.scale.x,
                childScaleY: this.image.scale.y,
                originW: this.originW,
                originH: this.originH,
                scaleSignX: this.scaleSignX,
                scaleSignY: this.scaleSignY
            },

            pngSource: false
        };
    }


    get complete(){
        return true;
    }
}
