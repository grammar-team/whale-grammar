const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const EventHooksPlugin = require('event-hooks-webpack-plugin');
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
function getEntries(dir, results) {
	return new Promise((resolve, reject) => {
		fs.readdir(dir, function(err, list) {
			if (err) {
				reject(err);
			}

			var i = 0;
			(function next() {
				var file = list[i++];
				if (!file) {
					return resolve(results
						.filter(item => item.match && item.match(/.*\.(js|s?css)$/))
						.map((item) => {
							var label = item.replace(`/scss/`, `/css/`);
							var ext = getExtension(label).length + 1;

							return {
								name: label.substring(srcPath.length + 1, label.length - ext),
								path: item
							}
						}
					).reduce((memo, item) => {
						memo[item.name] = item.path
						return memo;
					}, {}));
				}
				file = `${dir}/${file}`;
				fs.stat(file, function(err, stat) {
					if (stat && stat.isDirectory()) {
						getEntries(file, results).then(res => {
							results = results.concat(res);
						next();
					});
					} else {
						results.push(file);
						next();
					}
				});
			})();
		});
	});
};

module.exports = async function(mode = `production`) {
	let entryFiles = await getEntries(srcPath, []);
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