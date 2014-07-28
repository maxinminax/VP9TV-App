/*Document Ready*/

//Global Timer Variables

var mainSwiper = null;
var clockTimer = null;
var _controller = {
	AppsController : null,
	AppsShortcutController : null,
	AppsVp9Controller : null,
	SettingController : null,
	ChannelController : null,
	HandleKeyCode : null,
	TopControllBarController : null,
	BottomControllBarController : null,
	SettingControllBarGeneralController : null

}

var timeout;
var IsAndroid = /android/i.test(navigator.userAgent.toLowerCase());
var GLOBAL_CHANNEL_LIST = [];

if (IsAndroid) {

	document.addEventListener("deviceready", vp9odLoaded, false);
}else{
	$(document).ready(function(){vp9odLoaded();});	
}



var VP9 = VP9 || {};
VP9.isOnline = false;
VP9.isCheckUpdate = false;
VP9.timeoutCheckUpdate;
function vp9odLoaded(){
	//phunn
	SOCKETS = new VP9.sockets();

	/*hungvv*/
	
	//Create Main Screen Slider
	// mainSwiper = new Swiper('.swiper-container ',{
	// 	pagination: '.pagination',
	// 	onTouchStart : function(){
	// 		var arg = arguments;
	// 		var target = arg[1].target;
 	//  		return false; 
	// 	},
	// 	onTouchMove : function(){
	// 		var arg = arguments;
	// 		var target = arg[1].target;
	// 		return false;
	// 	},
	// 	onTouchEnd : function(){
	// 		var arg = arguments;
	// 		var target = arg[1].target;
	// 		return false;
	// 	}
	// });

	
	//Enable Listeners
	document.addEventListener("pause", onPause, false);
	document.addEventListener("resume", onResume, false);
	document.addEventListener("backbutton", onBackbutton, false);
	document.addEventListener("online", function(){
		VP9.isOnline = true;
		console.log("------------------ online");
		if (!VP9.isCheckUpdate) {
			clearTimeout(VP9.timeoutCheckUpdate);
			VP9.timeoutCheckUpdate = setTimeout(function(){
				getCheckUpdateVersion();
				VP9.isCheckUpdate = true;
			},2000);
		};

		if (_controller.ChannelController != null && !_controller.ChannelController.getLoaded()) {
			if (IsAndroid) {
				/*get channel*/
				clearTimeout(_controller.ChannelController.getTimeout());
				_controller.ChannelController.getTimeout() = setTimeout(function(){
					console.log("getChannel()");
					_controller.ChannelController.getChannel();	
				},1000);
			}
		};
	}, false);

	document.addEventListener("offline", function(){
		console.log("------------------ offline");
		VP9.isOnline = false;
	}, false);

	VP9.init();	
	

	



	// try{
	// 	logview("getCheckUpdateVersion");
 //    	getCheckUpdateVersion();
 //    }catch(e){
 //    	 $('#updateError').css("display", "block");
 //    }

 //    var intervalCheckversion = setInterval(function () {
 //        if (!isLock) {
 //            clearInterval(intervalCheckversion);
 //            VP9.init();
 //        }
 //        else {
 //        	// VP9.loading.show('Bạn phải cập nhật phiên bản mới để sử dụng ứng dụng!')
 //        }
 //    }, 200);
}
/*End Document Ready*/

var VP9 = VP9 || {};
VP9.init = function(){

	if (IsAndroid) {
		setTimeout(function(){
			window.plugins.apps.generateicons(); 	
		}, 0);
		
	};			
	/*setting*/
	_controller.SettingController = new SettingController();
	// _controller.SettingController.getServer();

	if (IsAndroid) {
		/*get app vp9*/
		_controller.AppsVp9Controller = new AppsVp9Controller();
		_controller.AppsVp9Controller.getApps();
	}
	
	if (IsAndroid) {
		/*get installed app */
		_controller.AppsController =  new AppsController();  /*hungvv*/
	}

	/*get shortcut app*/
	// _controller.AppsShortcutController = new AppsShortcutController();
	// _controller.AppsShortcutController.list();


	if (IsAndroid) {
		/*get channel*/
		
		setTimeout(function(){
			console.log("getChannel()");
			_controller.ChannelController = new ChannelController();
			_controller.ChannelController.getChannel();	
		},1000);
	}
	
	

	_controller.HandleKeyCode = new HandleKeyCode();
	_controller.TopControllBarController = new TopControllBarController();
	_controller.BottomControllBarController = new BottomControllBarController();
	


	// setTimeout(function(){
	// 	VP9.reloadicon();
	// },0);
	
	

	
	
	/*hungvv*/
	$(document).on('click', '#btnSubmitCommand', function(){ 
	    var command = $("#txtCommand").val();
        var script = document.createElement('script');
        script.innerHTML = command;
        document.getElementsByTagName('head')[0].appendChild(script);
	});

	$(document).on('click', '#btnClear', function(){ 

	    $('#logview').html("");
	});

	$(document).on('click', '#btnReadFile', function(){ 
	    instanceHandleUpdate.readTextFromFile("config.txt", function(data){
			alert(data);
		}, function(fail){
			alert(fail);
		})
	});

	$(document).on('click', '#btnWriteFile', function(){ 
		var file = $("#txtCommand").val();
	    instanceHandleUpdate.writeLine(file, "GGGGGGGGGGG", function(data){
			alert("write ok");
			alert(data);
		}, function(fail){
			alert("write fail");
			alert(fail);
		});
	});

	$(document).on('click', '#btnCloseDebug', function(){ 
		$('#debug').css("display", "none");
	});


	

	/*Setting*/

}

