var VP9 = VP9 || {};

VP9.playerHTML5 = function(player) {
	var _this = this;

	this.name = 'HTML5';
	this.state =  'IDLE';

	this.init = function() {
		player.$player.empty();

		_this.creatDisplay();
	    player.creatDisplay();
		_this.creatControls();
		player.creatControls();

		//init plugin before set video
    	player.plugins.init();

		this.ui.hideControls();

	    //onclick
	    player.$playBtn.on('click', function() {
			if (_this.player.paused) {
				_this.player.play();
			}
			else {
				_this.player.pause();
			}
	    });

	   	player.ready.call(this);
    	if (typeof(player.options.ready) == 'function') {
	   		player.options.ready.call(this, player);
	   	}

		player.setPlaylist(player.options.playlist);
		player.setVideo(player.options.activeVideo);
	}

	this.destroy = function() {
	}

	this.creatDisplay = function() {
		player.$display = $('<div class="ppdisplay"></div>').appendTo(player.$player);
		player.$media = $('<div id="' + player.id + '_media"></div>')
			.css({
				overflow: 'hidden',
				height: '100%',
				width: '100%',
				top: '0px',
				left: '0px',
				padding: '0px',
				margin: '0px',
				display: 'block'
			})
			.appendTo(player.$display);

		player.$start = $('<div class="ppstart" style="display:none"></div>')
			.on('click', function(event) {
				event.preventDefault();
				player.$playBtn.click();
			})
			.appendTo(player.$display);

		player.$buffering = $('<div class="ppbuffering_" style="display:none"></div>').appendTo(player.$display);
	}

	this.creatControls = function() {
		player.$controls = $('<div class="ppcontrols"><ul class="left nav"></ul><ul class="right"></ul><ul class="bottom"></ul></div>')
			.appendTo(player.$player);

		if ($.inArray('fullscreen', player.options.controls) >= 0 && window.screenfull) {
			player.addControl('fsExitBtn', '<div class="ppfsexit inactive"></div>', '.right')
				.on('click', function(event) {
					event.preventDefault();
					screenfull.exit();
					player.$fsExitBtn.removeClass('active').addClass('inactive');
					player.$fsEnterBtn.removeClass('inactive').addClass('active');
				});
			player.addControl('fsEnterBtn', '</div><div class="ppfsenter active"></div>', '.right')
				.on('click', function(event) {
					event.preventDefault();
					screenfull.request();
					player.$fsExitBtn.removeClass('inactive').addClass('active');
					player.$fsEnterBtn.removeClass('active').addClass('inactive');
				});
		}

		if ($.inArray('timeleft', player.options.controls) >= 0) {
			player.addControl('timeleftBar', '<div class="pptimeleft"><span class="ppelp">00:00:00</span> | <span class="ppdur">00:00:00</span></div>', '.right');

	    	_this.$dur = player.$timeleftBar.find('.ppdur');
	    	_this.$elp = player.$timeleftBar.find('.ppelp');
		}

		if ($.inArray('progress', player.options.controls) >= 0) {
			player.addControl('progressBar', '<div class="ppscrubber" ><div class="pploaded"></div><div class="ppplayhead" style="width: 0%;"></div><div class="ppscrubberknob" ></div><div class="ppscrubberdrag"></div></div>', '.bottom');

			player.$playhead = player.$progressBar.find('.ppplayhead');
			player.$scrubberdrag = player.$progressBar.find('.ppscrubberdrag')
				.on('click', function(event) {
					event.preventDefault();
					if (_this.player.readyState == 0) {
						return false;
					} 

		            var x = $(this).offset().left;
		            var dx = event.clientX - x;
		            var widthSlider = $(this).width();
		            var seekTime = dx * _this.player.duration / widthSlider;
					_this.ui.setCurrentTime(seekTime, _this.player.duration);
		            _this.player.currentTime = seekTime;
				});
		}

		if ($.inArray('next', player.options.controls) >= 0) {
			player.addControl('nextBtn', '<div class="ppnext inactive"></div>', '.right')
				.on('click', function(event) {
					event.preventDefault();
					player.setVideo('next');
				});
		}

		if ($.inArray('prev', player.options.controls) >= 0) {
			player.addControl('prevBtn', '<div class="ppprev inactive"></div>', '.right')
				.on('click', function(event) {
					event.preventDefault();
					player.setVideo('prev');
				});
		}
	}

    this.ui = {};
    this.ui.onEvent = function() {
		_this.player.addEventListener('play', function() {
			player.$start.hide();
			player.$playBtn.addClass('pause');
			player.$controls.removeClass('lock');
		});

		_this.player.addEventListener('pause', function() {
			_this.state = 'PAUSED';
			player.$start.show();
			player.$playBtn.removeClass('pause');
			player.$controls.addClass('lock');
		});

		_this.player.addEventListener('durationchange', function() {
			_this.ui.setDuration(_this.player.duration);
		});

		_this.player.addEventListener('loadedmetadata', function() {
			player.$playBtn.removeClass('disabled');
			player.$start.show();
		});	

		_this.player.addEventListener('timeupdate', function() {
			_this.ui.setCurrentTime(_this.player.currentTime, _this.player.duration);
		});

		_this.player.addEventListener('canplay', function() {
			player.$buffering.hide();
			// player.$start.hide();
		});
	    _this.player.addEventListener('canplaythrough', function() {
			player.$buffering.hide();
			// player.$start.hide();
		});
	    _this.player.addEventListener('playing', function() {
			_this.state = 'PLAYING';
			player.$buffering.hide();
			player.$start.hide();
			player.$playBtn.addClass('pause');
		});
	    _this.player.addEventListener('seeking', function() {
			player.$buffering.show();
		});

	    _this.player.addEventListener('seeked', function() {
			player.$buffering.hide();
		});

	    _this.player.addEventListener('error', function() {
			_this.state = 'ERROR';
			player.$buffering.show();
			player.$start.hide();
		});
		
	    _this.player.addEventListener('stalled', function() {

		});
	    _this.player.addEventListener('suspend', function() {

		});
		
	    _this.player.addEventListener('ended', function() {
			_this.state = 'COMPLETED';
			player.$buffering.hide();
			player.$start.hide();

			player.ui.setStop();
			if (player.options.autoNext) {
				player.setVideo('next');
			}
		});

	    _this.player.addEventListener('waiting', function() {
			player.$buffering.show();
			player.$start.hide();
		});

		if (!player.options.tagClick) {
			_this.$video.on('click', function(event) {
				event.preventDefault();
				event.stopPropagation();
			});
		}
    }

    this.ui.resume = function() {
    	_this.$video.on('error', function() {
			if (_this.player.networkState == 0) {
				player.reconnect = setTimeout(function() {
					player.$mesgBar.html('Lỗi kết nối! Kết nối lại sau 3s');
					_this.$video.attr('src', _this.$video.attr('src').split('#')[0] + '#t=' + _this.player.currentTime);
					_this.player.load();
					//_this.setVideo()
				}, 3000);
			}
			else if (_this.player.networkState == 3) {
				player.reconnect = setTimeout(function() {
					player.$mesgBar.html('Lỗi kết nối! Kết nối lại sau 3s');
					_this.$video.attr('src', _this.$video.attr('src'));
					_this.player.load();
				}, 3000);
			}
		});
    }

    this.ui.autoPlay = function() {
    	_this.player.addEventListener('loadedmetadata', function() {
			if (player.options.autoplay) {
				if (player.options.cordova) {
					cordova.exec(
						function (data) {},
						function (error) {},
						"HandlerEventPlugin",
						"playVideo",
						[]
					);
				}
				else {
					_this.player.play();
				}
			}
		});
    }

    this.ui.scale = function() {
    	//get size chỉ đúng khi thật sự play frame đầu tiên
    	_this.$video.removeAttr('style').one('timeupdate', function() {
    		if (this.currentTime > 0) {
			    var videoRatio = this.videoWidth / this.videoHeight,
			        tagRatio = player.options.ratio;
			    if (videoRatio < tagRatio) {
			        _this.$video.css('-webkit-transform','scaleX(' + tagRatio / videoRatio  + ')')
			    } else if (tagRatio < videoRatio) {
			        //_this.$video.css('-webkit-transform','scaleY(' + videoRatio / tagRatio  + ')')
			    }
    		}
    		else {
    			_this.ui.scale();
    		}
    	})
    }

	_this.ui.hideTimeout = null;
    this.ui.hideControls = function() {
    	player.$player.on('mousemove', function(event) {
    		player.$player.off('mousemove');
    		player.$controls.removeClass('inactive').addClass('active');
    		_this.ui.hideTimeout = setTimeout(function() {
				player.$controls.removeClass('active').addClass('inactive');
				_this.ui.hideControls();
			}, 5000);
    	});

    }

    this.ui.setDuration = function(duration) {
    	duration = player.timeToString(duration);
    	_this.$dur.html(duration);
    };

    this.ui.setCurrentTime = function(currentTime, duration) {
    	player.$playhead.css('width', currentTime / duration * 100 + '%');

    	currentTime = player.timeToString(currentTime);
    	_this.$elp.html(currentTime);
    }

    this.ui.setStop = function() {
    	_this.$dur.html('00:00:00');
    	_this.$elp.html('00:00:00');
    	player.$playhead.width(0);
    	player.$buffering.show();
		player.$prevBtn.removeClass('active').addClass('inactive');
		player.$nextBtn.removeClass('active').addClass('inactive');
    }

    this.ui.setVideo = function(id) {
		if (_this.playlist.length <= 1) {
			player.$prevBtn.removeClass('active').addClass('inactive');
			player.$nextBtn.removeClass('active').addClass('inactive');
		}
    	else if (player.options.playlist[id] == _this.playlist[0]) {
			player.$prevBtn.removeClass('active').addClass('inactive');
			player.$nextBtn.removeClass('inactive').addClass('active');
    	}
    	else if (player.options.playlist[id] == _this.playlist[_this.playlist.length - 1]) {
			player.$prevBtn.removeClass('inactive').addClass('active');
			player.$nextBtn.removeClass('active').addClass('inactive');
    	}
    	else {
			player.$prevBtn.removeClass('inactive').addClass('active');
			player.$nextBtn.removeClass('inactive').addClass('active');
    	}
    }


    //Events
    player.onReady = function(func) {

    }

    player.onPlay = function(func) {
    	_this.player.addEventListener('play', func);
    }

    player.onFirstPlay = function(func) {
		_this.$video.one('timeupdate', function() {
			if (this.currentTime > 0) {
				func.call(this);
			}
			else {
				this.ui.hideControls();
				player.onFirstPlay(func);
			}
		});
    }

    player.onPause = function(func) {
    	_this.player.addEventListener('pause', func);
    }

    player.onEnded = function(func) {
    	_this.player.addEventListener('ended', func);
    }

    var onStop = [];
    player.onStop = function(func) {
    	onStop.push(func);
    }

    var onSetVideo = [];
    player.onSetVideo = function(func) {
    	onSetVideo.push(func);
    }

    player.onTimeupdate = function(func) {
    	_this.player.addEventListener('timeupdate', function() {
			if (_this.player.paused) {
				return false;
			}
    		func.call(this, _this.player.currentTime);
    	});
    }

    player.onError = function(func) {
    	_this.player.addEventListener('error', func);
    }

    player.onSeeking = function(func) {
    	_this.player.addEventListener('seeking', func);
    }

    player.onSeeked = function(func) {
    	_this.player.addEventListener('seeked', func);
    }

    //methods
    player.setPlay = function() {
    	if (_this.player && _this.player.paused) {
			_this.player.play();
		}
    }

    player.setPause = function() {
    	if (_this.player && !_this.player.paused) {
			_this.player.pause();
		}
	}

	player.setStop = function() {
		try {
			_this.player.pause();
			_this.$video.remove();
		}
		catch (e) {}

		player.ui.setStop();
		_this.ui.setStop();

    	$.each(onStop, function(k, func) {
    		func.call(this);
    	});

    	onStop = [];
		_this.state = 'STOPPED';
	}

	player.setSeek = function(time) {
		_this.player.currentTime = time;
		_this.ui.setCurrentTime(time, _this.player.duration);
	}

	player.setVideo = function(item, seekTime) {
		player.setStop();
		var id = player.ui.setVideo(item);

		if (id !== false) {

			var curentVideo = player.options.playlist[id][0];

			// var typeStr = '';
			// if (_this.player.canPlayType(curentVideo.type) != '') {
			// 	typeStr = ' type="' + curentVideo.type + '"';
			// }

			_this.$video = $('<video />')
				.attr({
					'id' : player.id + '_media_html5',
					'width': '100%',
					'height': '100%',
					/*'poster': '',
					'loop': false,
					'autoplay': false,
					'preload': 'none',
					'autobuffer': false,*/
				})
				.appendTo(player.$media);
			_this.player = _this.$video[0];

			_this.ui.onEvent();
			_this.ui.setVideo(id);
			_this.ui.autoPlay();
			_this.ui.resume();

		    if (player.options.scale) {
				_this.ui.scale();
			}

		    $.each(onSetVideo, function(k, func) {
		    	func.call(this, id);
		    });

		    if (seekTime) {
		    	//curentVideo.src += '#t=' + seekTime;
		    	player.on('firstPlay', function() {
		    		_this.player.currentTime = seekTime;
		    	});
		    }

			if (_this.player.canPlayType(curentVideo.type) != '') {
				_this.$video.attr({	
					'src' :  curentVideo.src,
					'type': curentVideo.type
				});
			}
			else {
				/*_this.$video.attr({	
					'src' :  curentVideo.src
				});*/
				_this.$video.append('<source src="' + curentVideo.src + '">')
			}
			_this.player.load();

			//_this.$video.empty().append('<source src="' + curentVideo.src + '"' + typeStr + '>')
			
		}
	}

	player.setPlaylist = function(playlist) {
		player.setStop();
		player.options.playlist = playlist;
		_this.playlist = player.options.playlist.filter(function(item) {
			return item;
		});
	}


	player.setAutoNext = function(auto) {
		player.options.autoNext = auto;
	}

    player.addItem = function(data) {
    	player.options.playlist.push(data);
		_this.playlist = player.options.playlist.filter(function(item) {
			return item;
		});
    	_this.ui.setVideo(player.activeVideo);
    	return player.options.playlist.length - 1;
    }

    player.removeItem = function(data) {
    	var index;
    	if ($.isNumeric(data)) {
    		index = data;
    	}
    	else {
    		index = $.inArray(data, player.options.playlist);
    	}
    	if (index >= 0) {
			_this.playlist = player.options.playlist.filter(function(item) {
				return item;
			});
    		if (index == player.activeVideo) {
    			//console.log('can not remove item when playing');
    			return false;
    		}
    		else {
    			//delete player.options.playlist[index];
    			player.options.playlist.splice(index,1)
	    		_this.ui.setVideo(player.activeVideo);
	    		return index;
	    	}
    	}
    	else {
    		return false;
    		//console.log('delete item not live');
    	}
    }

	player.getCurrentVideo = function() {
		return {
			index: player.activeVideo,
			duration: _this.player.duration
		}
	}

	player.getCurrentTime = function() {
		return _this.player.currentTime;
	}

	player.getState = function(state) {
		if (state) {
			return state == _this.state;
		}
		else {
			return _this.state;
		}
	}

    this.init();
}
