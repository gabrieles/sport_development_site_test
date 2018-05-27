function reposToLogger() {
  Logger.log( getMyRepos('gabrieles') );
}

function createTestFile(){
  var path = 'test.txt'
  var fileContent = 'melonstan';
  var message = 'test commit via gsuite';
  var branch = 'master';
  createFile(path,fileContent, message, branch)
}

function updateTestFile(){
  var path = 'test.txt'
  var fileContent = 'berrystan';
  var message = 'test update via gsuite';
  var branch = 'master';
  var sha = '0e4035b65d53b6d721faf9356117b4d9cc9d7a8e';
  updateFile(path, fileContent, message, branch, sha)
}

function deleteTestFile(){
  var path = 'test.txt'
  var message = 'test delete via gsuite';
  var branch = 'master';
  var sha = '36bb377081cf509c77482ba1b91842254f7f35ee';
  deleteFile(path, message, branch, sha)
}

function getUserEmail(){
 var email = Session.getActiveUser().getEmail();
 Logger.log(email); 
}

function getTestContent(){
 var git_user = printSVal('gh_user');
 var git_repo = printSVal('gh_repo'); 
 var aaa = getRepoContent(git_user, git_repo, 'test.txt') 
 Logger.log(aaa);
}