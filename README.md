
# Using Plupload For Drag & Drop File Uploads In ColdFusion

by Ben Nadel ([www.bennadel.com][1])

This project demonstrates how to use [Plupload][2] to enable drag & drop 
uploading in a ColdFusion project. The drag & drop feature is only supported
in browsers that have implemented enough of the HTML5 spec. For older browsers
(and IE), the uploader fails-over to a Flash object. The Flash object doesn't
support drag & drop; but, it can still support multi-file uploads.

## Buggy On Windows Virtual Machine

In my testing, this works perfectly on my Mac in all browsers. However, when 
I try to test on my Windows Virtual Machine (Windows 7), I get bugginess in 
all of the browsers. This behavior includes:

* Failure to start upload.
* Failure to finish upload.
* Failure to recognize "upload complete" event.
* Failure to handle drag events (relatedTarget).

I am not sure if this is related to the Virtual Machine? Or, if this is a 
Windows-related issue.


[1]: http://www.bennadel.com
[2]: http://www.plupload.com