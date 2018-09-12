/* 
To run the script that interact with Google drive, you need to enable the Google Drive API: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAA6klEQVQY05WRzwqCQBCH94GiS+Ah6A8EXXwQ7wsqKGqCStAz9B7R2TqZdpAMCopOvUPQ9huZhfLW4WOY3367jKNwXVeAAliO44ggCESSJG2lHvkCbMjTogInHA468gz5DbzJI9kCD7qAwyMkg+U5+jM/VJMneIwxuNi2rSCVWZatURvqkR+AocdowSsT3/f3kBSqCsOQ6ha5oZ1vWcRxvCJZStnKURRJ/shfGZh4qSSZINnzvBz5tCub4M4z52maLlErnrnWF/Qen7yNHaQ+b2OEvuJtXMkTvHAKChz2OnseIm/Aizzxzx/8AIvX4+gc2zPQAAAAAElFTkSuQmCC
You can do it by clikcing on "Tools > Script Editor" and then on "Resources > Advanced Google Services"

Important: the REST calls are restricted by the Google Apps Script quotas. The two you are most likely to hit into are: 
1) The maximum runtime for a script is 6 minutes. Individual scripts have a limit of 30 seconds. 
2) The URLfetch (the HTTP/HTTPS service used to make the API calls) has a 20MB maximum payload size per call.
   For full details, see https://developers.google.com/apps-script/guides/services/quotas   
   
*/


// ******************************************************************************************************
// Function to display the HTML as a webApp
// ******************************************************************************************************
function doGet(e) {
  
  //you can also pass a parameter via the URL as ?add=XXX 

  var template = HtmlService.createTemplateFromFile('Dashboard');  

  var htmlOutput = template.evaluate()
                   .setSandboxMode(HtmlService.SandboxMode.IFRAME)
                   .setTitle('Dashboard Development')
                   .addMetaTag('viewport', 'width=device-width, initial-scale=1')
                   .setFaviconUrl('http://threeflamesproductions.com/wp-content/uploads/2017/01/Favicon_ThreeFlames_FireIcon_Color.png');

  return htmlOutput;
};



// ******************************************************************************************************
// Function to print out the content of a file
// ******************************************************************************************************
function getContent(filename) {
  var pageContent = HtmlService.createTemplateFromFile(filename).getRawContent();
  return pageContent;
}



// ******************************************************************************************************
// Function to store the Google Analytics Tracking ID and the Google Optimize ID 
// ******************************************************************************************************
function configureGoogleScripts() {
  
  var ga_trackingID = Browser.inputBox("Enter your Google Analytics Tracking ID", "Tracking ID", Browser.Buttons.OK);
  PropertiesService.getScriptProperties().setProperty("ga_trackingID", ga_trackingID.trim()); 
  
  var gOptimiseID = Browser.inputBox("Enter your Google Optimise ID", "Google Optimise ID", Browser.Buttons.OK);
  PropertiesService.getScriptProperties().setProperty("gOptimiseID", gOptimiseID.trim()); 
 }  

// ******************************************************************************************************
// Function to return the code to run Google Analytics, Google Tag Manager, and Google Optimize
// ******************************************************************************************************
function addGoogleScriptSnippets(){
  var html = ''
  var ga_trackingID = printVal('ga_trackingID');
  var gOptimiseID = printVal('gOptimiseID');
  
  // Add function to disable tracking if the opt-out cookie exists.
  html += "<script> " +    
            "var disableStr = 'ga-disable-" + ga_trackingID + "'; " +
            "var gat_gtagStr = '_gat_gtag_" + ga_trackingID + "'; " +
            "if (document.cookie.indexOf(disableStr + '=true') > -1) { window[disableStr] = true; } " +
            "function delete_cookie(name) {" +
              "var expires = new Date(0).toUTCString(); " +
              "var domain = location.hostname.replace(/^www\./i, ''); " +
              "document.cookie = name + '=; expires=' + expires + '; path=/; domain=.' + domain;" +
            "}" + 
            "function gaOptout() { " +
              "delete_cookie('_ga'); " +
              "delete_cookie(gat_gtagStr); " +
              "delete_cookie('_gid'); " +
              "document.cookie = disableStr + '=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/'; " +
              "window[disableStr] = true; " + 
            "} " +
          "</script>";
  
  html += "<style>.async-hide { opacity: 0 !important} </style>" +
          "<script>" + 
            "(function(a,s,y,n,c,h,i,d,e){s.className+=' '+y;h.start=1*new Date;" +
            "h.end=i=function(){s.className=s.className.replace(RegExp(' ?'+y),'')};" +
            "(a[n]=a[n]||[]).hide=h;setTimeout(function(){i();h.end=null},c);h.timeout=c;" +
            "})(window,document.documentElement,'async-hide','dataLayer',4000,{'" + gOptimiseID + "':true});" + 
          "</script>";

  //code from https://support.google.com/optimize/answer/7513085?hl=en  
  html += '<!-- Global site tag (gtag.js) - Google Analytics -->' +
          '<script async src="https://www.googletagmanager.com/gtag/js?id=' + ga_trackingID + '"></script>' +
          '<script>' +
            'window.dataLayer = window.dataLayer || []; ' +
            'function gtag(){dataLayer.push(arguments);} ';
  html +=   "gtag('js', new Date()); " +
            "gtag('config', '" + ga_trackingID + "', { 'optimize_id': '" + gOptimiseID + "', 'anonymize_ip': true });" +
          "</script>";
  
  return html;            
}


