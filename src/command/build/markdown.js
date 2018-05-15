const fs = require('fs');
const h2m = require('h2m');
const times = require('lodash/times');
const compact = require('lodash/compact');
const ebook = require('./ebook.js');

const imgsrc = '![](https://pic1.zhimg.com/';

/**
 * markdown(path, zhihuId[, format])
 * @param {string} path 下载地址
 * @param {string} zhihuId 知乎专栏ID
 * @param {string} format 指定为ebook，或者留空
 */
const markdown = (path, zhihuId, res, format) => {
	const jsonObj = res;
	times(Object.getOwnPropertyNames(jsonObj).length, (i) => {
		let answer = h2m(jsonObj[i].content);
		const reg = /<noscript>.*?<\/noscript>/g;
		const reg2 = /src="(.*?)"/;
		let src = answer.match(reg);
		const imageList = [];
		src = compact(src); // 使用lodash ，即便是src为null也能够转为空的数组
		times(src.length, (imageNum) => {
			imageList.push(`![](${src[imageNum].match(reg2)[1]})`);
		});
		times(src.length, (imageNum) => {
			answer = answer.replace(src[imageNum], imageList[imageNum]);
		});
		let { title } = jsonObj[i];
		const pattern = new RegExp("[`~!@#$^&'*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&mdash;—|{}【】‘；：”“'。，、？]");
		let rs = '';
		times(title.length, (k) => {
			const rs2 = title.substr(k, 1).replace(/"/, ''); // 使用正则表达式单独去除双引号
			rs += rs2.replace(pattern, '');
		});
		answer = answer.replace(/!\[\]\(/g, imgsrc);
		title = Buffer.from(rs);

		answer = Buffer.from(answer);

		const time = `${jsonObj[i].publishedTime}`;
		const T = time.replace("T", ",").replace("+08:00", "");
		const Ti = T.split(',')[0];

		const postId = jsonObj[i].url;
		let copyRight = `\n\n知乎原文: [${title}](https://zhuanlan.zhihu.com${postId})\n\n\n`;
		let header = `# ${title}\n\ndate: ${T.replace(",", " ")} \n\n\n`;
		header = Buffer.from(header);
		copyRight = Buffer.from(copyRight);
		if (!fs.existsSync(`${path}/${zhihuId}`)) {
			fs.mkdirSync(`${path}/${zhihuId}`);
		}
		// 如果没有指定目录，创建之
		fs.writeFileSync(`${path}/${zhihuId}/${Ti};${title}.md`, header, 'utf8', (err) => {
			if (err) throw err;
			console.log(`❌ ${Ti};${title}.md`);
		});

		fs.appendFile(`${path}/${zhihuId}/${Ti};${title}.md`, answer + copyRight, 'utf8', (err) => {
			if (err) throw err;
			console.log(`🍅  ${Ti};${title}.md`);
			if (i === jsonObj.length - 1 && format === "ebook") {
				const ebookObj = (fs.readFileSync(`${path}/${zhihuId}/0.json`))[0];
				ebook(path, zhihuId, {
					title: zhihuId,
					author: ebookObj.author.name,
					content: []
				});
			}
		});
	});
};

module.exports = markdown;