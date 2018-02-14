/*
* request方法
* @param {*} options 
*/

const { _, request, cheerio, ep, url } = require('../config/commonModules.js');

let requestMethod = (options) => {
	return request(options).then((c) => {
		return JSON.parse(c.body);
	});
};

/**
* 
* @param {nubmer} count 总数
* @param {nubmer} cycle 周期
*/
let rateMethod = (count, cycle) => {
	count = count === undefined ? 20 : count;
	cycle = cycleMethod(cycle);
	let posts = count % cycle;
	let times = (count - posts) / cycle;
	return {
		times,
		count,
		cycle,
		writeTimes: 0,
		allObject: {}
	}
}

let cycleMethod = (cycle) => {
	let defaultCycle = 20;
	if (cycle && cycle !== defaultCycle) {
		cycle = cycle % defaultCycle;
	}
	cycle = cycle || defaultCycle;
	return cycle;
}

let loopMethod = (config) => {
	let { urlTemplate, ...options } = config.options;
	return new Promise((resolve, reject) => {
		return requestMethod({
			url: url.resolve(urlTemplate, `?limit=${config.cycle}&offset=${config.writeTimes * 20}`),
			options
		}).then(c => {
			_.forEach(c, (item, index) => {
				config.allObject[index + config.writeTimes * 20] = item;
			});

			if (config.writeTimes === config.times) {
				// console.log(config.allObject)
				resolve(config.allObject);
			} else {
				config.writeTimes += 1;
				loopMethod(config);
			}
		});
	})
}
module.exports = {
	loopMethod,
	cycleMethod,
	rateMethod,
	requestMethod
}