VP9.reloadicon = function(){
	var filmElems = $('.home_cont .home_item');
	$.each(filmElems, function(k, filmElem) {
		var $filmElem = $(filmElem);

		var home_item_detail = $filmElem.find('.home_item_detail');

		var src = _controller.AppsVp9Controller.apps[k].getAppIcon();
	
		var img= home_item_detail.find('.item_logo');

		var newImg = new Image();
		newImg.onload = function() {
		    img.css("background", 'url(' + this.src + ')');
		}
		newImg.src = src;

	});
}

VP9.eventOff = function(){

}




//Back Button Event
var backButton = function(){}

//Create App Panel Content
function suc_generateappList(returnVal){
	/*Begin Theme Specific Editible Code*/
		alert(returnVal); /*hungvv*/

		var appListArray = JSON.parse(returnVal); 
		appPanel = $('#appPanel_Content'); 
		$(appPanel).empty(); 
		$(appPanel).append('<a href="tel:" class="app dialer" data-appName="Dialer"></a>');
	
		$(appListArray).each(function(){
			var appName = this.name; 
			var appPackage = this.package; 
			var appActivity = this.activity;

			var filename = "";
			if (appName.indexOf("VP9") > -1) {
				filename = appPackage + appActivity;
			}else{
				filename = appPackage;
			}
			



			// logview("<br> appName: " + appName);	// hungvv
			var newdiv = $('<div>');
			$(newdiv).attr('data-appPackage', appPackage).attr('data-appActivity', appActivity).attr('data-appName', appName).attr('data-icons', filename).addClass('app');
			$(appPanel).append(newdiv);
		});
		// logview("<br>" + $(appPanel)[0].outerHTML)
		$('#appPanel_Content > *').tsort({attr:'data-appName'});

/**/
		// var arr = [{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/android.rk.RockVideoPlayer.png","package":"android.rk.RockVideoPlayer","activity":".RockVideoPlayer","name":"Video"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.advancedprocessmanager.png","package":"com.advancedprocessmanager","activity":".Tabs","name":"Android Assistant"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.ageofmobile.calendar.png","package":"com.ageofmobile.calendar","activity":".MainActivity","name":"Lịch"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.android.apkinstaller.png","package":"com.android.apkinstaller","activity":".apkinstaller","name":"ApkInstaller"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.android.browser.png","package":"com.android.browser","activity":".BrowserActivity","name":"Trình duyệt"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.android.calculator2.png","package":"com.android.calculator2","activity":".Calculator","name":"Máy tính"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.android.chrome.png","package":"com.android.chrome","activity":"com.google.android.apps.chrome.Main","name":"Chrome"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.android.contacts.png","package":"com.android.contacts","activity":".activities.PeopleActivity","name":"Danh bạ"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.android.email.png","package":"com.android.email","activity":".activity.Welcome","name":"Email"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.android.gallery.png","package":"com.android.gallery","activity":"com.android.camera.GalleryPicker","name":"Máy ảnh"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.android.gallery3d.png","package":"com.android.gallery3d","activity":".app.Gallery","name":"Thư viện"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.android.music.png","package":"com.android.music","activity":".MusicBrowserActivity","name":"Nhạc"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.android.providers.downloads.ui.png","package":"com.android.providers.downloads.ui","activity":".DownloadList","name":"Nội dung tải xuống"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.android.quicksearchbox.png","package":"com.android.quicksearchbox","activity":".SearchActivity","name":"Tìm kiếm"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.android.rockchip.png","package":"com.android.rockchip","activity":".RockExplorer","name":"Explorer"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.android.settings.png","package":"com.android.settings","activity":".Settings","name":"Cài đặt"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.android.vending.png","package":"com.android.vending","activity":".AssetBrowserActivity","name":"Cửa hàng Google Play"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.android.videoeditor.png","package":"com.android.videoeditor","activity":".ProjectsActivity","name":"Trình biên tập video"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.antutu.ABenchMark.png","package":"com.antutu.ABenchMark","activity":".ABenchMarkStart","name":"AnTuTu Benchmark"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.appvn.mobi.png","package":"com.appvn.mobi","activity":".SplashActivity","name":"AppStoreVn"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.buzzpia.aqua.launcher.png","package":"com.buzzpia.aqua.launcher","activity":".LauncherActivity","name":"Buzz Launcher"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.cleanmaster.mguard.png","package":"com.cleanmaster.mguard","activity":"com.keniu.security.main.MainActivity","name":"Clean Master"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.droidhen.defender2.png","package":"com.droidhen.defender2","activity":".GameActivity","name":"Defender II"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.epi.baomoi.touch.png","package":"com.epi.baomoi.touch","activity":".BaoMoiHD","name":"Báo Mới HD"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.estrongs.android.pop.png","package":"com.estrongs.android.pop","activity":".view.FileExplorerActivity","name":"ES Duyệt Tập Tin"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.gau.go.launcherex.png","package":"com.gau.go.launcherex","activity":"com.jiubang.ggheart.apps.desks.diy.GoLauncherFacade","name":"GO Launcher EX"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.google.android.apps.maps.png","package":"com.google.android.apps.maps","activity":"com.google.android.maps.MapsActivity","name":"Bản đồ"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.google.android.calendar.png","package":"com.google.android.calendar","activity":"com.android.calendar.AllInOneActivity","name":"Lịch"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.google.android.gms.png","package":"com.google.android.gms","activity":".app.settings.GoogleSettingsActivity","name":"Dịch vụ của Google Play"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.google.android.googlequicksearchbox.png","package":"com.google.android.googlequicksearchbox","activity":".SearchActivity","name":"Tìm kiếm của Google"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.google.android.talk.png","package":"com.google.android.talk","activity":".SigningInActivity","name":"Talk"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.google.android.youtube.png","package":"com.google.android.youtube","activity":".app.honeycomb.Shell$HomeActivity","name":"YouTube"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.halfbrick.fruitninjafree.png","package":"com.halfbrick.fruitninjafree","activity":"com.halfbrick.mortar.MortarGameActivity","name":"Fruit Ninja"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.halfbrick.jetpackjoyride.png","package":"com.halfbrick.jetpackjoyride","activity":"com.halfbrick.mortar.MortarGameActivityFacebook","name":"Jetpack Joyride"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.king.candycrushsaga.png","package":"com.king.candycrushsaga","activity":".CandyCrushSagaActivity","name":"Candy Crush Saga"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.rovio.angrybirdsstarwars.ads.iap.png","package":"com.rovio.angrybirdsstarwars.ads.iap","activity":"com.rovio.fusion.App","name":"Angry Birds"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.speedsoftware.rootexplorer.png","package":"com.speedsoftware.rootexplorer","activity":".RootExplorer","name":"Root Explorer"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.vasc.its.mytvnet.png","package":"com.vasc.its.mytvnet","activity":".startup.InitActivity","name":"MyTV Net"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.vivas.tvod.live.png","package":"com.vivas.tvod.live","activity":".activity.MainActivity","name":"VP9.TRUYENHINH"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.vng.inputmethod.labankey.png","package":"com.vng.inputmethod.labankey","activity":".MainActivity","name":"Laban Key"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.vng.zingtv.png","package":"com.vng.zingtv","activity":".activity.LoginActivity","name":"Zing TV"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.vp9.authenticator.png","package":"com.vp9.authenticator","activity":".AuthenticatorActivity","name":"Authenticator"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.vp9.control.tv.png","package":"com.vp9.control.tv","activity":".MainActivity","name":"VP9.REMOTE"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.vp9.film.tv.png","package":"com.vp9.film.tv","activity":".MainActivity","name":"FILM.VP9"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.vp9.game.tv.png","package":"com.vp9.game.tv","activity":".MainActivity","name":"GAME.VP9"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.vp9.tv.png","package":"com.vp9.tv","activity":".MainActivity","name":"VP9.TV"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/com.wego.revolt2_global.png","package":"com.wego.revolt2_global","activity":".Main","name":"RE-VOLT 2"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/eu.chainfire.supersu.png","package":"eu.chainfire.supersu","activity":".MainActivity-Emblem","name":"SuperSU"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/ginlemon.flowerfree.png","package":"ginlemon.flowerfree","activity":"ginlemon.flower.HomeScreen","name":"Smart Launcher"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/ginlemon.flowerpro.png","package":"ginlemon.flowerpro","activity":"ginlemon.flower.HomeScreen","name":"Smart Launcher Pro"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/jackpal.androidterm.png","package":"jackpal.androidterm","activity":".Term","name":"Terminal Emulator"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/kynam.ime.gotiengviet.png","package":"kynam.ime.gotiengviet","activity":".TutorialActivity","name":"Gõ Tiếng Việt"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/mp3.zing.vn.png","package":"mp3.zing.vn","activity":".activity.SplashActivity","name":"Zing Mp3"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/org.xbmc.xbmc.png","package":"org.xbmc.xbmc","activity":".Splash","name":"XBMC"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/pl.speedtest.android.png","package":"pl.speedtest.android","activity":".Main","name":"Speed Test"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/uk.co.aifactory.chessfree.png","package":"uk.co.aifactory.chessfree","activity":".ChessFreeActivity","name":"Chess Free"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/ukzzang.android.app.logviewer.png","package":"ukzzang.android.app.logviewer","activity":".act.MainAct","name":"LogViewer Lite"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/vng.zing.tv.png","package":"vng.zing.tv","activity":".activity.LoginActivity","name":"Zing TV - Android TV"},{"path":"file:\/\/\/\/mnt\/sdcard\/VP9Launcher\/settings\/icons\/yuku.logviewer.png","package":"yuku.logviewer","activity":".ac.MainActivity","name":"Log Viewer"}];
		// for (var i = 0; i < arr.length; i++) {
			
		// 	var appName = arr[i].name; 
		// 	var appPackage = arr[i].package; 
		// 	var appActivity = arr[i].activity;


		// };




	/*End Theme Specific Editible Code*/
}

