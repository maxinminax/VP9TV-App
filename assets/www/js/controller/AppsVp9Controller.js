AppsVp9Controller = Class.extend({
	appView : null,
	appSelected : null,
	apps : null,

	init : function(){
		this.apps = [];
	},
	getApps : function(){
		var self = this;


		// var data = CONFIG.VP9_PACKAGES;
		// this.showSearchResuls(data);


/*get app from object CONFIG.VP9_PACKAGES*/
		// var data = [{"id":1,"name":"TV VP9","address":"http://tv.vp9.tv","status":1,"content":[{"id":1,"name":"Truyền hình","services":"tivi","status":1,"icon":"http://tv.vp9.tv/images/home/tivi.svg","icon_path":"sdcar/..../tivi.png"},{"id":5,"name":"Music","services":"music","status":1,"icon":"http://tv.vp9.tv/images/home/music.svg","icon_path":"sdcar/..../tivi.png"},{"id":6,"name":"Game","services":"game","status":1,"icon":"http://tv.vp9.tv/images/home/game.svg","icon_path":"sdcar/..../tivi.png"}]}];
		// this.showSearchResuls(data);



/*get app from server vp9*/
		// var self = this;
		// window.plugins.apps.generatelistappVP9(function(success){
		// 	alert(success);
		// 	var apps = JSON.parse(success);
		// 	self.showSearchResuls(apps);
		// }, function(fail){
		// 	var apps = CONFIG.VP9_PACKAGES;
		// 	self.showSearchResuls(apps);
		// });

/*get app from file server.txt*/
		instanceHandleUpdate.readTextFromFile(CONFIG.SETTING_NAME + '.txt', function(data){
			try{
				var apps = JSON.parse(data);
				console.log(JSON.stringify(apps));
				self.showSearchResuls(apps);
			}catch(e){
				// alert("parse error");
				var data = JSON.stringify(CONFIG.VP9_PACKAGES);
				instanceHandleUpdate.writeLine(CONFIG.SETTING_NAME + '.txt', data, function(success){
					var apps = JSON.parse(success);
					self.showSearchResuls(apps);
				}, function(fail){
					// alert("write fail");
				});
			}

			// var data = JSON.stringify(CONFIG.VP9_PACKAGES);
			// instanceHandleUpdate.writeLine(CONFIG.SETTING_NAME + '.txt', data, function(success){
			// 	// alert("write ok");
			// 	var apps = JSON.parse(success);
			// 	self.showSearchResuls(apps);
			// }, function(fail){
			// 	// alert("write fail");
			// });

		}, function(fail){
			var data = JSON.stringify(CONFIG.VP9_PACKAGES);
			instanceHandleUpdate.writeLine(CONFIG.SETTING_NAME + '.txt', data, function(success){
				// alert("write ok");
				var apps = JSON.parse(success);
				self.showSearchResuls(apps);
			}, function(fail){
				// alert("write fail");
			});
		})



	},
	showSearchResuls : function(parse){

		// var parse = JSON.parse(apps); 
		// var appPanel = $('#home-page');	/*parent panel*/
		// $(appPanel).empty();

		// var apps = [];
		// for (var i = 0; i < parse.length; i++) {
		// 	alert(JSON.stringify(parse[i]));
		// 	var name = parse[i].name;
		// 	var package = parse[i].package;
		// 	var activity = parse[i].activity;
		// 	var icon = parse[i].icon;
		// 	if (name.indexOf('VP9') > -1) {
		// 		var app = new AppModel(package, activity, name);
		// 		app.setAppIcon(icon);
		// 		apps.push(app);
		// 	}
		// }

		// alert(JSON.stringify(apps));

		// /* show app mac dinh duoc cau hinh trong config.js */
		// if (apps.length < 1) {
		// 	var apps = CONFIG.VP9_PACKAGES;
		// 	parse = apps;

		// 	for (var i = 0; i < parse.length; i++) {
		// 		var name = parse[i].name;
		// 		var package = parse[i].package;
		// 		var activity = parse[i].activity;
		// 		var icon = parse[i].path;

		// 		var app = new AppModel(package, activity, name);
		// 		app.setAppIcon(icon);
		// 		apps.push(app);
		// 	};
		// }

		// var appView = new AppVp9View(apps);
		// $(appPanel).append(appView.render());


		if (typeof parse == "string") {
			parse = JSON.parse(parse);
		}

		var apps = [];

		
		//for (var i = 0; i < parse.length; i++) {
		$.each(parse, function(k, server) {
			if (server.socket) {
				SOCKETS.add(server.address.replace('http://', ''), server.socket);
			}
			else {
				SOCKETS.add(server.address.replace('http://', ''));
			}
			if (server.services) {
				var packageApp = "com.vp9.tv";
				if(server.hasOwnProperty("package")){
					packageApp = server.app;
				}
				var activity = ".MainActivity";
				if(server.hasOwnProperty("activity")){
					activity = server.activity;
				}
				
				for (var j = 0; j < server.services.length; j++) {
					var name = server.services[j].name;
					var icon = server.services[j].icon;
					var type = server.services[j].service;
					var address = server.address;

					var app = new AppModel(packageApp, activity, name);
					app.setAppIcon(icon);
					app.setType(type);
					app.setServer(address);
					apps.push(app);
				};
			}
		});
		this.apps = apps;
		this._showView(apps);

		VP9.reloadicon();
	},

	_showView : function(models){
		var appPanel = $('.home_wrapper');	/*parent panel*/
		appPanel.empty();

		this.appView = new AppVp9View(models);
		
		// appView.addEvent();
		appPanel.append(this.appView.render());
		this.appView.caculateAppPerRow();
		this.addControllBarSelected();
	},

	launch : function(obj){		/*launching shortcut*/
		

		window.plugins.launching.appVP9(obj, function(){
			console.log("launching success");
		}, function(){
			alert("app chua duoc cai");

			var arr = [];
	        var url = {"url" :  CONFIG.ApkUrl };
	        arr.push(url);

			window.plugins.handlerplugin.installapp(url);
		});
		
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
		this.launch(element[0]);
	},


	addServer : function(data){
		// package, activity, name, icon, type, server

		var parse = data;
		if (typeof data == "string") {
			parse = JSON.parse(data);
		}
		console.log(JSON.stringify(data));
		var name = parse.name;
		var package = "com.vp9.tv";
		if(parse.hasOwnProperty("package")){
			package = parse.package;
		}
		var activity = ".MainActivity";
		if(parse.hasOwnProperty("activity")){
			activity = parse.activity;
		}

		var iconPath = parse.icon == undefined ? './img/vp9logo.png' : parse.icon;
		var type = parse.type;
		var server = CONFIG.SERVER_VP9;
		if(parse.hasOwnProperty("server")){
			server = parse.server;
		}
		
		var app = new AppModel(package, activity, name);
		app.setAppIcon(iconPath);
		app.setType(type);
		app.setServer(server);

		this.apps.push(app);

		// refresh view
		// this._showView(this.apps);
		this.appView.addDom(app);
		VP9.controlUI.closePopup();
		// 

		/*write File*/
		this.outputFile(this.apps);
		/*write File*/
	},

	removeServer : function(index){
		delete this.apps[index];
		this.appView.removeDom(index);

		this.outputFile(this.apps);
		
	},

	outputFile : function(apps){
		var arrOutput = [];
		for (var i = 0; i < apps.length; i++) {
			var app = apps[i];
			if (app != null && app != undefined) {
				var object = {
								name : app.getAppName(),
								icon : app.getAppIcon(),
								type : app.getType(),
								server : app.getServer()
							}
				arrOutput.push(object);
			}
		};
		instanceHandleUpdate.writeLine(CONFIG.SETTING_NAME + '.txt', JSON.stringify(arrOutput) , function(data){
			// alert("write ok");
			// alert(data);
		}, function(fail){
			// alert("write fail");
			// alert(fail);
		});
	},

	destroy: function(){
		if (this.appView && this.appView.rootElement) {
			this.appView.rootElement.remove();
		}
		// var appPanel = $('.home_wrapper');	//parent panel
		// appPanel.empty();
	},
	addControllBarSelected : function(){
		if (this.appView != null) {
			if ($('.viewSelected').length > 0) {
				return;
			};
			this.appView.rootElement.addClass("viewSelected");	
			if (this.appView.elementSelected == null) {
				this.appView.keyleft();
			}else{
				this.appView.elementSelected.find('.home_item_detail').addClass("selected");
			}
		};
	},
	removeControllBarSelected : function(){
		if (this.appView != null) {
			this.appView.rootElement.removeClass("viewSelected");
			this.appView.elementSelected.find('.home_item_detail').removeClass("selected");
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