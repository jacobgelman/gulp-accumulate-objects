"use strict";
const through = require("through");
const path = require("path");
const gutil = require("gulp-util");
const PluginError = gutil.PluginError;
const File = gutil.File;

function generateError(message, showStack = false) {
    return new PluginError("gulp-accumulate-objects", message, {showStack});
}

module.exports = function(fileName, edit) {
	if (!fileName) {
		throw generateError("Missing fileName option for gulp-accumulate-objects");
	}

	var accum = [];
	var firstFile = null;
	var skipConversion = false;

	function bufferContents(file) {
		if (!firstFile) {
			firstFile = file;
		}

		if (file.isNull()) {
			return; // ignore
		}
		if (file.isStream()) {
			skipConversion = true;
			return this.emit("error", generateError("Streaming not supported"));
		}
		try {		
            const obj = JSON.parse(file.contents.toString());
            const newObj = typeof edit === "function" ? edit(obj, file) : obj;
            accum.push(newObj);
		} catch (err) {
			skipConversion = true;
			return this.emit("error", generateError("Error parsing JSON: " + err + ", file: " + file.path.slice(file.base.length)));
		}
	}

	function endStream() {
		if (firstFile && !skipConversion) {
			var joinedPath = path.join(firstFile.base, fileName);

			try {
				var joinedFile = new File({
					cwd: firstFile.cwd,
					base: firstFile.base,
					path: joinedPath,
					contents: Buffer.from(JSON.stringify(accum), "utf8")
				});
				this.emit("data", joinedFile);
			}	catch (e) {
				return this.emit("error", generateError(e, true));
			}
		}
		this.emit("end");
	}

	return through(bufferContents, endStream);
};
