var KeyCodeInfo = Class.extend({
	msgValue : null,
	isSuccess : null,

	init : function(){

	},
	getMsgValue : function(){
		return this.msgValue;
	},
	setMsgValue : function(msgValue){
		this.msgValue = msgValue;
	},
	getSuccess : function(){
		return this.isSuccess;
	},
	setSuccess : function(isSuccess){
		this.isSuccess = isSuccess;
	}
})