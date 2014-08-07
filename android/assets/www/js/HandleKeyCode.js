var HandleKeyCode = Class.extend({
	strChannel : null,
	timeout : null,
	timeoutPlayChannel : null,
	keyOld : null,
	keyNew : null,
	isWait : null,
	timeoutIsWait  : null,

	init : function(){
		this.strChannel = "";
		this.isWait = false;
	},

	setChannel : function(strChannel){
		this.strChannel = strChannel;
	},
	getChannel : function(){
		return this.strChannel;
	},
	visibleChannelNumber : function(channelNumber){
		var param = {};
		param.channelNumber = channelNumber;
		if(IsAndroid){
			VP9.cordova.visibleChannelNumber(param);
		}
	},
	invisibleChannelNumber : function(){
		if(IsAndroid){
			VP9.cordova.invisibleChannelNumber();	
		}
	},
	handleChannelNumber : function(keyCodeInfo){
		var self = this;
		var keyNew = keyCodeInfo;

		
		if (this.isWait &&  (this.keyOld != null && keyNew.getMsgValue() == this.keyOld.getMsgValue())) {
			console.log("key old: " + keyNew.getMsgValue() + " - " + this.keyOld.getMsgValue());
			return;
		}
		
		this.isWait = true;
		clearTimeout(this.timeoutIsWait);
		this.timeoutIsWait = setTimeout(function(){
			self.isWait = false;
		}, 500);

		this.keyOld = keyNew;

		VP9.cordova.gohomelauncher();



		// if(this.strChannel != null && this.strChannel != ""){
		// 	if (this.strChannel.trim().endsWith('-') && this.strChannel.trim().length < 3) {
		// 		if(this.timeout != null){
		// 			clearTimeout(this.timeout);
		// 		}
		// 		this.strChannel = this.strChannel.replace("-", keyCodeInfo.getMsgValue());
		// 		if(this.strChannel.length < 2){
		// 			this.strChannel += "-";
		// 			// tvChannel.setText(strChannel +"-");     // show channel
		// 			this.visibleChannelNumber(this.strChannel);
		// 	 	}else{
		// 	 		// tvChannel.setText(strChannel);     // show channel
		// 	 		this.visibleChannelNumber(this.strChannel);
		// 	 		// this.timeout = setTimeout(function(){
		// 	 		// 	self.playChannelNumber.call(self);
		// 	 		// 	if (this.timeoutPlayChannel != null) {
		// 				// 	clearTimeout(this.timeoutPlayChannel);	
		// 				// };
		// 	 		// }, 1000);
						
		// 	 		// return;
		// 	 	}
		// 	}else if(this.strChannel.trim().length < 1 || this.strChannel == ""){
		// 		if (this.timeout != null) {
		// 			clearTimeout(this.timeout);	
		// 			if (this.timeoutPlayChannel != null) {
		// 				clearTimeout(this.timeoutPlayChannel);	
		// 			};
		// 		};

		// 		this.strChannel = keyCodeInfo.getMsgValue() + "-";
		// 		this.visibleChannelNumber(this.strChannel);
		// 		// show channel
		// 	}else if (this.strChannel.trim().length <= 2 && this.strChannel.trim().length >= 1){
		// 		if (this.timeout != null) {
		// 			clearTimeout(this.timeout);	
		// 			if (this.timeoutPlayChannel != null) {
		// 				clearTimeout(this.timeoutPlayChannel);	
		// 			};
		// 		};

		// 		this.strChannel = keyCodeInfo.getMsgValue() + "-";
		// 		this.visibleChannelNumber(this.strChannel);
		// 	}
		// }else{
		// 	this.strChannel = "-";
		// 	this.visibleChannelNumber(this.strChannel);
		// 	//show channel

		// }

		// this.timeout = setTimeout(function(){
		// 	self.playChannelNumber.call(self);	
		// }, 3000);
		
	},

	deleteChannel : function(keyCodeInfo){
		var self = this;
		var keyNew = keyCodeInfo;

		if (this.isWait &&  (this.keyOld != null && keyNew.getMsgValue() == this.keyOld.getMsgValue())) {
			console.log("key old: " + keyNew.getMsgValue() + " - " + this.keyOld.getMsgValue());
			return;
		}
		
		this.isWait = true;
		clearTimeout(this.timeoutIsWait);
		this.timeoutIsWait = setTimeout(function(){
			self.isWait = false;
		}, 500);

		this.keyOld = keyNew;

		if (this.timeout != null) {
			clearTimeout(this.timeout);
			if (this.timeoutPlayChannel != null) {
				clearTimeout(this.timeoutPlayChannel);	
			};
		}
		
		if (this.strChannel != "" && this.strChannel.length  < 1 ) {
			if (this.strChannel.endsWith("-")) {
				
			}else{
				this.strChannel = "-";
				this.visibleChannelNumber(this.strChannel);
				// showchannel
			}
		}else if(this.strChannel != ""){
			if (this.strChannel.endsWith("-")) {
				this.strChannel = "-";
				this.visibleChannelNumber(this.strChannel);
				// showchannel
			}else{
				this.strChannel = this.strChannel.trim().substring(0, this.strChannel.trim().length - 1);
				this.strChannel += "-";
				this.visibleChannelNumber(this.strChannel);
				// showchannel
			}
		}
		

		this.timeout = setTimeout(function(){
			self.playChannelNumber.call(self);	
		}, 3000);
	},

	playChannelNumber : function(){
		var self = this;
		if (this.strChannel != null && this.strChannel.trim().endsWith("-")) {
			this.strChannel = this.strChannel.trim().substring(0, this.strChannel.trim().length - 1);
			console.log(this.strChannel);
			this.visibleChannelNumber(this.strChannel);
			// show channel
		};

		
		if (this.strChannel != "") {
			this.timeoutPlayChannel = setTimeout(function(){
				console.log("launchingApp: " + self.strChannel);
				
				// hidden channel
				// launchingApp
				
				self.invisibleChannelNumber();
				_controller.ChannelController.playChannel(self.strChannel);
				self.strChannel = "";

			}, 2000);
		}else{
            this.timeoutPlayChannel = setTimeout(function(){
                console.log("launchingApp: " + self.strChannel);              
                self.invisibleChannelNumber();
                self.strChannel = "";
 
            }, 2000);
        }
	}



})