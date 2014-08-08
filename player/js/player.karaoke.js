var VP9 = VP9 || {};

VP9.karaoke = function(player) {
	var _this = this;

	this.init = function() {
		console.log('init karaoke');
		if (!player.options.karaoke && !player.options.karaoke.send) {
			console.warn('karaoke plugin need websocket to work');
			return false;
		}

		player.setAutoNext(true);
		player.options.karaoke.message(_this.onMessage);

		_this.creatKaraoke();
		_this.namoke = new namoke(player);

		player.on('setVideo', function() {
			_this.namoke.reset();
			_this.loadLyric(player.activeVideo);
		    player.on('timeupdate', function(time) {
		    	_this.namoke.videotime(time);
		    });
		    player.on('stop', function() {
		    	player.$musicLines.empty();
		    });
		});

		player.options.karaoke.send({
			action : 'search', 
			search : 'films',
			find : '',
			class : 'karaoke',
			index : 0,
			count : 6,
			t9 : 1
		});
	}

	this.destroy = function() {
		$('body').off('keydown', _this.ui.typeKey);
	}

	this.creatKaraoke = function() {
		var karaoke = '<div class="col-sm-12" id="listKaraokek">'
						+ '<ul class="col-sm-2">'
							+ '<li><a href="#song-list">Tìm bài</a></li>'
							+ '<li><a href="#play-list">Đang chơi</a></li>'
						+ '</ul>'
						+ '<div class="col-sm-10" id="song-list">'
						+ '</div>'
						+ '<div class="col-sm-10" id="play-list">'
						+ '</div>'
					+ '</div>';

		player.$karaoke = $(karaoke).appendTo(player.$player).tabs({
			active: 0
		});

		var songlist = '<!--<div class="headerk">'
				        + '<div id="btPevewk" class="ppprev inactive"></div>'
				        + '<div id="btplayPausek">'
				            + '<div class="ppplay inactive" id="btPlayk"></div>'
				            + '<div class="pppause active" id="btPausek"></div>'
				        + '</div>'
				        + '<div id="btNextk" class="ppnext inactive"></div>'
				        + '<div id="btListk" class="ppplaylist">(0)</div>'
				        + '<div id="btAllSongk" class="ppallsong active">Not connect</div>'
				        + '<div id="lbPlayingk">Please Select songs!</div>'
				    + '</div>-->'
				    + '<div class="contentk col-sm-8">'
				        + '<div id="DivSelectk">'
				            + '<div id="selectSongk">Bài hát</div>'
				            + '<div id="selectSingerk">Ca sỹ</div>'
				            + '<div id="selectCategoryk">Thể loại</div>'
				            + '<div id="selectDurectork">Nhạc sỹ</div>'
				            + '<div id="selectFavoritesk">Yêu thích</div>'
				            + '<div id="selectSettingk">Cài đặt</div>'
				        + '</div>'
				        + '<div id="DivSearchk">'
				            + '<div class="inputSearchk">'
				            	+ '<span style="float: left;width: 90%">'
				            		+ '<input id="tbInputk" type="text" readonly="readyonly"/>'
				            	+ '</span>'
				                + '<span id="btClear"></span>'
				            + '</div>'
				            + '<div id="DivlistSearchk">'
				                + '<ul id="listSearchk"></ul>'
				            + '</div>'
				        + '</div>'
				    + '</div>'
				    + '<div id="keyboardk" class="col-sm-4">'
				        + '<div class="keyrowk row">'
				        	+ '<span href="javascript:void(0)" class="myButton col-sm-4" data-key="1">'
				        		+ '<div class="number">1</div>'
				        		+ '<div class="text">&nbsp;</div>'
				        	+ '</span> '
				        	+ '<span href="javascript:void(0)" class="myButton col-sm-4" data-key="2">'
				        		+ '<div class="number">2</div>'
				        		+ '<div class="text">abc</div>'
				        	+ '</span> '
				        	+ '<span href="javascript:void(0)" class="myButton col-sm-4" data-key="3">'
				        		+ '<div class="number">3</div>'
				        		+ '<div class="text">def</div>'
				        	+ '</span> '
				        + '</div>'
				        + '<div class="keyrowk row">'
				        	+ '<span href="javascript:void(0)" class="myButton col-sm-4" data-key="4">'
				        		+ '<div class="number">4</div>'
				        		+ '<div class="text">ghi</div>'
				        	+ '</span> '
				        	+ '<span href="javascript:void(0)" class="myButton col-sm-4" data-key="5">'
				        		+ '<div class="number">5</div>'
				        		+ '<div class="text">jkl</div>'
				        	+ '</span> '
				        	+ '<span href="javascript:void(0)" class="myButton col-sm-4" data-key="6">'
				        		+ '<div class="number">6</div>'
				        		+ '<div class="text">mno</div>'
				        	+ '</span> '
				        + '</div>'
				        + '<div class="keyrowk row">'
				        	+ '<span href="javascript:void(0)" class="myButton col-sm-4" data-key="7">'
				        		+ '<div class="number">7</div>'
				        		+ '<div class="text">pqrs</div>'
				        	+ '</span> '
				        	+ '<span href="javascript:void(0)" class="myButton col-sm-4" data-key="8">'
				        		+ '<div class="number">8</div>'
				        		+ '<div class="text">tuv</div>'
				        	+ '</span> '
				        	+ '<span href="javascript:void(0)" class="myButton col-sm-4" data-key="9">'
				        		+ '<div class="number">9</div>'
				        		+ '<div class="text">wxyz</div>'
				        	+ '</span> '
				        + '</div>'
				        + '<div class="keyrowk row">'
				        	+ '<span href="javascript:void(0)" class="myButton col-sm-4" style="opacity:0">'
				        		+ '<div class="number" data-key="xxx">C</div>'
				        	+ '</span>' 
				        	+ '<span href="javascript:void(0)" class="myButton col-sm-4" data-key="0">'
				        		+ '<div class="number">0</div>'
				        		+ '<!--<div class="text">_</div>-->'
				        		+ '</span> '
				        	+ '<span href="javascript:void(0)" class="myButton col-sm-4" data-key="--">'
				        		+ '<div class="number">&#8592;</div>'
				        	+ '</span> '
				        + '</div>'
				    + '</div>';

		player.$karaokeSongPannel = player.$karaoke.find('#song-list').append(songlist);
		player.$karaokeSongList = player.$karaokeSongPannel.find('#listSearchk');
		player.$karaokeInput = player.$karaokeSongPannel.find('#tbInputk');

		player.$karaokeSongPannel.find('#btClear').on('click', function(event) {
			player.$karaokeInput.val('');
			event.preventDefault();
		});

		$('body').on('keydown', _this.ui.typeKey);


		player.$karaokeT9 = player.$karaokeSongPannel.find('#keyboardk');
		player.$karaokeT9.find('.myButton').on('click', function(event) {
			var search;
			if ($(this).data('key') != '--') {
				search = player.$karaokeInput.val() + $(this).data('key');
			}
			else {
				search = player.$karaokeInput.val().substr(0, player.$karaokeInput.val().length - 1);
			}
			player.$karaokeInput.val(search);
			player.options.karaoke.send({
				action : 'search', 
				search : 'films',
				find : search,
				class : 'karaoke',
				index : 0,
				count : 6,
				t9 : 1
			});
			
			event.preventDefault();
		});

		var playlist = '<div class="contentk col-sm-8">'
				        + '<div id="DivSelectk">'
				            + '<div id="selectSongk">Bài hát</div>'
				            + '<div id="selectSingerk">Ca sỹ</div>'
				            + '<div id="selectCategoryk">Thể loại</div>'
				            + '<div id="selectDurectork">Nhạc sỹ</div>'
				            + '<div id="selectFavoritesk">Yêu thích</div>'
				            + '<div id="selectSettingk">Cài đặt</div>'
				        + '</div>'
				        + '<div id="DivListSelectk">'
				            + '<ul id="listSelectk"></ul>'
				        + '</div>'
				    + '</div>'
				    + '<div class="col-sm-4">'
				    + '</div>';

		player.$karaokePlayPannel = player.$karaoke.find('#play-list').append(playlist);
		player.$karaokePlayList = player.$karaokePlayPannel.find('#listSelectk');

		player.$menuBtn.removeClass('disabled').on('click', function(event) {
			if (player.$karaoke.is(':visible')) {
				player.$karaoke.hide();
				player.$controls.removeClass('lock');
			}
			else {
				player.$karaoke.show();
				player.$controls.addClass('lock');
			}
			
			event.preventDefault();
		});

   		player.$musicBar = $('<div class="music_bar" style=""><div class="time_pitch"></div><div class="namoke_lyrics"></div><div class="namoke_lyrics"></div><div class="Guitar_Chord"></div></div>').appendTo(player.$player);
    	player.$musicLines = player.$musicBar.find(".namoke_lyrics");
	}

	this.onMessage = function(data) {
		switch (data.action) {
			case 'film-list':
				_this.ui.searchlist(data.films);
				break;

			case 'play_karaoke':
				_this.ui.playlist(data.karaokePlays);
				break;
			default:
				break;
		}
	}

	this.addSong = function(song) {
		song[0].src = 'http://f.vp9.tv' + song[0].src;
		song[0].karaoke = 'http://f.vp9.tv/guitar/' + song[0].karaoke;
		var index = player.addItem(song);
		if ($.inArray(player.getState(), ['AWAKENING', 'STARTING', 'PLAYING', 'PAUSED']) < 0) {
			player.setVideo(index);
		}
		return index;
	}

	this.removeSong = function(song) {
		var index = player.$karaokePlayList.find('[data-id=' + song + ']').index();
		if (player.removeItem(index) !== false) {
			player.$karaokeSongList.find('[data-id=' + song + ']').removeClass().removeAttr('data-songId');
			player.$karaokePlayList.find('[data-id=' + song + ']').remove();
		}
	}

	this.loadLyric = function(videoId) {
		$.getJSON(player.options.playlist[videoId][0].karaoke + '?v=' + Date.now(), function(data) {
			_this.namoke.parse_metadata(data);
		});
	}

	this.ui = {}

	this.ui.typeKey = function(event) {
		var search = '';
		if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 65 && event.keyCode <= 90) || event.keyCode == 32) {
			event.preventDefault();
			search = player.$karaokeInput.val() + String.fromCharCode(event.keyCode);
			player.$karaokeInput.val(search);
			player.options.karaoke.send({
				action : 'search', 
				search : 'films',
				find : search,
				class : 'karaoke',
				index : 0,
				count : 6,
				t9 : 1
			});
			return false;
		}
		else if (event.keyCode == 8){
			event.preventDefault();
			search = player.$karaokeInput.val().substr(0, player.$karaokeInput.val().length - 1);
			player.$karaokeInput.val(search);
			player.options.karaoke.send({
				action : 'search', 
				search : 'films',
				find : search,
				class : 'karaoke',
				index : 0,
				count : 6,
				t9 : 1
			});
			return false;
		}
	}

	this.ui.searchlist = function(data) {
		player.$karaokeSongList.empty();
		$.each(data, function(k, song) {
			var active = '';
			if (player.options.playlist.filter(function(item) {
				return item[0].id == song.id;
			}).length > 0) {
				active = 'active selectedk';
			}
			$('<li data-id="' + song.id + '" class="' + active + '"><span class="numberk"></span><span class="textk">' + song.name + '</span></li>')
				.appendTo(player.$karaokeSongList)
				.on('click', function(event) {
					if ($(this).hasClass('selectedk')) {
						//_this.removeSong($(this).attr('data-songId'));
						_this.removeSong($(this).attr('data-id'));
					}
					else {
						player.options.karaoke.send({
							action : 'play_karaoke',
							id : [song.id]
						});
						$(this).addClass('active selectedk');
					}
					event.preventDefault();
				});
		});
	}

	this.ui.playlist = function(data) {
		$.each(data, function(k, song) {
			var index = _this.addSong(song);

			player.$karaokeSongList.find('[data-id=' + song[0].id + ']').attr('data-songId', index);
			var $song = $('<li data-id="' + song[0].id + '" data-songId="' + index + '"><span class="numberk"></span><span class="textk">' + song[0].name + '</span><!--<span class="reloadk"><img src="IMG/reload.png"/></span><span class="upk"><img src="IMG/up.png"/>--><span class="deletek"></span></li>')
			.appendTo(player.$karaokePlayList)
			.on('click', function(event) {
				player.setVideo(index);
			})
			.find('.deletek').on('click', function(event) {
				event.stopPropagation();
				_this.removeSong($(this).parent('li').data('id'));
				event.preventDefault();
			});
		});
	}

	this.init();
}



