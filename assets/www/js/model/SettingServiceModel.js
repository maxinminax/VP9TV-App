SettingServiceModel = Class.extend({
	id : null,
	name : null,
	services : null,
	status : null,
	icon : null,
	temp : null,

	init : function(id, name, services, status, icon){

		this.id = id;
		this.name = name;
		this.services = services;
		this.status = status;
		this.icon = icon;
	},
	setId : function(id){
		this.id = id;
	},
	setName : function(name){
		this.icon = icon;
	},
	setService : function(services){
		this.services = services;
	},
	setStatus : function(status){
		this.status = status;
	},
	setIcon : function(icon){
		this.icon = icon;
	},

	getId : function(){
		return this.id;
	},
	getName : function(){
		return this.name;
	},
	getService : function(){
		return this.services;
	},
	getStatus : function(){
		return this.status;
	},
	getIcon : function(){
		return this.icon;
	},




});