var VP9 = VP9 || {};

VP9.cordova = {};

VP9.cordova.getChannelList = function(params, callbackSuccess, callbackError) {
    cordova.exec(callbackSuccess, callbackError, "HandlerEventPlugin", "getChannelList", params);
}

VP9.cordova.startServiceProxy = function(params, callbackSuccess, callbackError) {
    cordova.exec(callbackSuccess, callbackError, "HandlerEventPlugin", "startserviceproxy", params);
}

VP9.cordova.visibleChannelNumber = function(params, callbackSuccess, callbackError) {
    cordova.exec(callbackSuccess, callbackError, "HandlerEventPlugin", "visibleChannelNumber", [params]);
}

VP9.cordova.invisibleChannelNumber = function(callbackSuccess, callbackError) {
    cordova.exec(callbackSuccess, callbackError, "HandlerEventPlugin", "invisibleChannelNumber", []);
}

/*kiem tra activity launcher co chay hay k */
VP9.cordova.checkCurrentActivityRunning = function(callbackSuccess, callbackError) {
    cordova.exec(callbackSuccess, callbackError, "HandlerEventPlugin", "checkCurrentActivityRunning", []);
}

VP9.cordova.getAccountInfos = function(callbackSuccess, callbackError) {
    cordova.exec(callbackSuccess, callbackError, "AccountInfoPlugin", "getAccountInfos", []);
}

VP9.cordova.httpRequest = function(params, callbackSuccess, callbackError) {
    cordova.exec(callbackSuccess, callbackError, "HandlerEventPlugin", "httpRequestGetService", [params]);
}

VP9.cordova.gohomelauncher = function(callbackSuccess, callbackError) {
    cordova.exec(callbackSuccess, callbackError, "HandlerEventPlugin", "gohomelauncher", []);
}










function removeDirectory(){
    var instance = new HandleUpdate();

    instance.removeDirectory("Download", function(){
                                            // alert("remove error");
                                        });
}

function writeFile(data){
    // var data = $('html')[0].outerHTML;

    var instance = new HandleUpdate();      

    instance.readTextFromFile("datalauncher2.txt", function(value){
        instance.writeLine("datalauncher2.txt", data, function(){alert("write file success");}, function(){alert("write file error")});
    }, function(){
        alert("ERROR Read Text");
    });
}

function handlerCordovaMsg(message){
    // logview("<br> handlerCordovaMsg: " + message );

    var parser = JSON.parse(message);
    var action = parser.action;

    if (action == "keyEvent") {
        var keyboard = parser.key;
        // if (keyboard == "key_back") {
        //     VP9.controlUI.handleBack();
        // }

        switch(keyboard){
            case "menu": 
                VP9.cordova.onKeyDown.key_menu();
                break;
            case "key_back":
                VP9.cordova.onKeyDown.key_back();
                break;
            case "key_f1":
                VP9.cordova.onKeyDown.key_back();
                break;
            case "key_f3":
                VP9.cordova.onKeyDown.key_menu();
                break;
            case "key_f9":
                VP9.cordova.onKeyDown.key_back();
                break;
            case "key_f11":
                VP9.cordova.onKeyDown.key_menu();
                break;
            case "key_menu_virtual":
                VP9.cordova.onKeyDown.key_menu();
                break;
            default :
                break;
        }
    }
}

VP9.cordova.onKeyDown = VP9.cordova.onKeyDown || {};
VP9.cordova.onKeyDown.key_back = function(){
    VP9.controlUI.handleBack();
}

VP9.cordova.onKeyDown.key_menu = function(){
    $('.home_menu').trigger('click');
}










