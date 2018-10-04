module.exports = {
	mode: 'development',
  entry: {
  	'movimento-1': './movimento-1/index.js',
  	'movimento-2': './movimento-2/index.js',
  	'movimento-3': './movimento-3/index.js',
  	'movimento-4': './movimento-4/index.js',
  },
  output: {
    filename: '[name].js'
  },
  module: {
	  rules: [
		  // the 'transform-runtime' plugin tells babel to require the runtime
		  // instead of inlining it.
		  {
		    test: /\.js$/,
		    exclude: /(node_modules|bower_components)/,
		    use: {
		      loader: 'babel-loader'
		    }
		  },
		  
      {
        test: /\.txt$/,
        use: 'raw-loader'
      }
		]
  }
}
