SettingServiceView = Class.extend({
	rootElement : null,

	init : function(serverUsing, servers, checked){

		this.rootElement = $('<ul class="sub" style="top:-1px">');

		if (serverUsing != null) {
			var servicesUsing = serverUsing.getServices();
			var serverName = serverUsing.getAddress();
			if (servicesUsing.length >= 0) {
				var services = servers.getServices();
				for (var i = 0; i < services.length; i++) {
					var id = services[i].getId(); 
					var service_name = services[i].getName(); 
					var service_type = services[i].getService(); 
					var status = services[i].getStatus();
					var icon = services[i].getIcon();
				
					var li = $('<li>').attr("data-server_id", serverUsing.getId())
											.attr("data-server_name", serverUsing.getName())
											.attr("data-server_address", serverUsing.getAddress())
											.attr("data-service_id", id)
											.attr("data-serviceName", service_name)
											.attr("data-serviceType", service_type)
											.attr("data-serviceIcon", icon)
											.attr("data-controller", "SettingController")
											.attr("data-action", "addremoveService")
											.data("param", services[i])
											.attr("action", "add");
						li = li[0];				


						var inputId = serverName + id + service_type;

						li.innerHTML = '<label for="' + inputId +'" >' + service_name + '</label><input type="checkbox" id="' + inputId +'" />';
						if (this.checkChooseService(serverUsing, id)) {
							li.innerHTML = '<label for="' + inputId +'" >' + service_name + '</label><input type="checkbox" checked="checked" id="' + inputId +'" />';
						};

					
					this.rootElement.append(li);	
				}
			}
		}else{
			var services = servers.getServices();
			var serverName = servers.getAddress();
			for (var i = 0; i < services.length; i++) {
				var id = services[i].getId(); 
				var service_name = services[i].getName(); 
				var service_type = services[i].getService(); 
				var status = services[i].getStatus();
				var icon = services[i].getIcon();
			
				var li = $('<li>').attr("data-server_id", servers.getId())
										.attr("data-server_name", servers.getName())
										.attr("data-server_address", servers.getAddress())
										.attr("data-service_id", id)
										.attr("data-serviceName", service_name)
										.attr("data-serviceType", service_type)
										.attr("data-serviceIcon", icon)
										.attr("data-controller", "SettingController")
										.attr("data-action", "addremoveService")
										.data("param", services[i])
										.attr("action", "add");
					li = li[0];			

					var inputId = serverName + id + service_type;					
					li.innerHTML = '<label for="' + inputId +'" >' + service_name + '</label><input type="checkbox" id="' + inputId +'" />';

				this.rootElement.append(li);	
			}
		}
		
		
	},

	checkChooseService : function(serverUsing, id){
		var serviceUsing = serverUsing.getServices();
		for (var j = 0; j < serviceUsing.length; j++) {
			var service = serviceUsing[j];
			if (id == service.getId()) {
				return true;
			};
		};
		return false;
	},
	addService : function(server, services){
		var ul = $('<ul>');

		var servicesUsing = server.getService();

		for (var i = 0; i < services.length; i++) {
			var id = services[i].getId(); 
			var service_name = services[i].getName(); 
			var service_type = services[i].getService(); 
			var status = services[i].getStatus();
			var icon = services[i].getIcon();
		
			var li = $('<li>').attr("data-server_id", server.getId())
									.attr("data-server_name", server.getName())
									.attr("data-server_address", server.getAddress())
									.attr("data-service_id", id)
									.attr("data-serviceName", service_name)
									.attr("data-serviceType", service_type)
									.attr("data-serviceIcon", icon)
									.attr("data-controller", "SettingController")
									.attr("data-action", "addremoveService")
									.attr("action", "add");
				li = li[0];								
				li.innerHTML = '<label for="' + id + service_type +'" >' + service_name + '</label><input type="checkbox" id="' + id + service_type +'" />';

			for (var j = 0; j < servicesUsing.length; j++) {

				var serviceUsing = servicesUsing[j];
				if (id == serviceUsing.getId()) {
					li.innerHTML = '<label for="' + id + service_type +'" >' + service_name + '</label><input type="checkbox" id="' + id + service_type +'" />';
					break;
				};
			};
			ul.append(li);	
			
		}
		return ul.html();

	},

	render : function(){
		return this.rootElement;
	},

})