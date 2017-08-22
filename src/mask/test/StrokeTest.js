import {request} from './../utils/async';
import {parseXML} from './../utils/string';


const maskWidth = 325;
const maskHeight = 310;
const canvasWidth = 500;
const canvasHeight = 500;


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


        //request('./../../assets/svg/mask-star-1.svg')
        request('./../../assets/svg/mask-round-square.svg')
            .then(responseText => {
                console.log('responseText', responseText);

                this.svgElement = parseXML(responseText).documentElement;
                this.svgContainer.appendChild(this.svgElement);



                this.mainPath = document.querySelector('#npe-mask-core');




                const maskX = (canvasWidth - maskWidth) / 2;
                const maskY = (canvasHeight - maskHeight) / 2;

                console.log('maskX', maskX, 'maskY', maskY);


                this.mainPath.style['stroke-width'] = '0px';

                const maskCanvas = this.maskCanvas = this.createCanvas('maskCanvas', '0px', '0px', canvasWidth, canvasHeight);
                document.body.appendChild(maskCanvas);
                this.maskContext = maskCanvas.getContext('2d');
                this.maskContext.drawSvg(this.svgContainer.innerHTML, maskX, maskY, maskWidth, maskHeight);


                this.mainPath.style['stroke-width'] = '20px';
                this.mainPath.style.stroke = '#ff3300';

                const strokeCanvas = this.strokeCanvas = this.createCanvas('strokeCanvas', '500px', '0px', canvasWidth, canvasHeight);
                this.strokeContext = strokeCanvas.getContext('2d');
                this.strokeContext.drawSvg(this.svgContainer.innerHTML, maskX, maskY, maskWidth, maskHeight);


                const mixCanvas = this.mixCanvas = this.createCanvas('mixCanvas', '0px', '500px', canvasWidth, canvasHeight);
                this.mixContext = mixCanvas.getContext('2d');
                this.mixContext.drawImage(strokeCanvas, 0, 0);
                this.mixContext.globalCompositeOperation = 'destination-in';
                this.mixContext.drawImage(maskCanvas, 0, 0);

            })
            .catch(e => {
                console.warn('error', e);
            });
    }


    createCanvas(id = '', left = '0px', top = '0px', width = 500, height = 500, border = 'thin solid #ff3300')
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