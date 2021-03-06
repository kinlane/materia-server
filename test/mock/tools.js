var fs = require('fs')
var path = require('path')

var ncp = require('ncp').ncp
var remove = require('remove')

function copyFile(source, target) {
	return new Promise(function(resolve, reject) {
		var rd = fs.createReadStream(source);
		rd.on('error', reject);
		var wr = fs.createWriteStream(target);
		wr.on('error', reject);
		wr.on('finish', resolve);
		rd.pipe(wr);
	});
}

exports.cleanAppDir = function cleanAppDir(appDir, callback) {
	exports.cleanHistory(appDir, (err) => {
		if (err)
			return callback(err)
		exports.cleanApi(appDir, (err) => {
			if (err)
				return callback(err)
			exports.cleanEntities(appDir, callback)
		})
	})
}

exports.cleanApi = function cleanApi(appDir, callback) {
	if (fs.existsSync(path.join(appDir, 'tpl_api.json'))) {
		copyFile(path.join(appDir, 'tpl_api.json'), path.join(appDir, 'api.json')).then(() => {
			callback()
		}).catch((err) => {
			callback(err)
		})
	}
	else
		callback()
}

exports.cleanHistory = function cleanHistory(appDir, callback) {
	try {
		if (fs.existsSync(path.join(appDir, 'history')))
			remove.removeSync(path.join(appDir, 'history'))
	} catch (err) {
		return callback(err)
	}
	callback()
}

exports.cleanEntities = function cleanEntities(appDir, callback) {
	try {
		if (fs.existsSync(path.join(appDir, 'entities')) && fs.existsSync(path.join(appDir, 'tpl_entities'))) {
			remove.removeSync(path.join(appDir, '/entities'))
		}
	} catch (err) {
		return callback(err)
	}
	ncp(path.join(appDir, 'tpl_entities'), path.join(appDir, 'entities'), callback)
}