import Mouse from './../utils/Mouse';
import Calc from './../utils/Calculator';
import ToolControlType from './ToolControlType';
import RotationControlType from './RotationControlType';


export default class ToolControl extends PIXI.Sprite
{
    static get DELETE() {return 'delete';}
    static get MOVE_START() {return 'moveStart';}
    static get MOVE() {return 'move';}
    static get MOVE_END() {return 'moveEnd';}
    static get ROTATE_START() {return 'rotateStart';}
    static get ROTATE() {return 'rotate';}
    static get ROTATE_END() {return 'rotateEnd';}
    static get CHANGE_ROTATION_CURSOR() {return 'changeRotationCursor';}


    constructor(type, options = {}, rotationControlType = RotationControlType.NONE)
    {
        super();
        this.type = type;
        this.options = options;
        this.photoEditor = options.photoEditor;
        this.rotationControlType = rotationControlType;
        this.rotationCursorList = options.rotationCursorList;

        this.initialize();
        this.render();
        this.addCursorEvent();
        this.addMouseDownEvent();
    }


    initialize()
    {
        this.currentRadian = 0;
        this.currentRotation = 0;
        this.drawAlpha = 0.0;
        this.buttonMode = true;
        this.interactive = true;
        this.defaultCursor = 'inherit';
        this._isMouseDown = false;
        this.hasMouseMoveEvent = false;
        this._localPoint = new PIXI.Point();
        this.g = this.graphics = new PIXI.Graphics();
        this.addChild(this.graphics);

        this.ticker = PIXI.ticker.shared;
    }


    render()
    {
        switch (this.type) {
            case ToolControlType.TOP_LEFT:
            case ToolControlType.TOP_CENTER:
            case ToolControlType.TOP_RIGHT:
            case ToolControlType.MIDDLE_LEFT:
            case ToolControlType.MIDDLE_RIGHT:
            case ToolControlType.BOTTOM_LEFT:
            case ToolControlType.BOTTOM_CENTER:
            case ToolControlType.BOTTOM_RIGHT:
                this.drawControl();
                break;
            case ToolControlType.MIDDLE_CENTER:
                this.drawControl();
                break;
            case ToolControlType.ROTATION:
                this.drawRotation();
                break;
            case ToolControlType.DELETE:
                this.drawDeleteButton();
                break;
        }
    }


    drawControl()
    {
        const innerRectSize = 3;
        const innerRectHalf = innerRectSize / 2;
        const outerRectSize = 5;
        const outerRectHalf = outerRectSize / 2;
        const buttonRectSize = 10;
        const buttonRectHalf = buttonRectSize / 2;

        this.g.clear();
        this.g.beginFill(0xFF33FF, this.drawAlpha);
        this.g.drawRect(-buttonRectHalf, -buttonRectHalf, buttonRectSize, buttonRectSize);
        this.g.beginFill(0xFFFFFF, 1);
        //this.g.beginFill(0xFFFFFF, 0);
        this.g.drawRect(-outerRectHalf, -outerRectHalf, outerRectSize, outerRectSize);
        this.g.beginFill(0x000000, 1);
        //this.g.beginFill(0x000000, 0);
        this.g.drawRect(-innerRectHalf, -innerRectHalf, innerRectSize, innerRectSize);
        this.g.endFill();
    }


    /**
     * target.scale.x 와 y 를 곱해서 반전 적용하는 이유는
     * 반전 적용하지 않아도 화면에는 영역이 정상적으로 그려지나
     * 마우스 다운이 발생하지 않습니다. (mousedown 이벤트가 발생하지 않습니다.)
     *
     * 문제 시점은
     * 자르기에서 반전 후 스티커를 추가하면 스티커는 반전된 상태에서 추가됩니다.
     * 반전된 스티커를 더블 클릭하면 더 이상 선택이 불가능합니다.
     *
     * 이유는
     * mousedown 이 발생한 스티커는
     * TransformTool.setTarget 에 의해
     * 변형툴(TransformTool)이 스티커 위에 그려지게 됩니다.
     * 그리고 다시 mousedown 을 하면 (더블클릭)
     * 스티커 위에 있는 가운데 영역 (ToolControlType.MIDDLE_CENTER)이 먼저 mousedown 을 받게 됩니다.
     *
     * 가운데 영역에서 mousedown 이 먼저 발생하게 되면
     * e.stopPropagation()으로 스티커에 전달되는 mousedown 전파를 막아 releaseTarget이 되지 않도록 합니다.
     *
     * 하지만 가운데 영역을 그릴 때 (drawRect) 반전을 적용하지 않으면
     * 가운데 영역은 mousedown 이 발생하지 스티커가 mousedown 을 받게 되고
     * releaseTarget 을 호출되어 더 이상 선택되지 않습니다.
     *
     * @param rotation
     * @param width
     * @param height
     */
    drawCenter(rotation, width, height)
    {
        this.rotation = rotation;
        this.g.clear();
        this.g.beginFill(0xFF33FF, this.drawAlpha);
        this.g.drawRect(-(width / 2), -(height / 2), width, height);
        this.g.endFill();
    }


    drawRotation()
    {
        const buttonRectSize = 22;
        const buttonRectHalf = buttonRectSize / 2;
        this.g.clear();
        this.g.beginFill(0xFF3300, this.drawAlpha);
        this.g.drawRect(-buttonRectHalf, -buttonRectHalf, buttonRectSize, buttonRectSize);
        this.g.endFill();
    }


