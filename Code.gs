//set the global vars
var sheetID = "Ma7Xv49KZEI8ssu_XziNs0NAONQ2lCa5B"; //needed as you cannot use getActiveSheet() while the sheet is not in use (as in a standalone application like this one)
var scriptURL = "https://script.google.com/macros/s/AKfycbytiMYA6sUnb5dRE3yVzXUJApEDzk5f9Sm_Ihx1pXI0NW4pfLk/exec";  //the URL of this web app


/* 
To run the script that interact with Google drive, you need to enable the Google Drive API: 
You can do it by clikcing on "Tools > Script Editor" and then on "Resources > Advanced Google Services"

Important: the REST calls are restricted by the Google Apps Script quotas. The two you are most likely to hit into are: 
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
// Function to return the full HTML of a page by stitching together different page components
// ******************************************************************************************************
function createHTML(pagename, pageTitle, bodyClass) {
 
  var html = '<!DOCTYPE html>' +
             '<html>' +
               '<head>' +
                 '<base target="_top">' + 
                  getContent('head') +                   
                  '<title>' + pageTitle + '</title>' +
               '</head>' +
               '<body id="page-top" class="' + bodyClass + '">' +
               getContent('navigation') +  
               getContent(pagename) +
               getContent('footer') + 
               '</body>' +
             '</html>'  
  return html;               
}



// ******************************************************************************************************
// Function to shortcut writing a call for a user property
// ******************************************************************************************************
function printVal(key) {

  if (key == "git_token" || key == "git_user") {
     var dummy = PropertiesService.getUserProperties().getProperty(key);    
  } else {
     var dummy = PropertiesService.getScriptProperties().getProperty(key);    
  }
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