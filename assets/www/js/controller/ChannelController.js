ChannelController = Class.extend({
	listChannelModel : null,
	isLoaded : null,
	timeout : null,

	init : function(){
		this.listChannelModel = [];
		this.isLoaded = false;
	},

	getLoaded : function(){
		return this.isLoaded;
	},
	setLoaded : function(loaded){
		this.isLoaded = loaded;
	},
	getTimeout : function(){

	},

	getChannel: function(){

		var self = this;
		// var data = '{"http://tv.vp9.tv":{"id":1,"name":"TV VP9","address":"http://tv.vp9.tv","status":1,"services":[{"id":1,"name":"Truyen hình","service":"tivi","status":1,"icon":"http://tv.vp9.tv/images/home/tivi.png"},{"id":2,"name":"Karaoke","service":"karaoke","status":1,"icon":"http://tv.vp9.tv/images/home/karaoke.png"},{"id":3,"name":"Film","service":"film","status":1,"icon":"http://tv.vp9.tv/images/home/movie.png"},{"id":5,"name":"Music","service":"music","status":1,"icon":"http://tv.vp9.tv/images/home/music.png"},{"id":6,"name":"Game","service":"game","status":1,"icon":"http://tv.vp9.tv/images/home/game.png"}]}}';
		// self.loadChannelListFromServer(data);

		instanceHandleUpdate.readTextFromFile(CONFIG.SETTING_NAME + '.txt', function(data){
			
			if (data == null || data == undefined || data.trim() == "") {
				return;
			};
			
			/* Read File Channel list */
			try{
				self.loadChannelListFromServer(data);
				self.setLoaded(true);
			}catch(e){
				instanceHandleUpdate.readTextFromFile(CONFIG.FILE_CHANNEL_LIST, function(data){
					self.loadChannelFromSdcard(data);
					self.setLoaded(true);
				}, function(){

				});
			}
			
		}, function(fail){
			// var data = [];
			// instanceHandleUpdate.writeLine(CONFIG.CONFIG.SETTING_NAME + '.txt', data, function(success){
			// 	// alert("write ok");
			// 	var apps = JSON.parse(success);
			// 	self.showResult(apps);
			// }, function(fail){
			// 	// alert("write fail");
			// });
		});
	},

	loadChannelListFromServer : function(listserver){
		var self = this;
		if (listserver == null || listserver == "") {
			return;
		};

		var servers = null;
		try{
			servers = JSON.parse(listserver);
		}catch(e){
			return;
		}
		if (servers == null) {
			return;
		};


		var serverContainTvLoadedLength = 0;

		var arrServerContainTv = [];


		$.each(servers, function(k, server) {
			var serverId = server.id;
			var serverName = server.name;
			var serverAddress = server.address;

			var content = server.services;
			if(self.checkServiceExsits(content, "tivi")){

				var obj = {"server_id" : serverId, 
							"server_name" : serverAddress,
							"server_address" : serverAddress + "/tivichannel/ChannelNumber.json"
						};
				arrServerContainTv.push(obj);
			}

		});


		// for (var i = 0; i < servers.length; i++) {
		// 	var serverId = servers[i].id;
		// 	var serverName = servers[i].name;
		// 	var serverAddress = servers[i].address;

		// 	var content = servers[i].content;
		// 	if(this.checkServiceExsits(content, "tivi")){

		// 		var obj = {"server_id" : serverId, 
		// 					"server_name" : serverAddress,
		// 					"server_address" : serverAddress + "/tivichannel/ChannelNumber.json"
		// 				};
		// 		arrServerContainTv.push(obj);
		// 	}
		// };


		for (var i = 0; i < arrServerContainTv.length; i++) {
			var obj = arrServerContainTv[i];

			VP9.cordova.getChannelList([obj],function(success){
				
				
				if (success == "") {
					return;
				}

				var parse = null;
				try{
					parse = JSON.parse(success);
				}catch(e){
					return;
				}
				if(parse == null){
					return;
				}

				var serverId = parse.server_id;
				var serverName = parse.server_name;
				var strChannelList = parse.channel_list;

				if (strChannelList == null && strChannelList.trim() == "") {
					return;
				};



				var arrChannelList = [];
				try{
					arrChannelList = JSON.parse(strChannelList).channelList;
				}catch(e){
					return;
				}
				for (var i = 0; i < arrChannelList.length; i++) {
					var channelId = arrChannelList[i];
					var channel = new ChannelModel(channelId, serverId, serverName);
					self.getListChannelModel().push(channel);
				};
				serverContainTvLoadedLength ++;

			}, function(fail){
				console.log(fail);
			});

		};


		var interval = setInterval(function(){
			if (arrServerContainTv.length == serverContainTvLoadedLength) {
				clearInterval(interval);


				if (IsAndroid) {
					instanceHandleUpdate.writeLine(CONFIG.FILE_CHANNEL_LIST, JSON.stringify(self.getListChannelModel()) , function(success){
						GLOBAL_CHANNEL_LIST = JSON.parse(success);
					}, function(fail){
						isSuccess = false;
						// alert("write fail");
						// alert(fail);
					});
				}

			};

		}, 1000);
		


	},

	getListChannelModel : function(){
		return this.listChannelModel;
	},

	checkServiceExsits : function(services, name){
		if (services == null) {
			return false;
		};
		for (var i = 0; i < services.length; i++) {
			var service = services[i].service
			if (service == name) {
				return true;
			};
		};
		return false;
	},

	loadChannelFromSdcard : function(data){
		var parseChannel = null;
		if (data != "") {
			try{
				parseChannel = JSON.parse(data);
			}catch(e){
				return;
			}
		};
		var arrChannel = [];
		if (parseChannel != null) {
			for (var i = 0; i < parseChannel.length; i++) {
				var channel = parseChannel[i];
				var channelId = channel.channelId;
				var serverId = channel.serverId;
				var serverName = channel.serverName;

				var channelModel = new ChannelModel(channelId, serverId, serverName);
				arrChannel.push(channelModel);
			};
		}

		this.listChannelModel = arrChannel;
	},

	playChannel : function(channelNumber){
		if(channelNumber != "" ){
			for (var i = 0; i < _controller.ChannelController.getListChannelModel().length; i++) {
				var objChannel = _controller.ChannelController.getListChannelModel()[i];
				if(objChannel.getChannelId() == channelNumber){
					var serverName = objChannel.getServerName();
					var obj = {"package" : CONFIG.VP9APP.package, 
								"activity" : CONFIG.VP9APP.activity, 
								"type" : "tivi", 
								"server" : serverName,
								"channelNumber" : channelNumber
							};
					console.log("-------------------- " + JSON.stringify(obj));
					window.plugins.launching.appVP9(obj);
					break;
				}
			};
		}
	},

	


})