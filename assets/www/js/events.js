// JavaScript Document

//App Launch Event

var VP9 = VP9 || {};
VP9.onClick = VP9.onClick || {};
VP9.onClick.ServerSetting = VP9.onClick.ServerSetting || {};



$(document).on('click', '.appVP9', function(){
	
	var controller = $(this).attr("data-controller");
	var action = $(this).attr("data-action");

	window._controller[controller][action].call(null, this);

	
	// window.plugins.launching.appVP9(this, function(){
	// 	console.log("launching success");
	// }, function(){
	// 	alert("app chua duoc cai");

	// 	var arr = [];
 //        var obj = {"url" :  CONFIG.ApkUrl };
 //        arr.push(obj);
	// 	// cordova.exec(function(){
	// 	// 	alert("success");
	// 	// }, function(){
	// 	// 	alert("fail");
	// 	// }, "HandlerEventPlugin", "install_app", arr);

	// 	window.plugins.handlerplugin.installapp(obj);
	// });

	return false;
});


$(document).on('click', '.appInstalled, #appPanel_Setting', function(){	
	window.plugins.launching.app(this);
	return false;
});



//Hide Show App Panel
$(document).on('click', '#close_appPanel, #appPanel_Show', function(){
	if ($('.viewSelected').length > 0) {
		var controller = $('.viewSelected').attr("data-controller");
		_controller[controller].removeControllBarSelected();
	};
	if($('#appPanel').hasClass('visible')){
		// init appVp9
		_controller.AppsVp9Controller.getApps();

		$('#appPanel').removeClass('visible');
		setTimeout(function(){$('#appPanel').css('display', 'none');}, 500);
	}else{
		$('.viewSelected').removeClass('viewSelected');
		_controller.AppsController.addControllBarSelected();

		_controller.AppsVp9Controller.destroy();

		// 	_controller.AppsController.getApps();	
		if(_controller.AppsController.getState() == CONFIG.STATE["LOADED"]){	
			$('#appPanel').css('display', 'block');
			setTimeout(function(){$('#appPanel').addClass('visible');}, 10);
		}else{
			_controller.AppsController.loadingApp(function(){
				$('#appPanel').css('display', 'block');
				setTimeout(function(){$('#appPanel').addClass('visible');}, 10);
			});
		}
	}
	return false;
});

/*phunn*/
$('#appPanel_Content').mousewheel(function(event) {
	var step = 214; //194
    var pos = $(this).scrollTop();
    var nextPos = step * (Math.round(pos/step) - event.deltaY);
    console.log(nextPos);
    $(this).scrollTop(nextPos);
    event.preventDefault();
});

$('#appPanel_Content').swipe({
	pos : 0,
	oldPos : 0,
	swipeStatus: function(event, phase, direction, distance, duration, fingers) {
		
		var deltaY = 0;
		var stepScroll = 214; //px
		var stepSwipe = 100; //px
		var direct = 0;
		var nextPos = 0;
		if (phase == 'start') {
			pos = $(this).scrollTop();
		}
		else {
			deltaY = Math.round(distance/100);
			
			if (direction == 'up') {
				direct = 1;
			}else if (direction == 'down') {
				direct = -1;
			}else if (direction == null) {
				return;
			}

			nextPos = stepScroll * (Math.round(pos/stepScroll) + direct * deltaY);
			if(this.oldPos != nextPos){
				console.log("update");
				$(this).scrollTop(nextPos);
				this.oldPos = nextPos;
			}else{
				
			}

   			$(this).scrollTop(nextPos);
		}
	}
});

/*end phunn*/


//Refresh Apps
$(document).on('click', '#refresh_appPanel', function(){ 
	window.plugins.apps.generatelist(suc_generateappList);
	window.plugins.apps.generateicons();	
	window.plugins.apps.generatecss();	
});




/*hungvv*/
// var pressTimer
// $("*[data-appPackage]").mouseup(function(){
//   	clearTimeout(pressTimer)
//   	// Clear timeout
//   	return false;
// }).mousedown(function(){
//   	// Set timeout
//   	pressTimer = window.setTimeout(function() { console.log("long click") },1000);
//   	return false; 
// });







$(window).keydown(function (e) {
	if (!VP9.userInput) {
		e.preventDefault();
	}
    event = window.event ? window.event : event;
    RemoteKey.keydown(event); 


});

$(window).keyup(function (e) {
	if (!VP9.userInput) {
		e.preventDefault();
	}
    event = window.event ? window.event : event;
    RemoteKey.keyup(event);
});





