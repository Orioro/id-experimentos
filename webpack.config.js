module.exports = {
	mode: 'development',
  entry: {
  	'movimento-1': './movimento-1/index.js',
  },
  output: {
    filename: 'dist/[name].js'
  },
  module: {
	  rules: [
		  // the 'transform-runtime' plugin tells babel to require the runtime
		  // instead of inlining it.
		  {
		    test: /\.js$/,
		    exclude: /(node_modules|bower_components)/,
		    use: {
		      loader: 'babel-loader',
		      options: {
		        presets: ['@babel/preset-env'],
		        plugins: ['transform-object-rest-spread']
		      }
		    }
		  },
		  
      {
        test: /\.txt$/,
        use: 'raw-loader'
      }
		]
  }
}
