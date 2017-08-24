import {request} from './../utils/async';
import {parseXML} from './../utils/string';


const svgId = '#npe-mask-core';


export default class Stroke extends PIXI.Container
{
    constructor(url, thickness = 0, color = '#EEEEEE', opacity = 1, width = 1000, height = 1000)
    {
        super();

        this.url = url;
        this._thickness = thickness;
        this._color = color;
        this._opacity = opacity;
        this._drawWidth = width;
        this._drawHeight = height;

        this.initialize();
    }


    initialize()
    {
        const svgContainer = this.svgContainer = document.createElement('div');
        document.body.appendChild(svgContainer);

        // 도형을 그리는 캔버스 (스트로코 캔버스 마스킹용)
        this.maskContext = this.createCanvas('maskCanvas');

        // 스트로크를 그리는 캔버스
        this.strokeContext = this.createCanvas('strokeCanvas');

        // 최종 결과 캔버스
        this.resultContext = this.createCanvas('resultCanvas');

        // 스트로크 텍스쳐 Sprite
        this.strokeSprite = new PIXI.Sprite(new PIXI.Texture.fromCanvas(this.resultContext.canvas));

        if (this.url) {
            this.load(this.url, this.thickness, this.color, this.opacity, this.drawWidth, this.drawHeight);
        }

        // DEBUG CODE
        //this.graphics = new PIXI.Graphics();
        //this.graphics.beginFill(0xFF3300, 0);
        //this.graphics.lineStyle(1, 0xFF3300, 1);
        //this.graphics.drawRect(0, 0, this.drawWidth, this.drawHeight);
        //this.graphics.endFill();
        //this.addChild(this.graphics);
    }


    load(url, thickness = 0, color = '#EEEEEE', opacity = 1, width = 1000, height = 1000)
    {
        if (this.svgElement) {
            this.svgContainer.removeChild(this.svgElement);
        }

        if (url) {
            request(url)
                .then(responseText => {
                    this.svgElement = parseXML(responseText).documentElement;
                    this.svgContainer.appendChild(this.svgElement);
                    this.svg = document.querySelector(svgId);
                    this.update(thickness, color, opacity, width, height);
                    this.addChild(this.strokeSprite);
                })
                .catch(e => {
                    console.warn('error', e);
                });
        }
    }


    clear()
    {
        this.resultContext.clearRect(0, 0, this.resultContext.canvas.width, this.resultContext.canvas.height);
        this.maskContext.clearRect(0, 0, this.maskContext.canvas.width, this.maskContext.canvas.height);
        this.strokeContext.clearRect(0, 0, this.strokeContext.canvas.width, this.strokeContext.canvas.height);
    }


    /**
     * width, height 를 조절하면 clear 효과도 있습니다.
     * @param width
     * @param height
     */
    resizeCanvas(width, height)
    {
        this.maskContext.canvas.width = width;
        this.maskContext.canvas.height = height;
        this.strokeContext.canvas.width = width;
        this.strokeContext.canvas.height = height;
        this.resultContext.canvas.width = width;
        this.resultContext.canvas.height = height;
    }


    textureUpdate()
    {
        //this.clear();
        this.resizeCanvas(this.drawWidth, this.drawHeight);

        // 배경색 보이게 해서 도형 그리기
        this.fillOpacity = 1;
        this.maskContext.drawSvg(this.svgContainer.innerHTML, 0, 0, this.drawWidth, this.drawHeight);

        // 배경색으로 투명하게 만들어서 스트로크만 보이도록 처리
        this.fillOpacity = 0;

        if (this.thickness !== 0) {
            this.stroke = this.color;
            this.strokeWidth = this.thickness;
            this.strokeOpacity = this.opacity;
        }

        this.strokeContext.drawSvg(this.svgContainer.innerHTML, 0, 0, this.drawWidth, this.drawHeight);
        this.resultContext.drawImage(this.strokeContext.canvas, 0, 0);
        this.resultContext.globalCompositeOperation = 'destination-in';
        this.resultContext.drawImage(this.maskContext.canvas, 0, 0);
    }


