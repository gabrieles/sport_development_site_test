//set the global vars
var sheetID = "Ma7Xv49KZEI8ssu_XziNs0NAONQ2lCa5B"; //needed as you cannot use getActiveSheet() while the sheet is not in use (as in a standalone application like this one)
var scriptURL = "https://script.google.com/macros/s/AKfycbytiMYA6sUnb5dRE3yVzXUJApEDzk5f9Sm_Ihx1pXI0NW4pfLk/exec";  //the URL of this web app


/* 
To use this code you need to:

1) Create an application on Github at https://github.com/settings/developers
     - The callback needs to be set to https://script.google.com/macros/d/{SCRIPT ID}/usercallback 
       where {SCRIPT ID} is the ID of this script, which you can find by clicking on the menu item "File > Project properties" in the script editor
     - The URL needs to be set to where you will be making the call from, so if you are creating an HTML dashboard you will need to use its URL
     
2) Once you have created the application on github, store its Client ID and Client Secret as properties of this Script. 
   You can do it using the custom menu item "GitHub > Configure github connection" (if you have just copy&pasted this code, reopen this file to see it)

3) Setup the OAuth2 library at https://github.com/gsuitedevs/apps-script-oauth2
   You can do it in two ways:
   a) Add it as a library (as it is already published as an Apps Script) 
      In the Apps Script code editor:
        - Click on the menu item "Resources > Libraries..."
        - In the "Find a Library" text box, enter the script ID 1B7FSrk5Zi6L1rSxxTDgDEUsPzlukDsi4KGuTMorsTQHhGBzBkMun4iDF and click the "Select" button.
        - Choose a version in the dropdown box (usually best to pick the latest version).
        - Click the "Save" button.
   b) Copy and paste the files in the /dist directory directly into your script project. (currently there is only 1: OAuth2.gs)
      You can find it at https://github.com/gsuitedevs/apps-script-oauth2/tree/master/dist
   If you are setting explicit scopes in your manifest file, ensure that the following scope is included: https://www.googleapis.com/auth/script.external_request
   
   More info on setting up oAuth2 library here https://github.com/googlesamples/apps-script-oauth2
   

Important: you are restricted by Google Apps Script quotas. 
The two you are most likely to hit into are runtime and UrlFetchApp. 
1) The maximum runtime for a script is 6 minutes and if you are processing lots of files you may have to run in batches. 
2) The URLfetch (the HTTP/HTTPS service used to make the API calls) has a 10MB maximum payload size per call.
   Therefore, if you are planning on using anything bigger than 10 MB you need a different solution, 
   For videos, you may look into the YouTube API service at https://developers.google.com/apps-script/advanced/youtube
   
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
  var menuEntries = [{name: "Configure github connection", functionName: "githubConfigure"}]; 
  ss.addMenu("GitHub", menuEntries);
}



// ******************************************************************************************************
// Function to store the github details of the user and repo, and store what is necessary for future calls
// ******************************************************************************************************
function githubConfigure() {
  
  var gh_user = Browser.inputBox("Enter your GitHub username", "GitHub username", Browser.Buttons.OK);
  PropertiesService.getScriptProperties().setProperty("gh_user", gh_user); 
  
  var gh_password = Browser.inputBox("Enter your GitHub password (it will not be stored)", "GitHub password", Browser.Buttons.OK);
  
  var gh_repo = Browser.inputBox("Enter your GitHub repo", "GitHub repo", Browser.Buttons.OK);
  PropertiesService.getScriptProperties().setProperty("gh_repo", gh_repo);  
      
  var gh_clientId = Browser.inputBox("Enter the GitHub project client ID", "Client ID", Browser.Buttons.OK);
  PropertiesService.getScriptProperties().setProperty("gh_clientId", gh_clientId);
  
  var gh_clientSecret = Browser.inputBox("Enter the GitHub project Secret", "Client Secret", Browser.Buttons.OK);
  //var git_clientSecret = Utilities.base64Encode(gh_clientSecret);
  PropertiesService.getScriptProperties().setProperty("gh_clientSecret", gh_clientSecret);
    
  
  //Now make a call to GitHub and use Basic Auth to get an OAuth token 
  
  //note is required!
  var payloadParams = {
    scopes: [
      'repo',
      'gist'
    ],
    note: 'gas-github_' + Date.now()  
  }
  
  var url = 'https://api.github.com/authorizations';  
  
  //base64 encode the username:pwd to create the Basic authentication that you need to access the OAUTH API
  var authString = Utilities.base64Encode(git_user + ':' + git_password);
  
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
    PropertiesService.getScriptProperties().setProperty("gh_token", gh_token);
  } else {
    Logger.log("There was an error when trying to create the authorisation token.");
	throw new Error(response.getContentText());
  }
}  