// ******************************************************************************************************
// Function to return the full HTML of a page by stitching together all page components
// ******************************************************************************************************
function createHTML(pageID, pageTitle, bodyClass) {
  
  var html = '<!DOCTYPE html>' +
             '<html>' +
               '<head>' +
                 addGoogleScriptSnippets() +
                 '<base target="_top">' + 
                  getContent('head') +                   
                  '<title>' + pageTitle + '</title>' +
                  createLinksToJSandCSS() +  
               '</head>' +
               '<body id="page-top" class="' + bodyClass + '">' +
                 getContent('navigation') +  
                 getContent(pageID) +
                 getContent('footer') + 
               '</body>' +
             '</html>'  
  return html;               
}


// ******************************************************************************************************
// Function to return links to the main css and JS files with their respective version numbers
// ******************************************************************************************************
function createLinksToJSandCSS() {
  var out = '<script src="js/main.js?v=' + printVal('js_version') + '"></script>' +
            '<link href="/css/main.css?v=' + printVal('css_version') + '" rel="stylesheet">';
  return out;
}


// ******************************************************************************************************
// Function to return the full HTML of a page by stitching together different page components
// ******************************************************************************************************
function createUtilityPageHTML(pageID, pageTitle, bodyClass) {
  
  if (typeof bodyClass === 'undefined') { 
    bodyClass = ' ' + bodyClass; 
  } else {
     bodyClass = ''; 
  }
  
  var pageBody = '<section>' +
                   '<div class="container">' +
		             '<div class="row">' +
		               '<div class="col-lg-12">' +
                         getHTMLfromGDocID(pageID) +
                       '</div>' +
		             '</div>' +
	               '</div>' +
                 '</section>'; 
  
  var html = '<!DOCTYPE html>' +
             '<html>' +
               '<head>' +
                 addGoogleScriptSnippets() +
                 '<base target="_top">' + 
                  getContent('head') +                   
                  '<title>' + pageTitle + '</title>' +
                  createLinksToJSandCSS() +  
               '</head>' +
               '<body id="page-top" class="utility-page' + bodyClass + '">' +
                 getContent('navigation') +  
                 pageBody +
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
                     {name: "Configure the Cloudinary API", functionName: "cloudinaryConfigure"},
                     {name: "Configure Google Analytics and Optimize", functionName: "configureGoogleScripts"},
                     {name: "Set your GitHub authentication", functionName: "setGithubAuthToken"},
                    ]; 
  ss.addMenu("Configure", menuEntries);
}




