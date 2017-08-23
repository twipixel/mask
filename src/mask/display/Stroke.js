import {request} from './../utils/async';
import {parseXML} from './../utils/string';


export default class Stroke extends PIXI.Container
{
    constructor(url, thickness = 1, color = '#EEEEEE', opacity = 1, width = 100, height = 100)
    {
        super();

        this.url = url;
        this._thickness = thickness;
        this._color = color;
        this._opacity = opacity;
        this.drawWidth = width;
        this.drawHeight = height;

        this.initialize();
    }


    initialize()
    {

    }

}