    drawDeleteButton()
    {
        this.deleteTexture = PIXI.Texture.fromImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAYAAACN1PRVAAAB2UlEQVRIie2VTUsqYRTHj2M4MhHUIKLDCC58QxHdulHEnWsXfYco0kUUVHKDXqgJLtw2fYC+haDixpUgA8KIgsj4Hm1qTCf03EW3W9xL40yCtPC/eRbnPOd3Dvyf8+gA4AYWpJU/5/0CWCZiAZC/WsKWsK/DotEoPZlMjg0Gg25WIURMzwXLZrMPLpfrajQaHVutVoMSiCTJk7lgAAD1ev05Fov9arVaB6FQaP1jLBKJ0IiYttlsF7Is49wwgNcJE4nEbaFQ2Ha73dQbKJfLbdM0fSqK4lhNHR287kZV64plWbLZbO47nc7LWq22ZzabzwaDwYuauwBgWpmd8y5RFMcEQfxAxHQymbzTAAIAjdYPh8MbiJj2+/3XHMdtqnGpZpjRaCTsdrsxn8/v+Hw+rlKpPAWDwZ/D4fDQ4/GsEoS6nvUAEAeAoVJSPB43F4vFXYvFct5oNEaICP1+X65Wq7VMJrPF83xVEIQnREVDUjMNQlEUIUnSEcMw551OR/43HggE1kqlUtLr9XKCICg1rfyfsSxLSpJ05HA4Lnu93n8gAIByufyo1+tPeJ7fTaVSTqV6mqyvJIZhyG63O55Op5+laLO+ktrt9syH/X22/hL2LWFvbjQtAvYb9NC0/9Sr3AYAAAAASUVORK5CYII=');
        this.deleteOverTexture = PIXI.Texture.fromImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAYAAACN1PRVAAABCElEQVRIie3UvWrDMBDA8VNtD8EfIojYwlPA0Rrw4HcIef9XyRAh9O/SlgaaWC4htGDBLcdJP4HupEQEedF6exW0Yiv2jzDnnIQQJMuy2YMgbVx5FMYYYozUdX23BiDLsofnfMRsAc45Yozs9/ub/OFwAEBrnQKlYSLCOI5479ntdjfQZrNJhdIxEUFrTYwRYwwAZVkugZZh39/odDot3rcIG4YBAGst1+s1tSmWYXmes91uAei6DqUU1lq897Rti1LqedjxeASgqqqb/DRNeO8ZxzEVfFxQFAXA3Tnr+54QwleX/hrTWgNgjJm9+eVy4Xw+P78bf4qmaWYvpD7FV6y/8+uv2Iq9A1yTczX16ka0AAAAAElFTkSuQmCC');
        this.texture = this.deleteTexture;
    }


    hideAllRotationCursor()
    {
        if (this.type !== ToolControlType.ROTATION) {
            return;
        }

        const n = this.rotationCursorList.length;

        for (var i = 0; i < n; i++) {
            this.rotationCursorList[i].visible = false;
        }
    }


    /**
     * 포토에디터에서 사용한다면
     * 회전에 자르기 반전 방향을 적용합니다.
     * @param rotation
     * @returns {*}
     */
    getFlipRotation(rotation)
    {
        if (this.photoEditor) {
            const scaleX = this.photoEditor.croppedScaleX;
            const scaleY = this.photoEditor.croppedScaleY;

            if (scaleX == -1 && scaleY == 1) {
                rotation *= -1;
            }
            else if (scaleX == 1 && scaleY == -1) {
                rotation *= -1;
            }
        }
        return rotation;
    }


    addCursorEvent()
    {
        this.mouseover = this.onMouseOver.bind(this);
        this.mouseout = this.onMouseOut.bind(this);
        this.mousemove = this.onMouseOverMove.bind(this);
    };


    addMouseDownEvent()
    {
        this._mouseDownListener = this.onMouseDown.bind(this);
        this.on('mousedown', this._mouseDownListener);
    };


    removeMouseDownEvent()
    {
        this.off('mousedown', this._mouseDownListener);
    };


    addMouseMoveEvent()
    {
        if (this.hasMouseMoveEvent === true) {
            return;
        }

        this.hasMouseMoveEvent = true;
        this._mouseMoveListener = this.onMouseMove.bind(this);
        this._mouseUpListener = this.onMouseUp.bind(this);
        this.ticker.add(this._mouseMoveListener);
    };


    removeMouseMoveEvent()
    {
        this.hasMouseMoveEvent = false;
        this.ticker.remove(this._mouseMoveListener);
        window.document.removeEventListener('mouseup', this._mouseUpListener);
    };


    /**
     * MaskMain 에서 실제 'mousedown' 이벤트가 아닌 가짜로 'mousedown'을 emit 합니다.
     * MaskMain -> onMaskDown or onBackgroundImageMouseDown -> transformTool.setTarget -> c.mc.emit('mousedown');
     * @param event
     */
    onMouseDown(event)
    {
        event.stopPropagation();

        this._isMouseDown = true;

        const globalPoint = Mouse.global;

        this.mouseDownPoint = globalPoint.clone();
        this.prevMousePoint = this.currentMousePoint = globalPoint;
        this.targetPrevMousePoint = this.targetCurrentMousePoint = this.targetLayer.toLocal(globalPoint);

        if (this.type === ToolControlType.ROTATION) {
            this.prevRotation = this.currentRotation = Calc.getRotation(this.centerPoint.globalPoint, globalPoint);
            this.prevRotation = this.currentRotation = this.getFlipRotation(this.currentRotation);
            this.currentRadian = Calc.toRadians(this.currentRotation);

            this.emit(ToolControl.ROTATE_START, {
                target: this,
                type: this.type,
                currentRadian: this.currentRadian,
                currentRotation: this.currentRotation,
                currentMousePoint: this.currentMousePoint
            });

        } else {
            this.emit(ToolControl.MOVE_START, {
                target: this,
                type: this.type,
                currentMousePoint: this.currentMousePoint,
                targetCurrentMousePoint: this.targetCurrentMousePoint
            });
        }

        this.addMouseMoveEvent();
        window.document.addEventListener('mouseup', this._mouseUpListener);
        this.prevMousePoint = this.targetPrevMousePoint = null;
    };


    onMouseMove(event)
    {
        const globalPoint = Mouse.global;
        this.currentMousePoint = globalPoint;
        this.targetCurrentMousePoint = this.targetLayer.toLocal(globalPoint);

        this.prevMousePoint = this.prevMousePoint || this.currentMousePoint;
        this.targetPrevMousePoint = this.targetPrevMousePoint || this.targetCurrentMousePoint;

        this.changeMovement = {
            x: this.currentMousePoint.x - this.prevMousePoint.x,
            y: this.currentMousePoint.y - this.prevMousePoint.y
        };

        this.targetChangeMovement = {
            x: this.targetCurrentMousePoint.x - this.targetPrevMousePoint.x,
            y: this.targetCurrentMousePoint.y - this.targetPrevMousePoint.y
        };

        this.moveRotationCursor();

        if (this.type === ToolControlType.ROTATION) {
            this.currentRotation = Calc.getRotation(this.centerPoint.globalPoint, globalPoint);
            this.currentRotation = this.getFlipRotation(this.currentRotation);
            this.changeRotation = this.currentRotation - this.prevRotation;
            this.absChangeRotation = (this.changeRotation < 0) ? this.changeRotation * -1 : this.changeRotation;

            if (this.absChangeRotation < 100) {
                this.emit(ToolControl.ROTATE, {
                    prevRotation: this.prevRotation,
                    changeRotation: this.changeRotation,
                    currentRotation: this.currentRotation,
                    currentRadian: Calc.toRadians(this.currentRotation),
                    changeRadian: Calc.toRadians(this.changeRotation)
                });
            }

            this.emit(ToolControl.CHANGE_ROTATION_CURSOR, this.getRotationCursor());
        } else {
            this.emit(ToolControl.MOVE, {
                target: this,
                type: this.type,
                prevMousePoint: this.prevMousePoint,
                changeMovement: this.changeMovement,
                currentMousePoint: this.currentMousePoint,
                targetPrevMousePoint: this.targetPrevMousePoint,
                targetChangeMovement: this.targetChangeMovement,
                targetCurrentMousePoint: this.targetCurrentMousePoint
            });
        }

        this.prevRotation = this.currentRotation;
        this.prevMousePoint = this.currentMousePoint;
        this.targetPrevMousePoint = this.targetCurrentMousePoint;
    };


