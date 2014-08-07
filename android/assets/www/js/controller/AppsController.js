AppsController = Class.extend({
	state : CONFIG.STATE["NOT_LOADING"],
	appView : null,
	interval : null,
	position : 0,


	init : function(){
		this.position = 0;

	},
	getApps : function(){
		// var strJSON = '[{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video0"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video1"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video2"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video3"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video4"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video5"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video6"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video7"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video8"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video9"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video10"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video11"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video12"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video13"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video14"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video15"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video16"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video17"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video18"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video19"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video20"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video21"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video22"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video23"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video24"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video25"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video26"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video27"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video28"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video29"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video30"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video31"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video32"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video33"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video34"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video35"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video36"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video37"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video38"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video39"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video40"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video41"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video42"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video43"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video44"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video45"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video46"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video47"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video48"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video49"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video50"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video51"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video52"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video53"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video54"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video55"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video56"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video57"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video58"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video59"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video60"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video61"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video62"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video63"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video64"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video65"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video66"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video67"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video68"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video69"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video70"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video71"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video72"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video73"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video74"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video75"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video76"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video77"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video78"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video79"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video80"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video81"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video82"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video83"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video84"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video85"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video86"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video87"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video88"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video89"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video90"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video91"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video92"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video93"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video94"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video95"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video96"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video97"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video98"},{"path":"file:////mnt/sdcard/VP9Launcher/settings/icons/android.rk.RockVideoPlayer.png","package":"RockVideoPlayer","name":"Video99"}]';
		// this.showSearchResuls(strJSON);
		
		var self = this;
		window.plugins.apps.generatelist(self.showSearchResuls);
		

	},

	getAppByPosition : function(parse, position){
		if (_controller.AppsController.getState() == CONFIG.STATE["NOT_LOADING"] || _controller.AppsController.getState() == CONFIG.STATE["LOADING"]) {

			_controller.AppsController.addDom(parse[position]);

			if (position == parse.length-1) {
				_controller.AppsController.setState(CONFIG.STATE["LOADED"]);
			}else{
				var nextPosition = position + 1;
				_controller.AppsController.setPosition(nextPosition)
				setTimeout(function(){
				_controller.AppsController.getAppByPosition(parse, nextPosition);
				}, 10);
			}
		}

		// if (_controller.AppsController.getState() == CONFIG.STATE["LOADED"]) {
		// 	var appPanel = $('#appPanel_Content .container-fluid .row #content-panel');	
		// 	appPanel.find('[data-apppackage]').tsort({attr: _controller.AppsController.getAppView().getSort()});
		// };
			
	},
	// callback
	showSearchResuls : function(strResult){
		// logview("generatelist: " + strResult);
/*new*/
		var parse = JSON.parse(strResult);
		var appPanel = $('#appPanel_Content .container-fluid .row #content-panel');	
		appPanel.empty();

		var apps = [];
		var length = parse.length < CONFIG.LoadApp ? parse.length : CONFIG.LoadApp;		// lay 10 app dau tien
		for (var i = 0; i < length; i++) {
			var name = parse[i].name;
			var package = parse[i].package;
			var activity = parse[i].activity;
			var icon =  parse[i].path;
			// alert(icon);

			var app = new AppModel(package, activity, name);
			app.setAppIcon(icon);

			apps.push(app);
		};

		var appView = new AppView(apps);
		// appView.addEvent();
		appPanel.append(appView.render());
		appView.calculateAppPerRow();

		appPanel.find('[data-apppackage]').tsort({attr: appView.getSort()});
		appView.setChildrenElement(appView.render().find('[data-appPackage]'));

		_controller.AppsController.setPosition(length);
		_controller.AppsController.setAppView(appView);
		_controller.AppsController.setState(CONFIG.STATE["LOADING"]);

		
		var position = _controller.AppsController.getPosition();

		_controller.AppsController.getAppByPosition(parse,position);
		



		/*old*/
		// var parse = JSON.parse(strResult);
		// var appPanel = $('#appPanel_Content .container-fluid .row #content-panel');	/*parent panel*/
		// appPanel.empty();

		// var apps = [];

		// for (var i = 0; i < parse.length; i++) {
		// 	var name = parse[i].name;
		// 	var package = parse[i].package;
		// 	var activity = parse[i].activity;

		// 	var icon = "";
		// 	if (name.indexOf("VP9") > -1) {
		// 		filename = package + activity;
		// 	}else{
		// 		filename = package;
		// 	}

		// 	icon = filename;

		// 	var app = new AppModel(package, activity, name);
		// 	app.setAppIcon(icon);

		// 	apps.push(app);
		// };

		// var appView = new AppView(apps);
		// // appView.addEvent();
		// appPanel.append(appView.render());
		// appView.calculateAppPerRow();

		// appPanel.find('[data-apppackage]').tsort({attr: appView.getSort()});
		// appView.setChildrenElement(appView.render().find('[data-appPackage]'));

		// _controller.AppsController.setAppView(appView);
		// _controller.AppsController.setState(CONFIG.STATE["LOADED"]);

	},

	launch : function(){		/*launching shortcut*/
		window.plugins.launching.app(this);
	},

	addDom : function(data){
		var parse = data;
		if (typeof data == "string") {
			parse = JSON.parse(data);
		}

		var name = parse.name;
		var package = parse.package;
		var activity = parse.activity;
		var iconPath = parse.path;
		
		var app = new AppModel(package, activity, name);
		app.setAppIcon(iconPath);
		
		this.getAppView().addDom(app);	
		this.getAppView().setChildrenElement(this.getAppView().render().find('[data-appPackage]'));

	},
	removeDom : function(packageName){
		this.getAppView().removeDom(packageName);
		this.getAppView().setChildrenElement(this.getAppView().render().find('[data-appPackage]'));
	},

	setPosition : function(_position){
		this.position = _position;
	},
	getPosition : function(){
		return this.position;
	},
	setState : function(_state){
		this.state = _state;
	},
	getState : function(){
		return this.state;
	},

	loadingApp : function(callback){
		var self = this;

		// if (self.getState() == CONFIG.STATE["NOT_LOADING"]) {
		// 	$('.spinner-wrapper').css("display", "block");	
		// }
		// setTimeout(function(){
		// 	self.interval = setInterval(function(){

		// 		logview("<br>self.getState(): " + self.getState());
		// 		if (self.getState() == CONFIG.STATE["NOT_LOADING"]) {
		// 			logview("<br> loading: ");
		// 			$('.spinner-wrapper').css("display", "block");
		// 			self.setState(CONFIG.STATE["LOADING"]);
		// 			setTimeout(function(){
		// 				self.getApps();
		// 			},0);
					
		// 		}else if(self.getState() == CONFIG.STATE["LOADING"]){
		// 			if ($('.spinner-wrapper').css("display") == "none") {
		// 				$('.spinner-wrapper').css("display", "block");
		// 				logview("<br> loading: ");
		// 			};
					
					
		// 		}else if(self.getState() == CONFIG.STATE["LOADED"]){
		// 			$('.spinner-wrapper').css("display", "none");
		// 			logview("<br> interval: " + self.interval);
		// 			clearInterval(self.interval);
		// 			if(typeof callback == "function"){
		// 				callback();
		// 			}
		// 		}
		// 	}, 10);
		// },0)
		

		callback();
		self.getApps();
		
	},



	keyDownUpLeftRight : function(e){
		
		switch(e.keyCode){
			case 37:
			  	this.appView.keyleft();
			  	break;
			case 38:
			  	this.appView.keyup();
			  	break;
			case 39:
			  	this.appView.keyright();
			  	break;
			case 40:
			  	this.appView.keydown();
			  	break;
			default:
			  	break;
		}
	},

	keyEnter : function(){
		var element = this.appView.elementSelected;
		window.plugins.launching.app(element[0]);
	},

	getAppView : function(){
		return this.appView;
	},
	setAppView : function(_appView){
		this.appView = _appView;
	},
	removeControllBarSelected : function(){
		if (this.appView != null && this.appView.rootElement.hasClass('viewSelected')) {
			this.appView.rootElement.removeClass("viewSelected");
			this.appView.elementSelected.removeClass("selected");
		}
	},
	addControllBarSelected : function(){
		if (this.appView != null && !this.appView.rootElement.hasClass('viewSelected')) {
			this.appView.rootElement.addClass("viewSelected");
			if (this.appView.elementSelected == null) {
				this.appView.keyleft();
			}else{
				this.appView.elementSelected.addClass("selected");
			}
		};
	},
	isControllBarSelected : function(){
		if (this.appView.rootElement.hasClass("viewSelected")) {
			return true;
		}else{
			return false;
		}
	}



	





})