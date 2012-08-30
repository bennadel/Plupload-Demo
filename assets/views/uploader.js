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
			this._dom.dropzone = target.find( "a.dropzone" );
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
				browse_button: "pluploadDropzone",

				// For the Flash engine, we have to define the ID of
				// the node into which Pluploader will inject the 
				// <OBJECT> tag for the flash movie.
				container: "pluploadContainer",

				// The URL for the SWF file for the Flash upload 
				// engine for browsers that don't support HTML5.
				flash_swf_url: this._swfUrl

			});

			// When the Pluploader Uploader is instantiated, it will
			// try to implement the HTML5 file upload engine; if it 
			// cannot, it wil fallback to the flash engine. We can
			// check to see which engine it has selected (and we can
			// use this information to help determine if drag-drop is
			// supported by the browser). We won't know this until 
			// the pluploader has finished initializing. Let's 
			// default to true (since the HTML also defaults this 
			// way -- ie, uses CSS classes).
			this._supportsDragDrop = true;

			// The uploader needs time to initialize and load the most
			// appropriate runtime. When this is done, we'll bind the
			// events for the interactions.
			this._uploader.bind(
				"Init",
				$.proxy( this, "_handlePluploadInit" )
			);

			// Listen for any errors on the plupload interactions.
			this._uploader.bind( 
				"Error",
				$.proxy( this, "_handlePluploadError" )
			);

			// When files are added to Plupload, they go in the queue.
			this._uploader.bind(
				"FilesAdded",
				$.proxy( this, "_handlePluploadFilesAdded" )
			);

			// When files are added or removed from the queue.
			this._uploader.bind(
				"QueueChanged",
				$.proxy( this, "_handlePluploadQueueChanged" )
			);

			// When a chunk of a file has been uploaded.
			this._uploader.bind(
				"UploadProgress",
				$.proxy( this, "_handlePluploadUploadProgress" )
			);

			// When a file has finished uploading.
			this._uploader.bind(
				"FileUploaded",
				$.proxy( this, "_handlePluploadFileUploaded" )
			);			

			// Initialize the pluploader.
			this._uploader.init();

			// Return this object reference.
			return( this );

		}


		// Define the class methods.
		Uploader.prototype = {

			// I add a file line item to the visual queue.
			_addFileToQueue: function( id, name, size ){

				var fileLineItem = this._createFileLineItem( id, name, size );

				// Add teh file to the visual queue.
				this._dom.files.append( fileLineItem );

			},


			// I check for an empty queue; and hide it if it is empty.
			_checkForEmptyQueue: function(){

				// If there are not children in the queue, hide it.
				if (!this._dom.files.children( ":visible" ).length){

					this._hideFileQueue();

				}

			},


			// I create a new file line item template instance.
			_createFileLineItem: function( id, name, size ){

				// Clone our template.
				var lineItem = this._dom.templates
					.filter( "li.file" )
						.clone()
				;

				// Set the properties.
				lineItem.attr( "data-id", id );
				lineItem.find( "span.name" ).text( name );
				lineItem.find( "span.totalSize" ).text( this._formatBytes( size ) );

				return( lineItem.clone() );

			},


			// I format the Bytes as a more readible number.
			_formatBytes: function( byteCount ){

				// If the file is less than a 1K, don't do much.
				if (byteCount < 1024){

					return( byteCount + "B" );

				}

				// Convert to K for smaller number.
				return( Math.floor( byteCount / 1024 ) + "K" );

			},


			// I get the file line item with the given ID.
			_getFileLineItemByID: function( id ){

				// Find the queue item with the given ID.
				var fileLineItem = this._dom.files
					.children( "li[ data-id = '" + id + "' ]" )
				;

				return( fileLineItem );

			},


			// I handle the mouse / drag out of the dropzone.
			_handleMouseOut: function( event ){

				// We only want to do this if the event was triggered
				// on the dropzone (and is not bubbling).
				if (this._isMouseEventRelevant( event, this._dom.dropzone )){

					this._dom.dropzone.removeClass( "hotDropzone" );
					
				}

			},


			// I handle the mouse / drag over the dropzone.
			_handleMouseOver: function( event ){

				// We only want to do this if the event was triggered
				// on the dropzone (and is not bubbling).
				if (this._isMouseEventRelevant( event, this._dom.dropzone )){

					this._dom.dropzone.addClass( "hotDropzone" );

				}

			},


			// I get called when an error occurs in the Plupload 
			// instance. 
			_handlePluploadError: function( uploader, error ){

				// If we have access to the console, log the error.
				if (window.console && window.console.log){

					console.log( "Plupload Error:", error );

				}

			},


			// I get called when one or more files are added to the
			// Plupload queue. 
			_handlePluploadFilesAdded: function( uploader, files ){

				// For some reason, calling start() here doesn't seem
				// to actually start the upload. I think the event is
				// being fired [[incorecctly] before the files are 
				// actually added to the queue -- if you log out the 
				// queue, it is currently empty.
				//
				// If you use setTimeout() to start the uploader, it
				// then works fine.
				//
				// Rely on Queue-change event instead. Use this 
				// opporutnity to populate the visual queue.

				// Show the file queue.
				this._showFileQueue();

				// Add each file to the queue.
				for (var i = 0 ; i < files.length ; i++ ){

					this._addFileToQueue(
						files[ i ].id,
						files[ i ].name,
						files[ i ].size
					);

				}

			},


			// I get called when a given file has finished uploading.
			_handlePluploadFileUploaded: function( uploader, file, response ){

				// Remove the file from the Plupload queue.
				this._uploader.removeFile( file );

				// Remove file from the visual queue.
				this._removeFileFromQueue( file.id );

			},


			// I get called when the pluploader instance has been 
			// initialized and a runtime has been chosen.
			_handlePluploadInit: function( uploader, params ){

				// Determine whether or not this browser supports 
				// drag-drop. We'll need this to create various
				// event bindings.
				this._supportsDragDrop = !!uploader.features.dragdrop;

				// Set up the drag-drop workflow.
				if (this._supportsDragDrop){

					this._dom.dropzone.on(
						"mouseover dragenter",
						$.proxy( this, "_handleMouseOver" )
					);

					this._dom.dropzone.on(
						"mouseout dragleave",
						$.proxy( this, "_handleMouseOut" )
					);

				// Set up the click-only workflow (no drag-drop).
				} else {

					// Show the Flash insturctions.
					this._dom.dropzone
						.removeClass( "html5Dropzone" )
						.addClass( "flashDropzone" )
					;


				}

			},


			// I get called when files are added or removed from the
			// queue.
			_handlePluploadQueueChanged: function( uploader ){

				// If there are files left in the queue, upload them.
				if (
					this._uploader.files.length && 
					this.isNotUploading()
					){

					this._uploader.start();

				}

			},


			// I get called when a chunk of a file has been uploaded.
			_handlePluploadUploadProgress: function( uploader, file ){

				this._setFileProgress(
					file.id,
					file.uploaded,
					file.percent
				);

			},


			// I hide the file queue.
			_hideFileQueue: function(){

				this._dom.queue
					.removeClass( "activeQueue" )
					.addClass( "emptyQueue" )
				;

			},


			// I determine if the given event is relevenat to the 
			// given element. This is meant to return True if the
			// event is not being triggered internally to the element
			// as part of event propagation.
			_isMouseEventRelevant: function( event, element ){

				// Get the related target (ie. the one "losing" 
				// the mouse).
				var relatedTarget = event.relatedTarget;
				var target = $( element );

				// If the related target is not defined, then we'll 
				// flag this event as being relevant.
				if (!relatedTarget){

					return( true );

				}

				// If the related target is the element, then it's not
				// relevant. NOTE: Does this only happen on event 
				// delegation?
				if (target.is( relatedTarget )){

					return( false );

				}

				// If the related target is not inside the element, 
				// then the event is relevant since it is crossing-
				// over into the target.
				if (!$.contains( target[ 0 ], relatedTarget )){

					return( true );

				}

				// If we made it this far, then the event is part of
				// propagation and is not relevant to the element.
				return( false );

			},


			// I determine if the upload is currently inactive.
			isNotUploading: function(){

				var currentState = this._uploader.state;

				return( currentState === Plupload.STOPPED );

			},


			// I determine if the uploader is currently uploading a
			// file (or if it is inactive).
			isUploading: function(){

				var currentState = this._uploader.state;

				return( currentState === Plupload.STARTED );

			},


			// I remove the file from the queue.
			_removeFileFromQueue: function( id ){

				// Find the queue item with the given ID.
				var fileLineItem = this._getFileLineItemByID( id );

				// Fade it out quickly.
				fileLineItem.fadeOut(
					"fast",
					$.proxy( this, "_checkForEmptyQueue" )
				);

			},


			// I update the progress display of a file in the queue.
			_setFileProgress: function( id, loaded, percent ){

				// Find the queue item with the given ID.
				var fileLineItem = this._getFileLineItemByID( id );

				fileLineItem.find( "span.percentComplete" )
					.text( percent + "%" )
				;

			},


			// I show the file queue.
			_showFileQueue: function(){

				this._dom.queue
					.removeClass( "emptyQueue" )
					.addClass( "activeQueue" )
				;

			}

		};


		// -------------------------------------------------- //
		// -------------------------------------------------- //


		// Return the module constructor.
		return( Uploader );


	}
);