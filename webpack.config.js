const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const EventHooksPlugin = require('event-hooks-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require(`path`);
const fs = require(`fs`);

const srcPath = path.resolve(__dirname, `./src/`);
const distPath = path.resolve(__dirname, `./dist/`);

var deleteDirectoryRecursive = function(path) {
	if( fs.existsSync(path) ) {
		fs.readdirSync(path).forEach(file => {
			var curPath = path + "/" + file;
			if(fs.lstatSync(curPath).isDirectory()) {
				deleteDirectoryRecursive(curPath);
			} else {
				fs.unlinkSync(curPath);
			}
		});

		fs.rmdirSync(path);
	}
};
function getExtension(path) {
	var name = path.split(`.`);
	return name[name.length - 1];
}

function generateEntries(dir, results) {
	var fileList = fs.readdirSync(dir);
	for(var i = 0; i < fileList.length; i++) {
		var file = `${dir}/${fileList[i]}`;
		var stat = fs.statSync(file);
		if(stat && stat.isDirectory()) {
			generateEntries(file, results);
		} else {
			if(`${file}`.match(/.*\.(jsx?|s?css)$/)) {
				var label = file.replace(`/scss/`, `/css/`);
				var ext = getExtension(label).length + 1;
				var name = label.substring(srcPath.length + 1, label.length - ext);

				results[name] = file;
			}
		}
	}
}

module.exports = async function(mode = `production`) {
	let entryFiles = {};
	generateEntries(srcPath, entryFiles);

	return {
		mode: mode,
		resolve: {
			extensions: ['.js', '.jsx', '.scss', '.css'],
			alias: {
				"@": srcPath
			}
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: [ `babel-loader` ]
				},
				{
					test: /\.s?css$/,
					use: [
						{
							loader: MiniCssExtractPlugin.loader
						},
						{
							loader: "css-loader"
						},
						{
							loader: "sass-loader",
							options: {
								sourceMap: false,
								sassOptions: {
									outputStyle: `compressed`
								}
							}
						}
					]
				}
			]
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: '[name].css'
			}),
			new EventHooksPlugin({
				done: () => {
					Object.keys(entryFiles).map(key => {
						if([`scss`, `css`].includes(getExtension(entryFiles[key]))) {
							const p = path.resolve(`${distPath}/${key}.js`);
							if(fs.existsSync(p)) {
								fs.unlinkSync(p);
							}
						}
					});

					const scssPath = path.resolve(`${distPath}/scss/`);
					deleteDirectoryRecursive(scssPath);
				}
			})
		],
		entry: entryFiles,
		output: {
			path: distPath,
			filename: `[name].js`
		}
	};
};