    onMouseUp(event)
    {
        this._isMouseDown = false;

        const globalPoint = Mouse.global;
        const modified = this.currentMousePoint.x != this.mouseDownPoint.x &&
            this.currentMousePoint.y != this.mouseDownPoint.y;

        this.currentMousePoint = globalPoint;
        this.targetCurrentMousePoint = this.targetLayer.toLocal(globalPoint);

        this.prevMousePoint = this.prevMousePoint || this.currentMousePoint;
        this.targetPrevMousePoint = this.targetPrevMousePoint || this.targetCurrentMousePoint;

        this.changeMovement = {
            x: this.currentMousePoint.x - this.prevMousePoint.x,
            y: this.currentMousePoint.y - this.prevMousePoint.y
        };

        this.targetChangeMovement = {
            x: this.targetCurrentMousePoint.x - this.targetPrevMousePoint.x,
            y: this.targetCurrentMousePoint.y - this.targetPrevMousePoint.y
        };

        this.moveRotationCursor();

        if (this.type === ToolControlType.ROTATION) {

            this.currentRotation = Calc.getRotation(this.centerPoint.globalPoint, Mouse.global);
            this.currentRotation = this.getFlipRotation(this.currentRotation);

            this.changeRotation = this.currentRotation - this.prevRotation;
            this.absChangeRotation = (this.changeRotation < 0) ? this.changeRotation * -1 : this.changeRotation;

            if (this.absChangeRotation < 100) {
                this.emit(ToolControl.ROTATE_END, {
                    target: this,
                    type: this.type,
                    modified: modified,
                    prevRotation: this.prevRotation,
                    changeRotation: this.changeRotation,
                    currentRotation: this.currentRotation,
                    currentRadian: Calc.toRadians(this.currentRotation),
                    changeRadian: Calc.toRadians(this.changeRotation)
                });
            }
        } else {
            this.emit(ToolControl.MOVE_END, {
                target: this,
                type: this.type,
                modified: modified,
                prevMousePoint: this.prevMousePoint,
                changeMovement: this.changeMovement,
                currentMousePoint: this.currentMousePoint,
                targetPrevMousePoint: this.targetPrevMousePoint,
                targetChangeMovement: this.targetChangeMovement,
                targetCurrentMousePoint: this.targetCurrentMousePoint,
            });
        }

        this.removeMouseMoveEvent();
    };


    onMouseOver() {
        this.defaultCursor = this.getCursor();

        if (this.type === ToolControlType.DELETE) {
            this.texture = this.deleteOverTexture;
        }

        if (this.type === ToolControlType.ROTATION) {
            this.rotationCursor = this.rotationCursorList[this.cursorIndex];
            this.moveRotationCursor();
            this.rotationCursor.visible = true;
        }
    }


    onMouseOut() {
        if (this.type === ToolControlType.DELETE) {
            this.texture = this.deleteTexture;
        }

        if (Mouse.defaultCursor !== 'none') {
            this.rotationCursor = null;
            this.hideAllRotationCursor();
        }
    }


    onMouseOverMove() {
        if (this.type === ToolControlType.ROTATION) {
            this.moveRotationCursor();
        }
    }


    moveRotationCursor() {
        if (!this.rotationCursor || this.rotationCursor === null) {
            return;
        }

        const cursor = this.rotationCursorList[this.cursorIndex];

        if (this.rotationCursor !== cursor) {
            this.rotationCursor.visible = false;
            this.rotationCursor = cursor;
            this.rotationCursor.visible = true;
        }

        this.rotationCursor.x = Mouse.globalX;
        this.rotationCursor.y = Mouse.globalY;
    }


    set target(value) {
        this._target = value;
    }

    get target() {
        return this._target;
    }


    set transform(value) {
        this._transform = value;
    }

    get transform() {
        return this._transform;
    }


    set localPoint(value) {
        this._localPoint = value;
    }

    get localPoint() {
        return this._localPoint;
    }


    get globalPoint() {
        return this.transform.apply(this._localPoint);
    }


    set centerPoint(value) {
        this._centerPoint = value;
    }

    get centerPoint() {
        return this._centerPoint;
    }


    /**
     * global rotation 을 반환합니다. (단위 degress)
     * @returns {*}
     */
    get angle() {
        const matrix = this.target.worldTransform.clone();
        var angle = Calc.getSkewX(matrix);
        angle = (angle < 0) ? angle + 360 : angle;
        return angle;
    }


    /**
     * getFlipCursor 으로 자르기의 반전 상태를 적용합니다.
     * @returns {number}
     */
    get cursorIndex() {
        return (this.getAngleIndex() + this.getFlipCursor(this.getCursorIndex())) % 8;
    }


    set targetLayer(value) {
        this._targetLayer = value;
    }

    get targetLayer() {
        return this._targetLayer;
    }

    get isMouseDown() {
        return this._isMouseDown;
    }


    getAngleIndex() {
        const angle = this.angle;

        if (angle > 337.5 && angle <= 22.5) {
            return 0;
        } else if (angle > 22.5 && angle <= 67.5) {
            return 1;
        } else if (angle > 67.5 && angle <= 112.5) {
            return 2;
        } else if (angle > 112.5 && angle <= 157.5) {
            return 3;
        } else if (angle > 157.5 && angle <= 202.5) {
            return 4;
        } else if (angle > 202.5 && angle <= 247.5) {
            return 5;
        } else if (angle > 247.5 && angle <= 292.5) {
            return 6;
        } else if (angle > 292.5 && angle <= 337.5) {
            return 7;
        } else {
            return 0;
        }
    }


    getCursor() {
        switch (this.type) {
            case ToolControlType.TOP_LEFT:
            case ToolControlType.TOP_CENTER:
            case ToolControlType.TOP_RIGHT:
            case ToolControlType.MIDDLE_LEFT:
            case ToolControlType.MIDDLE_RIGHT:
            case ToolControlType.BOTTOM_LEFT:
            case ToolControlType.BOTTOM_CENTER:
            case ToolControlType.BOTTOM_RIGHT:
                return this.getScaleCursor();
            case ToolControlType.ROTATION:
                return this.getRotationCursor();
            case ToolControlType.DELETE:
                return 'pointer';
            case ToolControlType.MIDDLE_CENTER:
                return 'move';
        }
    }


