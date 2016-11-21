var gulp = require('gulp'),
	path = require('path'),
	sassPath = [path.join(__dirname, 'css', 'units'),
				path.join(__dirname, 'css', 'layouts')],
	resumeData = require("./resume-info.json"),
	plugins = require('gulp-load-plugins')(),
	bs = require('browser-sync').create(),
	reload = bs.reload;

function getLocals(data){
	var data2str = JSON.stringify(data);
	return JSON.parse(data2str.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
			.replace(/`(.+?)`/g, "<strong>$1</strong>"));
}

gulp.task("sass", function(){
	gulp.src("./css/main.scss")
		.pipe(
			plugins.sass({
				includePaths: sassPath
			})
			.on('error', function(err){
				console.log(err);
			})
		)
		.pipe(gulp.dest("./build/css"))
		.pipe(reload({
			stream: true
		}));

	console.log("sass file build success!");
});

gulp.task("jade", function(){
	gulp.src("./jade/index.jade")
		.pipe(
			plugins.jade(
				{
					pretty: true,
					locals: getLocals(resumeData)
				}
			)
		)
		.pipe(gulp.dest('./build'));
	
	console.log("jade file build success!");
});

gulp.task("static", function(){
	gulp.src("./static/**/*")
		.pipe(gulp.dest("./build/"));
});

gulp.task("serve", function(){
	bs.init({
		port: 8080,
		server: "build",
		browser: "C:\\Users\\Administrator\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe"
	});

	console.log("server start success!");
});

gulp.task("watch", function(){
	gulp.watch("./css/**/*.scss", ["sass"]);
	gulp.watch("index.jade", ["jade"], reload);

	console.log("file changed watching!");
});

gulp.task("default", ["sass", "jade", "static", "serve", "watch"], function(){
	console.log("all build success!");
});