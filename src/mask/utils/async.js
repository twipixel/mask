import _Promise from 'promise-polyfill';


//----------------------------------------------------------------------------------------
//
// Promise polyfill
//
//----------------------------------------------------------------------------------------


if( !window.Promise ) window.Promise = _Promise;
export const all = Promise.all.bind( Promise );



/**
 * request some data
 * @param  {[type]} url    [description]
 * @param  {String} method [description]
 * @return {[type]}        [description]
 */
export function request(url, method = 'GET') {
	return new Promise((resolve, reject) => {
		const req = new XMLHttpRequest();

		req.onload = () => resolve(req.responseText);
		req.onerror = e => reject(e);

		req.open(method, url);
		req.send(null);
	})
}