var showHideTiviChannelTimeout = "";
function keycodeBroadcast(keycode){
    console.log(keycode);

    
    VP9.cordova.checkCurrentActivityRunning(function(){
        
    }, function(){
        
        
        var keyCodeInfo;
        var msgValue = "";
        var isSuccess = false;
        switch(keycode){
            case "KEYCODE_DEL": 
                msgValue = "key_del";
                isSuccess = true;
                keyCodeInfo = new KeyCodeInfo();
                keyCodeInfo.setMsgValue(msgValue);
                keyCodeInfo.setSuccess(isSuccess);

                _controller.HandleKeyCode.deleteChannel(keyCodeInfo);
                break;
            case "KEYCODE_DPAD_CENTER":
                console.log("--------------keyEnter");
                msgValue = "key_enter";
                isSuccess = true;
                keyCodeInfo = new KeyCodeInfo();
                keyCodeInfo.setMsgValue(msgValue);
                keyCodeInfo.setSuccess(isSuccess);

                // _controller.HandleKeyCode.deleteChannel(keyCodeInfo);
                break;
            default:
                keyCodeInfo = KeyCodeUtil.getKeyCodeInfo(keycode);
                msgValue = keyCodeInfo.getMsgValue();
                
                break;  
        }


        if(KeyCodeUtil.isNumberKey(keycode)){

            // clearTimeout(showHideTiviChannelTimeout);
            // if (IsAndroid) {
            //     var params = [];
            //     window.plugins.handlerplugin.settivichannel(params, function(){
                
            //     }, function(){
                
            //     });
                
            //     showHideTiviChannelTimeout =  setTimeout(function(){
            //         window.plugins.handlerplugin.canceltivichannel(params, function(){
                        
            //         }, function(){
                        
            //         });     
            //     }, 2000);
            // }

            _controller.HandleKeyCode.handleChannelNumber(keyCodeInfo);                     
        }
    });
}


function handlerHomeButton(isLauncherStart){
    console.log("------------------isLauncherStart: " + isLauncherStart);
    if (isLauncherStart == "false") {
        // if($('#appPanel').hasClass('visible')){
            
        //     _controller.AppsVp9Controller.getApps();
        //     $('#appPanel').removeClass('visible');
        //     setTimeout(function(){$('#appPanel').css('display', 'none');}, 500);
        // }else if($('#setting-launcher').css("display") == "block"){
        //     _controller.SettingController.writeFileGeneralConfig();

        //     $('.existedServer').remove();
        //     $('#main-launcher').css("display", "block");
        //     $('#setting-launcher').css("display", "none");
        // }
        VP9.controlUI.handleBack();
    }else{
        if(VP9.controlUI.getLayout() == "vp9apps"){
            _controller.AppsVp9Controller.getApps();
        }
    }
}




// function launchingVP9(object, funcSuccess, funcFail) {
//         var packageChoice = null;
//         var activityChoice = null;
//         var typeChoice = null;
//         var serverChoice = null;
//         var channelNumber = null;

//         if($(object).attr("data-appPackage")){
//             packageChoice = object.getAttribute('data-appPackage');  //com.class.name    
//         }

//         if($(object).attr("data-appActivity")){
//             activityChoice = object.getAttribute('data-appActivity') || "";  //.ActivityCall    
//         }

//         if($(object).attr("data-apptype")){
//             typeChoice = object.getAttribute('data-apptype') || "";  //.ActivityCall
//         }

//         if($(object).attr("data-appserver")){
//             serverChoice = object.getAttribute('data-appserver') || "";  //.ActivityCall
//         }


//         if (object.hasOwnProperty("package")) {
//             packageChoice = object.package;
//         };

//         if (object.hasOwnProperty("activity")) {
//             activityChoice = object.activity;
//         };

//         if (object.hasOwnProperty("type")) {
//             typeChoice = object.type;
//         };

//         if (object.hasOwnProperty("server")) {
//             serverChoice = object.server;
//         };

//         if (object.hasOwnProperty("channelNumber")) {
//             channelNumber = object.channelNumber;
//         };

//         // alert("package: " + packageChoice + "\n activity: " + activityChoice);
//         var obj = {package:packageChoice, activity:activityChoice, type:typeChoice, server : serverChoice};

//         if (channelNumber != null) {
//             obj.channelNumber = channelNumber
//         };
//         window.plugins.launch.app(obj, 
//             function() {if(typeof funcSuccess == "function"){funcSuccess();}}, // Success function
//             function(error) {
//                 // alert('Application/Activity Launch Failed ' + JSON.stringify(error));
//                 if(typeof funcFail == "function"){funcFail();}
//             }); // Failure function
//     };