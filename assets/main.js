
// Configure our RequireJS paths.
require.config({

	// Since Plupload doesn't support AMD loading, we can use the shim
	// configuration to define a just-in-time module that exports the
	// Plupload library as the named-module, "plupload". 
	shim: {
		plupload: {
			exports: "plupload"
		}
	},

	// Set up the paths to our various modules. Be sure to include the
	// "full" plupload file - otherwise, you'll get a -500 Init Error.
	paths: {
		domReady: "require/domReady",
		jquery: "jquery/jquery-1.8.0.min",
		plupload: "plupload/js/plupload.full",
		views: "views"
	},

	// To help prevent JS caching while we're developing.
	urlArgs: ("v=" + (new Date()).getTime())

});


// Run our boostrap file once the DOM-Ready event has fired. Notice
// that I am running domReady as a plugin (ie. ends with "!").
require(
	[ 
		"jquery",
		"views/uploader",
		"domReady!"
	],
	function( $, Uploader ){


		// Create an instance of our upload view giving it the root
		// module node and the server-side end-point for the uploads.
		// Since we want to use the Flash runtime, we have to give
		// it the URL to the Flash engine SWF file to fallback to if
		// the user's browser doesn't support the HTML5 file API.
		var uploader = new Uploader( 
			$( "div.uploader" ),
			"upload_files.cfm",
			"assets/plupload/js/plupload.flash.swf"
		);


	}
);