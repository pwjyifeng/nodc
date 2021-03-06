/**
 * @author bubao 
 * @description 
 * @date: 2018-03-15
 * @Last Modified by: bubao
 * @Last Modified time: 2018-05-15 19:03:20
 */
const ProgressBar = require('../ProgressBar');
const isFunction = require('lodash/isFunction');
const { path, request, fs, parseURL } = require('../../tools/commonModules');
const { time } = require('../../tools/utils');

class NodeDown {
	constructor(props) {
		this.description = props.description;
		this.bar_length = props.bar_length;
		this.pb = new ProgressBar(this.description, this.bar_length);
		this.description = this.pb.description;
	}

	/**
	 * 
	 * @param {object} opts 配置
	 * {url, localPath, name}
	 * @param {function} callback 
	 */
	download(opts, callback) {
		let read = 0;
		let { name, out } = opts;
		const { url, hiden } = opts;
		const start = new Date().valueOf() / 1000;
		let end = 0;
		out = path.resolve(out || './');
		name = name || path.basename(parseURL(url).basename);

		this.pb.description = `${name}\n${this.description}`;

		request.get(url).on('response', (response) => {
			if (response.headers['content-length']) {
				this.response = parseInt(response.headers['content-length'], 10);
			} else {
				throw new Error('It is nothing to download!!!')
			}
		}).on('data', (data) => {
			read += data.length;
			this.pb.render({
				completed: read,
				hiden,
				total: this.response,
				time: { start },
				status: {
					down: '正在下载...',
					end: '完成\n'
				}
			});
		}).on('error', (error) => {
			if (isFunction(callback)) {
				callback(error);
			}
			throw error;
		}).pipe(fs.createWriteStream(path.join(out, name))).on('close', () => {
			end = new Date().valueOf() / 1000;
			if (isFunction(callback)) {
				const back = { start, end, elapsed: time(end - start) }
				callback(back);
			}
		});
	}
}

module.exports = NodeDown;