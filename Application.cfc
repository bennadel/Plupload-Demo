<cfscript>

component 
	output = "false"
	hint = "I define the application settings and event handlers."
	{


	// Define the application settings.
	this.name = hash( getCurrentTemplatePath() );
	this.applicationTimeout = createTimeSpan( 0, 0, 10, 0 );
	this.sessionManagement = false;


	// I initialize the application.
	function onApplicationStart(){

		// Get the root directory of the demo.
		var rootDirectory = getDirectoryFromPath( getCurrentTemplatePath() );

		// Set up the uploads directory.
		application.uploadsDirectory = (rootDirectory & "uploads/");

		// Return true so the application can load.
		return( true );

	}


	// I initialize the request.
	function onRequestStart(){

		// Check to see if we need to manually reset the application.
		if (structKeyExists( url, "init" )){

			this.onApplicationStart();

		}

		// Return true so the page can load.
		return( true );

	}


}

</cfscript>