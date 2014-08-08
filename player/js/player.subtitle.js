var VP9 = VP9 || {};

VP9.plugin = VP9.plugin || {};

VP9.subtitle = function(player) {
	var _this = this;

	this.languages = {
		'vie' : 'Việt Nam',
		'eng' : 'English'
	}

	this.init = function() {
		console.log('init subtitle');
		_this.creatSubtitle();


		// _this.subtitles = {};
		// _this.activeLang = localStorage.activeLang ? JSON.parse(localStorage.activeLang) : [];

		player.on('setVideo', function() {	
			_this.loadSubtitle(player.activeVideo);
			player.on('stop', function() {
				_this.subtitles = {};
				player.$sub.empty();
				player.$ccList.empty();
			});
			player.on('ended', function() {
				_this.subtitles = {};
				player.$sub.empty();
				player.$ccList.empty();
				player.$ccBtn.hide();
			});
		});
	}

	this.creatSubtitle = function() {
		player.$sub = $('<div class="ppsub"></div>')
			.appendTo(player.$player)
			.wrap('<div class="ppsubtitles"></div>');

		player.addControl('ccBtn', '<div class="pptoggcc" style="display: none"></div>', '.right');

		player.$ccList = $('<ul id="divSelectLang" class="listSelectLang"></ul>')
			.appendTo(player.$ccBtn.parent())
			.wrap('<div class="pplistlang" style="display:block"></div>');


		_this.hideTimeout;
		player.$ccBtn.on('click', function(event) {
			event.preventDefault();
			if (player.$ccList.is(':visible')) {
				clearTimeout(_this.hideTimeout);
				player.$ccList.hide();
				player.$controls.removeClass('lock');
			}
			else {
				player.$ccList.show();
				player.$controls.addClass('lock');
				_this.hideTimeout = setTimeout(function() {
					player.$ccList.hide();
					player.$controls.removeClass('lock');
				}, 5000);
			}
		});
	}

	this.loadSubtitle = function(videoId) {
		_this.subtitles = {};
		_this.activeLang = localStorage.activeLang ? JSON.parse(localStorage.activeLang) : [];
		
		_this.id = Date.now();

		if (typeof(player.options.playlist[videoId]) != 'object' ||
			typeof(player.options.playlist[videoId][0].subtitle) != 'object' ||
			player.options.playlist[videoId][0].subtitle.filter(function(item) { return item}).length == 0) {
			player.$ccBtn.hide();
			return false;
		}

		player.$ccBtn.show();
		$.each(player.options.playlist[videoId][0].subtitle, function(k, sub) {
			var subLang = sub.split('.').splice(-2, 1)[0];
			_this.subtitles[subLang] = {
				name: subLang,
				index : 0
			};
			var checked = '';
			if ($.inArray(subLang, _this.activeLang) >= 0) {
				checked = 'checked="checked"';
			}
			_this['$input' + player.capitalize(subLang)] = $('<input type="checkbox"  id="input_' + subLang + '" title="' + _this.languages[subLang] + '"' + checked + '>')
				.appendTo(player.$ccList)
				.on('change', function(event) {
					event.preventDefault();
					if ($.inArray(subLang, _this.activeLang) < 0 && $(this).is(':checked')) {
						if (!_this.subtitles[subLang].data) {
							_this.subtitles[subLang].index = 0;	
						}
						else {
							_this.subtitles[subLang].index = _this.searchTime(player.getCurrentTime(), _this.subtitles[subLang].data);
						}
						_this.activeLang.push(subLang);
					}
					else if ($.inArray(subLang, _this.activeLang) >= 0 && !$(this).is(':checked')) {
						_this.activeLang = $.grep(_this.activeLang, function(lang, k) {
							return lang != subLang;
						});
						_this['$sub' + player.capitalize(subLang)].empty();
					}
					localStorage.activeLang = JSON.stringify(_this.activeLang);
				})
				.wrap('<li class="language"></li>')
				.parent('.language')
				.append('<label for="input_' + subLang + '">' + _this.languages[subLang] + '</label></li>');

			_this['$sub' + player.capitalize(subLang)] = $('<div id="sub_' + subLang + '">').appendTo(player.$sub);

			player.on('firstPlay', function() {
				_this.callSub(sub, function(data) {
					_this.subtitles[subLang].data = data;
					_this.addSub(_this.subtitles[subLang]);
				});
			});
		});
	}

	this.addSub = function(subObj) {
		subObj.newLine = true;
		player.on('seeked', function() {
			if ($.inArray(subObj.name, _this.activeLang) >= 0) {
				subObj.index = _this.searchTime(player.getCurrentTime(), subObj.data);
				subObj.newLine = true;
			}
		});
		player.on('timeupdate', function(time) {
			if ($.inArray(subObj.name, _this.activeLang) >= 0) {
				if (subObj.newLine === true && time >= subObj.data.start[subObj.index]) {
					_this['$sub' + player.capitalize(subObj.name)].html(subObj.data.text[subObj.index]);
					subObj.newLine = false;
				}
				if (time >= subObj.data.end[subObj.index]) {
					subObj.index ++;
					subObj.newLine = true;
					_this['$sub' + player.capitalize(subObj.name)].empty();	
				}
			}
		});
	}

	// Binary search on the start array: Find the biggest start time < time
	this.searchTime = function(time, data) {
		var start = 0;
		var end = data.start.length - 1;
		while (start <= end) {
			var mid = (start + end) >> 1;
			if (data.start[mid] > time) {
				end = mid - 1;
			}
			else if(data.start[mid] < time) {
				start = mid + 1;
			}
			else {
				start = mid;
				end = mid;
			}
		}
		return end;
	}

	this.parseSubName = function(subName) {
		var sub = subName.split('.').splice(-2, 1);
		return {
			lang : sub,
			name : _this.languages[sub]
		}
	}

	this.callSub = function(url, callback) {
		var id = _this.id;
		console.log('Đang load sub ' + url);
	    $.ajax({
	        url: url + '?v=' + Math.random(),
	        dataType: "text",
	        statusCode: {
	            404: function () { console.log("Not found data subtitle!"); },
	            200: function () {console.log('load sub ' + url + ' ok!');},
	            500: function () { console.log('Data server error!'); }
	        },
	        success: function (data) {
	        	if (id == _this.id) {
		            var obj = _this.parseSub(data);
		            callback(obj);
		        }
		        else {
		        	console.log('Sub ' + url + ' không hợp lệ');
		        }
	        }
	    });
	}

	this.parseSub = function (assContent) {
	    var state = 0;
	    var assfile = assContent.split('\n');

	    var lineLength = assfile.length;
	    var styleAss = 0;
	    var captionLang = '', startTime = [], endTime = [], textSub = [];

	    for (var linecount = 0; linecount < lineLength; linecount++) {
	        var line = assfile[linecount];
	        if(line.trim()=='')continue;
	        if (line.startsWith('[Script Info]')) {
	            state = 1;
	        } else if (line.startsWith('[V4+ Styles]')) {
	            state = 2;
	        } else if (line.startsWith('[Events]')) {
	            state = 3;
	        } else if (state == 1) {
	            if (!line.startsWith(';') && line.startsWith('Title:')) {
	                captionLang = line.split(':')[1].trim();
	            } else {
	                continue;
	            }
	        } else if (state == 2) {
	            continue;
	        } else if (state == 3) {
	            if (line.startsWith('Format:')) {
	                if (line.split(':')[1].split(',').length > 5)
	                    styleAss = 1;
	            }

	            if (line.startsWith('Dialogue:')) {
	                var lineparts = line.split(',');
	                startTime.push(stringToTime(lineparts[1]));
	                endTime.push(stringToTime(lineparts[2]));
	                if (styleAss == 1) {
	                    for (var z = 0; z < 9; z++) { lineparts.shift(); }

	                }
	                else {
	                    for (z = 0; z < 4; z++) { lineparts.shift(); }
	                }

	                var text = lineparts.join(',');
	                text = text.replace(/{[^}]+}/gi, "");
	                text = text.replace(/\\N|\n\r|\r\n|\n|\r/gi, "<br/>");

	                textSub.push(text);
	            }
	        }
	    }
	    return {
	    	title: captionLang,
	    	lines: lineLength,
	    	start: startTime,
	    	end: endTime,
	    	text: textSub
	    };
	}


	this.init();
}

String.prototype.startsWith = function (input) {
    return (this.substr(0, input.length) === input);
};

String.prototype.endsWith = function (input) {
    return (this.substr(this.length - input.length, input.length) === input);
};

function stringToTime(value) {
    var arr = value.trim().split(':');
    return parseFloat(arr[0] * 3600) + parseFloat(arr[1] * 60) + parseFloat(arr[2]);
};