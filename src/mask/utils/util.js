
import {each} from './lambda';
import {sign} from './number';

/**
 * 임시 캔버스가 필요한 경우 사용한다.
 * @type {[type]}
 */
export const __context = document.createElement( "canvas" ).getContext("2d");
export const __renderableContext = document.createElement( "canvas" ).getContext( "2d" );
export const __photoFrameContext = document.createElement( 'canvas' ).getContext( '2d' );

export const TEMP_POINT_A = { x: 0, y: 0 };
export const TEMP_POINT_B = { x: 0, y: 0 };
export const TEMP_POINT_C = { x: 0, y: 0 };


/**
 * a를 복사한 새로운 객체를 생성한다. 
 * 1. b가 null이 아닐 경우 b에 a의 속성과 값을 복사한다. 
 * @param  {[type]} a [description]
 * @param  {[type]} b [description]
 * @return {[type]}   [description]
 */
export function clone(a, b = {}) {

	each(a, (v, k) => {b[k] = v});

	return b;
}


/**
 * source 객체에 target 객체의 정보를 가져온다. 
 * 1. target 객체에 있는 정보 중 source에 없는 것만 가져온다. 
 * @param  {[type]} source [description]
 * @param  {[type]} target [description]
 * @return {[type]}        [description]
 */
export function pull( source, target ){

	var type;

	for( var s in target ){

		type = typeof source[s];

		if( type === "undefined" )
		{
			source[s] = target[s];
			continue;
		}

		if( type === "object" ){

			if ( source[s] === null ){
				source[s] = target[s];
			} else if (typeof target[s].length === "undefined") {
				pull( source[s], target[s] );
			}
		}
	}

	return source;
}


/**
 * 프록시 서버 주소를 add한 url을 반환 
 * @param  {[Strig]} url
 * @return {[String]}   
 */
export function proxy( url ){
	
	// 프록시 서버 한꺼번에 끄기.
	if( nts && nts.$proxyDisabled ) return url;
	// 로컬 혹은 해당 서버의 이미지를 읽을 경우 프록시 적용 안함. 
	if( /^[.\/\\]/.test( url ) ) return url;

	return "http://10.113.216.159:10080/?sURL=" + url;
}


/**
 * 배열안에 null pointer가 있을 경우, 뒤의 요소를 앞으로 채워넣는다. 
 * removeNullPointer( [1,2,3,4, ,5,6, , ,7] ) => [1,2,3,4,5,6,7] 
 * Number를 원소로 하는 배열은 0일 경우 없어지니 주의를 요함. 
 * @param  {[Array]} list 
 * @return {[Array]}      
 */
export function removeNullPointer( list ){

	var i = 0, len = list.length, k = 0;

	for( ; i < len; i++ ){
		
		if( !list[i] ) continue;
		if( i != k ) list[k] = list[i];

		++k;
	}

	list.length = k;

	return list;
}


/**
 * img element를 imageData로 변환 
 * @param  {[HTMLImageElement]} img 
 * @param  {[Number]} x   
 * @param  {[Number]} y   
 * @param  {[Number]} w   
 * @param  {[Number]} h   
 * @return {[ImageElement]}     
 */
export function toImageData( img, x, y, w, h ){

	x = x || 0;
	y = y || 0;
	w = w || img.width || img.naturalWidth;
	h = h || img.height || img.naturalHeight;

	var canvas = __context.canvas;

	canvas.width = w;
	canvas.height = h;

	__context.drawImage( img, x, y, w, h );

	return __context.getImageData( 0, 0, w, h );
}


/**
 * 필터 배열에서 필터의 이름을 concat하여 한 줄의 string으로 반환한다. 
 * @param  {[type]} filters [description]
 * @return {[type]}         [description]
 */
export function enumerateFilterNames( filters ){

	return filters.reduce( (a, b) => {

		return typeof a == "string" ?
			a + ", " + b.name :
			a.name + ", " + b.name;
	});
}


/**
 * 1. for loop를 setTimeout으로 비동기 호출한다. 
 * 2. func에서 반환한 값을 for loop의 진행률로 설정한다. 
 * 3. 2번의 값이 전체 len 이상이 되는 경우 for loop를 종료한다. 
 * 4. func의 매개변수는 현재 index( i )와 전체 길이( len )을 unshift한 args로 대신한다. 
 * @param  {[type]} start    [description]
 * @param  {[type]} len      [description]
 * @param  {[type]} func     [description]
 * @param  {[type]} args     [description]
 * @param  {[type]} scope    [description]
 * @param  {[type]} update   [description]
 * @param  {[type]} complete [description]
 * @return {[type]}          [description]
 */