var showHideTiviChannelTimeout;
var numberChannel = "";
RemoteKey.Numpad = function(_e){
	var e = _e;
	if (VP9.userInput) {	
		
	}else{
		clearTimeout(showHideTiviChannelTimeout);

		var params = [];
		window.plugins.handlerplugin.settivichannel(params, function(){
			
		}, function(){
		
		});
		
		showHideTiviChannelTimeout =  setTimeout(function(){
			window.plugins.handlerplugin.canceltivichannel(params, function(){
				
			}, function(){
				
			});		
		}, 2000);
	}
	
	
}

RemoteKey.Backspace = function(){

	// if (VP9.userInput) {	
	// }else{
		// clearTimeout(showHideTiviChannelTimeout);
		// var params = [];
		// window.plugins.handlerplugin.settivichannel(params, function(){
		// }, function(){
		// });
		
		// showHideTiviChannelTimeout =  setTimeout(function(){
		// 	window.plugins.handlerplugin.canceltivichannel(params, function(){	
		// 	}, function(){
		// 	});		
		// }, 2000);
	// }
}


RemoteKey.DownUpLeftRight = function(_e){
	var e = _e

	if (!VP9.userInput) {
		console.log("RemoteKey.DownUpLeftRight");

		var controller = $('.viewSelected').attr("data-controller");
		if (controller == undefined) {
			var layout = VP9.controlUI.getLayout();
			if (layout=="setting") {
				controller = "TopControllBarController";
				_controller[controller].addControllBarSelected();
			}else if(layout == "apps"){
				controller = "AppsController";
				_controller[controller].addControllBarSelected();
			}else if(layout == "vp9apps"){
				controller = "AppsVp9Controller";
				_controller[controller].addControllBarSelected();
			}

		};
		_controller[controller].keyDownUpLeftRight(e);

		// if($('#appPanel').hasClass('visible')){
		// 	_controller.AppsController.keyDownUpLeftRight(e);
		// }else{
		// 	_controller.AppsVp9Controller.keyDownUpLeftRight(e);
		// }
	}else{

	}
	

	
}

RemoteKey.OK = function(_e){
	if (!VP9.userInput) {
		console.log("--------------keyEnter");
		var e = _e;
		var controller = $('.viewSelected').attr("data-controller");
		if (controller == undefined) {
			var layout = VP9.controlUI.getLayout();
			if (layout=="setting") {
				controller = "TopControllBarController";
				_controller[controller].addControllBarSelected();
			}else if(layout == "apps"){
				controller = "AppsController";
				_controller[controller].addControllBarSelected();
			}else if(layout == "vp9apps"){
				controller = "AppsVp9Controller";
				_controller[controller].addControllBarSelected();
			}
		};
		_controller[controller].keyEnter(e);
	}
}

function playTiviChannel(numberChannel){
	console.log("--------------------------- handlerTiviChannel- numberChannel: " + numberChannel);
	_controller.ChannelController.playChannel(numberChannel);
}

/* method refreshView
*	flag = removeapp | addapp
*/
function refreshView(flag, informationApp){
	console.log("----------------------------------refreshView: " + flag + " - " + informationApp);

	if (flag == "removeapp") {
		if(_controller.AppsController.getState() == CONFIG.STATE["LOADED"]){
			console.log("------------------ events : removeapp: " );
			setTimeout(function(){
				_controller.AppsController.removeDom(informationApp);		
			}, 0);
			
		}
	}else if(flag == "addapp"){
		if(_controller.AppsController.getState() == CONFIG.STATE["LOADED"]){	
			setTimeout(function(){
				_controller.AppsController.addDom(informationApp);	
				// window.plugins.apps.generatecss();	
				
				// gereratecss
				var parse = JSON.parse(informationApp);
				var iconPath = parse.path;
				var package_name = parse.package;
				var name = parse.name;

				var newStyle = document.createElement('style');
				newStyle.innerHTML = '*[data-icons="'+package_name+'"]{background-image:url('+iconPath+');}';
				document.getElementsByTagName('head')[0].appendChild(newStyle);
			}, 0);		
		}
	}
}
$(document).on('click', '#btnAddServer', function(){
	var type = $('#txtType').val();
	var server = $('#txtServerName').val();
	var object = 		{	"name" : type,
							// "icon" : "./img/movie.png",
							"server" : server,
							"type" : type
						}

	_controller.SettingController.addServer(object);
	_controller.AppsVp9Controller.addServer(object);

	return false;
});



$(document).on('click', '.exit-popup, .popup-header .close', function(event){	
	event.stopPropagation();
    VP9.controlUI.closePopup();
    event.preventDefault();
    return false;
});


