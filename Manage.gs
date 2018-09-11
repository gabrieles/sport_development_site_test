var policyFileID = "12kzgkjUvspUsMw4ZnliHawTbTYeKjVW8n4tFWiBbwMI"
var termsFileID = "'1J_-G_ASI_6Trh06TJNGH4l_NPwF1GaB3LcvOC8NsKKI'"


function updateAllProjects(){
  updateProjectPage(1);
  updateProjectPage(2);
  updateProjectPage(3);
  updateProjectPage(4);
  updateProjectPage(5);
  updateProjectPage(6);
  updateProjectPage(345);
}


function createTestImage(){
  var fileID = '1154hFm_EBRxiCCNX9NSvhbbMLJE5u945';
  var folder = 'images';
  var fileName = 'test';
  var path = generateImagePath(fileID, folder, fileName);
  createImageInGitHub(fileID, path);
}

function createImageInGitHub(fileID, path){
  var fileContent = DriveApp.getFileById(fileID).getBlob().getBytes();
  createFile(path, fileContent, 'image created via gSuite', 'master'); 
}

function updateHome() {
  var html = createHTML('home', 'WFDF Development - Home', 'homepage');
  var path = 'index.html'
  var fileContent = html;
  var message = 'updated page via gSuite';
  var branch = 'master';
  updatePage(path, fileContent, message, branch);
}

function updateProjectsJSON(){
  var outJson = sheet2Json('Projects');
  var path = 'projects/projects.json';
  var fileContent = JSON.stringify(outJson);
  var message = 'updated page via gSuite';
  var branch = 'master';
  updatePage(path, fileContent, message, branch);
}

function updateResources() {
  var html = createHTML('resources', 'WFDF Development - Resources', 'utility-page');
  var path = 'resources.html'
  var fileContent = html;
  var message = 'updated page via gSuite';
  var branch = 'master';
  updatePage(path, fileContent, message, branch);
}

function updateResourcesJSON(){
  var outJson = sheet2Json('Resources');
  var path = 'resources/resources.json';
  var fileContent = JSON.stringify(outJson);
  var message = 'updated page via gSuite';
  var branch = 'master';
  updatePage(path, fileContent, message, branch);
}

function updateProjects() {
  var html = createHTML('projects', 'WFDF Development - Projects', 'utility-page');
  var path = 'projects.html'
  var fileContent = html;
  var message = 'updated page via gSuite';
  var branch = 'master';
  updatePage(path, fileContent, message, branch);
}


function updatePrivacyPolicy() {
  var html = createUtilityPageHTML(policyFileID, 'Privacy Policy - WFDF Development');
  var path = 'privacy-policy.html'
  var fileContent = html;
  var message = 'updated page via gSuite';
  var branch = 'master';
  updatePage(path, fileContent, message, branch);
}

function updateTerms() {
  var html = createUtilityPageHTML(termsFileID, 'Terms of use - WFDF Development');
  var path = 'terms-of-use.html'
  var fileContent = html;
  var message = 'updated page via gSuite';
  var branch = 'master';
  updatePage(path, fileContent, message, branch);
}

function updateMainCSS() {
  var html = getContent('main.css');
  var css_version = printVal('css_version');
  var new_css_version = parseInt(css_version,10) + 1;
  PropertiesService.getScriptProperties().setProperty("css_version", new_css_version.toString() ); 
  var path = 'css/main.css';
  var fileContent = html;
  var message = 'updated page via gSuite';
  var branch = 'master';
  updatePage(path, fileContent, message, branch);
}

function updateMainJS() {
  var html = getContent('main.js');
  var js_version = printVal('js_version');
  var new_js_version = parseInt(js_version,10) + 1;
  PropertiesService.getScriptProperties().setProperty("js_version", new_js_version.toString() ); 
  var path = 'js/main.js'
  var fileContent = html;
  var message = 'updated page via gSuite';
  var branch = 'master';
  updatePage(path, fileContent, message, branch);
}


function createProjectPage(id) {
  var html = generateProjectHTML(id);
  var path = "projects/" + id.toString() + '.html';
  var fileContent = html;
  var message = 'create page via gSuite';
  var branch = 'master';
  createFile(path,fileContent, message, branch)
}

function updateProjectPage(id) {
  var html = generateProjectHTML(id);
  var path = "projects/" + id.toString() + '.html';
  var fileContent = html;
  var message = 'create page via gSuite';
  var branch = 'master';
  updatePage(path, fileContent, message, branch);
}



