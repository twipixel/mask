export default class Painter
{
    static drawPoint(graphics, point, radius = 0.5, isClear = true, color = 0xFF3300, alpha = 0.7)
    {
        if (isClear === true) {
            graphics.clear();
        }

        graphics.beginFill(color, alpha);
        graphics.drawCircle(point.x, point.y, radius);
        graphics.endFill();
    }


    static drawBounds(graphics, bounds, isClear = true, thickness = 1, color = 0xFF3300, alpha = 0.7)
    {
        if (isClear === true) {
            graphics.clear();
        }

        graphics.lineStyle(thickness, color, alpha);
        graphics.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
        graphics.endFill();
    };


    static drawBoundsPoints(graphics, bounds, radius = 0.5, isClear = true, color = 0xFF3300, alpha = 0.7)
    {
        if (isClear === true) {
            graphics.clear();
        }

        graphics.beginFill(color, alpha);
        graphics.drawCircle(bounds.lt.x, bounds.lt.y, radius);
        graphics.drawCircle(bounds.rt.x, bounds.rt.y, radius);
        graphics.drawCircle(bounds.rb.x, bounds.rb.y, radius);
        graphics.drawCircle(bounds.lb.x, bounds.lb.y, radius);
        graphics.endFill();
    };
}