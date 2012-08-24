// Define the Uploader module.
define(
	[
		"jquery",
		"plupload"
	],
	function( $, Plupload ){


		// I initialize the uploader module. The uploadUrl parameter
		// is where the files will be uploaded by the Pluploader.
		function Uploader( target, uploadUrl, swfUrl ){

			// Cache DOM element references.
			this._dom = {};
			this._dom.target = target;
			this._dom.dropzone = target.find( "div.dropzone" );
			this._dom.queue = target.find( "div.queue" );
			this._dom.files = target.find( "ul.files" );
			this._dom.templates = $( target.find( "script.templates" ).html() );

			// Store the upload URL and the flash fallback SWF.
			this._uploadUrl = uploadUrl;
			this._swfUrl = swfUrl;

			// Create an initialize the Plupload instance.
			this._uploader = new Plupload.Uploader({

				// Try to load the HTML5 engine and then, if that's 
				// not supported, the Flash fallback engine.
				runtimes: "html5,flash",

				// The upload URL.
				url: this._uploadUrl,

				// The ID of the drop-zone element.
				drop_element: "pluploadDropzone",

				// To enable click-to-select-files, you can provide a
				// browse button. We can use the same one as the drop
				// zone.
				browse_button: "button",

				// For the Flash engine, we have to define the ID of
				// the node into which Pluploader will inject the 
				// <OBJECT> tag for the flash movie.
				container: "pluploadContainer",

				// The URL for the SWF file for the Flash upload 
				// engine for browsers that don't support HTML5.
				flash_swf_url: this._swfUrl

			});

			console.log( $("#pluploadDropzone") );
			console.log( $("#pluploadContainer") );

			console.log( this._uploader );

			// When the Pluploader Uploader is instantiated, it will
			// try to implement the HTML5 file upload engine; if it 
			// cannot, it wil fallback to the flash engine. We can
			// check to see which engine it has selected (and we can
			// use this information to help determine if drag-drop is
			// supported by the browser). We won't know this until 
			// the pluploader has finished initializing. Let's 
			// default t0 true.
			this._supportsDragDrop = true;

			this._uploader.bind(
				"Init",
				function( uploader, params ){

					console.log( uploader );

				}
			);

			this._uploader.bind('Error', function(up, err) {
				console.log( arguments );
			});


			// Initialize the pluploader.
			this._uploader.init();

			console.log( this._uploader );


		}


		// Define the class methods.
		Uploader.prototype = {



		};


		// -------------------------------------------------- //
		// -------------------------------------------------- //


		// Return the module constructor.
		return( Uploader );


	}
);