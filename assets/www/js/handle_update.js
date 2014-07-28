function cordovaExec(callback, pluginName, action, arr) {
    cordova.exec(callback, function (err) {
        alert('error');
    }, pluginName, action, arr);
};


function HandleUpdate(){

}

HandleUpdate.prototype = {
    getRootPath : function(){
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,     function (fileSystem) {
                                                                        fileSystem.root.getDirectory("Android/data/com.vp9.tv/", 
                                                                            {create: true, exclusive: false}, 
                                                                            function(dirEntry) {
                                                                                rootPath = dirEntry.fullPath;
                                                                                console.log("-----------------------rootPath: " + rootPath);
                                                                                alert("rootPath: " + rootPath);
                                                                            }, function(){
                                                                                alert("fail1");
                                                                            });;
                                                                    }, 
            function(){
                alert("fail2");
            }
        );
    },
    getRootPath2 : function(){
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,     function (fileSystem) {
                                                                        alert(fileSystem.root);
                                                                        alert(fileSystem.root.fullPath);
                                                                    }, 
            function(){
                alert("fail2");
            }
        );
    },
    writeLine: function(fileName, text, onSuccess, onError) {
            var that = this;
            var grantedBytes = 0;

            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){

                                                                        that.createFile.call(that, fileSystem, fileName, text, onSuccess, onError);
                                                                    }, function(error){
                                                                        that.fail(that, error);
                                                                    });
    },

    createFile : function(fileSystem, fileName, text, onSuccess, onError) {     // create file if not exist

        var that = this;
        fileSystem.root.getFile(fileName, {create: true, exclusive: false}, function(fileEntry){
                                                                                that.createFileWriter.call(that, fileEntry, text, onSuccess, onError);
                                                                            }, function(error){
                                                                                that.fail(that, error);
                                                                            });
    },

    createFileWriter : function(fileEntry, text, onSuccess, onError) {

        var that = this;
        fileEntry.createWriter(function(writer){
            writer.seek(0);
            writer.write(text);
            onSuccess.call(that, text);
        }, function(error){
            // that.fail(that, error);
            onError.call(that, error);
        });     
    },

    fail : function(error) {
        alert(error.code);
    },


    // Read 
    readTextFromFile : function(fileName, onSuccess, onError) {
            var that = this;
    
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
                                                             function(fileSystem) {
                                                                     that.getFileEntry.call(that, fileSystem, fileName, onSuccess, onError);
                                                             },
                                                             function(error){
                                                                that.fail(that, error);
                                                            });
    },

    getFileEntry: function(fileSystem, fileName, onSuccess, onError) {
    
            var that = this;
            // Get existing file, don't create a new file.
            fileSystem.root.getFile(fileName, {create: true, exclusive: false},
                                                            function(fileEntry) {
                                                                    that._getFile.call(that, fileEntry, onSuccess, onError);
                                                            }, 
                                                            function(error){
                                                                that.fail(that, error);
                                                            });
    },

    _getFile: function(fileEntry, onSuccess, onError) { 
            var that = this; 
            fileEntry.file(
                    function(file) { 
                            that._getFileReader.call(that, file, onSuccess);
                    },
                    function(error){
                        that.fail(that, error);
                    });
    },

    _getFileReader: function(file, onSuccess) {
            var that = this;
            var reader = new FileReader();
            reader.onloadend = function(evt) { 
                    var textToWrite = evt.target.result;
                    onSuccess.call(that, textToWrite);
            };
            reader.readAsText(file);
    },

    //clear directory
    removeDirectory : function(directory, onError){
        var that = this;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
            that.onFileSystemSuccess(fileSystem, directory, onError);
        }, onError);

    },
    onFileSystemSuccess : function(fileSystem, directory, onError) {
        fileSystem.root.getDirectory(
                 directory,
                {create : true, exclusive : false},
                function(entry) {
                entry.removeRecursively(function() {
                    alert("Remove  Succeeded");
                }, onError);
            }, onError);
    },

    // check file exsit
    checkFileExsit : function(fileName, onSuccess, onError) {
            var that = this;
    
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
                                                             function(fileSystem) {
                                                                     that.getFileExsitEntry.call(that, fileSystem, fileName, onSuccess, onError);
                                                             },
                                                             function(error){
                                                                that.fail(that, error);
                                                            });
    },
    getFileExsitEntry: function(fileSystem, fileName, onSuccess, onError) {
    
            var that = this;
            // Get existing file, don't create a new file.
            fileSystem.root.getFile(fileName, {create: false, exclusive: false},
                                                            function(fileEntry) {
                                                                    that._getFile.call(that, fileEntry, onSuccess, onError);
                                                            }, 
                                                            function(error){
                                                                that.fail(that, error);
                                                            });
    },

}