    getScaleCursor() {
        switch (this.cursorIndex) {
            case 0: // 337.5-22.5, TOP_CENTER
                return 'ns-resize';
            case 1: // 22.5-67.5, TOP_RIGHT
                return 'nesw-resize';
            case 2: // 67.5-112.5, MIDDLE_RIGHT
                return 'ew-resize';
            case 3: // 112.5-157.5, BOTTOM_RIGHT
                return 'nwse-resize';
            case 4: // 157.5-202.5, BOTTOM_CENTER
                return 'ns-resize';
            case 5: // 202.5-247.5, BOTTOM_LEFT
                return 'nesw-resize';
            case 6: // 247.5-292.5, MIDDLE_LEFT
                return 'ew-resize';
            case 7: // 292.5-337.5, TOP_LEFT
                return 'nwse-resize';
        }
    }


    getRotationCursor() {
        return 'none';

        /*switch (this.cursorIndex) {
         case 0: // 337.5-22.5, TOP_CENTER
         return "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAOCAYAAAA8E3wEAAAAAXNSR0IArs4c6QAAAyRJREFUOBGNVF1IU2EY9pz9z9YkRdaPIfhHiV4V3Sy80S4jijLqwvDGO/Uq6KLLqBtpN+G9SndJmSBZlDYbNjeGLWSW2CQxt0E65+bmfk7Pc/I7HRdELzx7v/d7f7/3fc+kiv8jSWemPyu6e/1Zd334qHemhrJwFDryctCWRNtyiHvyv0gflEohC0PKMmDQcZFcJCpBVwQEF/e40uLxjqQwmAggJ5PJ85AZnDACZsAK2IBKwK5DuWyBjvb0EzEY8xxkfR41IQ3MhULBt7y8fBHnI8BR4FhLS8uJ2dnZqxsbG4/hPJnNZkPAJ2BxZ2dnKhaLPfH7/bc7OztP0x5wACymErpr+Xz+Gc4mgDnUDjI7q7JDGUqn03PT09OXqqurTwaDwTu7u7tvw+Hw68HBwZnW1tavJpMpB1vFaDTmUcxqb2/vnM/newW/D5FIZKC9vf0U9LVLS0s39/b2/Llc7jlkdog5JDEjCpb9/X1vV1eXPDExkYbhWiKRqO3p6XEFAoEzkiQpCPYFSLhcrlw8HjejG1ULCwtni8Wiob6+/vvo6Gikra0tH41G39TV1V3v6+uTR0ZG4na7/Rbis9ACoPaXvXciySK40tHR8dnj8bwzGAwFh8ORHBoamkqlUu/R8nHYPALuAQ8hP81kMnNjY2OTNTU1Cfr29/d7Nzc3PzY1Na01NzdH0aFJ3LPNbKvWUias4mzAxZYpbrc7vLW15UWyBysrK43QcQ4cgQa85jiS3gW83d3d8/Q3m81q23UJuQ9qQjqSmKTEtqnSwY/NZitYLJYKVPyysbExSpsyKGhlDC3zYF7jw8PDRXQkhdHwASTlICb9tNh8prY0BwrtlZhpAAFmtre3ud5qS8D1JGNhrmBjZxoaGr5Bofnihavo2gvccWnULWUAgi81YPjzoVDoh6IoamBWhzmWEKgSlbPqAdwFwTWC7WUI97FEP9fX1/P0Ff7wkeCbxWbfgA3/HNTAomoZs3KjIhmJ1TskU6xWawmfAD8DIqNPiMCs+gKWxwBIhN4f4yjJspx2Op0sUn25SFbOoT9ENCYJ/lv68/svf72P8gunF5KUe/EFxQAAAABJRU5ErkJggg==') 14 7, auto";
         case 1: // 22.5-67.5, TOP_RIGHT
         return "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1Rjc3NTE3RDZEQTcxMUU2OTkwNzk1ODBGOTZCN0JBOSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1Rjc3NTE3RTZEQTcxMUU2OTkwNzk1ODBGOTZCN0JBOSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjVGNzc1MTdCNkRBNzExRTY5OTA3OTU4MEY5NkI3QkE5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjVGNzc1MTdDNkRBNzExRTY5OTA3OTU4MEY5NkI3QkE5Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+bXt2owAAA1tJREFUeNqsVt1LWmEY99XjR7ZNZ8yGC0YrG2ODddXNBjXGrlpjH25rhKj76Cbovqv9A4PddN9N7kLYYNiFoMyltmBusUqIIHJCzTJD0yzNr/1e9xrH0wfH2gsPnvfjPL/3eZ7f7zkSycFBJIePsuSEQ3oIAGHr0kKh8Ix3hkj+w6g652DKTCbzulQq+fEsh8lOAyIVRECdyTc2Nmy5XM5cLBbpvoKtS5mRegGlghTJV1dXX+bz+RddXV2XkS66pmJA1YhkvHdIvZHI1tfXLYSQp52dndfw3IR0Kbxe752RkRED9ht4gJwATFQtuGQyORiNRr16vT5GmaRQKHJjY2OeQCDgTqVS37HvmJ2d7W9vb7+A/XMMVM7LxvEgqMFV5P9nT0/PL0bVGuM4Lt/b2/tjfn6eAjodDsdtrJ+HNYoFqqQqHo8/3tra8uGmv6ljjUaTDIfDkx6Px2Wz2fxqtXqbrpvN5m+IanpmZsaMeZNYoP2iI12mRCLhp0BarTYBhk0vLS09B51H0+m0b3h4+AsFovubm5tTDEgHU7M6ETEaUaDgT2hEYFcILPOz3Csikcj1vb09u9vtnkC9shQI56bHx8dvYV9DtSVGT/sRIe8Pd3d3fWDXJLthRSNOp1MNoPcul2uCRmS1WgM4+7m1tbWZpY0TRQLmUJbNZh+Uy2WvQEuEAX0YGhqie+VQKOQJBoP9eNayaKRiKV0xgNwVaKFyibW1tRuIwKdSqTJ9fX1BSm9GgobTtqAaNiLSUYvF4qP0pjoCKYxYPyNgGpGIDe2QzwAB4yYHBgbSaD0c9JM0mUw3GQDH63WVs5xY70gdvaWJNk2wjsD5pY6ODtpiJKA5uYeB34vQUwFWVCqVJUjgE6SQFA2CnrYNoLhMJnuLQkfn5uY40L0Smd1u1+/s7EgxrhiNxkJ3d3cz2PkOAKnqDY81IRZlHYT5ta2tLSxsPy0tLX9isZh/ZWXFyprpPxLUC0JfRFd4RAULoEgVwGAwRMG6qcXFxTeYn2XdWnpSkIpgaWeotiAaAeaBhYWFQaYXVQ2V6wSpaUG019GI0MV9y8vLr1h7UfG6RAWEHOGIX/DjBEtTdx8+GnU63UfMi8z4tToxiETwCSZCx/y/UNwplF8+4v/YgVv/FWAAZA0E5twGSyUAAAAASUVORK5CYII=') 12.5 12.5, auto";
         case 2: // 67.5-112.5, MIDDLE_RIGHT
         return "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAcCAYAAABRVo5BAAAAAXNSR0IArs4c6QAAAztJREFUOBF9VN9rUnEU915NS5BV2JRqa7CYkOAeEgqmSTF7jC2IPfU22Nvajzehl6CHHmR/xN6FbCP6icsZgYrDLXFzNFcgONlQNyf+urfP+d77vdwN6sC53+/3nPM53/PrewWDQoK60qLf01mmj0ra3gQBNxTVPZ25jOwlMAE4iK0EJCKQEUxnYjoT9VTuqisHMyPh+PjYZ7ValyRJEsCiLMsCiD6cm41GY76vry9J3kDMgVipVB6mUqlVVUBCxoFAIAvA+vb2th+yC2AeibLp9XoC3QKFRgD9jEajjUQi8crlcm1oCnXDczwvN0xOTlZarVZ5YmJiC0p9wWgvs6uNRiPLhdDBYHDD5/NtLS4u+pFCfzwefwwxXUDFOxOViOIEMpnMO4BSp6en8aOjo3WbzVbzer25k5OTLwj1OkA28Jk8hWaz+aBer39tt9uxQqFwH45eh8Ph9zCUNzc3P62trT3F/gr4Ili7Weh0On4UZ71arXqhMO3u7t4G+BvaIc3NzcVKpdIS5NfAVtKDlZABukusCkho7Ha7kdHR0bzb7S7UarUVyBxgHq7AigPPaWIotB6iRQWPx1PZ2dkZtFgsN6AjhxprDYXwPNWcTmcLaZih4HkpIULwP6Dt4ODAbDKZaE7ZiOlWBYj8yCMnFg56ewujdnl4ePgPql2CUv9KlAGA8B7AT7BSBEKxWOyH8WAymbwzNjZWQrt+qUAOVgxRQbrxJQaawCa73f48EolUUSDj9PR0Y39//zvk/InxsA1sAMrl8gcMQezw8HCepgfgytDQ0G84S4yPjw8CSK2gQml1YSOXTqdXkM8exi0xNTX1AwYyJuZjPp9/gf1V8CUwry628KB/j5jROmTy7OxsHJO0il7exFl/G2sJu1b/HjFqNjS8HQqFzCjS52w22waQisILw3LU4oVCI7xDMx6yY2Bg4Fkul3sEhVYQbsQeMm6QEKIwMjKyBwXrI9pjmJmZEZeXlxdQuI7D4Xir6pgTZoQh9uJnFULIIjFASh6iKGEQJFEUe6j0G/ysUurtzICBIaCK8ZdOKZBnYuofjZ0+T/Vd6aYeBtwRtoy4A/2qAcmChafY/vNLYEZ/ARukibLGcoOhAAAAAElFTkSuQmCC') 7 14, auto";
         case 3: // 112.5-157.5, BOTTOM_RIGHT
         return "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAXNSR0IArs4c6QAAA71JREFUSA2lVUlPU1EYhU6UYi1qJIGwYlghsIGVkQ0JG8QRg4YgjVNMmhB/gQv+gAsXpCtcgFEjJgoaQouFUuwCIYHCCoSSME9lKnR+nvPoNWD7kMYvOX33ft+999xvuk1P+z9JV9guHderjk9SHJOAUK2vrxfjq+Y4rlMih/nsIh+O5dqNjY070Wh0dHt7+xnmGYAGEGQYHk3kQQo/wgPN8vLyTa1W+6K6ulp9eHj4YHV19RHO0QH0SqxL4eijpX88wIF3fT7fUFFRkRcmKScnZ21paWlwcXHRgnkmkOARdGcSkqh3d3dv7ezsOAUBdEy0IBpAjp5jztAJjzA8u6QHAoEbCI2zsrLSYzKZfMA2tks6nS5oNBr3SLy1tTXo9/ufQJ86iSRJ1YAjFosNhsPhoWAw6J6bmxskSXt7ux0Hj+ICbtiGscYViUQaYKP3KYnICeOdOTMz02C323sxllwul83hcNRjfAnIArSAXGX8SVUY/xgQzc3NvdbZ2Zml0WgiZWVlpr6+vgnog0A4vuZEU0KXXBCec39ZZG/m5+dL9vb2nAaDwV9bW/sTffIB6y4AekDkQjFUNMgAwXXAHJ/jc6Tv7u42hEKhzpaWlu/QSR6PxzY+Pn4fYyPAMCkeDptsZAjVrCIQjCB5bDBBrIoTvLLZbD3QS01NTT9Q0t2oqsuYGwDmS5GEBhJo0WS3EYoBt9v9BdXyOL5RvbKycgUevO3t7e1ByQZYrgiTu6ur6yrWnAfY7TwjKYkg0LGT2WiFhYVzVqv1G8hebm5u3sPhr3Fjp8ViceAQiQTQD4+NjTVhzlyILj+VQIu3qJ5PBQjmeVBra6vd6/XaUDVfm5ubnXq93k+92Wx24SLuOEFCyWJNgpBZzRDFnwqZADr5qRBflGm4rq5uZHJy0g6PPnd0dDBEF4ETPYF5gjBJlHQkOQshSUPCWR2y1NTUTDQ2Nq4hNFJpaWk2utg7PT39qby83IFOD2AR+4GIAuJSGCaK7AnUmbOzs4+RE1deXt4y5lJbW1s/Xlar0+msR7nyj4mhyQZ4+6T/HdAniPCEt4gWFBR8nJqa0iDWDysqKiSVShU7ODjwVFVV9cMubix3O+bcwzGFY0VhuQk36XKwpKTkPXLzBkS/iouLI+joCPQMDZ+LEHCcTOyF+t/CkJGQnvFZMC4sLJjxtzqGPniKOfOkWP+wnSrHw8WFdJ83jeXn57/b398PZWRksP6pT+nWWK8o9Eh4xUdODU/YaEKvuPE0Azcnk2T6U5Ob7BCh+w13D8jLwsORsAAAAABJRU5ErkJggg==') 12.5 12.5, auto";
         case 4: // 157.5-202.5, BOTTOM_CENTER
         return "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAOCAYAAAA8E3wEAAAAAXNSR0IArs4c6QAAAy1JREFUOBF9VE1IG1EQdpNs/jQNiAlW0h8UYkEIWCN4EQ/V3irFXgoFLd682PRorz3YS6iXHjwK4qktLRWkhlKtqWColcSSotEmXiS2KElM1MRkt9+87ixbKX3wMfPmzcw3M5mNVPfnSJokYdTZrGoKS7az5BiWbGfJcSo7kJTy+XyXoij15XLZRJ5ms1m12+2KxWJRNdRgXpMkiaQ4qqp2VatVJyARzs7OTLVaTeTleJfLFYWzQgEWQJBBmp1O55Pd3V378fGxqAiJVYLP55O9Xm8jfJ4ayXAXB8VMnp6eVhBbApkJRQhCiu3s7LwMpx7NVZDSoxlwoLq3fr//B3QiFGhra0sXCoWlUql0FzbROaTxSLlcLlipVJYGBga+4EGPJf38/HwD0glwc6JDujQg6TsQpsmRgFEUjo6OPh8eHj7G3QoQoagekg/dLalUqufk5GQFpESgk+LnieN+CZABE1dMQTwKkdBqtVYwWtfY2JjZ4XAMFYvFUDqd9sJP+JI/Y2dn53pzc/MdJK/DaKl4/Wjj/atQSkDsLiSdR4eZ9vb2TDabXRsfH1+BXW1qavo1Ozs7jw6iWIw5JJ4EJoBnuL9GYZ/C4fACJpLHolSnpqY+9vX1faNY+FCHbkBMiMgIVJUNCeeGh4e909PTyt7e3svW1tZb8XhcHhkZuZHJZK4gWa27uzuJgnLoqLy/v29PJBIewE+dBIPB7zMzM1mPx/PTZrNdGxwcrI9EIgqm1Yv8ZaAK6IQOVPMGI4klk8n7sHsDgYBve3v7EX7bVZz3o6OjUVoq6gLvqizL5Y6OjlQoFFra3NyMYEIf1tfXH2LbWxYXF28jLnphacRPSB3Slsp4fHVwcHAPer0GF2Rjf3//1Vgs9gBvL7CxC9jmOJAANvDtzqPT58vLy0PovIX8AVqShq2trV6MfBU6jZM4JB6pkPThu93ur3jgQxWRI42cfmfSeVmg6ttI3xd1zaA/BtrUOuS8iZz650JEdC5K4azZ6Y2JWIoCYef1JwIiZcnxMInDd/2vjR8uSmMhTMKSfZnUKOmNScifdb0zDv6fZHLyMep6MtiN+j9z/Qasm4fFL/kTlgAAAABJRU5ErkJggg==') 14 7, auto";
         case 5: // 202.5-247.5, BOTTOM_LEFT
         return "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAXNSR0IArs4c6QAAA6lJREFUSA2lVUlLW1EUNiZGY4zGxhoiIggqQqtLEVqo0KVYOqTowqYKHRFcdeOy/oFuCl260S5EkFYLYtLGTKTUKg3RhSixLpI4GzXikOH1+0KuxDHRHji8e84993xnuvfJss4n2Tlq6RxdRirFKSvhnF/BdC4AxPfUscvF7JRt4ZQ6gis3Nzfbtra2HmAtB4t9LK9GIhPhQADk+nw+YywWe65UKrOCwaDcYDB8heto0v21MiIIo80Da2dnZ1+vrKw4y8vLA1VVVX+RjQPyE+zlgBkI7a9EPMCDSrBmbm7u5fLysqusrCwIOdEPAm1vb9sB9gg6UTosM6fjLPx+f+fq6qqDGeB4AkB8q6urfbu7uxMHBwfs0ZUyoXEik3A43KpSqd7ZbLaV+fl5RTwezx4eHi4ZHx+v7+3t/a7X64/q6+ujjY2NBpx5L5PJRvHNiBKND4VChXK5XIVIP9XW1sorKioU+fn5deA4QLJMJpOk0+l+KhQKP4ZBgm2JJEkFAApnhAIjkQ1rzcaqwMV2u93ocrnGsZYA9G1jY+Mp1gxK2GOZGbHhYhzjWMfAHNPI0NCQp66uTovoowMDAxq1Wn0vxVacgerqxCiZEbPRoYyDLS0tk3l5eXs7Ozt2TN1t6FNHOJEVSncfepEhv2mJTnLB2snJybaZmRkL1lJXV5f16Ojo88jISD7kVIfZALEmp44BpgYB8XyiA9ZeXVlZqUcGXzo6OpyQpbGxsVEAfUgC0RmZk2jb39+3w/Yh5IwuLEEYEbMp6u/vv4OL6OaFxBNzYDabCTSwtLR0C/u8wKpIJOJoaGjw8sImXwbq02YksmFpbkxPTz/DdLkIBFnq7u7+gXG37+3tfVxYWGg9PDx0a7XaLfEE4a0zwi5tRgRhJDRUg3UAMmEQ3O3t7W7IEu5QuLOz02GxWMYWFxdtRUVFIerFE7S+vv4YMitCXxfSaaDiwcHBu6j7iNfrNTc3N//GeEdw+sTzQ7mpqekPLu3U2tpaDeRLQYieCsSxLkSkNz0eTxvHGz345XQ6zX19fRb06xD7Umlp6SrKNYH9V5DF5cXychJAPMCGsk8acHFPT0+N1Wo1ojdTGo1mlwCBQGACzX+LfQ5O2nLB5pgIlArGXvHfUwDWYXwT0wcAG17yLugYCINKO2GwOUOpYIySmakxwi78qm3owRvILGvayYJNRkRAAuXgMjpRshdYs0TXzgBnz5DISh6NRluxS0DymRLR8H/oovMnXul/F7SWjoEFkdEAAAAASUVORK5CYII=') 12.5 12.5, auto";
         case 6: // 247.5-292.5, MIDDLE_LEFT
         return "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAcCAYAAABRVo5BAAAAAXNSR0IArs4c6QAAAz9JREFUOBFtVN9LU3EU997b7nJrG+hkYWKGOEFBIhdIWFHMFx+iN4NASv+A8EXfetxTkD304rNo0INgVhhkybURbmuwcDCnDRNxOtT9cIr7cW+f83Xf23XswNn5nvP9fs4538/33Al1F0W46Nb0NIpeMmwRqFr5Nh3mSjHNCKQAAUUoxaWKTzEVWoaWKlavyCplMplei8UyoaqqVC6XRVhKUicIgiZJkkp6cnLiczgcQV6R2hAQ+LW3tzdjt9snhoeH1UgkcpWAENbm/Px8zOVyWeFTIV3IoUSWaDT65ODgwN/R0bEFn99NCwQCn5LJ5EPERNYKFkYRurq6lra3t98ripKUZblg3ORrDmR3RJB8saenR25ra/P6fL4CRLbZbDkCVO5KHehCQGKxHtqwvr7+Ynl5+QvW2tDQ0M/Dw8Mf7e3tiVAotJDL5e4jzguyhYyAzev1tubzeT8q/nU6nSmwqOC+Y9ls9juIWzw9Pb2Hc1SI/VC1y9CG1dXVp36/fxFrbXp6euH4+HgcaxnJHmuaFigWi3fh60Bik2huQta3IyMjK3izEqqtJBIJehJ2dwAfQe/AZ0JoE9QGdaGlz263+09fX1+kVCrNIMYnCEu0oWnks0wE5CqC/ubNzc3Wzs7ONKZni85WFAYHBYFG7z87FKMARABAwoTQ+2VZpMaPTiv2eOayyWQq7O7umhFz1MCwEJHCAcyenZ3t4I5XMKdNIMiNfX4Nut8tQqHdEK9IIOpdBe3xgYGBHQDdeDPnxsbGDcSldDrdC/sGhFlgBSOQvrlSPB5XRkdHi8guTE1N5XHX54h58Lm9wtQUAORc4Pg5SexJwGYzHv2rx+OJYkYzR0dHCk0PJioUDoc/VI8cZdFnFTP5bG1tbYmGoL+//zdaD2NfCwaDH1Op1INKIZhzAqhtmld7Y2Pjtf39/XeTk5Pf4OvkGb/HC/8A/NDs7Gy32Wy+Pjc3R9NUUzhQ34zFYjdbWlpeDg4OWvFpdesbWBi/R84QWQF/VretVutrMFpPrHIlgCiKKlQDUWMgTeFASkxruieRRJ2QZQMNy54Klv89qtVAVhkHeBIsmegEwaMk+mCz3SrfmJT2CcxF+wduL3Nt3V5HIgAAAABJRU5ErkJggg==') 7 14, auto";
         case 7: // 292.5-337.5, TOP_LEFT
         return "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAXNSR0IArs4c6QAAA5hJREFUSA2lVklMU1EUtb/fTlIpihgIG2TYOCxYsGFDYsIGMYoTCVaKGKNpQly4YeOCuHehG5Yk6IKEhaKGUBT6EZtQJRJgQUgaSJgqQylQZvo9p/aZ30mmm9z8++5775x777vv5etOHE90Sbar8T4p3nGIcYRgeXnZhj3EodInFOZfOQ4JESSj0Vi1trZ2D/ZJqEwfNIboqCQCRNra2tKbzebnU1NT1QA3QkkWQ3QYkn/AURA9vvL6+rrkdrv9BoOhfmxsjEQm+qFcH5GDkGjBCcxIDVBGbQKJPD4+LhcXF+enp6c7RkdHWTrOcW1k734kgiASdXSzGV9LQ0NDtqIoVy0Wy+VwOCyhXNkgupCZmWn3+Xy3NSQwUwsJGAQjt0DT8/Lyznu93mp0VNvKyspAf39/V0tLi6u8vHwI82xdNTc3d2Z+fl5ZWlq6j3FM2TCOES3BKcycaW1tLQXw+5GRke7KykqvLMs78EeAtd+CgoKJYDCoBAKBm/CLksGMlXiCs4ODg3Zs9Dgcjm9YqppMplBtba3S1dX1aWJiwtXU1NRNPwkA3jc7O8tyabsslgEjkjBN1j4DBA8WFxf7CYCx6nQ6e5CRsr29/Rr+O6urqy+am5s/FxYW+piB3++/hXVsDJaaWAkisuCi0+3t7aWov4cEaNHNzs7OjwB/Nzc3dwnzkWbY2Nio93g8H0DWGy3RfzMgo8jCAuBziLjDbrd/h191uVwkeNXR0cEmEFHqdnd3H6qq6t3c3LwOP4nFHMzkQhJGYh0aGqoeHh52wVbRrl9B8DZKwDVUig4EDug12hrlXIKIBYyENzaDbVpRUfED92ANpVAmJycvwp8QJQjSEtCSOLQEPIu0xsbGIhziANu0rq6uLxQKvYFfe5gikyRwiS5GRuEm2iyVEZfrCkoVRL3lmpqaEFqyD/4D1RvrEoStegJgdyVJcu7t7UmwJTwThra2tgDn8vPzzTk5Oc92dnacer1e1el0Ybhf4vuF8wcVZqFHSR7hKXCzXa1W6ypadgt+FY/ess1mC5SUlAyjXZVoFx2qXAwkQoKvEW/Ok5mZGXdWVtZvEgglMS8aWvoGfCzbkUh4HpFbPj097QRRryAiAZ+K6E3e96IBJ6UwMnHwFgA+xWH3lJWV/WIGsPkWabsrJdB+E4KIGRlxTx6jEX4uLCxUYXysDOKJBRHrLuOMivA9cusKcILGSzIf1yT8T8VvTDX+A7nQiRk9jngZAAAAAElFTkSuQmCC') 12.5 12.5, auto";
         }*/
    }


