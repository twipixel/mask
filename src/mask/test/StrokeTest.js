import {request} from './../utils/async';
import {parseXML} from './../utils/string';
import BackgroundImage from './../display/BackgroundImage';


//const maskURL = './../../assets/svg/mask-oval.svg';
//const maskURL = './../../assets/svg/mask-polygon.svg';
//const maskURL = './../../assets/svg/mask-round-square.svg';
//const maskURL = './../../assets/svg/mask-round-star.svg';
//const maskURL = './../../assets/svg/mask-star-1.svg';
//const maskURL = './../../assets/svg/mask-star-2.svg';
const maskURL = './../../assets/svg/mask-triangle.svg';



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
        const svgContainer = this.svgContainer = document.createElement('div');
        document.body.appendChild(svgContainer);


        // 배경 이미지 생성
        const backgroundImage = this.backgroundImage = new BackgroundImage('./../assets/img/background0.png');
        backgroundImage.on(BackgroundImage.READY, this.startTest.bind(this, svgContainer));
    }


    startTest(svgContainer)
    {
        request(maskURL)
            .then(responseText => {

                const svgElement = this.svgElement = parseXML(responseText).documentElement;
                svgContainer.appendChild(svgElement);

                const mainPath = this.mainPath = document.querySelector('#npe-mask-core');

                const stroke = 50;
                const lineThickness = 1;
                const halfStroke = stroke / 2;
                const maskX = halfStroke;
                const maskY = halfStroke;

                const maskSize = this.getMaskSize(maskURL);
                const maskWidth = maskSize.width;
                const maskHeight = maskSize.height;
                const canvasWidth = maskWidth + stroke;
                const canvasHeight = maskHeight + stroke;

                mainPath.style.fill = '#000';
                mainPath.style['stroke-width'] = '0px';

                // 1. 마스크 캔버스
                const maskCanvas = this.maskCanvas = this.createCanvas(true, 'maskCanvas', '0px', '0px', canvasWidth, canvasHeight);
                const maskContext = maskCanvas.getContext('2d');
                maskContext.drawSvg(svgContainer.innerHTML, maskX, maskY, maskWidth, maskHeight);


                mainPath.style.stroke = '#CDDC39';
                mainPath.style['stroke-width'] = stroke + 'px';
                mainPath.style['fill-opacity'] = 0;


                // 2. 스트로크 스타일 입힌 실제 화면
                const strokeCanvas = this.strokeCanvas = this.createCanvas(true, 'strokeCanvas', canvasWidth + 'px', '0px', canvasWidth, canvasHeight);
                const strokeContext = strokeCanvas.getContext('2d');
                strokeContext.drawSvg(svgContainer.innerHTML, maskX, maskY, maskWidth, maskHeight);


                // 3. 스트로크 적용한 마스크 (가운데 안 뚫린 이미지)
                const strokeResultCanvas = this.strokeResultCanvas = this.createCanvas(true, 'strokeResultContext', '0px', canvasHeight + 'px', canvasWidth, canvasHeight);
                const strokeResultContext = strokeResultCanvas.getContext('2d');
                strokeResultContext.drawImage(this.backgroundImage.bitmap.imageElement, 0, 0);
                strokeResultContext.drawImage(strokeCanvas, 0, 0);
                strokeResultContext.globalCompositeOperation = 'destination-in';
                strokeResultContext.drawImage(maskCanvas, 0, 0);


                // 4. 1픽셀 라인만 그리기
                mainPath.style.fill = '#CDDC39';
                //mainPath.style.fill = '#EEEEEE';
                mainPath.style['stroke-width'] = '0px';
                mainPath.style['fill-opacity'] = 1;

                const bgCanvas = this.bgCanvas = this.createCanvas(false, 'bgCanvas', '0px', '0px', canvasWidth, canvasHeight);
                const bgContext = bgCanvas.getContext('2d');
                bgContext.drawSvg(svgContainer.innerHTML, 0, 0, maskWidth, maskHeight);

                const cropCanvas = this.cropCanvas = this.createCanvas(false, 'cropCanvas', '0px', '0px', canvasWidth, canvasHeight);
                const cropContext = cropCanvas.getContext('2d');
                cropContext.drawSvg(svgContainer.innerHTML, 0, 0, maskWidth - (lineThickness * 2), maskHeight - (lineThickness * 2));

                const singleLineResultCanvas = this.singleLineResultCanvas = this.createCanvas(true, 'singleLineResultCanvas', canvasWidth + 'px', canvasHeight + 'px', canvasWidth, canvasHeight);
                const singleLineResultContext = singleLineResultCanvas.getContext('2d');
                singleLineResultContext.drawImage(bgCanvas, maskX, maskY);
                singleLineResultContext.globalCompositeOperation = 'destination-out';
                singleLineResultContext.drawImage(cropCanvas, maskX + lineThickness, maskY + lineThickness);


                // 5. 스트로크색만 남기고 나머지 색 제거하기 (깨끗하게 안지워진다)
                const colorRemoveCanvas = this.strokeOtherCanvas = this.createCanvas(true, 'strokeOtherCanvas', '0px', (canvasHeight * 2) + 'px', canvasWidth, canvasHeight);
                const colorRemoveContext = colorRemoveCanvas.getContext('2d');

                // black 컬러를 제거
                var color = [0,0,0];
                var canvasData = strokeResultContext.getImageData(0, 0, canvasWidth, canvasHeight),
                    pix = canvasData.data;

                for (var i = 0, n = pix.length; i < n; i += 4) {
                    if(pix[i] === color[0] && pix[i + 1] === color[1] && pix[i + 2] === color[2]){
                        pix[i + 3] = 0;
                    }
                }

                colorRemoveContext.putImageData(canvasData, 0, 0);


                // 6. 두께 만큼 뚫어보자 (도형을 겹쳐서 뚫으면 비율이나 모양이 어긋난다)

                mainPath.style.fill = '#CDDC39';
                mainPath.style['stroke-width'] = '0px';

                /**
                 * drawSvg 시점에 x, y 를 stroke 만큼 주고 그리면 오차가 발생합니다. 위치가 맞지 않습니다 (이유를 모름)
                 * drawImage 시점에 위치를 설정하면 딱 맞습니다.
                 * thicknessContext.drawImage(thicknessTempCanvas, stroke, stroke);
                 */
                const thicknessTempCanvas = this.thicknessTempCanvas = this.createCanvas(false, 'thicknessTempCanvas', '0px', '0px', canvasWidth, canvasHeight);
                const thicknessTempContext = thicknessTempCanvas.getContext('2d');
                thicknessTempContext.drawSvg(svgContainer.innerHTML, 0, 0, maskWidth - stroke, maskHeight - stroke);

                const thicknessCanvas = this.thicknessCanvas = this.createCanvas(true, 'thicknessCanvas', canvasWidth + 'px', (canvasHeight * 2) + 'px', canvasWidth, canvasHeight);
                const thicknessContext = thicknessCanvas.getContext('2d');
                thicknessContext.drawImage(strokeCanvas, 0, 0);
                thicknessContext.globalCompositeOperation = 'destination-in';
                thicknessContext.drawImage(maskCanvas, 0, 0);
                thicknessContext.globalCompositeOperation = 'destination-out';

                /**
                 * x, y 조절은 여기서 해야 오차가 없습니다.
                 */
                thicknessContext.drawImage(thicknessTempCanvas, stroke, stroke);
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

        if (appendChild === true) {
            document.body.appendChild(canvas);
        }

        return canvas;
    }



    getMaskSize(url)
    {
        switch (url) {
            case './../../assets/svg/mask-oval.svg':
                return {width:300, height:300};
            case './../../assets/svg/mask-triangle.svg':
                return {width:330, height:300};
            case './../../assets/svg/mask-round-square.svg':
                return {width:300, height:300};
            case './../../assets/svg/mask-polygon.svg':
                return {width:335, height:320};
            case './../../assets/svg/mask-star-1.svg':
                return {width:325, height:310};
            case './../../assets/svg/mask-star-2.svg':
                return {width:320, height:320};
            case './../../assets/svg/mask-round-star.svg':
                return {width:335, height:335};
            default:
                return {width:300, height:300};
        }
    }
}