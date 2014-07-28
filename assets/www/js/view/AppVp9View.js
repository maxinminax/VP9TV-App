AppVp9View = Class.extend({
	rootElement : null,
	appPerRow : null,
	elementSelected : null,
	listApp : null,
	init : function(apps){
		this.listApp = [];
		this.rootElement = $('<div class="home_cont">').attr("data-controller", "AppsVp9Controller");
		for (var i = 0; i < apps.length; i++) {

			var app = apps[i];
			if (app != null && app != undefined) {

				var appName = app.getAppName(); 
				var appPackage = app.getAppPackage(); 
				var appActivity = app.getAppActivity();
				var appIcon = app.getAppIcon();
				var appIconDefault = app.getAppIconDefault();
				var appType = app.getType();
				var appServer = app.getServer();

				var element = $('<div class="home_item col-xs-6 col-sm-4 col-md-4 col-lg-3">').addClass("appVP9");
				element.attr("data-appPackage", appPackage)
						.attr("data-appActivity", appActivity)
						.attr("data-apptype", appType)
						.attr("data-appserver", appServer)
						.attr("data-appName", appName)
						.attr("data-controller", "AppsVp9Controller")
						.attr("data-action", "launch")
															

				element[0].innerHTML =  ['<div class="home_item_detail" style="position: relative; overflow: hidden; display: block;">',
						'<h3 class="hidden-xs">' + appName  + '</h3>',
						'<div class="item_logo" style="background: url(' + 'img/logo_vp9.svg' + ') no-repeat; background-size: 100% 100%; width:50%; padding-top: 50%; margin-left: 25%;"></div>',

				'</div>'].join('');
				this.listApp.push(element);
																				
				this.rootElement.append(element);
			};
		}
	},

	caculateAppPerRow : function(){
		
        var app_width =  this.rootElement.children().outerWidth(true);

		var movie_wd_width = this.rootElement[0].clientWidth;

        var app_per_row = movie_wd_width / app_width;
        if (app_per_row + 0.2 >= Math.floor(app_per_row + 1) ) {
        	app_per_row = Math.floor(app_per_row + 1);
        }else{
        	app_per_row = Math.floor(app_per_row);
        }
        this.setAppPerRow(app_per_row);

	},

	addEvent : function(){
		this.rootElement.find("*[data-appPackage]").unbind("click");
		this.rootElement.find("*[data-appPackage]").bind("click", function(){
			alert("create shortcut");
			// window.plugins.launching.app(this);
			var package = $(this).attr("data-appPackage");
			var activity = $(this).attr("data-appActivity");
			var name = $(this).attr("data-appName");
			var controller = $(this).attr("data-controller");
			var action = $(this).attr("data-action");

			var obj = {"name" : name, "activity" : activity , "package" : package};
			window._controller[controller][action].call(this, JSON.stringify(obj));

		});
	},

	render : function(){
		return this.rootElement;
	},
	setAppPerRow : function(value){
		this.appPerRow = value;
	},
	getAppPerRow : function(){
		return this.appPerRow;
	},
	keydown : function(){
		var app_per_row = this.getAppPerRow();
		var children = this.rootElement.children();
		if (this.elementSelected == null) {
			this.elementSelected = children.eq(0);
			this.elementSelected.find('.home_item_detail').addClass("selected");
		}else{
			var position = this.elementSelected.index();
			var index = position + app_per_row;
			var next =  children.eq(index);
            if (next.length > 0 && next != undefined && index >= 0) {
                this.elementSelected.find('.home_item_detail').removeClass("selected");
                this.elementSelected = next;
                this.elementSelected.find('.home_item_detail').addClass('selected');
            }else{
            	_controller.AppsVp9Controller.removeControllBarSelected();
            	_controller.BottomControllBarController.addControllBarSelected();
            	this.elementSelected.find('.home_item_detail').removeClass("selected");
            }
		}
	},
	keyup : function(){
		var app_per_row = this.getAppPerRow();
		var children = this.rootElement.children();
		if (this.elementSelected == null) {
			this.elementSelected = children.eq(0);
			this.elementSelected.find('.home_item_detail').addClass("selected");
		}else{
			var position = this.elementSelected.index();
			var index = position - app_per_row;
			var next =  children.eq(index);
            if (next.length > 0 && next != undefined && index >= 0) {
                this.elementSelected.find('.home_item_detail').removeClass("selected");
                this.elementSelected = next;
                this.elementSelected.find('.home_item_detail').addClass('selected');
            }else{
            	_controller.AppsVp9Controller.removeControllBarSelected();
            	_controller.TopControllBarController.addControllBarSelected();
            	this.elementSelected.find('.home_item_detail').removeClass("selected");
            }
		}
	},
	keyleft : function(){
		var children = this.rootElement.children();
		if (this.elementSelected == null) {
			this.elementSelected = children.eq(0);
			this.elementSelected.find('.home_item_detail').addClass("selected");
		}else{
			var next = this.elementSelected.prev();
			
            if (next.length > 0 && next != undefined ) {
                this.elementSelected.find('.home_item_detail').removeClass("selected");
                this.elementSelected = next;
                this.elementSelected.find('.home_item_detail').addClass('selected');
            }
		}
	},
	keyright:function(){
		var children = this.rootElement.children();
		if (this.elementSelected == null) {
			this.elementSelected = children.eq(0);
			this.elementSelected.find('.home_item_detail').addClass("selected");
		}else{
			var next = this.elementSelected.next();
			
            if (next.length > 0 && next != undefined ) {
                this.elementSelected.find('.home_item_detail').removeClass("selected");
                this.elementSelected = next;
                this.elementSelected.find('.home_item_detail').addClass('selected');
            }
		}
	},
	removeDom : function(index){
		var app = this.listApp[index];
		delete this.listApp[index];
		$(app).remove();

	},
	addDom : function(app){
		console.log(JSON.stringify(app));
		var appName = app.getAppName(); 
		var appPackage = app.getAppPackage(); 
		var appActivity = app.getAppActivity();
		var appIcon = app.getAppIcon();
		var appType = app.getType();
		var appServer = app.getServer();

		var element = $('<div class="home_item col-xs-6 col-sm-4 col-md-4 col-lg-3">').addClass("appVP9");
				element.attr("data-appPackage", appPackage)
						.attr("data-appActivity", appActivity)
						.attr("data-apptype", appType)
						.attr("data-appserver", appServer)
						.attr("data-appName", appName)
						.attr("data-controller", "AppsVp9Controller")
						.attr("data-action", "launch");
															

		element[0].innerHTML =  ['<div class="home_item_detail" >',
				'<h3 class="hidden-xs">' + appName  + '</h3>',
				'<img src="' + appIcon + '">',
				// '<img src="http://10.10.10.159/code/vp9tv-testcode/images/home/movie.png">',
		'</div>'].join('');

		this.listApp.push(element);
																				
		this.rootElement.append(element);

	}
});