    getFlipCursor(cursorIndex)
    {
        if (!this.photoEditor) {
            return cursorIndex;
        }

        const targetFlipScaleX = this.target.scale.x;
        const targetFlipScaleY = this.target.scale.y;
        const croppedScaleX = this.photoEditor.croppedScaleX;
        const croppedScaleY = this.photoEditor.croppedScaleY;
        const isFlip = (targetFlipScaleX * targetFlipScaleY * croppedScaleX * croppedScaleY) < 1;

        if (isFlip) {
            switch (cursorIndex) {
                case 0:
                    return 0;
                case 1:
                    return 7;
                case 2:
                    return 6;
                case 3:
                    return 5;
                case 4:
                    return 4;
                case 5:
                    return 3;
                case 6:
                    return 2;
                case 7:
                    return 1;
            }
        }

        return cursorIndex;
    }


    getCursorIndex() {
        if (this.type === ToolControlType.ROTATION) {
            return this.getRotationCursorIndex();
        }

        const scaleSignX = (this.target) ? this.target.scaleSignX : 1;
        const scaleSignY = (this.target) ? this.target.scaleSignY : 1;

        if (scaleSignX === 1 && scaleSignY === 1) {
            switch (this.type) {
                case ToolControlType.TOP_CENTER:
                    return 0;
                case ToolControlType.TOP_RIGHT:
                    return 1;
                case ToolControlType.MIDDLE_RIGHT:
                    return 2;
                case ToolControlType.BOTTOM_RIGHT:
                    return 3;
                case ToolControlType.BOTTOM_CENTER:
                    return 4;
                case ToolControlType.BOTTOM_LEFT:
                    return 5;
                case ToolControlType.MIDDLE_LEFT:
                    return 6;
                case ToolControlType.TOP_LEFT:
                    return 7;
            }
        }
        else if (scaleSignX === -1 && scaleSignY === 1) {
            switch (this.type) {
                case ToolControlType.TOP_CENTER:
                    return 0;
                case ToolControlType.TOP_RIGHT:
                    return 7;
                case ToolControlType.MIDDLE_RIGHT:
                    return 6;
                case ToolControlType.BOTTOM_RIGHT:
                    return 5;
                case ToolControlType.BOTTOM_CENTER:
                    return 4;
                case ToolControlType.BOTTOM_LEFT:
                    return 3;
                case ToolControlType.MIDDLE_LEFT:
                    return 2;
                case ToolControlType.TOP_LEFT:
                    return 1;
            }
        }
        else if (scaleSignX === 1 && scaleSignY === -1) {
            switch (this.type) {
                case ToolControlType.TOP_CENTER:
                    return 4;
                case ToolControlType.TOP_RIGHT:
                    return 3;
                case ToolControlType.MIDDLE_RIGHT:
                    return 2;
                case ToolControlType.BOTTOM_RIGHT:
                    return 1;
                case ToolControlType.BOTTOM_CENTER:
                    return 0;
                case ToolControlType.BOTTOM_LEFT:
                    return 7;
                case ToolControlType.MIDDLE_LEFT:
                    return 6;
                case ToolControlType.TOP_LEFT:
                    return 5;
            }
        }
        else if (scaleSignX === -1 && scaleSignY === -1) {
            switch (this.type) {
                case ToolControlType.TOP_CENTER:
                    return 4;
                case ToolControlType.TOP_RIGHT:
                    return 5;
                case ToolControlType.MIDDLE_RIGHT:
                    return 6;
                case ToolControlType.BOTTOM_RIGHT:
                    return 7;
                case ToolControlType.BOTTOM_CENTER:
                    return 0;
                case ToolControlType.BOTTOM_LEFT:
                    return 1;
                case ToolControlType.MIDDLE_LEFT:
                    return 2;
                case ToolControlType.TOP_LEFT:
                    return 3;
            }
        }
        else {
            switch (this.type) {
                case ToolControlType.TOP_CENTER:
                    return 0;
                case ToolControlType.TOP_RIGHT:
                    return 1;
                case ToolControlType.MIDDLE_RIGHT:
                    return 2;
                case ToolControlType.BOTTOM_RIGHT:
                    return 3;
                case ToolControlType.BOTTOM_CENTER:
                    return 4;
                case ToolControlType.BOTTOM_LEFT:
                    return 5;
                case ToolControlType.MIDDLE_LEFT:
                    return 6;
                case ToolControlType.TOP_LEFT:
                    return 7;
            }
        }
    }


