module.exports = function ( grunt ) {

	require( 'load-grunt-tasks' )( grunt );

	// Project configuration.
	grunt.initConfig( {
		pkg: grunt.file.readJSON( 'package.json' ),

		// Setting folder templates.
		dirs: {
			js: 'assets/js',
		},

		// JavaScript linting with JSHint.
		jshint: {
			options: {
				reporter: require( 'jshint-stylish' ),
				jshintrc: '.jshintrc',
			},
			all: [ '<%= dirs.js %>/frontend/*.js', '!<%= dirs.js %>/frontend/*.min.js' ],
		},

		// Minify .js files.
		uglify: {
			options: {
				banner: '/*! <%= pkg.title %> <%= pkg.version %> */\n',
				output: {
					comments: /@license|@preserve|^!/,
				},
			},
			frontend: {
				files: [
					{
						expand: true,
						cwd: '<%= dirs.js %>/frontend/',
						src: [ '*.js', '!*.min.js' ],
						dest: '<%= dirs.js %>/frontend/',
						ext: '.min.js',
					},
				],
			},
		},

		// Watch changes for assets.
		watch: {
			js: {
				files: [ '<%= dirs.js %>/frontend/*.js', '!<%= dirs.js %>/frontend/*.min.js' ],
				tasks: [ 'js' ],
			},
		},

		// # Build and release

		// Remove any files in zip destination and build folder
		clean: {
			main: [ 'build/**' ],
		},

		// Copy the plugin into the build directory
		copy: {
			main: {
				src: [
					'**',
					'!node_modules/**',
					'!build/**',
					'!deploy/**',
					'!svn/**',
					'!**/*.zip',
					'!**/*.bak',
					'!wp-assets/**',
					'!package-lock.json',
					'!screenshots/**',
					'!.git/**',
					'!**.md',
					'!Gruntfile.js',
					'!package.json',
					'!gitcreds.json',
					'!.gitcreds',
					'!.gitignore',
					'!.gitmodules',
					'!sftp-config.json',
					'!**.sublime-workspace',
					'!**.sublime-project',
					'!deploy.sh',
					'!**/*~',
					'!phpcs.xml',
					'!composer.json',
					'!composer.lock',
					'!vendor/**',
					'!none',
					'!bin/**',
					'!.nvmrc'
				],
				dest: 'build/',
			},
		},

		// Make a zipfile.
		compress: {
			main: {
				options: {
					mode: 'zip',
					archive: 'deploy/<%= pkg.name %>-<%= pkg.version %>.zip',
				},
				expand: true,
				cwd: 'build/',
				dest: '<%= pkg.name %>',
				src: [ '**/*' ],
			},
		},

		// bump version numbers (replace with version in package.json)
		replace: {
			Version: {
				src: [ 'readme.txt', '<%= pkg.name %>.php' ],
				overwrite: true,
				replacements: [
					{
						from: /Stable tag:.*$/m,
						to: 'Stable tag: <%= pkg.version %>',
					},
					{
						from: /Version:.*$/m,
						to: 'Version: <%= pkg.version %>',
					},
					{
						from: /const VERSION = \'.*.'/m,
						to: "const VERSION = '<%= pkg.version %>'",
					},
				],
			},
		},
	} );

	// Register tasks.
	grunt.registerTask( 'js', [ 'jshint', 'uglify' ] );
	grunt.registerTask( 'assets', [ 'js' ] );
	grunt.registerTask( 'default', [ 'assets' ] );
	grunt.registerTask( 'zip', [ 'clean:main', 'copy', 'compress', 'clean:main' ] );
	grunt.registerTask( 'build', [ 'replace', 'assets' ] );
	grunt.registerTask( 'release', [ 'build', 'clean:main', 'copy', 'compress' ] );
};
