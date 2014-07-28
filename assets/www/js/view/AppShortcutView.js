AppShortcutView = Class.extend({
	rootElement : null,
	
	init : function(shortcuts){
		this.rootElement = $('<div>');
		for (var i = 0; i < shortcuts.length; i++) {
			var appName = shortcuts[i].getAppName(); 
			var appPackage = shortcuts[i].getAppPackage(); 
			var appActivity = shortcuts[i].getAppActivity();

			var element = $('<div>');
			element.attr("data-appPackage", appPackage).attr("data-appActivity", appActivity)
														.attr("data-appName", appName)
														.attr("data-controller", "AppShortcutController ")
														.attr("data-action", "launch remove")
														.addClass("app");
			$(this.rootElement).append(element);
		}
	},

	addEvent : function(){
		this.rootElement.find("*[data-appPackage]").unbind("click");
		this.rootElement.find("*[data-appPackage]").bind("click", function(){
			alert("launch");
			window.plugins.launching.app(this);
		});
	},

	render : function(){
		return this.rootElement;
	},
	getSort : function(){
		return this.sort;
	},
	setSort : function(_sort){
		this.sort = _sort;
	}



});