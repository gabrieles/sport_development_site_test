function createSampleDoc() {
  var doc = DocumentApp.create('Sample Document');
  var body = doc.getBody();
  var rowsData = [['Plants', 'Animals'], ['Ficus', 'Goat'], ['Basil', 'Cat'], ['Moss', 'Frog']];
  body.insertParagraph(0, doc.getName())
      .setHeading(DocumentApp.ParagraphHeading.HEADING1);
  table = body.appendTable(rowsData);
  table.getRow(0).editAsText().setBold(true);
}


function testStoreImageinGDrive(){
  //see https://stackoverflow.com/questions/35236232/create-image-file-base64-to-blob-using-google-appscript
  
  //see https://stackoverflow.com/questions/23450187/storing-images-from-url-to-gae-datastore
  var imageURL = "https://leadingpersonality.files.wordpress.com/2013/05/smile.jpg";
  var image=UrlFetchApp.fetch(imageURL); 
  var imageBlob = image.getBlob();
  DriveApp.createFile("testImage.jpg",imageBlob);
}


// see https://developers.google.com/apps-script/reference/drive/drive-app#searchFolders(String)

function getFoldersToLog(){
  var out = DriveApp.getFolders();
  Logger.log(out)  
}

function getFilesToLog(){
  var out = DriveApp.getFiles()
  Logger.log(out)  
}

function getHTMLfromGDocID(fileID){
  var forDriveScope = DriveApp.getStorageUsed();
  var url = "https://docs.google.com/feeds/download/documents/export/Export?id="+fileID+"&exportFormat=html";
  var param = {
    method      : "get",
    headers     : {"Authorization": "Bearer " + ScriptApp.getOAuthToken()},
    muteHttpExceptions:true,
  };
  var entirePageHTML = UrlFetchApp.fetch(url,param).getContentText();
  
  //remove the gdrive <style>
  var bodyHtml = /<body.*?>([\s\S]*)<\/body>/.exec(entirePageHTML)[1];
  
  return(bodyHtml);  
}


function getFileContentFromName(fileName) {
  var files = DriveApp.getFilesByName(fileName);
  while (files.hasNext()) {
    var file = files.next();
    var fileID = file.getId();
    var fileContent = DriveApp.getFileById(fileID).getBlob().getDataAsString();
    Logger.log(fileContent);
  }
}