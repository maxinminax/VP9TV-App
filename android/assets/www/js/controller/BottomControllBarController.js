BottomControllBarController = Class.extend({
	view : null,
	init : function(){
		this.view = new BottomControllBarView();
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
		}
	},
	addControllBarSelected : function(){
		if (this.view != null) {
			this.view.rootElement.addClass("viewSelected");
			if (this.view.elementSelected == null) {
				this.view.keyleft();
			}else{
				this.view.elementSelected.addClass("selected");
			}
		}
	},

	keyEnter : function(){
		var element = this.view.elementSelected;
		element.removeClass("selected");
		// if (element.attr('id')) {
		// 	if($('#appPanel').hasClass('visible')){
		// 		// init appVp9
		// 		_controller.AppsVp9Controller.getApps();

		// 		$('#appPanel').removeClass('visible');
		// 		setTimeout(function(){$('#appPanel').css('display', 'none');}, 500);
		// 	}else{
		// 		$('.viewSelected').removeClass('viewSelected');
		// 		_controller.AppsController.addControllBarSelected();

		// 		_controller.AppsVp9Controller.destroy();

		// 		// 	_controller.AppsController.getApps();	
		// 		if(_controller.AppsController.getState() == CONFIG.STATE["LOADED"]){	
		// 			$('#appPanel').css('display', 'block');
		// 			setTimeout(function(){$('#appPanel').addClass('visible');}, 10);
		// 		}else{
		// 			_controller.AppsController.loadingApp(function(){
		// 				$('#appPanel').css('display', 'block');
		// 				setTimeout(function(){$('#appPanel').addClass('visible');}, 10);
		// 			});
		// 		}
		// 	}
		// }else{
			element.click();
		// }


	},


})