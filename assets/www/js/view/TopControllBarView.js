TopControllBarView = Class.extend({
	rootElement : null,
	childrenElement : null,
	elementSelected : null,
	init : function(){
		this.rootElement = $('.home_top')
								.attr("data-controller", "TopControllBarController")

		this.childrenElement = this.rootElement.find('li');
	},
	keydown : function(){
        _controller.TopControllBarController.removeControllBarSelected();
        if($('#appPanel').hasClass('visible')){
        	_controller.AppsController.addControllBarSelected();	
        	this.elementSelected.removeClass("selected");
        }else if($('#setting-launcher').is(":visible")){
        	
        }else{
        	_controller.AppsVp9Controller.addControllBarSelected();	
        	this.elementSelected.removeClass("selected");
        }
        
	},
	keyup : function(){
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