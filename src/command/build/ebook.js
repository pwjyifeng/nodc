/**
 * @author bubao 
 * @description 
 * @date: 2018-01-23
 * @Last Modified by: bubao 
 * @Last Modified time: 2018-05-15 19:05:03 
 */
/*
 * @Author: bubao 
 * @Date: 2018-05-15 17:46:52 
 * @Last Modified by:   bubao 
 * @Last Modified time: 2018-05-15 17:46:52 
 */
const { exec } = require('child_process');
const fs = require('fs');
const forEach = require('lodash/forEach');
const localImage = require('./localImage.js');

/**
 * 
 * @param {string} p 下载路径
 * @param {string} name 下载路径的文件夹名
 * @param {object} ebookJson ebookJson数据
 */
const ebook = (p, name, ebookJson) => {
	exec(`cat ${p}/${name}/* >> ${p}/${name}Ebook/${name}.md`, (err) => {
		if (err) {
			throw err;
		}
		localImage(p, name, `${p}/${name}Ebook/${name}.md`, () => {
			const mdfile = fs.readdirSync(`${p}/${name}`);
			forEach(fs.readdirSync(`${p}/${name}`), (item, index) => {
				ebookJson.content[index] = {
					title: mdfile[index].replace(/\.md/, '').split(';')[1],
					data: mdfile[index]
				};
			});
		});
	});
}

module.exports = ebook;