var namoke = function(player) {
	var _this = this;

    this.MB = {}; // Music Bar
    this.MB.bar_dur = 5;

    var controlbar = player.$controls;
    this.MB.lines = player.$musicLines;
	this.timeAdd = 0.5;
    this.MB.lastLine = [-2, -1];
    this.MB.binarySearch = false;

	this.reset = function() {
	    this.MB.lastLine = [-2, -1];
	    this.MB.binarySearch = false;
	}


	this.parse_metadata = function (json) {
		var obj = this;
	    function parse_channel(channel) {
	    	var lyrics_time = [0], lyrics = [""], LongTime = [0], lineLyrics = [], timeLine1 = [0], timeLine2 = [0];
       		var wordStart = [], wordLength = [];

       		if (!channel.lyrics || !channel.lyrics.Events) { //phunn
       			return false;
       		}

	        events = channel.lyrics.Events; //lyrics event
	        if (events && events.length > 0) {
	            var oline = '', newline = true;
	            var lenthEvent = events.length;
	            if (obj.videoName == undefined) {
	                obj.videoName = "";
	            }
	            lineLyrics.push('<span class="lyricsB" title="true"><span class="lyricsW"></span>&nbsp;<span>' + obj.videoName + '</span></span>');
	            for (var j = 1; j < lenthEvent; j++) {
	                if (j < events.length - 1 && events[j + 1][0]) {
	                    var time = events[j][0] / 1000;
	                    var text = events[j][1];
	                    //if (j == 0) continue;
	                    if (j == 1) {//character >>>
	                        lyrics.push('&raquo;&raquo;&raquo;&nbsp;');
	                        var firstTime = (time - 3.0) < 0 ? 0 : (time - 3.0);
	                        lyrics_time.push(firstTime);
	                        LongTime.push(time - firstTime);

	                        //tanmv add 16/02/2014
	                        lineLyrics.push('<span class="lyricsB" data-arrIndex = "' + wordStart.length + '"><span class="lyricsW">&raquo;&raquo;&raquo;&nbsp;</span><span>&raquo;&raquo;&raquo;&nbsp;</span></span>');
	                        wordStart.push(firstTime);
	                        wordLength.push(time - firstTime);
	                        timeLine1.push(firstTime);
	                        timeLine2.push(time);
	                        //end
	                    }
	                    lyrics_time.push(time);
	                    lyrics.push(text.replace("\n", "\t")); //text
	                    var longtime = ((events[j + 1][0] - events[j][0]) / 1000).toFixed(2);
	                    LongTime.push(longtime); //time

	                    if (text != '\n' && text != ' ' && text != '') {
	                        oline += '<span class="lyricsB" data-arrIndex = "' + wordStart.length + '"><span class="lyricsW">' + text + '</span><span>' + text + '</span></span>';
	                        wordStart.push(time);
	                        wordLength.push(longtime);
	                        if (newline) timeLine1.push(time);
	                        newline = false;
	                    } else {
	                        if (!newline) timeLine2.push(time);
	                        newline = true;
	                    }
	                    if (newline == true && oline != '') {
	                        lineLyrics.push(oline);
	                        oline = '';
	                    }
	                    if (lenthEvent == j + 2) {
	                        lineLyrics.push(oline);
	                        timeLine2.push(time);
	                    }
	                }
	            }
	        }
	        return ({ lt: lyrics_time, lyrics: lyrics, longTime: LongTime, lineLyrics: lineLyrics, timeLine1: timeLine1, timeLine2: timeLine2, wordStart: wordStart, wordLength: wordLength });
	    };

	    function FixStartEndLine(index) {
		    var bar_dur = obj.MB.bar_dur;
		    var DAT = obj.DAT[index];
		    var startTime = DAT.timeLine1;
		    var endTime = DAT.timeLine2;
		    startTime[0] = (startTime[0] > bar_dur) ? startTime[0] - bar_dur : 0;
		    for (var i = 2; i < startTime.length; i = i + 2) {
		        var tmpTime = startTime[i] - endTime[i - 2];
		        tmpTime = tmpTime < bar_dur ? tmpTime : bar_dur;
		        startTime[i] = startTime[i] - tmpTime;
		    }
		    startTime[1] = (startTime[1] > bar_dur) ? startTime[1] - bar_dur : 0;
		    for (var i = 3; i < startTime.length; i = i + 2) {
		        var tmpTime = startTime[i] - endTime[i - 2];
		        tmpTime = tmpTime < bar_dur ? tmpTime : bar_dur;
		        startTime[i] = startTime[i] - tmpTime;
		    }
		    for (var i = 0; i < startTime.length; i = i + 2) {
		        var tmpTime = startTime[i + 2] - endTime[i];
		        tmpTime = tmpTime < bar_dur ? tmpTime : bar_dur;
		        endTime[i] = endTime[i] + tmpTime;
		    }
		    for (var i = 1; i < startTime.length; i = i + 2) {
		        var tmpTime = startTime[i + 2] - endTime[i];
		        tmpTime = tmpTime < bar_dur ? tmpTime : bar_dur;
		        endTime[i] = endTime[i] + tmpTime;
		    }
		}

	    var DAT = this.DAT = [];
	    for (var i in json) {
	    	if (!json[i].lyrics) {
	    		continue;
	    	}
	        DAT[i] = parse_channel(json[i]);
	        FixStartEndLine(i);
	        DAT[i].lyrics[0] = obj.videoName ? obj.videoName : "";
	    }
	    obj.render_metadata(this.MB.bar_dur / 2);
	};

	// Fix start time & end time of lines
	
	this.render_metadata = function (ctime) {
	    var DAT = this.DAT; if (!DAT) { console.log("Not ready"); return; }
	    this.render_metadata_channel(DAT[0], ctime);
	};

	this.render_metadata_channel = function (channel, ctime) {
	    // console.log(ctime);
	    var obj = this;
	    var MB = this.MB;
	    var DAT = this.DAT; if (!DAT) { console.log("Not ready"); return; }
	    var R = this.MB.R; // Raphael class for drawing of SVG
	    var bar_dur = MB.bar_dur;
	    var longtime = channel.longTime;

	    // Given an ascending sorted array, return the idx of the first member which is arr[idx] >= the given value. 

	    function find_id(array, value) {
	        var start = 0, end = array.length - 1, mid; 
	        while (start < end) { 
	            mid = (start + end) >> 1; 
	            if (array[mid] >= value) {
	                end = mid; 
	            }
	            else {
	                start = mid + 1;
	            } 
	        } 
	        return start; 
	    }

	    function render_lyrics_line(channel, time1) {
	        var lineLyrics = channel.lineLyrics;
	        var lineStart = channel.timeLine1;
	        var lineEnd = channel.timeLine2;
	        
	        var iEven = MB.lastLine[0];
	        var iOdd = MB.lastLine[1];
	        var iNext;
	        if (iEven > iOdd) {
	            iNext = iOdd + 2;
	        }
	        else {
	            iNext = iEven + 2;
	        }

	        // Show the next line if needed
	        if (lineStart[iNext] <= ctime && ctime <= lineEnd[iNext]) {
	            MB.lastLine[iNext & 1] = iNext;
	            MB.lines[iNext & 1].innerHTML = lineLyrics[iNext];
	            MB.lines[iNext & 1].uncolored = MB.lines[iNext & 1].firstChild;
	        }
	        // Clear the current even line
	        if (ctime >= lineEnd[MB.lastLine[0]] || ctime <= lineStart[MB.lastLine[0]]) {
	            MB.lines[0].innerHTML = '';
	        }
	        // Clear the current odd line
	        if (ctime >= lineEnd[MB.lastLine[1]] || ctime <= lineStart[MB.lastLine[1]]) {
	            MB.lines[1].innerHTML = '';
	        }

	        // The current lines are wrong
	        if (MB.binarySearch || ctime > lineEnd[iNext] || ctime < lineStart[MB.lastLine[0]] || ctime < lineStart[MB.lastLine[1]]) {
	            // Binary search the right one
	            var iCurrent = find_id(lineStart, ctime); 
	            var iPrev = iCurrent - 1;
	            // console.log(lineStart[iPrev] + " " + ctime + " " + lineEnd[iPrev]);
	            // console.log(lineStart[iCurrent] + " " + ctime + " " + lineEnd[iCurrent]);
	            var found = false;
	            if (lineStart[iPrev - 1] <= ctime && ctime <= lineEnd[iPrev - 1]) {
	                MB.lastLine[(iPrev + 1) & 1] = iPrev - 1;
	                MB.lastLine[iPrev & 1] = iPrev - 2;
	                MB.lines[(iPrev + 1) & 1].innerHTML = lineLyrics[iPrev - 1];
	                MB.lines[(iPrev + 1) & 1].uncolored = MB.lines[(iPrev + 1) & 1].firstChild;
	                found = true;
	            }   
	            if (lineStart[iPrev] <= ctime && ctime <= lineEnd[iPrev]) {
	                MB.lastLine[iPrev & 1] = iPrev;
	                MB.lastLine[iCurrent & 1] = iCurrent - 2;
	                MB.lines[iPrev & 1].innerHTML = lineLyrics[iPrev];
	                MB.lines[iPrev & 1].uncolored = MB.lines[iPrev & 1].firstChild;
	                found = true;
	            }     
	            if (found == false) {
	                MB.lastLine[iCurrent & 1] = iCurrent - 2;
	                MB.lastLine[(iCurrent + 1) & 1] = iCurrent - 1;
	            }
	        }
	        obj.follow_video_time(undefined);
	    }
	    render_lyrics_line(channel, ctime);
	};

	this.follow_video_time = function (interval) {
	    var obj = this, MB = obj.MB, bar_dur = MB.bar_dur;
	    //On interval, interpolate the current video time (vt) and update display based on vt

	    function follow_vt() {
	        var t0 = (new Date()).getTime();
	        var delta = (t0 - obj.sys_time) / 1000;
	        if (delta >= 2) {
	            //console.log('die internet');
	            if (player.rePlay instanceof Function) {
	                obj.player.setPause();
	                setTimeout(function () {
	                    player.rePlay();
	                }, 50);
	            }
	            return;
	        }
	        var vt0 = delta + obj.video_time;
	        var vt = vt0 + obj.timeAdd;
	        if (player.IsAndroid == true) {
	            vt += 0.5;
	        } 

	        if (obj.follow_time instanceof Function) {
	            obj.follow_time(vt0);
	        }

	        function highlight(lineIndex) { 
	            var uncolored = MB.lines[lineIndex].uncolored;
	            if (uncolored == null) {
	                return;
	            }
	            var index = uncolored.getAttribute("data-arrIndex");
	            var startTime = obj.DAT[0].wordStart[index];
	            if (startTime > vt) return;
	            var iLength = obj.DAT[0].wordLength[index];
	            var percentage = (vt - startTime) / iLength;
	            percentage = percentage >= 1 ? 100 : percentage * 100;
	            uncolored.firstChild.style.width = percentage + "%";
	            if (percentage == 100) {
	                MB.lines[lineIndex].uncolored = uncolored.nextSibling;
	            } 
	        }

	        highlight(0);
	        highlight(1);

	        if (obj.interval == undefined) {
	            var t2 = (new Date()).getTime();
	            t0 = t2 - t0;
	            t0 = obj.itv - t0;
	            if (t0 <= 0) t0 = 1;
	            obj.follow = setTimeout(follow_vt, t0);
	        }
	    }

	    clearTimeout(obj.follow);
	    obj.interval = interval;
	    if (interval == undefined) { // do once, don't install nor remove the interval
	        follow_vt();
	    } else {
	        if (interval == false) { // disable the interval call to follow_vt
	            MB.cursor_v.attr({ fill: "#F00" });
	            //if (obj.follow) clearInterval(obj.follow);
	            if (obj.follow) clearTimeout(obj.follow);
	            //obj.follow = undefined;
	        } else {
	            if (interval > 0) {
	                //obj.itv = interval;
	                follow_vt();
	                MB.cursor_v.attr({ fill: "#00F" });
	                //if (!obj.follow) obj.follow = setInterval(follow_vt, interval);
	                //if (!obj.follow) obj.follow = setTimeout(follow_vt, 10);
	            } else {
	                MB.cursor_v.attr({ x: 0 });
	            }
	        }
	    }
	};

	this.videotime = function (time) {
	    var obj = this;
	    var ctime = (new Date).getTime();
	    if (ctime - obj.last_update_vtime < 100) return; // Prevent updating too frequently
	    obj.last_update_vtime = ctime;
	    obj.vtime(time);
	};

	this.vtime = function (video_time) { // Song's current time, in second
	    var obj = this;
	    this.video_time = video_time;
	    obj.sys_time = (new Date()).getTime(); // Store system's number of ms since epoch
	    if (obj.conn_avail) obj.send_message("VIDEO_TIME=" + video_time + "\n");
	    // if (Math.floor(obj.MB.render_time) == Math.floor(video_time)) return; // Don't render too often
	    this.MB.render_time = video_time;

	    /*
	    if (obj.follow_timeBar instanceof Function) {
	        obj.follow_timeBar(video_time);
	    }
	    */

	    /*if (obj.ready) {
	        obj.ready = false;
	        if (obj.IsAndroid) {
	            obj.itv = 100;
	            obj.follow_video_time(100); //android | mobile 10hz
	        } else {
	            obj.itv = 50;
	            obj.follow_video_time(50); //pc=> 20hz
	        }
	        //this.follow_video_time(50);
	    }*/
		obj.follow_video_time(100);
	    obj.render_metadata(video_time);
	};

}
