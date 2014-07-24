module.exports = function(grunt) {

	grunt.initConfig({
		browserify: {
			build: {
				src: 'task/browserify.js',
				dest: 'example/browser_chat/windlike.js'
			}
		},

		uglify: {
			build: {
				src: 'example/browser_chat/windlike.js',
				dest: 'example/browser_chat/windlike.js'
			}
		}

	});

	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['browserify:build', 'uglify:build']);
}
