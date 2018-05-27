//set the global vars
var sheetID = "Ma7Xv49KZEI8ssu_XziNs0NAONQ2lCa5B"; //needed as you cannot use getActiveSheet() while the sheet is not in use (as in a standalone application like this one)
var scriptURL = "https://script.google.com/macros/s/AKfycbytiMYA6sUnb5dRE3yVzXUJApEDzk5f9Sm_Ihx1pXI0NW4pfLk/exec";  //the URL of this web app


/* 
Important: you are restricted in what you do by the Google Apps Script quotas. 
The two you are most likely to hit into are: 
1) The maximum runtime for a script is 6 minutes. If you are processing lots of files you may have to run it in batches. 
2) The URLfetch (the HTTP/HTTPS service used to make the API calls) has a 10MB maximum payload size per call.
   so for anything bigger than 10 MB you need a different solution, 
   
*/


// ******************************************************************************************************
// Function to display the HTML as a webApp
// ******************************************************************************************************
function doGet(e) {
  
  //you can also pass a parameter via the URL as ?add=XXX 

  var template = HtmlService.createTemplateFromFile('Dashboard');  

  var htmlOutput = template.evaluate()
                   .setSandboxMode(HtmlService.SandboxMode.IFRAME)
                   .setTitle('Dashboard WFDF Sport Dev')
                   .addMetaTag('viewport', 'width=device-width, initial-scale=1')
                   .setFaviconUrl('http://threeflamesproductions.com/wp-content/uploads/2017/01/Favicon_ThreeFlames_FireIcon_Color.png');

  return htmlOutput;
};



// ******************************************************************************************************
// Function to print out the content of an HTML file into another (used to load the CSS and JS)
// ******************************************************************************************************
function getContent(filename) {
  var pageContent = HtmlService.createTemplateFromFile(filename).getRawContent();
  return pageContent;
}

// ******************************************************************************************************
// Function to shortcut writing a call for a user property
// ******************************************************************************************************
function printUVal(key) {
  var dummy = PropertiesService.getUserProperties().getProperty(key);
  return dummy;
  //TODO - add logic for when the property is not defined
}

// ******************************************************************************************************
// Function to shortcut writing a call for a script property
// ******************************************************************************************************
function printSVal(key) {
  var dummy = PropertiesService.getScriptProperties().getProperty(key);
  return dummy;
  //TODO - add logic for when the property is not defined
}

// ******************************************************************************************************
// Function to create menus when you open the sheet
// ******************************************************************************************************
function onOpen(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var menuEntries = [{name: "Configure the github repo", functionName: "githubRepoConfigure"},
                     {name: "Set GitHub authentication", functionName: "setGithubAuthToken"}
                    ]; 
  ss.addMenu("GitHub", menuEntries);
}



// ******************************************************************************************************
// Function to store the github details of the user and repo, and store what is necessary for future calls
// ******************************************************************************************************
function githubRepoConfigure() {
  
  var gh_user = Browser.inputBox("Enter the GitHub username of the repo owner", "GitHub username", Browser.Buttons.OK);
  PropertiesService.getScriptProperties().setProperty("gh_user", gh_user); 
  
  var gh_repo = Browser.inputBox("Enter your GitHub repo", "GitHub repo", Browser.Buttons.OK);
  PropertiesService.getScriptProperties().setProperty("gh_repo", gh_repo);  
  
 }  


function setGithubAuthToken() {
  
  //get the user details
  var git_user = Browser.inputBox("Enter your GitHub username", "GitHub username", Browser.Buttons.OK); 
  PropertiesService.getUserProperties().setProperty("git_user", git_user); 
  var git_password = Browser.inputBox("Enter your GitHub password (it will not be stored)", "GitHub password", Browser.Buttons.OK);
  //base64 encode the username:pwd to create the Basic authentication that you need to access the OAUTH API
  var authString = Utilities.base64Encode(git_user + ':' + git_password);
  
  
  //Now make a call to GitHub and use Basic Auth to get an OAuth token 
  var url = 'https://api.github.com/authorizations';  
   
  //note is required
  var payloadParams = {
    scopes: [
      'repo',
      'gist'
    ],
    note: 'gas-github_' + Date.now()  
  }
  
  var params = {
			method: 'POST',
			muteHttpExceptions: true,
			contentType: "application/json",
            responseType: 'json',
            headers: { Authorization: 'Basic ' + authString },
			payload: JSON.stringify( payloadParams )
		}
  var response = UrlFetchApp.fetch(url, params);
  
  if (response.getResponseCode() == 200 || response.getResponseCode() == 201) {
    Logger.log(response);
    var response_JSON = JSON.parse(response);
 	var gh_token = response_JSON.token;
    PropertiesService.getUserProperties().setProperty("git_token", git_token);
  } else {
    Logger.log("There was an error when trying to create the authorisation token.");
	throw new Error(response.getContentText());
  }

}



// ******************************************************************************************************
// Function to convert a string into a SEO-friendly URL
// from https://stackoverflow.com/questions/14107522/producing-seo-friendly-url-in-javascript
// ******************************************************************************************************
function toSeoUrl(url) {
    return url.toString()               // Convert to string
        .normalize('NFD')               // Change diacritics
        .replace(/[\u0300-\u036f]/g,'') // Remove illegal characters
        .replace(/\s+/g,'-')            // Change whitespace to dashes
        .toLowerCase()                  // Change to lowercase
        .replace(/&/g,'-and-')          // Replace ampersand
        .replace(/[^a-z0-9\-]/g,'')     // Remove anything that is not a letter, number or dash
        .replace(/-+/g,'-')             // Remove duplicate dashes
        .replace(/^-*/,'')              // Remove starting dashes
        .replace(/-*$/,'');             // Remove trailing dashes
}