function createTestImage(){
  var fileID = '1154hFm_EBRxiCCNX9NSvhbbMLJE5u945';
  var folder = 'images';
  var fileName = 'test';
  var path = generateImagePath(fileID, folder, fileName);
  createImageInGitHub(fileID, path);
}




// ******************************************************************************************************
// Function to send to logger the list of the repos of a user. 
// ******************************************************************************************************
function getRepos(gh_user) {

  if (typeof gh_user === 'undefined') { gh_user = printVal('gh_user'); }
  
  // https://developer.github.com/v3/repos/contents/#create-a-file
  var url = Utilities.formatString('https://api.github.com/users/%s/repos', gh_user);    
    
  var params = {
    method: 'GET',
    contentType: "application/json",
    responseType: 'json',
  }
    
  var response = UrlFetchApp.fetch(url, params);

  if (response.getResponseCode() == 200 || response.getResponseCode() == 201) {
    return JSON.parse(response.getContentText());
  } else {
    throw new Error(response.getContentText());
  }
    
}



// ******************************************************************************************************
// Function to send to logger the content of one of your repos. 
// IN:
//   Optional:
//     gh_user: a string with the name of the repo owner. Defaults to the scriptProperty of the same name
//     gh_repo: a string with the repo name. Defaults to the scriptProperty of the same name
//     path: the path of the folder or file. Defaults to /
//     branch: a string with the branch. Defaults to 'master'
// OUT:
//   JSON response
// ******************************************************************************************************
function getRepoContent(gh_user, gh_repo, path, branch) {
  
  if (typeof gh_user === 'undefined') { gh_user = printVal('gh_user'); }
  if (typeof gh_repo === 'undefined') { gh_repo = printVal('gh_repo'); }
  if (typeof path === 'undefined'   ) { path    = ''; }
  if (typeof branch === 'undefined') { branch = 'master' }
  var token   = printVal('git_token');
  
  var params = {
    method: 'GET',
    muteHttpExceptions: true,
    headers: { Authorization: 'Bearer ' + token },
    contentType: "application/json",
    responseType: 'json',
  }
   
  var url = Utilities.formatString('https://api.github.com/repos/%s/%s/contents/%s', gh_user, gh_repo, path);  
  var response = UrlFetchApp.fetch(url, params);

  if (response.getResponseCode() == 200 || response.getResponseCode() == 201) {
    return JSON.parse(response.getContentText());
  } else {
    throw new Error(response.getContentText());
    return false;
  }

}



// ******************************************************************************************************
// Function to create a file in a github repo. 
// See https://developer.github.com/v3/repos/contents/#create-a-file
// IN:
//   Required:
//     path: where the file will be (include the filename!)
//     fileContent: the content of the file (it will be converted to base64 before sending it)
//   Optional:
//     message: a github comment
//     branch: defaults to master
// OUT:
//   True (the file was created)
//   False (the file was not created)
// ******************************************************************************************************
function createFile(path, fileContent, message, branch) {

  if (typeof message === 'undefined') { message = 'Created on ' + Date.now(); + ' via GSuite'}
  if (typeof branch === 'undefined') { branch = 'master' }
  var gh_user = printVal('gh_user');
  var gh_repo = printVal('gh_repo');
  var token   = printVal('git_token');
  var git_user = printVal('git_user');
  
  var filePath = path ? encodeURI(path) : '';
     		
  // https://developer.github.com/v3/repos/contents/#create-a-file
  var url = Utilities.formatString('https://api.github.com/repos/%s/%s/contents/%s', gh_user, gh_repo, filePath);  
  
  var email = Session.getActiveUser().getEmail();
  
  var payloadParams= {
    branch: branch,
    message: message,
    content: Utilities.base64Encode(fileContent),
    committer: {
      name: git_user,
      email: email
    }
  }
        
  var params = {
    method: 'PUT',
    muteHttpExceptions: true,
    contentType: "application/json",
    responseType: 'json',
    headers: { Authorization: 'Bearer ' + token },
    payload: JSON.stringify( payloadParams )
  }
      
  var response = UrlFetchApp.fetch(url, params);

  if (response.getResponseCode() == 200 || response.getResponseCode() == 201) {
    return true;
  } else {
    return false;
  }
    
}



