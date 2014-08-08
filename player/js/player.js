var VP9 = VP9 || {};

VP9.player = function(options) {
	if (options.tag == undefined || $(options.tag).length == 0) {
		console.log('player selector fail')
		return false;
	}
	else {
		this.$player = $(options.tag);
		this.id = this.$player.attr('id') ? this.$player.attr('id').split(' ')[0] : 'VP9_Player';
	}

	var _this = this;

	var default_opts = {
		tech : 'HTML5',
		cordova : false,
		autoplay: false,
		tagClick : false,
		scale: 'aspectratio', //fill, aspectratio, none
		//ratio: 16/9,
		plugins : [],

		controls : ['back', 'home', 'menu', 'play', 'timeleft', 'progress', 'fullscreen', 'next', 'prev'],
		swf : 'player/projekktor/swf/',
		playlist : [],
		live : false,
		autoNext : false,
		activeVideo : 0,
		logo: true,
		ready: function() {

		}
	}

	this.options = $.extend(default_opts, options);
	_this.ready = function() {
		_this.on('setVideo', function() {
			_this.on('stop', function() {
				clearTimeout(_this.reconnect);
			});
		});
	}

	this.techs = ['HTML5', 'Projekktor'];
	this.clickElems = ['progress', 'fullscreen']; //list of elems allow click event, alway ['back', 'home', 'menu', 'play']
	this.eventsList = ['setVideo', 'ready', 'play', 'firstPlay', 'pause', 'stop', 'ended', 'timeupdate', 'error', 'seeking', 'seeked'];
	this.methodsList = ['setPlay', 'setPause', 'getCurrentVideo', 'getCurrentTime'];

	this.activeVideo = null;

	this.init = function() {
		console.log('init player');
		if ($.inArray(_this.options.tech, _this.techs) >= 0) {
			_this.tech = new VP9['player' + _this.options.tech](_this);
		}
		else {
			console.log('videoPlayerTech không được hỗ trợ');
			return false;
		}

		_this.onClickInit();
		//on click
		_this.onClick('back', function() {
			console.log('click back');
		});

		_this.onClick('home', function() {
			console.log('click home');
		});

		_this.onClick('menu', function() {
			console.log('click menu');
		});

		_this.onClick('play', function() {
			console.log('click play');
		});
	}

	this.destroy = function() {
		$.each(_this.plugins, function(k, plugin) {
			if (typeof(plugin.destroy) == 'function') {
				plugin.destroy.call(this);
			}
		});
		_this.setStop();
		_this.tech.destroy();
	}

	this.creatDisplay = function() {
		_this.$mesg = $('<div class="ppmesg"></div>').appendTo(_this.$display);
		_this.$logo = $('<div class="pplogo"></div>').appendTo(_this.$display);
		if (_this.options.logo) {
			_this.$vp9logo = $('<div class="vp9logo">VP9.TV</div>').appendTo(_this.$display);
		}
	}

	this.creatControls = function() {
		_this.addControl('backBtn', '<a class="nav-back nav-btn pull-left disabled"></a>', '.left')
			.on('click', function(event) {
				event.preventDefault();
				//_this.onClickBack();
			});
		_this.addControl('homeBtn', '<a class="nav-home nav-btn pull-left disabled"></a>', '.left')
			.on('click', function(event) {
				event.preventDefault();
				//_this.onClickHome();
			});
		_this.addControl('menuBtn', '<a class="nav-menu nav-btn pull-left disabled"></a>', '.left')
			.on('click', function(event) {
				event.preventDefault();
				//_this.onClickMenu();
			});
		_this.addControl('playBtn', '<a class="nav-play nav-btn pull-left"></a>', '.left')
			.on('click', function(event) {
				event.preventDefault();
				//_this.onClickPlay();
			});

		_this.addControl('networkSpeedBar', '<div class="nav-btn pull-left networkSpeed"></div>', '.left');
		_this.addControl('mesgBar', '<div class="ppmsg"></div>', '.left');
		_this.$name = $('<div class="filmName"></div>').appendTo(_this.$controls);

		_this.setLive(_this.options.live);
	}

	this.addControl = function(name, elem, postion, index) {
		if (!_this.$controls) {
			console.log('controls chưa được khởi tạo');
			return false;
		}
		if (!index) {
			return _this['$' + name] = $(elem).appendTo(_this.$controls.find(postion)).wrap('<li></li>');
		}
		else {
			return _this['$' + name] = $(elem).insertAfter(_this.$controls.find(postion).eq(index - 1)).wrap('<li></li>');
		}
	}

    this.setLive = function(live) {
    	if (live) {
    		_this.options.live = true;
			_this.$controls.addClass('live');
			_this.$nextBtn.hide();
			_this.$prevBtn.hide();
			//_this.$playBtn.addClass('disabled');
    	}
    	else {
    		_this.options.live = false;
    		_this.$controls.removeClass('live');
			_this.$nextBtn.removeAttr('style');
			_this.$prevBtn.removeAttr('style');
			//_this.$playBtn.removeClass('disabled');
    	}
    }
    
	/*----------------------- EVENT ---------------------------*/

	this.on = function(evt, func) {
		if (typeof _this['on' + _this.capitalize(evt)] == 'function') {
			_this['on' + _this.capitalize(evt)](func);
		}
		else {
			console.log('event không được hỗ trợ');
		}
	}

    /*player.off = function(evt, func) {
    	_this['off' + _this.capitalize(evt)](func);
    }
	this.off = function(evt, funcIndex) {
		if ($.inArray(evt, _this.eventsList) < 0) {
			console.log('event ' + evt + ' đăng ký không được hỗ trợ');
			return false;
		}

		var evtArr = 'event' + _this.capitalize(evt);
		if (typeof(_this[evtArr]) != 'object' || funcIndex >= _this[evtArr].length) {
			console.log('event ' + evt + ' chưa đăng ký');
			return false;
		}
		else {
			delete _this[evtArr][funcIndex];
			return true;
		}
	}*/

	this.onClickInit = function() {
		$.each(_this.clickElems, function(k, elemName) {
			var evt = _this.capitalize(elemName);
			_this['onClick' + evt] = function() {
				var evtArr = 'clickElems' + evt;
				if (typeof(_this[evtArr]) == 'object') {
					$.each(_this[evtArr], function(k, func) {
						func.call(this);
					});
				}
			}
		});
	}


	this.onClick = function(btn, func, preventDefault) {
		var evtArr = 'clickElems' + _this.capitalize(btn);
		if (typeof(_this[evtArr]) != 'object' || preventDefault) {
			_this[evtArr] = [];
		}
		if (typeof(func) == 'function') {
			_this[evtArr].push(func)
		}
	}

    this.ui = {};

    this.ui.setStop = function() {
    	_this.$name.empty();
    	//_this.$playBtn.addClass('disabled');
    }

    this.ui.setVideo = function(item) {
		var id;
		if (item == 'next') {
			//id = _this.activeVideo + 1;
			for (var i = _this.activeVideo + 1; i < _this.options.playlist.length; i++) {
				if (_this.options.playlist[i]) {
					id = i;
					break;
				}
			}
		}
		else if (item == 'prev') {
			for (var i = _this.activeVideo - 1; i >= 0; i--) {
				if (_this.options.playlist[i]) {
					id = i;
					break;
				}
			}
		}
		else {
			id = item;
		}

    	if (_this.options.playlist[id] && _this.options.playlist[id][0]) {
    		_this.$mesg.empty().hide();

    		var currentVideo = _this.options.playlist[id][0];
	    	if (currentVideo.name) {
	    		_this.$name.html(currentVideo.name);
	    	}

    		//_this.$playBtn.removeClass('disabled');

    		_this.activeVideo = id;
    		return id;
	    }
	    else {
    		//_this.$playBtn.addClass('disabled');
	    	return false;
	    }
    }

    this.plugins = {};
    this.plugins.init = function() {
		$.each(_this.options.plugins, function(k, plugin) {
			if (typeof(VP9[plugin]) == 'function') {
				if (!_this.plugins[plugin]) {
					_this.plugins[plugin] =  new VP9[plugin](_this);
				}
				else {
					console.log('plugin ' + plugin + ' đã được khởi tạo');
				}
			}
			else {
				console.log('plugin ' + plugin + ' không tồn tại');
			}
		});
    }


    this.capitalize = function(string) {
    	return string.charAt(0).toUpperCase() + string.slice(1);
    }

    this.timeToString = function(time) {
	    time = Math.round(time);
	    var hours = Math.floor(time / 3600);
	    var minutes = Math.floor((time - (hours * 3600)) / 60);
	    var seconds = time - (hours * 3600) - (minutes * 60);
    	
	    sH = (hours < 10) ? '0' + hours.toString() : hours.toString();
	    sM = (minutes < 10) ? '0' + minutes.toString() : minutes.toString();
	    sS = (seconds < 10) ? '0' + seconds.toString() : seconds.toString();
	    return sH + ':' + sM + ':' + sS;
    }

    this.stringToTime = function(string) {
    	var timeArr = string.split(':');
    	return parseFloat(timeArr[0]) * 3600 + parseFloat(timeArr[1]) * 60 + parseFloat(timeArr[2]);
    }

    this.numberToString = function(number) {
    	return number > 9 ? '' + number : '0' + number;
    }

    this.init();
}