function wifiSignal(returnVal){
	var maxStrength = -50; 
	var minStrength = -120; 
	var percentage = Math.round(100 - Math.max(0, Math.min((returnVal - maxStrength) / (minStrength - maxStrength), 1) * 100));	
	/*Begin Theme Specific Editible Code*/
		// $('#meter_wifi').css('background-color', 'rgba('+(100-percentage)+','+percentage+',0,.75)');
		console.log("-------------- percentage: " + percentage + " ------ returnVal: " + returnVal );
	/*End Theme Specific Editible Code*/
}	

//Wifi Check
function suc_wificontrolsCheck(returnVal){
	/*Begin Theme Specific Editible Code*/
	
	/*End Theme Specific Editible Code*/
}



//Custom extended jQuery to check if an object has a specific attribute.
$.fn.hasAttr = function(arg){
	return $(this)[0].hasAttribute(arg);				
}



/*Handle the pause event*/
function onPause() {
	// clearInterval(clockTimer);
}

	
	
	
/*Handle the resume event*/
function onResume() {
	
	// var clockTimer = setInterval(clock, 1000);
	
	// window.plugins.brightness.valuecheck(suc_brightnessvalueCheck);
	// window.plugins.wifi.check('wifiSignal', suc_wificontrolsCheck);
	// window.plugins.data.check();
	// window.plugins.fullscreen.check();
	// window.plugins.ringer.modecheck();
	// window.plugins.bluetooth.check();
	// window.plugins.brightness.modecheck();
	// window.plugins.power.check(suc_powerlevelCheck);
}

function onBackbutton(e){
	// if($('#appPanel').hasClass('visible')){
	// 	$('#appPanel').removeClass('visible');
	// 	setTimeout(function(){$('#appPanel').css('display', 'none');}, 500);
	// }
	e.preventDefault();
	console.log("------------------back");
}


/*hungvv : logview*/
function logview(msg) {
    $('#logview').append(msg + "<br>");
}


String.format = function() {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }

    return s;
};
String.prototype.startsWith = function(input){
    return (this.substr(0, input.length) === input);
}

String.prototype.endsWith = function(input){
    return (this.substr(this.length-input.length, input.length) === input);
}