function createDevProjPage(){
  var html = createUtilityPageHTML('1iKVUfRALKMkcb1jBcV7LFEy67gTU_BdGfV_FzHfoPXU', 'Projects - WFDF Development');
  var path = 'development-projects.html'
  var fileContent = html;
  var message = 'updated page via gSuite';
  var branch = 'master';
  createFile(path, fileContent, message, branch);
}

function updateDevProjPage() {
  var html = createUtilityPageHTML('1iKVUfRALKMkcb1jBcV7LFEy67gTU_BdGfV_FzHfoPXU', 'Projects - WFDF Development');
  var path = 'development-projects.html'
  var fileContent = html;
  var message = 'updated page via gSuite';
  var branch = 'master';
  updatePage(path, fileContent, message, branch);
}



function createDiscMissionaryPage(){
  var html = createUtilityPageHTML('1jlg3QmQiGZG1vhYp4hUoauT6odG2Qdy8EDLACD4VtFM', 'Disc missionary - WFDF Development');
  var path = 'disc-missionary.html'
  var fileContent = html;
  var message = 'updated page via gSuite';
  var branch = 'master';
  createFile(path, fileContent, message, branch);
}
function createTeamFundraisingPage(){
  var html = createUtilityPageHTML('1gzmpsUdeXgyFpZwlolsDofR0t0buQahl0PlbiQ3euKk', 'Team fundraising - WFDF Development');
  var path = 'team-fundraising.html'
  var fileContent = html;
  var message = 'updated page via gSuite';
  var branch = 'master';
  createFile(path, fileContent, message, branch);
}


function createCarouselJSON(path){
  //carousel json
  var outJson = sheet2Json('Carousel');
  var fileContent = JSON.stringify(outJson);
  var message = 'created carousel JSON via gSuite';
  var branch = 'master';
  createFile(path, fileContent, message, branch);
}


//function needed only once to initialise the whole project
function generateAllCoreFiles() {
  //home
  var html = createHTML('home', 'WFDF Development - Home', 'homepage');
  var path = 'index.html'
  var fileContent = html;
  var message = 'created homepage via gSuite';
  var branch = 'master';
  createFile(path, fileContent, message, branch);
  
  //projects json
  var outJson = sheet2Json('Projects');
  var path = 'projects/projects.json';
  var fileContent = JSON.stringify(outJson);
  var message = 'created projects JSON via gSuite';
  var branch = 'master';
  createFile(path, fileContent, message, branch);
  
  //Projects page
  var html = createHTML('projects', 'WFDF Development - Projects', 'utility-page');
  var path = 'projects.html'
  var fileContent = html;
  var message = 'updated page via gSuite';
  var branch = 'master';
  createFile(path, fileContent, message, branch);

  //resources json
  var outJson = sheet2Json('Resources');
  var path = 'resources/resources.json';
  var fileContent = JSON.stringify(outJson);
  var message = 'created projects JSON via gSuite';
  var branch = 'master';
  createFile(path, fileContent, message, branch);
  
  //Resources page
  var html = createHTML('resources', 'WFDF Development - Projects', 'utility-page');
  var path = 'resources.html'
  var fileContent = html;
  var message = 'updated page via gSuite';
  var branch = 'master';
  createFile(path, fileContent, message, branch);
    
  //Privacy policy
  var html = createUtilityPageHTML('12kzgkjUvspUsMw4ZnliHawTbTYeKjVW8n4tFWiBbwMI', 'Privacy Policy - WFDF Development');
  var path = 'privacy-policy.html'
  var fileContent = html;
  var message = 'updated page via gSuite';
  var branch = 'master';
  createFile(path, fileContent, message, branch);
  
  //Terms
  var html = createUtilityPageHTML('1J_-G_ASI_6Trh06TJNGH4l_NPwF1GaB3LcvOC8NsKKI', 'Terms of use - WFDF Development');
  var path = 'terms-of-use.html'
  var fileContent = html;
  var message = 'updated page via gSuite';
  var branch = 'master';
  createFile(path, fileContent, message, branch);
}


function updateAllCorePages() {
  updateHome();
  updateProjectsJSON();
  updateProjects();
  updatePrivacyPolicy();
  updateTerms();
}


function deleteTestFile(){
  var path = 'test.txt'
  var message = 'test delete via gsuite';
  var branch = 'master';
  var sha = '36bb377081cf509c77482ba1b91842254f7f35ee';
  deleteFile(path, message, branch, sha)
}