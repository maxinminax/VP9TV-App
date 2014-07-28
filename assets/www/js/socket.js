var VP9 = VP9 || {};

VP9.sockets = function() {
	var _this = this;

	this.socket = {};
	this.login = {};
	this.remote = {};

	this.add = function(domain, socket) {
		console.log(domain);
		if (!domain) {
			return false;
		}
		domain = domain.replace('http://', '');
		if (_this.socket[domain] && _this.socket[domain].state != 5) {
			console.log('socket của ' + domain + ' đã tồn tại');
			if (!_this.login[domain]) {
				_this.login[domain] = new VP9.login(_this.socket[domain]);
			}
			else if (!_this.login[domain].logged) {
				_this.login[domain].verify();
			}

			if (!_this.remote[domain]) {
				_this.remote[domain] = new VP9.remote(_this.socket[domain], _this.login[domain]);
			}
			//return false;
		}
		else {
			_this.socket[domain] = new VP9.socket(domain, socket);
			_this.login[domain] = new VP9.login(_this.socket[domain]);
			_this.remote[domain] = new VP9.remote(_this.socket[domain], _this.login[domain]);
		}
	}

	this.remove = function(domain) {
		if (!_this.socket[domain]) {
			return false;
		}
		_this.socket[domain].close();
		_this.login[domain] = null;
		_this.remote[domain] = null;
	}
}

VP9.socket = function(domain, socket) {
	var _this = this;
	this.count = 0;

	var url = 'ws://' + domain + ':1505';
	if (socket && socket.indexOf('ws://')) {
		url = socket;
	}

	this.domain = domain;

	this.callbacks = {};

	this.trigger = function(action, data) {
		if (_this.callbacks.hasOwnProperty(action)) {
			var callbacks = _this.callbacks[action];
			for (var i = 0; i < callbacks.length; i++) {
				callbacks[i].call(this, data);
			}
		}
	}

	this.init = function(url) {
		console.log(url + ': init WebSocket ');
		_this.ws = new window.plugins.WebSocket(url);
		_this.url = url;

		_this.state = 0; //

		_this.ws.onopen = function() {
			_this.state = 1;
			_this.count = 0;
			console.log(url + ': ws opened');
			$('.home_item[data-appserver="http://' + _this.domain + '"] .home_item_detail').removeClass('die');
			if (_this.callbacks.hasOwnProperty('open')) {
				var callbacks = _this.callbacks.open;
				for (var i = 0; i < callbacks.length; i++) {
					callbacks[i].call(this);
				}
			}
			_this.off('open');
		}

		_this.ws.onerror = function() {
			console.log(url + ': ws error');
			if (_this.callbacks.hasOwnProperty('error')) {
				var callbacks = _this.callbacks.error;
				for (var i = 0; i < callbacks.length; i++) {
					callbacks[i].call(this);
				}
			}
		}

		_this.ws.onclose = function() {
			_this.state = 3;
			console.log(url + ': ws close');
			if (_this.callbacks.hasOwnProperty('close')) {
				var callbacks = _this.callbacks.close;
				for (var i = 0; i < callbacks.length; i++) {
					callbacks[i].call(this);
				}
			}
			$('.home_item[data-appserver="http://' + _this.domain + '"] .home_item_detail').addClass('die');
			_this.reconnect();
		}

		_this.ws.onmessage = function(message) {
			// console.log(url + ': Message - ' + message.data);
			// var data = message.data;
			var data = message;
	        if (data.trim() == "") {
	            return;
	        }
			messageObj = JSON.parse(data);
			if (!messageObj) {
				return;
			}
			if (messageObj.action == 'ping') {
				try {
					_this.ws.send('{"action": "pong"}');
				}
				catch (e) {

				}
			}
			else {
				_this.trigger(messageObj.action, messageObj);
			}
		}
	}

	_this.reconnect = function() {
		console.log(url + ': reconnect');
		if (_this.count > 4) {
			_this.state = 5;
			_this.close();
			return;
		}
		_this.state = 4; //reconnect state
		setTimeout(function() {
			_this.count++;
			_this.init(_this.url);
		}, 3000);
		console.log(url + ': Đứt kết nối mạng, Đang kết nối lại')
	}

	_this.send = function(request) {
		request.keys = Date.now();
		data = JSON.stringify(request);
		try {
			if (this.state == 1) { // open
				console.log(url + ': Sending - ' + data);
				_this.ws.send(data);
			}
			else {
				console.log(url + ": Send request when ws is not in OPEN state");
				_this.on('open', function() {
					_this.send(request);
				});
			}
		}
		catch(e) {
			console.log(e);
		}
	}

	_this.close = function() {
		_this.ws.onclose = function() {};
		_this.ws.close();
		_this = null;
	}

	this.on = function(action, func) {
		if (typeof _this.callbacks[action] != 'object') {
			_this.callbacks[action] = [];
		}
		if (typeof func == 'function') {
			_this.callbacks[action].push(func);
			return true;
		}
		else {
			return false;
		}
	}

	_this.off = function(action, func) {
		delete _this.callbacks[action];
	}

	this.init(url);
}