    getRotationCursorIndex() {
        const scaleSignX = (this.target) ? this.target.scaleSignX : 1;
        const scaleSignY = (this.target) ? this.target.scaleSignY : 1;

        if (scaleSignX === 1 && scaleSignY === 1) {
            switch (this.rotationControlType) {
                case RotationControlType.TOP_CENTER:
                    return 0;
                case RotationControlType.TOP_RIGHT:
                    return 1;
                case RotationControlType.MIDDLE_RIGHT:
                    return 2;
                case RotationControlType.BOTTOM_RIGHT:
                    return 3;
                case RotationControlType.BOTTOM_CENTER:
                    return 4;
                case RotationControlType.BOTTOM_LEFT:
                    return 5;
                case RotationControlType.MIDDLE_LEFT:
                    return 6;
                case RotationControlType.TOP_LEFT:
                case RotationControlType.DELETE:
                    return 7;
            }
        }
        else if (scaleSignX === -1 && scaleSignY === 1) {
            switch (this.rotationControlType) {
                case RotationControlType.TOP_CENTER:
                    return 0;
                case RotationControlType.TOP_RIGHT:
                    return 7;
                case RotationControlType.MIDDLE_RIGHT:
                    return 6;
                case RotationControlType.BOTTOM_RIGHT:
                    return 5;
                case RotationControlType.BOTTOM_CENTER:
                    return 4;
                case RotationControlType.BOTTOM_LEFT:
                    return 3;
                case RotationControlType.MIDDLE_LEFT:
                    return 2;
                case RotationControlType.TOP_LEFT:
                case RotationControlType.DELETE:
                    return 1;
            }
        }
        else if (scaleSignX === 1 && scaleSignY === -1) {
            switch (this.rotationControlType) {
                case RotationControlType.TOP_CENTER:
                    return 4;
                case RotationControlType.TOP_RIGHT:
                    return 3;
                case RotationControlType.MIDDLE_RIGHT:
                    return 2;
                case RotationControlType.BOTTOM_RIGHT:
                    return 1;
                case RotationControlType.BOTTOM_CENTER:
                    return 0;
                case RotationControlType.BOTTOM_LEFT:
                    return 7;
                case RotationControlType.MIDDLE_LEFT:
                    return 6;
                case RotationControlType.TOP_LEFT:
                case RotationControlType.DELETE:
                    return 5;
            }
        }
        else if (scaleSignX === -1 && scaleSignY === -1) {
            switch (this.rotationControlType) {
                case RotationControlType.TOP_CENTER:
                    return 4;
                case RotationControlType.TOP_RIGHT:
                    return 5;
                case RotationControlType.MIDDLE_RIGHT:
                    return 6;
                case RotationControlType.BOTTOM_RIGHT:
                    return 7;
                case RotationControlType.BOTTOM_CENTER:
                    return 0;
                case RotationControlType.BOTTOM_LEFT:
                    return 1;
                case RotationControlType.MIDDLE_LEFT:
                    return 2;
                case RotationControlType.TOP_LEFT:
                case RotationControlType.DELETE:
                    return 3;
            }
        }
        else {
            switch (this.rotationControlType) {
                case RotationControlType.TOP_CENTER:
                    return 0;
                case RotationControlType.TOP_RIGHT:
                    return 1;
                case RotationControlType.MIDDLE_RIGHT:
                    return 2;
                case RotationControlType.BOTTOM_RIGHT:
                    return 3;
                case RotationControlType.BOTTOM_CENTER:
                    return 4;
                case RotationControlType.BOTTOM_LEFT:
                    return 5;
                case RotationControlType.MIDDLE_LEFT:
                    return 6;
                case RotationControlType.TOP_LEFT:
                case RotationControlType.DELETE:
                    return 7;
            }
        }
    }


    hitTestWithGlobalPoint(globalPoint)
    {
        let localBounds;
        const local = this.toLocal(globalPoint);

        if (this.type !== ToolControl.DELETE) {
            localBounds = this.g.getLocalBounds();
        }
        else {
            localBounds = this.getLocalBounds();
        }

        if (local.x >= localBounds.x && local.x <= localBounds.x + localBounds.width &&
            local.y >= localBounds.y && local.y <= localBounds.y + localBounds.height ) {
            return true;
        }

        return false;
    }
}