$(document).on('click', '#btnRemoveServer', function(){
	var index = parseInt($(this).attr('data-id'));
	_controller.SettingController.removeServer(index);
	_controller.AppsVp9Controller.removeServer(index);
	return false;
});


/*setting*/
$(document).on('click', '.home_back', function(){
	if ($('.viewSelected').length > 0) {
		var controller = $('.viewSelected').attr("data-controller");
		_controller[controller].removeControllBarSelected();
	};
	VP9.controlUI.handleBack();
    return false;
});


$(document).on('click', '.home_menu', function(){
	if ($('.viewSelected').length > 0) {
		var controller = $('.viewSelected').attr("data-controller");
		_controller[controller].removeControllBarSelected();
	};
	if($('#setting-launcher').css("display") == "block"){
		VP9.controlUI.handleBack();

	}else{
		_controller.SettingController.getServer();
		_controller.SettingController.renderGeneralConfig();
		$('#main-launcher').css("display", "none");
		$('#setting-launcher').css("display", "block");
	}
    return false;
});

$(document).on('click', '.stt_left ul li', function(){
	var show=$(this).attr('title');
	if (show) {
		$('.stt_left ul li').removeClass('active');
		$(this).addClass('active');
		$('.stt_detail_cont').hide();
		$("."+show).show();
	}
	return false;
});

/*price_table*/

$(document).on('mouseenter', '.price_table ul li', function(){
	index = $(this).index();
	$('.price_table ul li:nth-child(' + (index + 1) + ')').addClass('hover');
});

$(document).on('mouseleave', '.price_table ul li', function(){
	$('.price_table ul li').removeClass('hover');
});

$(document).on('click', '.price_item', function() {
	$('.price_item').not(this).removeClass('price_select');
	$(this).toggleClass('price_select');
});

/*click server*/
$(document).on('click', '.choose_server .existed_server', function(evt){

	var e = $(this);
	
	var isActive = $('.existedServer > li').hasClass("active");
	if (!isActive) {

		var child = e.find("ul");
		child.css("display", "block");

		var controller = e.attr("data-controller");
		var action = e.attr("data-action");
		var param = e.attr("data-param");

		var row = e.attr("row");

		_controller[controller][action](row, param, e);
	};

	return false;
});

/*$(document).on('mouseleave', '.existedServer > li', function(){
	var e = $(this);
	var child = e.find("ul");
	child.css("display", "none");	
	
	return false;
});*/

$(document).on('click', '.existedServer > li > p', function(evt){
	evt.stopPropagation();

	var e = $(this).parent('li');
	var toggle = e.hasClass("active");
	if (toggle) {
		e.removeClass("active");	
	}else{
		$('.existedServer > li').removeClass("active");
		e.addClass("active");	
	}
	return false;
});

// $(document).on('mouseenter', '.existedServer > li', function(evt){
	
// 	var e = $(this);
// 	var child = e.find("ul");
// 	child.css("display", "block");

// 	return false;
// });

// $(document).on('mouseleave', '.existedServer > li', function(evt){
// 	var e = $(this);
// 	var child = e.find("ul");
// 	child.css("display", "none");

// 	return false;
// });




/*click service*/
// $(document).on('mouseenter', '.existedServer >li > .sub > li', function(){


// });

// $(document).on('mouseleave', '.existedServer >li > .sub > li', function(){


// });



// $(document).on('click', '.existedServer >li > .sub > li', function(){
// 	var elementService = $(this);
// 	if (!elementService.find("input").prop("checked")) {
// 		elementService.find("input").prop("checked", true);
// 	}else{
// 		elementService.find("input").prop("checked", false);
// 	}

// 	// var controller = $(this).attr("data-controller");
// 	// var action = $(this).attr("data-action");
	
// 	// var server_id = $(this).attr("data-server_id");
// 	// var server_name = $(this).attr("data-server_name");
// 	// var server_address = $(this).attr("data-server_address");
// 	// var objectServer = {"id" : server_id,
// 	// 					"name" : server_name,
// 	// 					"server_address" : server_address
// 	// 					}


	
// 	// var service_id = $(this).attr("data-service_id");
// 	// var service_name = $(this).attr("data-serviceName");
// 	// var service_type = $(this).attr("data-serviceType");
// 	// var service_icon = $(this).attr("data-serviceIcon");
	
// 	// var object = {
// 	// 	id : service_id,
// 	// 	name: service_name, 
// 	// 	service : service_type,
// 	// 	status : 1,
// 	// 	icon: service_icon
// 	// };

// 	// _controller[controller][action](type, objectServer, object);
// 	return false;
// });

// $(document).on('click', '.existedServer >li > .sub > li input[type="checkbox"]', function(e){
// 	e.stopPropagation();
// 	var elementService = $(this);

