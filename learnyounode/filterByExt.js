var fs = require("fs");
var path = require("path");

module.exports = function filterByExt(dir, ext, f) {
	var ext = "." + ext;

	fs.readdir(dir, function(err, files) {
		if (err) { return f(err); }
		return f(null, files.filter((file) => path.extname(file) == ext));
	});
};
