

export default class ShapeFactory
{
    static getCircle(x = 0, y = 0, radius = 1, color = 0xFF3300, alpha = 1)
    {
        const g = new PIXI.Graphics();
        g.beginFill(color, alpha);
        g.drawCircle(x, y, radius);
        g.endFill();
        return g;
    }

    static getRectangle(x = 0, y = 0, size = 1, color = 0xFF3300, alpha = 1)
    {
        const g = new PIXI.Graphics();
        g.beginFill(color, alpha);
        g.drawRect(x, y, size, size);
        g.endFill();
        return g;
    }
}