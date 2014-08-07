var KeyCodeUtil = (function(){
	return {
		getKeyCodeInfo : function(keyCode){
			var msgValue = "";
			var isSuccess = false;
	        switch(keyCode){
		        case "KEYCODE_BACK":

		        	msgValue = "key_back";
		        	isSuccess = true;
		        	break;
		        case "KEYCODE_HOME":
		        	msgValue = "key_home";
		            isSuccess = true;
		            break;
		            
		        case "KEYCODE_BUTTON_SELECT":
		            msgValue = "key_select";
		            isSuccess = true;
		            break;
		            
		            
		        case "KEYCODE_0":
		            msgValue = "0";
		            isSuccess = true;
		            break;
		            
		        case "KEYCODE_1":
		          msgValue = "1";
		          isSuccess = true;
		          break; 
		          
		        case "KEYCODE_2":
		          msgValue = "2";
		          isSuccess = true;
		          break; 
		          
		        case "KEYCODE_3":
		          msgValue = "3";
		          isSuccess = true;
		          break; 
		          
		        case "KEYCODE_4":
		          msgValue = "4";
		          isSuccess = true;
		          break; 
		          
		        case "KEYCODE_5":
		          msgValue = "5";
		          isSuccess = true;
		          break; 
		          
		        case "KEYCODE_6":
		          msgValue = "6";
		          isSuccess = true;
		          break; 
		          
		        case "KEYCODE_7":
		          msgValue = "7";
		          isSuccess = true;
		          break; 
		          
		        case "KEYCODE_8":
		          msgValue = "8";
		          isSuccess = true;
		          break; 
		          
		        case "KEYCODE_9":
		          msgValue = "9";
		          isSuccess = true;
		          break;
		            
		        default:
		        	msgValue = String.valueOf(keyCode);
		        	isSuccess = true;
		            break; 	
		    }
	        
	        var keyCodeInfo = new KeyCodeInfo();
	        keyCodeInfo.setMsgValue(msgValue);
	        keyCodeInfo.setSuccess(isSuccess);
	        
	        return keyCodeInfo;
		},

		isNumberKey : function(keyCode) {
			var numberKeys = ["KEYCODE_0", "KEYCODE_1", "KEYCODE_2", "KEYCODE_3",
					"KEYCODE_4", "KEYCODE_5", "KEYCODE_6", "KEYCODE_7",
					"KEYCODE_8", "KEYCODE_8", "KEYCODE_9"];
			

			for (var i = 0; i < numberKeys.length; i++) {
				if(numberKeys[i] == keyCode){
					return true;
				};
			};		
			
			return false;
		}
	}
})();