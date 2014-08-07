var SettingControllBarGeneralController = Class.extend({
	view : null,
	init : function(){
		this.view = new SettingControllBarGeneralView();
	},

	keyDownUpLeftRight : function(e){
		switch(e.keyCode){
			case 37:
			  	this.view.keyleft();
			  	break;
			case 38:
			  	this.view.keyup();
			  	break;
			case 39:
			  	this.view.keyright();
			  	break;
			case 40:
			  	this.view.keydown();
			  	break;
			default:
			  	break;
		}
	},

	getView : function(){
		return this.view;
	},
	removeControllBarSelected : function(){
		if (this.view != null) {
			this.view.rootElement.removeClass("viewSelected");	
		};
	},
	addControllBarSelected : function(){
		if (this.view != null) {
			this.view.rootElement.addClass("viewSelected");
			if (this.view.elementSelected == null) {
				// this.view.keyleft();
			};
		};
		
	}
})