AppShortcutModel = Class.extend({
	appPackage : null,
	appActivity : null,
	appName : null,

	init : function(package, activity, name){
		this.appPackage = package;
		this.appActivity = activity;
		this.appName = name;
	},
	setAppPackage : function(_appPackage){
		this.appPackage = _appPackage;
	},
	setAppActivity : function(_appActivity){
		this.appActivity = _appActivity;
	},
	setAppName : function(_appName){
		this.appName = _appName;
	},

	getAppPackage : function(){
		return this.appPackage;
	},
	getAppActivity : function(){
		return this.appActivity;
	},
	getAppName : function(){
		return this.appName;
	}
});