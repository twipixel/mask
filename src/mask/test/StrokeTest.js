import {request} from './../utils/async';
import {parseXML} from './../utils/string';



export default class StrokeTest extends PIXI.utils.EventEmitter
{
    constructor(renderer, rootLayer, maskLayer)
    {
        super();

        this.renderer = renderer;
        this.rootLayer = rootLayer;
        this.maskLayer = maskLayer;

        this.initialize();
    }


    /////////////////////////////////////////////////////////////////////////////
    //
    // 리사이즈 & 업데이트 & 초기화 함수
    //
    /////////////////////////////////////////////////////////////////////////////


    update (ms)
    {

    }


    resize()
    {
        // NOTHING
    }


    initialize()
    {
        this.svgContainer = document.createElement('div');
        document.body.appendChild(this.svgContainer);


        //request('./../../assets/svg/mask-oval.svg')
        //request('./../../assets/svg/mask-polygon.svg')
        //request('./../../assets/svg/mask-round-square.svg')
        //request('./../../assets/svg/mask-round-star.svg')
        //request('./../../assets/svg/mask-star-1.svg')
        request('./../../assets/svg/mask-star-2.svg')
        //request('./../../assets/svg/mask-triangle.svg')
            .then(responseText => {
                console.log('responseText', responseText);

                this.svgElement = parseXML(responseText).documentElement;
                this.svgContainer.appendChild(this.svgElement);

                this.mainPath = document.querySelector('#npe-mask-core');

                const stroke = 20;
                const maskWidth = 300;
                const maskHeight = 300;
                const canvasWidth = maskWidth + stroke;
                const canvasHeight = maskHeight + stroke;
                const maskX = stroke / 2;
                const maskY = stroke / 2;

                this.mainPath.style.fill = '#000';
                this.mainPath.style['stroke-width'] = '0px';

                const maskCanvas = this.maskCanvas = this.createCanvas(true, 'maskCanvas', '0px', '0px', canvasWidth, canvasHeight);
                this.maskContext = maskCanvas.getContext('2d');
                this.maskContext.drawSvg(this.svgContainer.innerHTML, maskX, maskY, maskWidth, maskHeight);

                const singleLineCanvas = this.singleLineCanvas = this.createCanvas(false, 'singleLineCanvas', canvasWidth + 'px', canvasHeight + 'px', canvasWidth, canvasHeight);
                this.singleLineContext = singleLineCanvas.getContext('2d');
                this.singleLineContext.drawSvg(this.svgContainer.innerHTML, maskX + 1, maskY + 1, maskWidth - 2, maskWidth - 2);

                this.mainPath.style.stroke = '#CDDC39';
                this.mainPath.style['stroke-width'] = stroke + 'px';

                const strokeCanvas = this.strokeCanvas = this.createCanvas(true, 'strokeCanvas', canvasWidth + 'px', '0px', canvasWidth, canvasHeight);
                this.strokeContext = strokeCanvas.getContext('2d');
                this.strokeContext.drawSvg(this.svgContainer.innerHTML, maskX, maskY, maskWidth, maskHeight);


                const strokeResultCanvas = this.strokeResultCanvas = this.createCanvas(true, 'strokeResultContext', '0px', canvasHeight + 'px', canvasWidth, canvasHeight);
                this.strokeResultContext = strokeResultCanvas.getContext('2d');
                this.strokeResultContext.drawImage(strokeCanvas, 0, 0);
                this.strokeResultContext.globalCompositeOperation = 'destination-in';
                this.strokeResultContext.drawImage(maskCanvas, 0, 0);


                const singleLineResultCanvas = this.singleLineResultCanvas = this.createCanvas(true, 'singleLineResultCanvas', canvasWidth + 'px', canvasHeight + 'px', canvasWidth, canvasHeight);
                this.singleLineResultContext = singleLineResultCanvas.getContext('2d');
                this.singleLineResultContext.drawImage(strokeCanvas, 0, 0);
                this.singleLineResultContext.globalCompositeOperation = 'destination-in';
                this.singleLineResultContext.drawImage(maskCanvas, 0, 0);
                this.singleLineResultContext.globalCompositeOperation = 'destination-out';
                this.singleLineResultContext.drawImage(singleLineCanvas, 0, 0);


                //this.singleLineContext.drawImage(strokeCanvas, 0, 0);
                //this.singleLineContext.globalCompositeOperation = 'destination-in';
                //this.singleLineContext.drawImage(maskCanvas, 0, 0);
                //this.singleLineContext.globalCompositeOperation = 'destination-out';
                //this.singleLineContext.drawImage();

            })
            .catch(e => {
                console.warn('error', e);
            });
    }


    createCanvas(appendChild = true, id = '', left = '0px', top = '0px', width = 500, height = 500, border = 'thin solid #ecf0f1')
    {
        const canvas = document.createElement('canvas');
        canvas.id = id;
        canvas.width = width;
        canvas.height = height;
        canvas.style.top = top;
        canvas.style.left = left;
        canvas.style.opacity = 1;
        canvas.style.border = border;
        canvas.style.position = 'absolute';
        document.body.appendChild(canvas);
        return canvas;
    }
}