

/**
 * 두 점 사이의 거리를 반환
 * @param  {[type]} a [description]
 * @param  {[type]} b [description]
 * @return {[type]}   [description]
 */
export function getDistance( ax, ay, bx, by ){

	let dx = bx - ax,
		dy = by - ay;

	return Math.sqrt( dx * dx + dy * dy );
}


/**
 * 두 점의 각도를 반환
 * @param  {[type]} ax [description]
 * @param  {[type]} ay [description]
 * @param  {[type]} bx [description]
 * @param  {[type]} by [description]
 * @return {[type]}    [description]
 */
export function getRadian( ax, ay, bx, by ){

	let dx = bx - ax,
		dy = by - ay;

	return Math.atan2( dy, dx );
}


/**
 * x, y를 radian 만큼 회전하여 반환한다. 
 * @param  {[type]} x      [description]
 * @param  {[type]} y      [description]
 * @param  {[type]} radian [description]
 * @param  {[type]} out    [description]
 * @return {[type]}        [description]
 */
export function rotate( x, y, radian, out = null ){

	out = out || { x: 0, y: 0 };

	if( radian == 0.0 ){

		out.x = x;
		out.y = y;

		return out;
	}

	let cos = Math.cos( radian ),
		sin = Math.sin( radian );

	out.x = x * cos - y * sin;
	out.y = x * sin + y * cos;

	return out;
}


/**
 * x, y를 t만큼 회전하여 iterable 객체(Array)로 반환
 * @param  {[type]} x [description]
 * @param  {[type]} y [description]
 * @param  {[type]} t [description]
 * @return {[type]}   [description]
 */
export function rotatei( x, y, t ){

	if( t % (2 * Math.PI) == 0 ) return [x, y];

	let cos = Math.cos(t), 
		sin = Math.sin(t),
		[ _x, _y ] = [ x, y ];

	x = cos * _x - sin * _y;
	y = sin * _x + cos * _y;

	return [ x, y ];
}



/**
 * px,py 를 중점으로 t 만큼 회전하는 행렬을 계산한다. 
 * @param  {[type]} t  [각도: 라디안]
 * @param  {[type]} px [중점 x]
 * @param  {[type]} py [중점 y]
 * @return {[type]} 행렬 원소 [ a, c, b, d, tx, ty ]를 반환한다. 순서에 주의 
 */
export function calcPivotRotateMatrix( t, px, py ){

	let cos, sin;
		
	if( t % ( 2 * Math.PI ) == 0 ){

		cos = 
		sin = 0;
	}
	else{

		cos = Math.cos(t);
		sin = Math.sin(t);
	}

	let a = cos, c = sin, 
		b = -sin, d = cos,
		tx = -a * px - c * py + px,
		ty = -b * px - d * py + py;

	return [ a, c, b, d, tx, ty ];
}


/**
 * x, y 좌표와 { origin: { x, y }, width: , height:, radian: } 으로 
 * 이루어진 boundary 객체의 충돌 여부를 검사하여 반환. 
 * @param  {[type]} x        [description]
 * @param  {[type]} y        [description]
 * @param  {[type]} boundary [description]
 * @return {[type]}          [description]
 */
export function hitTestWithBoundary( x, y, boundary ){

	let tx = boundary.origin.x,
		ty = boundary.origin.y,
		locX, locY;

	if( boundary.radian == 0 ){

		locX = x - tx;
		locY = y - ty;
	}
	else{

		let cos = Math.cos( boundary.radian ),
			sin = Math.sin( boundary.radian );

		locX = cos * x + sin * y - cos * tx - sin * ty;
        locY = -sin * x + cos * y + sin * tx - cos * ty;
	}

	if( locX < 0 || locX > boundary.width || locY < 0 || locY > boundary.height ) return false;

	return true;
}





