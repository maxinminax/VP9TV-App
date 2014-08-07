SettingView = Class.extend({
	rootElement : null,
	settingserviceview :null ,
	init : function(servers){

		//this.rootElement = $('<ul class="existedServer">');
		if(servers != null && servers != undefined){
			this.arrayElement = [];
			//for (var i = 0; i < servers.length; i++) {
			$.each(servers, function(k, server) {
				if (!server.address) {
					server.address = k;
				}
				var id = server.id;
				var name = server.name;
				var address = server.address;
				var status = server.status;
				var arrService = server.services;

				var li = $('<li class="existed_server">')
										.attr("data-controller", "SettingController")
										.attr("data-action", "handlerClickDomain")
										.attr("data-param", JSON.stringify(server))
										.attr("row", id)
										.attr("title", "stt2")
										.data("param", server);


				li[0].innerHTML = '<span class="btn_remove">Xóa</span>'  + '<p>' + (name ? name : k) + '</p>' + '<p class="remove_verify"">Xóa: <a href="#" data-controller="SettingController" data-action="removeServer" class="remove_ok">Đồng ý</a> | <a href="#" class="remove_cancel">Hủy bỏ</a></p>';

				//this.rootElement.append(li);
				$('.choose_server').append(li);
			});
		}
	},

	addServer : function(server){
		if (server != null && server != undefined) {
			var id = server.getId();
			var name = server.getName();
			var address = server.getAddress();
			var status = server.getStatus();
			var arrService= server.getServices();

			var li = $('<li class="existed_server">')
										.attr("data-controller", "SettingController")
										.attr("data-action", "handlerClickDomain")
										.attr("data-param", JSON.stringify(server))
										.attr("row", id)
										.attr("title", "stt2")
										.data("param", server);

			li[0].innerHTML = '<span class="btn_remove">Xóa</span>'  + '<p>' + (name ? name : k) + '</p>' + '<p class="remove_verify"">Xóa: <a href="#" data-controller="SettingController" data-action="removeServer" class="remove_ok">Đồng ý</a> | <a href="#" class="remove_cancel">Hủy bỏ</a></p>';

			$('.choose_server').append(li);
			return li;
		}

	},

	addServerTemp : function(address){
		var li = $('<li class="existed_server">');
		li[0].innerHTML = '<p>' + address + '</p>' + '<span class="btn_remove" data-controller="SettingController" data-action="removeServer">Xoa</span>';
		return li;
									
	},

	/*render : function(){
		return this.rootElement;
	},*/

})