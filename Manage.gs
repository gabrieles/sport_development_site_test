var policyFileID = "12kzgkjUvspUsMw4ZnliHawTbTYeKjVW8n4tFWiBbwMI"
var termsFileID = "1J_-G_ASI_6Trh06TJNGH4l_NPwF1GaB3LcvOC8NsKKI"
var devProjFileID = '1iKVUfRALKMkcb1jBcV7LFEy67gTU_BdGfV_FzHfoPXU';
var discAmbassFileID = '1jlg3QmQiGZG1vhYp4hUoauT6odG2Qdy8EDLACD4VtFM';
var teamFundFileID = '1gzmpsUdeXgyFpZwlolsDofR0t0buQahl0PlbiQ3euKk';


function updateAllProjectPages(){
  var sheet = SpreadsheetApp.getActive().getSheetByName('Projects');
  
  //get all values
  var lastRow = sheet.getLastRow();
  var range = sheet.getRange(2, 1, lastRow, 1);
  var projIDs = range.getValues();
  var pLength = projIDs.length;
  for (var i=0; i<pLength-1; i++){
    var index = projIDs[i];
    updateProjectPage(index);
    Logger.log('Project ' + index + ' updated');
  }
}


function updateAllCorePages() {
  updatePage('index.html', createHTML('home', 'WFDF Development - Home', 'homepage') );
 
  updatePage('projects/projects.json', JSON.stringify(sheet2Json('Projects')) );
  updatePage('projects.html', createHTML('projects', 'WFDF Development - Projects', 'utility-page') );
  
  updatePage('resources/resources.json', JSON.stringify(sheet2Json('Resources')) );
  updatePage('resources.html', createHTML('resources', 'WFDF Development - Resources', 'utility-page') );
  
  updatePage('development-projects.html', createUtilityPageHTML(devProjFileID, 'Projects - WFDF Development') );
  updatePage('privacy-policy.html', createUtilityPageHTML(policyFileID, 'Privacy Policy - WFDF Development') );
  updatePage('terms-of-use.html', createUtilityPageHTML(termsFileID, 'Terms of use - WFDF Development'));
   
}



function updateMainCSS() {
  var fileContent = getContent('main.css');
  var path = 'css/main.css';
  var css_version = printVal('css_version');
  var new_css_version = parseInt(css_version,10) + 1;
  PropertiesService.getScriptProperties().setProperty("css_version", new_css_version.toString() ); 
  updatePage(path, fileContent);
}

function updateMainJS() {
  var fileContent = getContent('main.js');
  var path = 'js/main.js';
  var js_version = printVal('js_version');
  var new_js_version = parseInt(js_version,10) + 1;
  PropertiesService.getScriptProperties().setProperty("js_version", new_js_version.toString() ); 
  updatePage(path, fileContent);
}



function createProjectPage(id) {
  var fileContent = generateProjectHTML(id);
  var path = "projects/" + id.toString() + '.html';
  createFile(path,fileContent)
}

function updateProjectPage(id) {
  var fileContent = generateProjectHTML(id);
  var path = "projects/" + id.toString() + '.html';
  updatePage(path, fileContent);
}


function createCarouselJSON(path){
  //carousel json
  var outJson = sheet2Json('Carousel');
  var fileContent = JSON.stringify(outJson);
  createFile(path, fileContent);
}




//function needed only once to initialise the whole project
function generateAllCoreFiles() {
    
  //home
  createFile('index.html', createHTML('home', 'WFDF Development - Home', 'homepage'));
  
  //projects json
  createFile('projects/projects.json', JSON.stringify(sheet2Json('Projects')));
  
  //projects page
  createFile('projects.html', createHTML('projects', 'WFDF Development - Projects', 'utility-page'));

  //resources json
  createFile('resources/resources.json', JSON.stringify(sheet2Json('Resources')));
  
  //Resources page
  createFile('resources.html', createHTML('resources', 'WFDF Development - Projects', 'utility-page'));
  
  //development projects
  createFile('development-projects.html', createUtilityPageHTML(devProjFileID, 'Development Projects - WFDF Development') );

  //disc ambassadors
  createFile('disc-ambassadors.html', createUtilityPageHTML(discAmbassFileID, 'Disc Ambassadors - WFDF Development'));
  
  //privacy policy
  createFile('privacy-policy.html', createUtilityPageHTML(policyFileID, 'Privacy Policy - WFDF Development'));

  //team Fundraising
  createFile('team-fundraising.html', createUtilityPageHTML(teamFundFileID, 'Team fundraising - WFDF Development'));
  
  //terms
  createFile('terms-of-use.html', createUtilityPageHTML(termsFileID, 'Terms of use - WFDF Development'));
}



