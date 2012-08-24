<cfscript>
component 
	output = "false"
	hint = "I define the application settings and event handlers."
	{


	// Define the application settings.
	this.name = hash( getCurrentTemplatePath() );
	this.applicationTimeout = createTimeSpan( 0, 0, 10, 0 );
	this.sessionManagement = false;

	// Define the root directory so we can set up mappings off of it.
	this.rootDirectory = getDirectoryFromPath( getCurrentTemplatePath() );

	// Set up the uploads directory.
	this.uploadsDirectory = (this.rootDirectory & "uploads/");


}
</cfscript>