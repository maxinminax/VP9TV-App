SettingServerModel = Class.extend({
	id : null,
	name : null,
	address : null,
	status : 1,
	type : null,
	services : [],
	channels : [],

	init : function(id, name, address,	status , services, type ){
		this.id = id;
		this.name = name;
		this.address = address;
		this.status = status;
		this.services = services;
		this.type = type;
		
	},
	
	setId : function(id){
		this.id = id;
	},
	setName : function(name){
		this.name = name;
	},
	setAddress : function(address){
		this.address = address
	},
	setStatus : function(status){
		this.status = status
	},
	setServices : function(services){
		this.services = services;
	},
	setType : function(type){
		this.type = type;
	},

	getId : function(id){
		return this.id;
	},
	getName : function(name){
		return this.name;
	},
	getAddress : function(address){
		return this.address;
	},
	getStatus : function(status){
		return this.status;
	},
	getServices : function(services){
		return this.services;
	},
	getType : function(){
		return this.type;
	},
	pushService : function(service){
		this.services.push(service);
	},
	removeService : function(service){
		
	}
	



});