// 	// if (!elementService.prop("checked")) {
// 	// 	elementService.prop("checked", true);
// 	// }else{
// 	// 	elementService.prop("checked", false);
// 	// }
// 	return false;
// });


$(document).on('click', '.btn_remove', function(){
	var eRemove = $(this);
	var rowParent = eRemove.parent('li');
	rowParent.addClass('remove_action');

	/*var controller = eRemove.attr("data-controller");
	var action = eRemove.attr("data-action");

	_controller[controller][action](rowParent);*/

	return false;
	
});

$(document).on('click', '.remove_cancel', function(){
	var eRemove = $(this);
	var rowParent = eRemove.closest('li');
	rowParent.removeClass('remove_action');
	return false;
	
});

$(document).on('click', '.remove_ok', function(event){
	event.preventDefault();
	event.stopPropagation();
	var eRemove = $(this);
	var rowParent = eRemove.closest('li');

	var controller = eRemove.attr("data-controller");
	var action = eRemove.attr("data-action");

	_controller[controller][action](rowParent);

	return false;
	
});

// add server
$(document).on('click', '.choose_server .add_server .btn_add', function(){
	var param = $('.choose_server .add_server input').val();
	$('.choose_server .add_server input').val("");

	var controller = $(this).attr("data-controller");
	var action = $(this).attr("data-action");

	_controller[controller][action](param);
	return false;
});


VP9.userInput = false;
$(document).on('focus', '.choose_server .add_server input', function(){
	VP9.userInput = true;
	return false;
});

$(document).on('blur', '.choose_server .add_server input', function(){
	VP9.userInput = false;
	return false;
});

$(document).on('click', '.price_table .stt_submit a', function(){
	var controller = $(this).attr("data-controller");
	var action = $(this).attr("data-action");

	_controller[controller][action]();
	return false;
});

$(document).on('click', '.service_action .stt_submit', function(){
	var controller = $(this).attr("data-controller");
	var action = $(this).attr("data-action");

	_controller[controller][action]();
	return false;
});

$(document).on('click', '.service_action .stt_reset', function(){
	var controller = $(this).attr("data-controller");
	var action = $(this).attr("data-action");

	_controller[controller][action]();
	return false;
});


$(document).on('change', 'div.stt1 input', function(){
	
	_controller.SettingController.writeFileGeneralConfig();
});

/**/





// $(document).on('click', '.existedServer li li input', function(){
// 	var isChecked = $(this).prop("checked");
// 	var parent = $(this).parent();
// 	parent.attr("data-action");

// 	if (isChecked) {

// 	}else{

// 	}

// });


var VP9 = VP9 || {};
VP9.controlUI = {};
VP9.controlUI.onClick = {};

VP9.controlUI.closePopup = function() {
    $(".popup").css("display", "none");
    $("body").removeClass("open-popup");
}

VP9.controlUI.handleBack = function() {
 //    if($('#appPanel').hasClass('visible')){
 //    	_controller.AppsController.removeControllBarSelected();
	// 	_controller.AppsVp9Controller.getApps();
	// 	$('#appPanel').removeClass('visible');
	// 	setTimeout(function(){$('#appPanel').css('display', 'none');}, 500);
	// }else if($(".popup[popupfor=genres]").css("display") == "block"){
	// 	VP9.controlUI.closePopup();
	// }else if($('#setting-launcher').css("display") == "block"){
	// 	_controller.SettingController.writeFileGeneralConfig();

	// 	$('.existedServer').remove();
	// 	$('#main-launcher').css("display", "block");
	// 	$('#setting-launcher').css("display", "none");
	// }

	var layout = VP9.controlUI.getLayout();
	if (layout == "setting") {
		

		_controller.SettingController.writeFileGeneralConfig();

		$('.existedServer').remove();
		$('#main-launcher').css("display", "block");
		$('#setting-launcher').css("display", "none");
		_controller.AppsVp9Controller.getApps();

		$('.add_server input').blur();
	}else if(layout == "apps"){
		_controller.AppsController.removeControllBarSelected();
		_controller.AppsVp9Controller.getApps();
		$('#appPanel').removeClass('visible');
		setTimeout(function(){$('#appPanel').css('display', 'none');}, 500);
	}else if (layout == "vp9apps") {

	};

}

VP9.controlUI.getLayout = function(){
	if ($('#setting-launcher').css("display") == "block") {
		return "setting";
	}else if($('#setting-launcher').css("display") == "none"){
		if ($('#appPanel').hasClass('visible')) {
			return "apps";
		}else{
			return "vp9apps";
		}
	}
}