// ******************************************************************************************************
// Function to generate the HTML for a project page
// ******************************************************************************************************
function generateProjectHTML(id) {
  
  var html = '';
  var idString = id.toString();
  var data = sheet2Json('Projects');
  //filter the data to get the project with the required id
  var projectDataArray = data.filter(function (entry) {
    return entry.id == idString;
  });
  //the above returns an array - you want just the first item
  var projectData = projectDataArray[0];
  
  var bodyClass = 'project-page';

  html += '<!DOCTYPE html>' +
            '<html>' +
              '<head>' +
                addGoogleScriptSnippets() +
                '<base target="_top">' + 
                getContent('head') +                   
                '<title>' + projectData.title + ' - WDFD Development</title>' +
                createLinksToJSandCSS() +  
              '</head>' +
              '<body id="page-top" class="' + bodyClass + '">' +
                getContent('navigation');  
               
	
  // Header
  var headerImage_url = projectData.headerImage_url;
  if(!headerImage_url) { headerImage_url = '/images/header.jpg';}    
    html += '<header class="masthead" style="background-image: url(' + headerImage_url + ')">' +
			  '<div class="container">' +
				'<div class="intro-text">' +
					'<div class="intro-lead-in">' + projectData['headline'] + '</div>' +
					'<div class="intro-heading text-uppercase">' + projectData['title'] + '</div>' +
					'<a class="btn btn-primary btn-xl text-uppercase js-scroll-trigger" href="#donate">Give</a>' +
				'</div>' +
			  '</div>' +
			'</header>';

  // Project description - you have 3 rows
  html += '<section id="description">' +
     	    '<div class="container">';
    
  if (projectData.quote) { 
    html += '<div class="row">' +
              '<div class="col-lg-12">' +
                '<blockquote class="blockquote">' +
                  '<p>' +
                    projectData.quote +
                  '</p>' +    
                '</blockquote>' +   
              '</div>' +
            '</div>';
  }
    
  if (projectData.description) { 
    html += '<div class="row">' +
              '<div class="col-lg-12">' +
                getHTMLfromGDocID(projectData.description) +
              '</div>' +
            '</div>';
  }
    	
  if (projectData.carouselJSON) { 
    var carouselID = 'carousel-' + id;
    html += '<div class="row">' +
              '<div class="col-lg-12">' +
                generateCarousel(carouselID, projectData.carouselJSON) +
              '</div>' +
            '</div>';
  }
	
  html += '</section>';

	
  
  // Donate section - up to 3 calls to action
  var colCount = 0;
  if(projectData.money_url) { colCount = colCount+1 }
  if(projectData.equipment_text) { colCount = colCount+1 }
  if(projectData.service_text) { colCount = colCount+1 }
	
  if (colCount> 0) {
    var colSize = 12/colCount;
    
    html += '<section id="donate">' +
              '<div class="container">' +
				'<div class="row text-center">';
				  if(projectData.money_url) {
					html += '<div class="col-md-' + colSize + '">' +
							  '<a class="cta cta-ask cta-button" data-toggle="modal" href="' + projectData.money_url +'">' +
								'<span class="fa-stack fa-4x">' +
								  '<i class="fa fa-circle fa-stack-2x text-primary"></i>' +
								  '<i class="fa fa-question fa-stack-1x fa-inverse"></i>' +
								'</span>' +
							  '</a>' +
							  '<h4 class="service-heading">' +
							    '<a class="cta cta-ask cta-text" data-toggle="modal" href="' + projectData.money_url + '">Donate</a>' +
							  '</h4>' +
							  '<p class="text-muted">' + projectData.money_text + '</p>' +
							'</div>';
				  }
						
				  if(projectData.equipment_text) {
					if (!projectData.equipment_url) { projectData.equipment_url = '#give-equipment'}
					  html += '<div class="col-md-' + colSize + '">' +
					 		    '<a class="cta cta-ask cta-button" data-toggle="modal" href="' + projectData.equipment_url + '">' +
								  '<span class="fa-stack fa-4x">' +
									'<i class="fa fa-circle fa-stack-2x text-primary"></i>' +
									'<i class="fa fa-question fa-stack-1x fa-inverse"></i>' +
								  '</span>' +
								'</a>' +
								'<h4 class="service-heading">' +
								  '<a class="cta cta-ask cta-text" data-toggle="modal" href="' + projectData.equipment_url + '">Give</a>' +
								'</h4>' +
								'<p class="text-muted">' + projectData.equipment_text + '</p>' +
							  '</div>';
				  }
						
				  if(projectData.service_text) {
					if (!projectData.service_url) { projectData.service_url = '#give-service'}
					  html += '<div class="col-md-' + colSize + '">' +
								'<a class="cta cta-ask cta-button" data-toggle="modal" href="' + projectData.service_url + '">' +
					   			  '<span class="fa-stack fa-4x">' +
									'<i class="fa fa-circle fa-stack-2x text-primary"></i>' +
									'<i class="fa fa-question fa-stack-1x fa-inverse"></i>' +
								  '</span>' +
								'</a>' +
								'<h4 class="service-heading">' +
								  '<a class="cta cta-ask cta-text" data-toggle="modal" href="' + projectData.service_url + '">Give</a>' +
								'</h4>' +
								'<p class="text-muted">' + projectData.service_text + '</p>' +
							  '</div>';
				  }

				  html += '</div>' +
				        '</div>' +
			          '</section>';
  }
	
  // Team - TODO
  if(projectData.has_team) {
    html += '<section class="bg-light" id="team">' +
			'</section>';
  }
  
  // Links - TODO
  var colCount = 0;
  if(projectData.facebook_url) { colCount = colCount+1 }
  if(projectData.twitter_url) { colCount = colCount+1 }
  if(projectData.site_url) { colCount = colCount+1 }
  
  if (colCount> 0) {
    var colSize = 12/colCount;
    
  }  
    
  html += getContent('footer') + 
        '</body>' +
      '</html>';  

  return html;

}	


// ******************************************************************************************************
// Get the content of a google sheet and convert it into a json - based on https://gist.github.com/daichan4649/8877801 but with performance improvements
// ******************************************************************************************************
function sheet2Json(sheetName) {
  var sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
  
  //get all values
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn()
  var range = sheet.getRange(1, 1, lastRow, lastCol);
  var allValues = range.getValues();
  
  //first row is for the property titles
  var titleColumns = allValues[0];

  // create json
  var jsonArray = [];
  for(var i=1; i<lastRow; i++) {
    var line = allValues[i];
    var json = new Object();
    for(var j=0; j<lastCol; j++) {
      json[titleColumns[j]] = line[j];
    }
    jsonArray.push(json);
  }
  return jsonArray;
}