export function loop( start, len, func, args, scope, update, complete ){

	var i = start,
		args = [ i, len ].concat( args );

	function exec(){

		args[0] = i;
		i = func.apply( scope, args );

		update( i, len );

		if( i < len ){
			setTimeout( exec, 10 );			
		}
		else{
			complete( i, len );
		}
	}

	exec();
}


/**
 * PIXI.EventEmitter 객체에 다량의 이벤트를 add하기 위한 util 함수. 
 * arr 배열은 [ type, listener, scope ] 순서를 가져야 한다. 
 * @param {[type]} emitter [description]
 * @param {[type]} arr     [description]
 */
export function addEvents( emitter, arr ){

	for( var i = 0, n = arr.length; i < n; i += 3 ){
		
		emitter.on( arr[i], arr[i+1], arr[i+2] );
	}
}

/**
 * PIXI.EventEmitter 객체에 다량의 이벤트를 remove하기 위한 util 함수. 
 * arr 배열은 [ type, listener, scope ] 순서를 가져야 한다. 
 * @param {[type]} emitter [description]
 * @param {[type]} arr     [description]
 */
export function removeEvents( emitter, arr ){

	for( var i = 0, n = arr.length; i < n; i += 3 ){
		
		emitter.off( arr[i], arr[i+1], arr[i+2] );
	}
}



/**
 * PIXI.Sprite의 local matrix 를 반환한다. 
 * 서명이나 스티커가 회전되어 있을 때 targetScale이 1.0이 아니라면 행렬이 정상적으로 반환되지 않는 이슈가 있습니다. 
 * @param  {[type]} o   [description]
 * @param  {[type]} out [description]
 * @return {[type]}     [description]
 */
export function toMatrix( o, out = null, targetScaleX = 1.0, targetScaleY = 1.0 ){

	out = out || [];

	var sx, sy, cos, sin, px, py,
		a, b, c, d, tx, ty;

	sx = o.scale.x;// * targetScaleX;
	sy = o.scale.y;// * targetScaleY;

	px = -o.pivot.x;
	py = -o.pivot.y;

	if( o.anchor && ( o.anchor.x || o.anchor.y ) ){

		px = -o.anchor.x * o.texture.frame.width;
		py = -o.anchor.y * o.texture.frame.height;
	}

	if( o.rotation == 0.0 ){

		out[0] = sx * targetScaleX;
		out[1] = 0;
		out[2] = 0;
		out[3] = sy * targetScaleY;
		out[4] = (sx * px + o.x) * targetScaleX;
		out[5] = (sy * py + o.y) * targetScaleY;
	}
	else{

		cos = Math.cos( o.rotation );
		sin = Math.sin( o.rotation );

		out[0] = sx * cos;
		out[1] = sx * sin;
		out[2] = sy * -sin;
		out[3] = sy * cos;
		out[4] = out[0] * px + out[2] * py + o.x;
		out[5] = out[1] * px + out[3] * py + o.y;
	}

	return out;
}


export function printMat( prefix, mat ){
	console.log( "%s. a(%s), b(%s), c(%s), d(%s), t(%s,%s)", prefix, mat.a, mat.b, mat.c, mat.d, mat.tx, mat.ty );
}


/**
 * displayObject의 x,y,scale,rotation등의 속성을 기준으로 변형 행렬을 가져온다. 
 * 1. scale은 
 * @param  {[type]} displayObject [description]
 * @return {[type]}               [description]
 */
export function getMatrixFrom( displayObject, result = null ){
	
	result = result || new PIXI.Matrix();

	let source = displayObject.texture && displayObject.texture.baseTexture ? displayObject.texture.baseTexture.source : null,
		pivotX = -displayObject.pivot.x, 
		pivotY = -displayObject.pivot.y;

	if( source ){
		pivotX = pivotX || -(source.width || source.naturalWidth) * displayObject.anchor.x;
		pivotY = pivotY || -(source.height || source.naturalHeight) * displayObject.anchor.y;
	}

	result.setTransform(
		displayObject.position.x,
		displayObject.position.y,
		pivotX,
		pivotY,
		sign( displayObject.scale.x ), // 1.0
		sign( displayObject.scale.y ), // 1.0
		displayObject.rotation,
		0, 0
	);

	return result;
}


/**
	 * 최종 renderableObject 객체를 찾아 임시 context에 draw하는 callback을 만든다. 
	 * 1. closure를 이용해 부모 객체의 transform을 전달한다. 
	 * @param  {[type]} transform [description]
	 * @return {[type]}           [description]
	 */
export function makeDrawCallbackInClosure( drawContext, transform = null ){
	
	return function( object ){

		let a = getMatrixFrom( object );

		if( transform ) a.prepend( transform );

		if( object.renderableObject && object.texture && object.texture.baseTexture ){

			let sx = Math.abs( object.scale.x ),
				sy = Math.abs( object.scale.y ),
			
				_a = sx * a.a, _c = sy * a.c, dx = a.tx | 0,
				_b = sx * a.b, _d = sy * a.d, dy = a.ty | 0;

			drawContext.setTransform( _a, _b, _c, _d, dx, dy );
			drawContext.drawImage( object.texture.baseTexture.source, 0, 0 );
		}
		else if( object instanceof PIXI.Container ){

			object.children.forEach( makeDrawCallbackInClosure( drawContext, a ), this );
		}
	}
}


