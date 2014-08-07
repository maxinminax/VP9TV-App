TopControllBarController = Class.extend({
	view : null,
	init : function(){
		this.view = new TopControllBarView();
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
			this.view.elementSelected.removeClass("selected");
		};
	},
	addControllBarSelected : function(){
		if (this.view != null) {
			this.view.rootElement.addClass("viewSelected");
			if (this.view.elementSelected == null) {
				this.view.keyleft();
			}else{
				this.view.elementSelected.addClass("selected");
			}
		};
		
	},
	keyEnter : function(){
		var element = this.view.elementSelected;
		if (element.hasClass("home_menu")) {
			if($('#setting-launcher').css("display") == "block"){
				_controller.SettingController.writeFileGeneralConfig();

				$('.existedServer').remove();
				$('#main-launcher').css("display", "block");
				$('#setting-launcher').css("display", "none");

			}else{
				_controller.SettingController.getServer();
				_controller.SettingController.renderGeneralConfig();
				$('#main-launcher').css("display", "none");
				$('#setting-launcher').css("display", "block");
			}
		}else if(element.hasClass("home_back")){
			VP9.controlUI.handleBack();
		}
		return false;
	
	},

})