// ******************************************************************************************************
// Take the output of a google form with a list of image files, and create an array with the file IDS
// ******************************************************************************************************
function generateFileIDArrayFromFileList(fileList){
  var stringsArray = fileList.split(' ,');
  var outArray = [];
  for(var i=0; i<stringsArray.length; i++) {
    var fileID = stringsArray[i].split('=')[1];
    outArray.push(fileID);
  }
  return outArray;
}


// ******************************************************************************************************
// Take the output of generateFileIDArrayFromFileList, upload all images to gitHub, and return an array with their URL
// ******************************************************************************************************
function uploadImagesFromArray(folder, fileIDArray){
  // create json
  var jsonArray = [];  

  for(var i=0; i<fileIDArray.length; i++) {
    var json = new Object();
    
    json['type'] = 'image';

    var fileID = fileIDArray[i];
    var fileName = 'image_' + i;
    var path = generateImagePath(fileID, folder, fileName);
    createImage(fileID, path);

    json['url'] = path;
    
    jsonArray.push(json);
  }  
  return jsonArray;
}


// ******************************************************************************************************
// Take the folder and file name and generate the output URL
// ******************************************************************************************************
function generateImagePath(fileID, folder, fileName){
  var fileType = DriveApp.getFileById(fileID).getMimeType();
  switch(fileType) {
    case 'image/bmp':
      var fileExt = '.bmp';
      break;
    case 'image/gif':
      var fileExt = '.gif';
      break;
    case 'image/jpeg':
      var fileExt = '.jpg';
      break;
    case 'image/png':
      var fileExt = '.png';
      break;
    default:
      //nothing      
  }
  
  //Add a / at the end of the folder name if necessary
  if (folder.length > 0 && folder.slice(-1) != "/") { folder += "/" }
  
  var path = folder + fileName + fileExt;
  
  return path;
}


// ******************************************************************************************************
// Take the folder and the output of generateFileIDArrayFromFileList, and generate the JSON for the carousel
// ******************************************************************************************************
function createJSONFromArray(folder, fileIDArray){

  // create json
  var jsonArray = [];  
  for(var i=0; i<fileIDArray.length; i++) {
    var json = new Object();
    
    json['type'] = 'image';
    
    var fileID = fileIDArray[i];
    var fileName = 'image_' + i;
    var path = generateImagePath(fileID, folder, fileName);
    json['url'] = path;
    
    jsonArray.push(json);
  }  
  return jsonArray;  
}

// ******************************************************************************************************
// Function to convert a string into a SEO-friendly URL
// from https://stackoverflow.com/questions/14107522/producing-seo-friendly-url-in-javascript
// ******************************************************************************************************
function toSeoUrl(textToConvert) {
    return textToConvert.toString()               // Convert to string
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



// ******************************************************************************************************
// Function to generate the HTML for a carousel from a path to a JSON file
// ******************************************************************************************************
function generateCarousel(itemID, linksJSON){
    
  var html = '<div id="' + itemID + '" class="carousel slide" data-ride="carousel">';
  
  var data = linksJSON;
  
  //indicators
  html += '<ul class="carousel-indicators">' +
            '<li data-target="#' + itemID + '" data-slide-to="0" class="active"></li>';
  
  for(var i=1; i<data.length; i++){
    html += '<li data-target="#' + itemID + '" data-slide-to="' + i + '"></li>';  
  }
  html += '</ul>'; 
    
    
  //carousel
  html += '<div class="carousel-inner">';
    
  var isActive = ' active';
  
  for(var j=0; j<data.length; j++){  
    var slideEl = data[j];
    switch(slideEl.type) {
      case 'image':
        html += '<div class="carousel-item' + isActive + '">' +
                  '<img src="' + slideEl.url + '">' +   
                '</div>';
        break;
      case 'youtube':
        html += '<div class="carousel-item' + isActive + '">' +
                  '<iframe src="' + slideEl.url + '" allow="autoplay; encrypted-media" allowfullscreen></iframe>' +
                '</div>';  
      default:
      //do nothing  
    }
    isActive = '';
  }  
    
  html += '</div>';
    
    
  //controls
  html += '<a class="carousel-control-prev" href="#' + itemID + '" data-slide="prev">' +
            '<span class="carousel-control-prev-icon"></span>' +
          '</a>' +
          '<a class="carousel-control-next" href="#' + itemID + '" data-slide="next">' +
            '<span class="carousel-control-next-icon"></span>' +
          '</a>';
  
  
  html += '</div>';
  
  return html;   

}