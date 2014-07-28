ChannelModel = Class.extend({
	channelId : null,
	serverId : null,
	serverName : null,
	type : "tivi",

	init : function(channelId, serverId, serverName){
		this.channelId = channelId;
		this.serverId = serverId;
		this.serverName = serverName;
	},
	getChannelId : function(){
		return this.channelId;
	},
	getServerId : function() {
		return this.serverId;
	},
	getServerName : function() {
		return this.serverName;
	},
	setChannelId : function(channelId){
		this.channelId = channelId;
	},
	setServerId: function(serverId) {
		this.serverId = serverId;
	},
	setServerName : function(serverName) {
		this.serverName = serverName;
	},
	

})