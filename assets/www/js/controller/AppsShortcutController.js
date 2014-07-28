AppsShortcutController = Class.extend({
	init : function(){
		if (!localStorage.getItem('vp9launcher')) {
			var vp9launcher = []
			localStorage.vp9launcher = JSON.stringify(vp9launcher);
		}
	},
	list : function(){
		var shortcutPanel = $('.shortcutPanel');
		shortcutPanel.empty();
		var shortcuts = [];

		var parse = JSON.parse(localStorage.vp9launcher);
		for (var i = 0; i < parse.length; i++) {
			var name = parse[i]["name"];
			var package = parse[i]["package"];
			var activity = parse[i]["activity"];

			var shortcut = new AppShortcutModel(package, activity, name);
			shortcuts.push(shortcut);
		};

		var appShortcutView = new AppShortcutView(shortcuts);
		appShortcutView.addEvent();
		shortcutPanel.append(appShortcutView.render());

	},
	add : function(data){   /*add them shortcut*/
		var shortcut = JSON.parse(data);

		var shortcuts = JSON.parse(localStorage.vp9launcher);

		shortcuts.push(shortcut);
		localStorage.vp9launcher = JSON.stringify(shortcuts);
	},
	remove : function(data){	/*xoa shortcut*/
		


	},
	launch : function(){		/*launching shortcut*/
		window.plugins.launching.app(this);
	}
	


})