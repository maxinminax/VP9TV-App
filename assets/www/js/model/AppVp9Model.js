AppModel = Class.extend({
	appPackage : null,
	appActivity : null,
	appName : null,
	appIcon : null,
	type : null,
	appIconDefault : null,

	init : function(package, activity, name, icon){
		this.appPackage = package;
		this.appActivity = activity;
		this.appName = name;
		this.appIcon = icon;
		this.appIconDefault = "img/img_vp9Logo.png";
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
	setAppIcon : function(_appIcon){
		this.appIcon = _appIcon;
	},
	setType : function(_type){
		this.type = _type;
	},
	getAppPackage : function(){
		return this.appPackage;
	},
	getAppActivity : function(){
		return this.appActivity;
	},
	getAppName : function(){
		return this.appName;
	},
	getAppIcon : function(){
		return this.appIcon;
	},
	getType : function(){
		return this.type;
	},
	getAppIconDefault : function(){
		return this.appIconDefault;
	}


});