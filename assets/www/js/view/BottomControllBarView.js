BottomControllBarView = Class.extend({
	rootElement : null,
	childrenElement : null,
	elementSelected : null,
	init : function(){
		this.rootElement = $('.quickBar').attr("data-controller", "BottomControllBarController");
		this.childrenElement = this.rootElement.find('.text-center > div');
	},
	keydown : function(){
		
	},
	keyup : function(){
		_controller.BottomControllBarController.removeControllBarSelected();
    	_controller.AppsVp9Controller.addControllBarSelected();	
    	this.elementSelected.removeClass("selected");       
	},

	keyleft : function(){
		var children = this.childrenElement;
		if (this.elementSelected == null) {
			this.elementSelected = children.eq(0);
			this.elementSelected.addClass("selected");
		}else{
			var next = this.elementSelected.prev();
			
            if (next.length > 0 && next != undefined ) {
                this.elementSelected.removeClass("selected");
                this.elementSelected = next;
                this.elementSelected.addClass('selected');
            }
		}
	},
	keyright:function(){
		var children = this.childrenElement;
		if (this.elementSelected == null) {
			this.elementSelected = children.eq(0);
			this.elementSelected.addClass("selected");
		}else{
			var next = this.elementSelected.next();
			
            if (next.length > 0 && next != undefined ) {
                this.elementSelected.removeClass("selected");
                this.elementSelected = next;
                this.elementSelected.addClass('selected');
            }
		}
	},
})