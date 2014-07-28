AppView = Class.extend({
	rootElement : null,
	sort : "data-appName",
	appPerRow : null,
	elementSelected : null,
	childrenElement : null,
	init : function(apps){
		// this.rootElement = $('<div>');
		// for (var i = 0, j = apps.length-1; i < apps.length, j >= 0; i++, j--) {
		// 	var appName = apps[i].getAppName(); 
		// 	var appPackage = apps[i].getAppPackage(); 
		// 	var appActivity = apps[i].getAppActivity();

		// 	var element = $('<div>');
		// 	element.attr("data-appPackage", appPackage).attr("data-appActivity", appActivity)
		// 												.attr("data-appName", appName)
		// 												.attr("data-sort", j)
		// 												.attr("data-controller", "AppsController")
		// 												.attr("data-action", "launch")
		// 												.addClass("app");
		// 	$(this.rootElement).append(element);
		// }

		this.rootElement = $('<div id="ct">').attr("data-controller", "AppsController");
		this.addDoms(apps);
		// for (var i = 0; i < apps.length; i++) {

		// 	var appName = apps[i].getAppName(); 
		// 	var appPackage = apps[i].getAppPackage(); 
		// 	var appActivity = apps[i].getAppActivity();
		// 	var appIcon = apps[i].getAppIcon();

		// 	var element = $('<div>');
		// 	element.attr("data-appPackage", appPackage)
		// 			.attr("data-appActivity", appActivity)
		// 			.attr("data-appName", appName)
		// 			.attr("data-controller", "AppsController")
		// 			.attr("data-action", "launch")
		// 			// .attr("data-icons", appIcon)
		// 			.addClass("app col-lg-2 col-md-3  col-sm-4  col-xs-6")
		// 			.addClass("appInstalled")
		// 			.html('<img src="' + appIcon + '"/>');
																		
		// 	this.rootElement.append(element);
			
		// }

		// this.rootElement.append('<div id="slider-wrapper"><div id="slider" style="height:100%"></div></div>');

	},

	calculateAppPerRow : function(){
		
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

	addDom : function(app){

		var appName = app.getAppName(); 
		var appPackage = app.getAppPackage(); 
		var appActivity = app.getAppActivity();
		var appIcon = app.getAppIcon();

		var element = $('<div>');
		element.attr("data-appPackage", appPackage)
				.attr("data-appActivity", appActivity)
				.attr("data-appName", appName)
				.attr("data-controller", "AppsController")
				.attr("data-action", "launch")
				// .attr("data-icons", appIcon) 
				.addClass("app col-lg-2 col-md-3  col-sm-4  col-xs-3")
				.addClass("appInstalled")
				.html('<img src="' + appIcon + '"/>');
																	
		this.rootElement.append(element);
			
	},

	addDoms : function(apps){
		for (var i = 0; i < apps.length; i++) {
			var app = apps[i];
			this.addDom(app);
		};
	},
	removeDom : function(packageName){
		this.rootElement.find('[data-apppackage="' + packageName + '"]').remove();
	},

	render : function(){
		return this.rootElement;
	},

	getSort : function(){
		return this.sort;
	},
	setSort : function(_sort){
		this.sort = _sort;
	},
	setAppPerRow : function(value){
		this.appPerRow = value;
	},
	getAppPerRow : function(){
		return this.appPerRow;
	},	
	setChildrenElement : function(_children){
		this.childrenElement = _children;
	},

	getChildrenElement : function(){
		return this.childrenElement;
	},

	keydown : function(){
		var app_per_row = this.getAppPerRow();
		var children = this.childrenElement;
		if (this.elementSelected == null) {
			this.elementSelected = children.eq(0);
			this.elementSelected.addClass("selected");
		}else{
			var position = this.elementSelected.index();
			var index = position + app_per_row;
			var next =  children.eq(index);
            if (next.length > 0 && next != undefined && index >= 0) {
                this.elementSelected.removeClass("selected");
                this.elementSelected = next.addClass('selected');
            }
		}
		// this.adjust_app_list("keyboard_down");
		$('#appPanel_Content').scrollTo(this.elementSelected);
	},
	keyup : function(){
		var app_per_row = this.getAppPerRow();
		var children = this.childrenElement;
		if (this.elementSelected == null) {
			this.elementSelected = children.eq(0);
			this.elementSelected.addClass("selected");
		}else{
			var position = this.elementSelected.index();
			var index = position - app_per_row;
			var next =  children.eq(index);
            if (next.length > 0 && next != undefined && index >= 0) {
                this.elementSelected.removeClass("selected");
                this.elementSelected = next.addClass('selected');
            }else{
            	_controller.AppsController.removeControllBarSelected();
            	_controller.TopControllBarController.addControllBarSelected();
            	this.elementSelected.removeClass("selected");
            }
		}
		// this.adjust_app_list("keyboard_up");
		$('#appPanel_Content').scrollTo(this.elementSelected);
	},

	keyleft : function(){
		var children = this.childrenElement;
		if (this.elementSelected == null) {
			this.elementSelected = children.eq(0);
			this.elementSelected.addClass("selected");
		}else{
			var next = this.elementSelected.prev();
			
            if (next.length > 0 && next != undefined ) {
                this.elementSelected.removeClass("selected");
                this.elementSelected = next.addClass('selected');
            }
		}
		$('#appPanel_Content').scrollTo(this.elementSelected);
	},
	keyright:function(){
		var children = this.childrenElement;
		if (this.elementSelected == null) {
			this.elementSelected = children.eq(0);
			this.elementSelected.addClass("selected");
		}else{
			var next = this.elementSelected.next();
			
            if (next.length > 0 && next != undefined ) {
                this.elementSelected.removeClass("selected");
                this.elementSelected = next.addClass('selected');
            }
		}
		$('#appPanel_Content').scrollTo(this.elementSelected);
	},
	adjust_app_list : function(arg){

		var parentOffsetTop = 80;
		var movieHeight = $('#appPanel_Content').height();

		var movieScrollTop = $('#appPanel_Content').scrollTop();

		var movieOffset;
        var movieLiHeight;
        if (this.elementSelected != undefined) {
            movieOffset = this.elementSelected.offset().top ;
            movieLiHeight = this.elementSelected.outerHeight() ;
        }
        // else{
        //     if (IsAndroid) {
        //         movie_list.css({
        //             '-webkit-overflow-scrolling': 'touch',
        //             'overflow-y': 'scroll'
        //         });
        //     }
        //     return;
        // }

        // if (IsAndroid) {
        //     movie_list.css({
        //         '-webkit-overflow-scrolling': 'touch',
        //         'overflow-y': 'scroll'
        //     });
        // }

        var arrow = arguments;
        var moveScroll;

        if (arrow != undefined && (arrow[0] == "keyboard_up" || arrow[0] == "keyboard_down")) {
            if (movieOffset < 0) {
                moveScroll = movieScrollTop + (movieOffset - parentOffsetTop) -25;
                
                $('#appPanel_Content').scrollTop(moveScroll);    
                
            } else if (movieOffset - parentOffsetTop > movieHeight - movieLiHeight ) {
                var x = movieHeight - movieLiHeight - (movieOffset - parentOffsetTop);
                moveScroll = movieScrollTop - x + 25;
                $('#appPanel_Content').scrollTop(moveScroll);
            }
        }
	},

	getElementSelected : function(){
		return this.elementSelected;
	},
	setElementSelected : function(_elementSelected){
		this.elementSelected = _elementSelected;
	}



});