var instanceHandleUpdate = new HandleUpdate();




var Version = Class.extend({
    version : null,
    important : null,
    url : null,
    init : function(){

    },
    setVersion : function(value){
        this.version = value;
    },
    setImportant : function(value){
        this.important = value;
    },
    setUrl : function(value){
        this.url = value
    },
    getVersion : function(){
        return this.version;
    },
    getImportant : function(){
        return this.important;
    },
    getUrl : function(){
        return this.url;
    },
    toString : function(){
        return "version = " + this.version + "\n important = " + this.important; 
    }
});


function GetVersionFromServer(result){

    cordova.exec(function(response){
        parseText(response, result);
    }, function(fail){
        console.log(fail);
    }, "HandlerEventPlugin", "httprequest", [{"url" : "http://tv.vp9.tv/launcher/launcherversion.txt"}]);

    // var xhr = new XMLHttpRequest();
 //    xhr.onreadystatechange=function(){
 //        if (xhr.readyState==4 && xhr.status==200){
 //            var response = xhr.responseText;
 //            parseText(response, result);
            
 //        }
 //    }
 //    xhr.open("GET","version.txt",false);
 //    xhr.send();


}

function parseText(response, result){
    if (response != "") {
        var lines = response.split("\n");

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            
            if (line.substring(0,1) != "" && line.substring(0,1) != "#") {
                
                var split = line.split("=");
                if (split[0].indexOf("version") > -1) {
                    result.setVersion(split[1].trim());
                    
                }else if (split[0].indexOf("important") > -1) {
                    result.setImportant(split[1].trim());
                    
                }else if (split[0].indexOf("url") > -1) {
                    result.setUrl(split[1].trim());
                    
                }
            }

        };
    };
}

function getVersionFromNative(success, fail, pluginName, action, arr){
    cordova.exec(success, fail, pluginName, action, arr);
}

var isLock = true;
function getCheckUpdateVersion(){

    if (IsAndroid) {

        var versionFromServer = new Version();
        GetVersionFromServer(versionFromServer);

        var arr = [];
        var obj = {"url" :  versionFromServer.getUrl() };
        arr.push(obj);


        //phunn
        function addUpdateDialog() {
            $('<div id="update" class="popup" popupfor="update" style="display: none;"><div class="popup-content"><div class="popup-header"><h2>Thông báo</h2></div><div class="popup-body row"><div class="col-sm-12"><p>Bạn cần cập nhật phiên bản mới để sử dụng ứng dụng VP9</p></div><div class="col-sm-6"><input type="button" value="Đồng ý" id="accept"></div><div class="col-sm-6"><input type="button" value="Hủy bỏ" id="deny"></div></div></div></div>').appendTo('body');
                $('#update #accept').on("click", function(){
                    $('#update').css("display", "block");
                    cordova.exec(function(){}, function(){}, "HandlerEventPlugin", "install_app", arr);
                                                                                
                    return false;
                });
                
                $('#update #deny').on("click", function(){
                    $('#update').css("display", "none");
                    return false;
                });
        }

        getVersionFromNative(function(data){

            if(!isNaN(parseFloat(data))){   // check version from native
                if (parseFloat(data) < parseFloat(versionFromServer["version"])) {
                    //phunn
                    addUpdateDialog();
                    //phunn
                    $('#update').css("display", "block");
                    if (versionFromServer.getImportant() == "1") {

                        //$('#update p').text("Ban phai update de su dung ung dung");
                        $('#update #deny').hide();
                    }else{
                        isLock = false;
                    }
                }else{
                    isLock = false;
                }
            }else if(versionFromServer["version"] == undefined){    // check version from server
                //$('#dialog-description').text("Ban phai update de su dung ung dung");
                isLock = false;
            }else{
                //phunn
                addUpdateDialog();
                //$('#dialog-description').text("Ban phai update de su dung ung dung");
                $('#update #deny').hide();
                $('#update').css("display", "block");
            }
        }, function(fail){
            //phunn
            addUpdateDialog();
            $('#update #deny').hide();
            $('#update').css("display", "block");

        }, "HandlerEventPlugin", "getVersion", []);

    }   
}


function checkIfFileExists(path){ // '/sdcard/icon.png'
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
        fileSystem.root.getFile(path, { create: false }, fileExists, fileDoesNotExist);
    }, getFSFail); //of requestFileSystem
}
function fileExists(fileEntry){
    alert("File " + fileEntry.fullPath + " exists!");
}
function fileDoesNotExist(){
    alert("file does not exist");
}
function getFSFail(evt) {
    console.log(evt.target.error.code);
}