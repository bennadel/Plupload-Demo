
<!---
	The Name field represents the filename as it exists on the client
	machine.
--->
<cfparam name="form.name" type="string" />

<!---
	The File field represents the TMP file into which the binary 
	data of the upload is being stored. This can be accessed via 
	CFFile/Upload.
--->
<cfparam name="form.file" type="string" />


<!--- Sleep for a brief period to allow UI a chance to show. --->
<!--- ------------------------------------------------------ --->
<cfset sleep( 1000 ) />
<!--- ------------------------------------------------------ --->


<!--- Save the file to the uploads directory. --->
<cffile
	result="upload"
	action="upload"
	filefield="file"
	destination="#application.uploadsDirectory#"
	nameconflict="makeunique"
	/>

<!--- Return a success message. --->
<cfheader
	statuscode="201"
	statustext="Created"
	/>