function createImageInGitHub(fileID, path){
  var fileContent = DriveApp.getFileById(fileID).getBlob().getBytes();
  createFile(path, fileContent); 
}



// ******************************************************************************************************
// Function to get the file sha, which is necessary to update or delete a file in a github repo. 
// IN:
//   Required:
//     path: where the file is (include the filename)
// OUT:
//   the sha for the file 
// ******************************************************************************************************
function getFileSha(path){
 var gh_user = printVal('gh_user');
 var gh_repo = printVal('gh_repo'); 
 var response = getRepoContent(gh_user, gh_repo, path, 'master');
 Logger.log(response.sha); 
 return response.sha;
}



// ******************************************************************************************************
// Function to update a page in a github repo. 
// IN:
//   Required:
//     path: where the file will be (include the filename!)
//     fileContent: the content of the file (it will be converted to base64 before sending it)
//     sha: the sha of the file to be updated  
//   Optional:
//     message: a github comment
//     branch: defaults to 'master'
// OUT:
//   True (the file was created)
//   False (the file was not created)
// ******************************************************************************************************
function updatePage(path, fileContent, message, branch, sha) {

  if (typeof message === 'undefined') { message = 'Created on ' + Date.now(); +' via gsuite';}
  if (typeof branch === 'undefined') { branch = 'master' }
  if (typeof sha === 'undefined') { sha = getFileSha(path) }
  var gh_user = printVal('gh_user');
  var gh_repo = printVal('gh_repo');
  var token   = printVal('git_token');
  var git_user = printVal('git_user');
  
  var filePath = path ? encodeURI(path) : '';
     		
  // https://developer.github.com/v3/repos/contents/#update-a-file
  var url = Utilities.formatString('https://api.github.com/repos/%s/%s/contents/%s', gh_user, gh_repo, filePath);  
  
  var email = Session.getActiveUser().getEmail();
  
  var payloadParams= {
    branch: branch,
    message: message,
    sha: sha,
    content: Utilities.base64Encode(fileContent),
    committer: {
      name: git_user,
      email: email
    }
  }
        
  var params = {
    method: 'PUT',
    muteHttpExceptions: true,
    contentType: "application/json",
    responseType: 'json',
    headers: { Authorization: 'Bearer ' + token },
    payload: JSON.stringify( payloadParams )
  }
      
  var response = UrlFetchApp.fetch(url, params);

  if (response.getResponseCode() == 200 || response.getResponseCode() == 201) {
    return true;
  } else {  
    return false;
  }
    
}


// ******************************************************************************************************
// Function to delete a file in a github repo. 
// See https://developer.github.com/v3/repos/contents/#delete-a-file
// IN:
//   Required:
//     path: where the file will be (include the filename!)
//     sha: the sha of the file to be updated  
//   Optional:
//     message: a github comment
//     branch: defaults to master
// OUT:
//   True (the file was created)
//   False (the file was not created)
// ******************************************************************************************************
function deleteFile(path, message, branch, sha) {

  if (typeof message === 'undefined') { message = 'Created on ' + Date.now(); }
  if (typeof branch === 'undefined') { branch = 'master' }
  var gh_user = printVal('gh_user');
  var gh_repo = printVal('gh_repo');
  var token   = printVal('git_token');
  var git_user = printVal('git_user');
  
  var filePath = path ? encodeURI(path) : '';
     		
  var url = Utilities.formatString('https://api.github.com/repos/%s/%s/contents/%s', gh_user, gh_repo, filePath);  
  
  var email = Session.getActiveUser().getEmail();
  
  var payloadParams= {
    branch: branch,
    message: message,
    sha: sha,
    committer: {
      name: git_user,
      email: email
    }
  }
        
  var params = {
    method: 'DELETE',
    muteHttpExceptions: true,
    contentType: "application/json",
    responseType: 'json',
    headers: { Authorization: 'Bearer ' + token },
    payload: JSON.stringify( payloadParams )
  }
      
  var response = UrlFetchApp.fetch(url, params);

  if (response.getResponseCode() == 200 || response.getResponseCode() == 201) {
    return true;
  } else {  
    return false;
  }
    
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