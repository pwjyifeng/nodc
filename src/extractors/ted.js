/**
 * @author bubao 
 * @description 
 * @date: 2018-03-16
 * @Last Modified by: bubao 
 * @Last Modified time: 2018-05-15 19:00:53 
 */
const { path, _, request, fs } = require('../tools/commonModules');
const { getHTML } = require('../tools/utils');
/**
 * 
 * @param {string} url 
 * @param {string} output_dir 
 * @param {boolean} merge 
 * @param {boolean} info_only 
 * @param {object} kwargs 
 */
function extractor(url, output_dir = '.', merge = true, info_only = false, ...kwargs) {
	getHTML(url, (html) => {
		html
	});
}

module.exports = extractor;