function updateOneProject(){
  updateProjectPage(345);
}

function updateProjectsJSON(){
  var outJson = sheet2Json('Projects');
  var path = 'projects/projects.json';
  var fileContent = JSON.stringify(outJson);
  var message = 'updated page via gSuite';
  var branch = 'master';
  updateFile(path, fileContent, message, branch);
}

function updateAllCore() {
  updateMainCSS();
  updateMainJS();
  updateHome();
  updateProjects();
  updatePrivacyPolicy();
  updateTerms();
}

function updateHome() {
  var html = createHTML('home', 'ToGetThere - Home', 'homepage');
  var path = 'index.html'
  var fileContent = html;
  var message = 'updated page via gSuite';
  var branch = 'master';
   updateFile(path, fileContent, message, branch);
}

function updateProjects() {
  var html = createHTML('projects', 'ToGetThere - Projects', 'utility-page');
  var path = 'projects.html'
  var fileContent = html;
  var message = 'updated page via gSuite';
  var branch = 'master';
   updateFile(path, fileContent, message, branch);
}


function updatePrivacyPolicy() {
  var html = createHTML('privacy-policy', 'Privacy Policy - ToGetThere', 'utility-page');
  var path = 'privacy-policy.html'
  var fileContent = html;
  var message = 'updated page via gSuite';
  var branch = 'master';
   updateFile(path, fileContent, message, branch);
}

function updateTerms() {
  var html = createHTML('terms-of-use', 'Terms of use - ToGetThere', 'utility-page');
  var path = 'terms-of-use.html'
  var fileContent = html;
  var message = 'updated page via gSuite';
  var branch = 'master';
   updateFile(path, fileContent, message, branch);
}

function updateMainCSS() {
  var html = getContent('main.css');
  var path = 'css/main.css'
  var fileContent = html;
  var message = 'updated page via gSuite';
  var branch = 'master';
   updateFile(path, fileContent, message, branch);
}

function updateMainJS() {
  var html = getContent('main.js');
  var path = 'js/main.js'
  var fileContent = html;
  var message = 'updated page via gSuite';
  var branch = 'master';
  updateFile(path, fileContent, message, branch);
}

function updateProjectPage(id) {
  var html = generateProjectHTML(id);
  var path = "projects/" + id.toString() + '.html';
  var fileContent = html;
  var message = 'create page via gSuite';
  var branch = 'master';
  updateFile(path, fileContent, message, branch);
}

function createProjectPage(id) {
  var html = generateProjectHTML(id);
  var path = "projects/" + id.toString() + '.html';
  var fileContent = html;
  var message = 'create page via gSuite';
  var branch = 'master';
  createFile(path,fileContent, message, branch)
}


function generatePrivacyPolicy() {
  var html = createHTML('privacy-policy', 'Privacy Policy - ToGetThere', 'utility-page');
  var path = 'privacy-policy.html'
  var fileContent = html;
  var message = 'create page via gSuite';
  var branch = 'master';
  createFile(path,fileContent, message, branch)
}

function deleteTestFile(){
  var path = 'test.txt'
  var message = 'test delete via gsuite';
  var branch = 'master';
  var sha = '36bb377081cf509c77482ba1b91842254f7f35ee';
  deleteFile(path, message, branch, sha)
}