/**
 * private
 * @param  {[type]} source [description]
 * @param  {[type]} dest   [description]
 * @param  {[type]} sw     [description]
 * @param  {[type]} sh     [description]
 * @param  {Number} f      [description]
 * @return {[type]}        [description]
 */
function _imageResize( source, dest, sw, sh, f = 0.5 ){

	// 최종 목표 크기는 dest context의 canvas 크기와 같다. 
	let dw = dest.canvas.width,
		dh = dest.canvas.height;

	// complete recursive
	// 소스 크기가 목표 크기와 같다면 재귀 함수 끝. 
	if( sw <= dw && sh <= dh ) return dest;

	// 새로운 목표 크기를 f를 곱해 설정. 
	let tw = Math.max( dw, f * sw | 0 ),
		th = Math.max( dh, f * sh | 0 ),
		context;

	// 새로운 목표 크기가 원 목표 크기보다 크다면
	if( tw > dw || th > dh ){
		
		// 새로운 목표 크기의 60%안에 원 목표 크기가 있다면 
		// 최종 목표 크기로 설정. 
		// 3-40 픽셀을 줄이기 위해 한번 더 그리는 상황을 차단. 
		if( 0.6 * tw * ( 1 - f ) > tw - dw ) tw = dw;
		if( 0.6 * th * ( 1 - f ) > th - dh ) th = dh;
	}

	// 목표 크기가 최종 목표 크기와 동일하다면 dest context에 draw
	context = tw == dw && th == dh ? dest : source;
	context.drawImage( source.canvas, 0, 0, sw, sh, 0, 0, tw, th );

	// 재귀 호출. 
	return _imageResize( source, dest, tw, th, f );
}

/**
 * source 이미지를 dest context에 draw한다. 
 * 1. source는 HTMLImageElement 혹은 HTMLCanvasElement 여야 한다. 
 * 2. matrix 배열을 이용해 source를 변형하여 draw할 수 있다. 
 * 3. sw, sh는 matrix가 적용되는 최초 캔버스의 크기를 가리킨다. 
 * 4. source resize는 한번이 아니라 여러번 나누어 점차 줄여나간다. 
 * 5. f를 이용해 한번에 줄어드는 정도를 정할 수 있다. 
 * @param  {[type]} source [description]
 * @param  {[type]} dest   [description]
 * @param  {[type]} sw     [description]
 * @param  {[type]} sh     [description]
 * @param  {Number} f      [description]
 * @param  {[type]} matrix [description]
 * @return {[type]}        [description]
 */
export function imageResize( source, dest, sw, sh, f = 0.5, matrix = null ){

	let dw = dest.canvas.width,
		dh = dest.canvas.height,

		tw = Math.max( dw, sw ),
		th = Math.max( dh, sh ),

		context = tw == dw && th == dh ? dest : __context;

	context.canvas.width = tw;
	context.canvas.height = th;
	
	context.save();
		if (matrix != null)
	        context.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
	    else
	        context.setTransform( 1,0,0,1,0,0 );

	    context.drawImage( source, 0, 0 );
    context.restore();

    if( context == dest ) return context;

    // call resize recursive
    return _imageResize( context, dest, tw, th, f );
}



/**
 * CanvasRenderingContext2D의 getImageData를 호출한다. 
 * 1. memory alloc이 큰 함수여서 try..catch로 실행 후 실패시 null을 반환한다. 
 * @param  {[type]} context [description]
 * @param  {[type]} sx      [description]
 * @param  {[type]} sy      [description]
 * @param  {[type]} w       [description]
 * @param  {[type]} h       [description]
 * @return {[type]}         [description]
 */
export function getImageData( context, sx, sy, w, h ){

	let imageData;

	try{

		imageData = context.getImageData( sx, sy, w, h );

	}catch(e){

		console.warn( "getImageData failed", e );
	}

	return imageData;
}


/**
 * CanvasRenderingContext2D의 createImageData 호출한다. 
 * 1. memory alloc이 큰 함수여서 try..catch로 실행 후 실패시 null을 반환한다. 
 * @param  {[type]} context [description]
 * @param  {[type]} w       [description]
 * @param  {[type]} h       [description]
 * @return {[type]}         [description]
 */
export function createImageData( context, w, h ){

	let imageData;

	try{

		imageData = context.createImageData( w, h );

	}
	catch(e){

		console.warn( "createImageData failed", e );
	}

	return imageData;
}


