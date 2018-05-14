//set the global vars
var sheetID = "xxx"; //needed as you cannot use getActiveSheet() while the sheet is not in use (as in a standalone application like this one)
var scriptURL = "https://script.google.com/macros/s/AKfycbx7gdszBquToEL_Iw6RRQYaa2-X9Qrs1y8FdrnajoFu3HnfmUKq/exec";  //the URL of this web app


// ******************************************************************************************************
// Function to display the HTML as a webApp
// ******************************************************************************************************
function doGet(e) {
  
  //you can also pass a parameter via the URL as ?add=XXX 

  var template = HtmlService.createTemplateFromFile('homepage');  

  var htmlOutput = template.evaluate()
                   .setSandboxMode(HtmlService.SandboxMode.IFRAME)
                   .setTitle('WFDF Test')
                   .addMetaTag('viewport', 'width=device-width, initial-scale=1')
                   .setFaviconUrl('http://threeflamesproductions.com/wp-content/uploads/2017/01/Favicon_ThreeFlames_FireIcon_Color.png');

  return htmlOutput;
};



// ******************************************************************************************************
// Function to create menus when you open the sheet
// ******************************************************************************************************
function onOpen(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var menuEntries = [{name: "Configure github connection", functionName: "githubConfigure"}]; 
  ss.addMenu("GitHub", menuEntries);
}


function githubConfigure() {
  
  var git_clientId = Browser.inputBox("Enter the GitHub project client ID", "Client ID", Browser.Buttons.OK);
  PropertiesService.getUserProperties().setProperty("host", git_clientId);
  
  var git_clientSecret = Browser.inputBox("Enter the GitHub project Secret", "Client Secret", Browser.Buttons.OK);
  //var git_clientSecret = Utilities.base64Encode(git_clientSecret);
  PropertiesService.getUserProperties().setProperty("git_clientSecret", git_clientSecret);
  
  Browser.msgBox("GitHub configuration saved successfully.");
}  



// ******************************************************************************************************
// Function to print out the content of an HTML file into another (used to load the CSS and JS)
// ******************************************************************************************************
function getContent(filename) {
  var pageContent = HtmlService.createTemplateFromFile(filename).getRawContent();
  return pageContent;
}