VP9.login = function(socket) {
	var _this = this;

	this.domain = socket.domain;
	this.logged = false;

	this.init = function() {
		socket.on('AcountInfo', _this.UIverify);
		socket.on('login', _this.UIlogin);
		socket.on('relogin', this.UIrelogin);
		socket.on('token', this.UItoken);
		_this.verify();
		socket.on('close', function() {
			$('.stt_server .stt_detail_head .room-code span[data-domain="' + _this.domain + '"]').empty();
			_this.logged = false;
        	_this.token = '';
        	_this.code = '';
			_this.verify();
		});
	}

    this.verify = function() {
        var token = {};
        try {
        	token = JSON.parse(localStorage.token);
        }
        catch (e) {
        	localStorage.token = '{}';
        	token = {};
        }
        if (token && token[_this.domain] && token[_this.domain].token) {
        	_this.token = token[_this.domain].token;
            socket.send({
            	action : "token",
            	token : token[_this.domain].token
            });
        } else {
            try {
                var getAccountSuccess = function() {
                    var parse = JSON.parse(arguments[0]);

                    var arrEmail = [];
                    var deviceID = parse["DeviceID"];
                    localStorage.deviceID = deviceID;

                    var accounts = parse["AccountInfos"];
                    for (var i = 0; i < accounts.length; i++) {
                        var account = accounts[i]["account"];
                        arrEmail.push(account);
                    };

                    // /*ADD ACCOUNT*/
                   		//TODO: addaccount action
                    // /*ADD ACCOUNT*/

                    console.log(JSON.stringify(arrEmail));
                    if (arrEmail.length > 0) {
                        socket.send({
                        	action : "AcountInfo",
                        	type : "Get_Account_Device",
                        	account_list : arrEmail
                        });
                    } else {
                        console.log('cần add account');
                        /*var message = 'Bạn cần đăng nhập tài khoản đi kèm với thiết bị!';
                        $('.home_message').html(message);

				        var announcement = [];
				        try {
				        	announcement = JSON.parse(localStorage.announcement);
				        }
				        catch (e) {
				        	localStorage.announcement = '[]';
				        	announcement = [];
				        }
				        var dNow = new Date();
						var sDate = dNow.getMonth() + '/' + dNow.getDate() + '/' + dNow.getFullYear() + ' ' + dNow.getHours() + ':' + dNow.getMinutes();
				        announcement.push({
				        	server: _this.domain,
				        	time: sDate,
				        	message: message 
				        });
				        localStorage.announcement = JSON.stringify(announcement);*/
                        //TODO
                    }
                };

                var getAccountError = function() {
                    console.log('Khong lay duoc thong tin tai khoan');
                };
                cordova.exec(getAccountSuccess, getAccountError, "AccountInfoPlugin", "getAccountInfos", []);
            } catch (e) {
                alert("catch: " + e);
            }
        }
    }

    this.sendToken = function(data) {
	    var accountInfo = JSON.parse(data);
	    var mail = accountInfo.mail;
	    var token = accountInfo.token;
	    //var deviceID = localStorage.deviceID;
	    var deviceID = device.uuid;

	    socket.send({
	    	action: "login",
	    	type_login: "device_login",
	    	email: mail,
	    	mail_type: "gmail",
	    	androidId : deviceID,
	    	//ip: VP9.CONFIG.URL,
	    	account_token: token
	    });
    }

    this.UIverify = function(data) {
        if (!data.email) {
            //TODO: addaccount action
        } else {
        	var email = data.email;
            //getAuthenticationAccountGmail
            var data = [{
                "account": email
            }],
            callbackSuccess = function(data) {
                console.log(data);
                _this.sendToken(data);
            };
            callbackError = function(data) {
                console.log(data);
            }
            cordova.exec(callbackSuccess, callbackError, "AccountInfoPlugin", "account_gmail_access_token", data);
        }
    }

    this.UIrelogin = function(data) {
        if (data.isSuccess) {
            //login success
            _this.code = data.code;

            $('.stt_server .stt_detail_head .room-code span[data-domain="' + _this.domain + '"]').html(data.code);

            _this.logged = true;
	        var token = {};
	        try {
	        	token = JSON.parse(localStorage.token);
	        }
	        catch (e) {
	        	localStorage.token = '{}';
	        	token = {};
	        }
            token[_this.domain] = {
            	token: data.token,
            	code: data.code
            }
            localStorage.token = token;
        } else {
        	_this.logged = false;
        	_this.token = '';
        	_this.code = '';
        	var token = JSON.stringify(localStorage.token);
            if (token && token[_this.domain]) {
            	delete token[_this.domain];
            }
            if (token) {
            	localStorage.token = JSON.stringify(token);
            }
            else {
            	localStorage.removeItem('token');
            }
        }
    }

    this.UItoken = function(data) {
        _this.token = data.token;
        _this.code = data.code;

         $('.stt_server .stt_detail_head .room-code span[data-domain="' + _this.domain + '"]').html(data.code);
        
        _this.logged = true;
        var token = {};
        try {
        	token = JSON.parse(localStorage.token);
        }
        catch (e) {
        	localStorage.token = '{}';
        	token = {};
        }
        token[_this.domain] = {
        	token: data.token,
        	code: data.code
        }
        localStorage.token = JSON.stringify(token);
    }

    this.init();
}

