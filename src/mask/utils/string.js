/**
 * xml string을 DOMParser를 이용해 파싱한다. 
 * @param  {[type]} string [description]
 * @return {[type]}        [description]
 */
export function parseXMLbyDOMParser(string) {
	if(typeof DOMParser === 'undefined') return null;

	return new DOMParser().parseFromString(string, 'text/xml');
}

/**
 * xml string을 ActiveXObject를 이용해 파싱한다. 
 * @param  {[type]} string [description]
 * @return {[type]}        [description]
 */
export function parseXMLbyActiveXObject(string) {
	if(typeof ActiveXObject === 'undefined') return null;

	const xmlDoc = new ActiveXObject('Microsoft.XMLDOM');

	if(typeof xmlDoc === 'undefined') return null;

	xmlDoc.async = 'false';
	xmlDoc.loadXML(string);

	return xmlDoc;
}

/**
 * DOMParser와 ActiveXObject를 이용해 xml string을 파싱한다. 
 * @param  {[type]} string [description]
 * @return {[type]}        [description]
 */
export function parseXML(string) {
	const xml = parseXMLbyDOMParser(string) 
			 || parseXMLbyActiveXObject(string);

	if(xml === null) throw new Error('No XML parser found');

	return xml;
}