    createCanvas(id = '', width = 1000, height = 1000, imageSmoothingEnabled = true)
    {
        const canvas = document.createElement('canvas');
        canvas.id = id;
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');

        // 이미지 smoothed 설정
        context.imageSmoothingEnabled = imageSmoothingEnabled;
        context.oImageSmoothingEnabled = imageSmoothingEnabled;
        context.msImageSmoothingEnabled = imageSmoothingEnabled;
        context.mozImageSmoothingEnabled = imageSmoothingEnabled;
        context.webkitImageSmoothingEnabled = imageSmoothingEnabled;

        // IE에서 웹폰트 안보이는 문제 때문에 body에 추가함.
        //canvas.style.display = "none";
        document.body.appendChild(canvas);

        // DEBUG CODE
        //canvas.style.top = (Math.random() * 600) + 'px';
        //canvas.style.left = (Math.random() * 600) + 'px';
        //canvas.style.top = 0 + 'px';
        //canvas.style.left = 325 + 'px';
        //canvas.style.opacity = 1;
        //canvas.style.border = 'thin solid #ecf0f1';
        //canvas.style.position = 'absolute';

        return context;
    }


    update(thickness = 0, color = '#EEEEEE', opacity = 1, width = 1000, height = 1000)
    {
        this._thickness = thickness;
        this._color = color;
        this._opacity = opacity;
        this._drawWidth = width;
        this._drawHeight = height;
        this.textureUpdate();
    }


    set thickness(value)
    {
        this._thickness = value;
        this.textureUpdate();
    }

    get thickness()
    {
        return this._thickness;
    }


    set color(value)
    {
        this._color = value;
        this.textureUpdate();
    }

    get color()
    {
        return this._color;
    }


    set opactiy(value)
    {
        this._opacity = value;
        this.textureUpdate();
    }

    get opacity()
    {
        return this._opacity;
    }


    set drawWidth(value)
    {
        this._drawWidth = value;
        this.textureUpdate();
    }

    get drawWidth()
    {
        return this._drawWidth;
    }


    set drawHeight(value)
    {
        this._drawHeight = value;
        this.textureUpdate();
    }

    get drawHeight()
    {
        return this._drawHeight;
    }



    /**
     * 배경색상
     * @param value
     */
    set fill(value)
    {
        if (this.svg) {
            this.svg.style.fill = value;
        }
    }


    get fill()
    {
        if (this.svg) {
            return this.svg.style.fill;
        }
        return null;
    }


    /**
     * 배경색 투명도
     * @param value 0 ~ 1
     */
    set fillOpacity(value)
    {
        if (this.svg) {
            this.svg.style['fill-opacity'] = value;
        }
        return null;
    }


    get fillOpacity()
    {
        if (this.svg) {
            return Number(this.svg.style['fill-opacity']);
        }
        return null;
    }


    /**
     * 스트로크 색상
     * @param value
     */
    set stroke(value)
    {
        if (this.svg) {
            this.svg.style.stroke = value;
        }
    }


    get stroke()
    {
        if (this.svg) {
            return this.svg.style;
        }
        return null;
    }


    /**
     * 두께 투명도
     * @param value
     */
    set strokeOpacity(value)
    {
        if (this.svg) {
            this.svg.style['stroke-opacity'] = value;
        }
    }


    get strokeOpacity()
    {
        if (this.svg) {
            return this.svg.style['stroke-opacity'];
        }
    }


    /**
     * 두께 넓이
     * @param value
     */
    set strokeWidth(value)
    {
        if (this.svg) {
            this.svg.style['stroke-width'] = value + 'px';
        }
    }


    get strokeWidth()
    {
        if (this.svg) {
            return this.svg.style['stroke-width'];
        }
        return null;
    }
}