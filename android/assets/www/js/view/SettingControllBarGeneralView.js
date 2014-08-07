var SettingControllBarGeneralView = Class.extend({
	rootElement : null,
	leftElement : null,
	rightElement : null,

	elementLeftSelected : null,
	elementRightSelected : null,

	init : function(){
		this.rootElement =  $('.setting-content').attr("data-controller", "SettingControllBarGeneralController");

		this.leftElement = this.rootElement.find('.stt_left').addClass("menuSelected");
		this.leftElement.children = this.leftElement.find("ul li");






	},

	keydown : function(){
       if(!this.leftElement.elementChildSelected){
       		this.leftElement.elementChildSelected = this.leftElement.children.eq(0);
       		this.leftElement.elementChildSelected.addClass("active");
       }else{
       		var next = this.leftElement.elementChildSelected.next();

       		if (next.length > 0 && next != undefined ) {
                this.leftElement.elementChildSelected.removeClass("active");
                this.leftElement.elementChildSelected = next;
                this.leftElement.elementChildSelected.addClass('active');
            }
       }	
        
	},


})