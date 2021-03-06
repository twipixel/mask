import Calc from './../utils/Calculator';


export default class Painter
{
    static drawPoint(graphics, point, isClear = true, radius = 1, color = 0xFF3300, alpha = 0.7)
    {
        if (isClear === true) {
            graphics.clear();
        }

        graphics.beginFill(color, alpha);
        graphics.drawCircle(point.x, point.y, radius);
        graphics.endFill();
    }


    static drawRectByBounds(graphics, bounds, isClear = true, thickness = 1, color = 0xFF3300, alpha = 0.7)
    {
        if (isClear === true) {
            graphics.clear();
        }

        graphics.lineStyle(thickness, color, alpha);
        graphics.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
        graphics.endFill();
    };


    static drawRectByPoints(graphics, rect, isClear = true, thickness = 1, color = 0xFF3300, alpha = 0.7)
    {
        if (isClear === true) {
            graphics.clear();
        }

        graphics.lineStyle(thickness, color, alpha)
        graphics.moveTo(rect.lt.x, rect.lt.y);
        graphics.lineTo(rect.rt.x, rect.rt.y);
        graphics.lineTo(rect.rb.x, rect.rb.y);
        graphics.lineTo(rect.lb.x, rect.lb.y);
        graphics.lineTo(rect.lt.x, rect.lt.y);
    }


    static drawPointsByPoints(graphics, rect, isClear = true, radius = 1, color = 0xFF3300, alpha = 0.7)
    {
        if (isClear === true) {
            graphics.clear();
        }

        graphics.beginFill(color, alpha);
        graphics.drawCircle(rect.lt.x, rect.lt.y, radius);
        graphics.drawCircle(rect.rt.x, rect.rt.y, radius);
        graphics.drawCircle(rect.rb.x, rect.rb.y, radius);
        graphics.drawCircle(rect.lb.x, rect.lb.y, radius);
        graphics.endFill();
    };
}