VP9.remote = function(socket, login) {
	var _this = this;
	this.domain = socket.domain;
	this.callbacks = {};

	this.trigger = function(action, data) {
		if (_this.callbacks.hasOwnProperty(action)) {
			var callbacks = _this.callbacks[action];
			for (var i = 0; i < callbacks.length; i++) {
				callbacks[i].call(this, data);
			}
		}
	}

	socket.on('forward_message', function(data) {
		if (!data.content || !data.content.action) {
			_this.trigger(data.content.action, data);
		}
		var action = data.content.action;
		switch (action) {
			case 'get_app':
				_this.UIgetApp(data);
				break;
			case 'open_app':
				_this.UIopenApp(data);
				break;
			case 'close_app':
				_this.UIcloseApp(data);
				break;
			case 'show_app':
				_this.UIshowApp(data);
				break;
			case 'hide_app':
				_this.UIhideApp(data);
				break;
			case 'run_app':
				_this.UIrunApp(data);
				break;
			case 'load_app':
				_this.UIloadApp(data);
				break;
		}

		if (data.content && data.content.action) {
			_this.trigger(data.content.action, data);
		}
	});

	this.on = function(action, func) {
		if (typeof _this.callbacks[action] != 'object') {
			_this.callbacks[action] = [];
		}
		if (typeof func == 'function') {
			_this.callbacks[action].push(func);
			return true;
		}
		else {
			return false;
		}
	}

	this.off = function(action, func) {
		delete _this.callbacks[action];
	}

	this.send = function(action, success, data) {
		var msg = {};
		msg.action = 'forward_message';
		msg.type = 'main';
		msg.content = {};
		msg.content.action = action;
		msg.content.success = !!success;
		if (!!success && data) {
			msg.content.data = data;
		}
		console.log(msg);
		socket.send(msg);
	}

	this.UIgetApp = function(data) {
		instanceHandleUpdate.readTextFromFile(CONFIG.SETTING_NAME + '.txt', function(data){
			try{
				var apps = JSON.parse(data);
				$.each(apps, function(url, app) {
					if (login.code) {
						app.code = login.code;
					}
				});
				_this.send('get_app', true, apps);
			}catch(e){
				_this.send('get_app', false);
				// console.log("parse error");
			}
		}, function(fail){
			_this.send('get_app', false);
		});
	}

	this.UIopenApp = function(data) {
		_this.controlApp('open_app', [{url: data.content.url}]);
	}

	this.UIcloseApp = function(data) {
		_this.controlApp('close_app', [{url: data.content.url}]);
	}

	this.UIshowApp = function() {
		_this.controlApp('show_app', []);
	}

	this.UIhideApp = function() {
		_this.controlApp('hide_app', []);
	}

	this.UIrunApp = function(data) {
		_this.controlApp('run_app', [{js: data.content.js}]);
	}

	this.UIloadApp = function(data) {
		_this.controlApp('load_app', [{url: data.content.url}]);
	}

	this.controlApp = function(action, data) {
		cordova.exec(function(success) {
			_this.send(action, true);
		},
		function(error) {
			_this.send(action, false);
		}, 'Launcher', action, data);
	}
}