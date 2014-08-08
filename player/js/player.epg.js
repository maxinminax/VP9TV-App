var VP9 = VP9 || {}

VP9.epg = VP9.epg || function(player) {
    var _this = this;

    this.channelStatus = {};
    this.channels = [];

    this.weekdays = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

    this.init = function() {
        console.log('init epg');
        localStorage.epg_grid = true;
        _this.EPG_GRID = localStorage.epg_grid ? true : false;
        player.$playBtn.removeClass('disabled');

        if (!player.options.epg && !player.options.epg.url) {
            console.log('need config epg');
            return false;
        }

        player.setLive(true);
        player.options.epg.message(_this.onMessage);

        _this.loadChannelStatus()
        $.getJSON(player.options.epg.url + 'getSystemTime.php?v' + Date.now(), function(data) {
            _this.clock = {
                day: data.wday,
                date: data.mday,
                month: data.mon,
                year: data.year,
                hours: data.hours,
                minutes: data.minutes,
                seconds: data.seconds,
                timestamp: data[0],
                timerange: data.hours * 3600 + data.minutes * 60 + data.minutes,
                dateString: '' + data.year + player.numberToString(data.mon) + player.numberToString(data.mday)
            }
            _this.creatEpg();
            _this.updateTime();
            _this.setTime();

            _this.goToDefaultChannel(_this.day, _this.loadChannelDescription);

        }).fail(function() {
            _this.creatEpg();
            _this.clock = _this.parseTime(new Date());
            _this.updateTime();
            _this.setTime();

            _this.goToDefaultChannel(_this.day, _this.loadChannelDescription);

        });

        var keepAlive;
        player.on('setVideo', function() {
            _this.clearNextVideo();

            clearInterval(keepAlive);
            var time = 0;
            keepAlive = setInterval(function() {
                var newTime = player.getCurrentTime();
                if (player.getState('PLAYING') && newTime > 0) {
                    console.log(time, newTime, player.getState());
                    if (newTime != time) {
                        time = newTime;
                    } else {
                        var currentVideo = player.getCurrentVideo().index;
                        player.setPlaylist(player.options.playlist);
                        console.log(currentVideo, newTime);
                        player.setVideo(currentVideo, newTime);
                    }
                }
            }, 3000);
        });
    }

    this.destroy = function() {
            clearInterval(_this.ui.move);
            clearInterval(_this.nextVideoInterval);
            clearInterval(_this.clockInterval);
            clearTimeout(_this.nextVideoTimeout);
        }

    this.onMessage = function(data) {
        switch (data.action) {
            case 'tivi_status':
                _this.ui.channelStatus(data.data);
                break;
            default:
                break;
        }
    }
    this.creatEpg = function() {
        player.$buffering.removeClass('active').addClass('inactive');

        var epg = '';
        if (_this.EPG_GRID) {
            epg = '<div class="epg_wrapper lock">' + '<span class="epg_loading"></span>' + '<span class="hover-btn hover_left"></span>' + '<span class="hover-btn hover_right"></span>' + '<div class="epg_container">' + '<div class="epg_gird_menu">' + '<ul>' + '</ul>' + '' + '<div class="epg_calendar">' + '<div class="show_date">' + '<span class="month">Thứ 3</span>' + '<span class="date">22/04/2014</span>' + '</div>' + '' + '<div class="box_cal epg_top">' + '</div>' + '</div>' + '</div><!--End menu-->' + '<div class="epg_gird_content">' + '<div class="epg_popup epg_top col-sm-8">' + '<div class="epg_popinner">' + '<h2>Thông tin</h2>' + '<div class="epg_info">' + '<div class="content">' + '</div>' + '<p class="link_control">' + '<a href="#" class="epg_pop_play" style="display: none">Xem ngay</a>' + '<a href="#" class="epg_pop_back">Quay lại</a>' + '</p>' + '</div>' + '</div>' + '</div>' + '<div class="col-sm-8 epg_grid_channellist"><ul></ul></div>' + '<div class="col-sm-4 epg_grid_schedule"></div>' + '</div><!--End content-->' + '</div>';
        } else {
            epg = '<div class="epg_wrapper lock">' + '<span class="epg_loading"></span>' + '<span class="hover-btn hover_left"></span>' + '<span class="hover-btn hover_right"></span>' + '<div class="epg_container">'
            + '<div class="epg_popup epg_top">' + '<div class="epg_popinner">' + '<h2>Thông tin</h2>' + '<div class="epg_info">' + '<div class="content">' + '</div>' + '<p class="link_control">' + '<a href="#" class="epg_pop_play" style="display: none">Xem ngay</a>' + '<a href="#" class="epg_pop_back">Quay lại</a>' + '</p>' + '</div>' + '</div>' + '</div>'
            + '<div class="epg_calendar">' + '<div class="show_date">' + '<span class="month"></span>' + '<span class="date"></span>' + '</div> '
            + '<div class="box_cal epg_top">' + '</div>' + '</div>'
            + '<div class="epg_content">'
            + '<div class="epg_main_cont">' + '<div class="epg_nav">' + '<h2 class="title_btn">Danh sách kênh</h2>' + '<ul>' + '</ul>' + '</div>' + '<div class="epg_scroll">' + '<div class="epg_head">' + '<span class="epg_line"> </span>' + '<ul>' + '<li>0:00</li>' + '<li>1:00</li>' + '<li>2:00</li>' + '<li>3:00</li>' + '<li>4:00</li>' + '<li>5:00</li>' + '<li>6:00</li>' + '<li>7:00</li>' + '<li>8:00</li>' + '<li>9:00</li>' + '<li>10:00</li>' + '<li>11:00</li>' + '<li>12:00</li>' + '<li>13:00</li>' + '<li>14:00</li>' + '<li>15:00</li>' + '<li>16:00</li>' + '<li>17:00</li>' + '<li>18:00</li>' + '<li>19:00</li>' + '<li>20:00</li>' + '<li>21:00</li>' + '<li>22:00</li>' + '<li>23:00</li>' + '</ul>' + '</div><!--End epg_head-->'
            + '<div class="epg_list">' + '</div>' + '</div>' + '</div>' + '</div><!--End epg_content-->' + '</div>' + '</div>';
        }

        player.$epg = $(epg).appendTo(player.$player);
        player.$epgContent = player.$epg.find('.epg_main_cont, .epg_container');
        player.$epgLine = player.$epg.find('.epg_line');
        player.$epgGroupChannel = player.$epgContent.find('.epg_nav ul, .epg_gird_menu ul');
        player.$epgList = player.$epgContent.find('.epg_list');
        player.$epgDay = player.$epg.find('.show_date');
        player.$epgPopup = player.$epg.find('.epg_popup');
        player.$logo2 = $('<div class="ppProgramLogo"></div>').insertAfter(player.$logo);

        player.addControl('clockBar', '<div class="ppclock"><span class="glyphicon glyphicon-time"></span> <span class="hours">00</span>:<span class="minutes">00</span>:<span class="seconds">00</span></div>', '.right');
        player.$clockHr = player.$clockBar.find('.hours');
        player.$clockMin = player.$clockBar.find('.minutes');
        player.$clockSec = player.$clockBar.find('.seconds');

        player.$epgPopup.find('.epg_pop_back').on('click', function(event) {
            event.preventDefault();
            player.$epgPopup.hide();
            player.$epgPopup.find('.content').empty();
            player.$epgPopup.find('.epg_pop_play').off('click');
        })

        //_this.hourWidth = (player.$epg.width() - 150)/3;
        _this.hourWidth = player.$epgContent.width() / 3;
        _this.dayWidth = _this.hourWidth * 24;
        _this.maxLeft = _this.dayWidth - player.$epgContent.width();

        $('.epg_content .epg_main_cont .epg_scroll').width(_this.dayWidth);

        if (_this.EPG_GRID) {
            function initScroll($div) {
                $div.on('mouseleave', function(event) {
                        if (event.clientY < $div.offset().top) {
                            _this.ui.scrollTop($div);
                        }
                        if (event.clientY > $(this).height()) {
                            _this.ui.scrollBottom($div);
                        }
                    })
                    .on('mouseenter', function(event) {
                        clearInterval(_this.ui.move);
                    });
            }
            initScroll($(".epg_grid_schedule"));
            initScroll($(".epg_grid_channellist"));

        } else {
            player.$epg
                .on('mouseleave', function(event) {
                    if (event.offsetX < 0) {
                        _this.ui.scrollLeft();
                    }
                    if (event.clientX > $(this).width()) {
                        _this.ui.scrollRight();
                    }

                    if (event.offsetY < 0) {
                        //top
                        _this.ui.scrollTop();
                    }

                    if (event.clientY > $(this).height()) {
                        //bottom
                        _this.ui.scrollBottom();
                    }
                })
                .on('mouseenter', function(event) {
                    $('.hover_left, .hover_right, .hover_top, .hover_bottom').hide();
                    clearInterval(_this.ui.move);
                });
        }


        /*$('.hover_left, .hover_right').mouseleave(function() {
            clearInterval(_this.ui.move);
        });

        $('.hover_left').mouseenter(function(){
            _this.ui.scrollLeft();
        });

        $('.hover_right').mouseenter(function(){
            _this.ui.scrollRight();
        });*/

        //Show epg_calendar 
        $('.box_cal').datepicker({
            dayNames: ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', ' Thứ 7'],
            dayNamesMin: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
            dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
            monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
            monthNamesShort: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
            yearSuffix: ',',
            showMonthAfterYear: true,
            dateFormat: 'yymmdd',
            onSelect: function(dateText, inst) {
                _this.setDay(dateText);
                $('.box_cal').hide();
            }
        });

        player.$epg.on('click', function(event) {
            event.preventDefault()
            if ($('.box_cal').is(':visible')) {
                $('.box_cal').slideUp(200);
            }
        });

        $('.box_cal').on('click', function(e) {
            e.stopPropagation();
        });

        $('.show_date').on('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            $('.box_cal').slideDown(200);
            return false;
        });
        //End

        //Menu  

        var chovertimeout;
        $('.epg_nav h2').mouseenter(function() {
            clearTimeout(chovertimeout);
            $('.epg_nav ul').stop().animate({
                left: 0
            }, 500, function() {});
        });
        $('.epg_nav').mouseenter(function() {
            clearTimeout(chovertimeout);
        });
        $('.epg_nav').mouseleave(function() {
            chovertimeout = setTimeout(function() {
                $('.epg_nav ul').stop().animate({
                    left: '-100%'
                }, 1000, function() {});
            }, 500);
        });
        //End


        var showEpg = function() {
            console.log('toggle EPG');
            if (!player.$epg.hasClass('invisible')) {
                _this.ui.hideEpg();
                player.setPlay();
            } else {
                _this.ui.showEpg();
                player.setPause();
            }
        }

        /*player.$menuBtn.removeClass('disabled').unbind('click').unbind('click').on('click', function(event) {
            event.stopPropagation();
            event.preventDefault();

            console.log('toggle EPG')
            if (!player.$epg.hasClass('invisible')) {
                //_this.ui.hideEpg();
                player.setPause();
            }
            else {
                //_this.ui.showEpg();
                player.setPlay();
            }
            
            return false;
        });
*/
        player.$menuBtn.removeClass('disabled').on('click', showEpg);
        player.$playBtn.removeClass('disabled').unbind('click').on('click', function(event) {
            event.stopPropagation();
            event.preventDefault();
            showEpg();
            return false;
        });
        /*
        player.$playBtn.removeClass('disabled').unbind('click').unbind('click').on('click', function(event) {
            event.stopPropagation();
            event.preventDefault();

            console.log('toggle EPG')
            if (!player.$epg.hasClass('invisible')) {
                player.setPause();
                _this.ui.hideEpg();
            }
            else {
                player.setPlay();
                _this.ui.showEpg();
            }
            
            return false;
        });*/

        //_this.ui.lockEpg();
    }

    this.loadChannelDescription = function() {
            $('.epg_loading').show();
            var descripton = $.getJSON(player.options.epg.url + 'ChannelDescriptionList.json?v=' + Date.now(), function(data, textStatus, jqXHR) {
                console.log(data);
                $('.epg_loading').hide();
                _this.ui.loadChannelDescription(data.GroupChannel);
            });
        }

    this.loadChannelStatus = function() {
        $.getJSON(player.options.epg.url + 'channelStatus.json?v=' + Date.now(), function(data, textStatus, jqXHR) {
            _this.ui.channelStatus(data);
        });
    }

    this.goToDefaultChannel = function(date, onReady) {
        var fileName = '';
        console.log(player.options.epg.defaultChannel);
        if (player.options.epg.defaultChannel) {
            fileName = 'Channel_' + player.options.epg.defaultChannel;
        } else if (localStorage.defaultChannel) {
            fileName = 'Channel_' + localStorage.defaultChannel;
        } else {
            fileName = 'ChannelDefault';
        }
        console.log(fileName);
        _this.goToChannel(fileName, date, onReady);
    }

    this.goToChannel = function(name, date, onReady) {
        _this.clearNextVideo();
        if (date == undefined) {
            date = _this.day;
        }

        var fileName = '';
        if ($.isNumeric(name)) {
            fileName = 'Channel_' + name;
        } else if (typeof name == 'string') {
            fileName = name;
        } else {
            console.log('channel\'s name không đúng')
            return false;
        }

        //player.$epg.hide();
        _this.ui.hideEpg();

        _this.id = Date.now();
        _this.getChannel(player.options.epg.url + fileName + '_' + date + '.json?v=' + Date.now(),
            function(data) {
                var channel = data;
                _this.playChannel(channel);
                if ($.isFunction(onReady)) {
                    onReady.call(this);
                }
            },
            function() {
                player.$mesgBar.html('Không có kênh');
                player.$controls.addClass('lock');
                //player.$epg.show();
                _this.ui.showEpg();

                if ($.isFunction(onReady)) {
                    onReady.call(this);
                }
            });
    }

    this.getChannel = function(url, success, fail) {
        var id = _this.id;
        $.getJSON(url, function(data, textStatus, jqXHR) {
                if (id == _this.id) {
                    success.call(this, data);
                } else {
                    console.log('Dữ liệu kênh không hợp lệ');
                }
            })
            .fail(function(jqxhr, textStatus, error) {
                if (id == _this.id) {
                    fail.call(this);
                } else {
                    console.log('Dữ liệu kênh không hợp lệ');
                }
            });
    }

    this.forwardChannel = function(action) {
        var channelId = localStorage.defaultChannel;
        $.each(_this.channels, function(k, channel) {
            if (channel.channelId == channelId) {
                var nextChannel = k;
                console.log(nextChannel);
                if (action == "next") {
                    nextChannel++;
                    nextChannel += nextChannel > _this.channels.length - 1 ? (-1) : 0;
                } else {
                    nextChannel--;
                    nextChannel += nextChannel < 0 ? 1 : 0;
                }
                //_this.playChannel(_this.channels[nextChannel]);
                console.log(nextChannel);
                $('.epg_grid_channellist ul li[data-id=' + _this.channels[nextChannel].channelId + "" + ']').trigger('click').trigger('click');
                return false;
            }
        });
    }

    this.playChannel = function(channel) {
        player.setStop();
        channel.channelPlaylist = [];
        channel.content = channel.content || [];
        player.$logo.removeAttr('style');
        player.$logo2.removeAttr('style');

        $(".epg_grid_channellist ul li.active").removeClass('active');

        $channel = $('.epg_grid_channellist li[data-id=' + channel.channelId + ']');
        $channel.addClass('active');
        var channelStatus = _this.channelStatus[channel.channelId];
        if (channelStatus && channelStatus.error != 0) {
            _this.ui.channelStatusMsg(channelStatus);
            _this.stop();
            return false;
        };

        VP9.remote.request.playChannel(channel.channelId, _this.day, player.getState());
        if ((channel.channelType != 1 && channel.channelType != 2) || (channel.channelType == 1 && channel.content.length == 0) || (channel.channelType == 2 && !channel.channelUrl)) {
            console.log('no channel found!');
            player.$mesgBar.html('Không có kênh');
            _this.stop();
            return false;
        }

        _this.ui.unlockEpg();
        _this.ui.hideEpg();

        if (channel.channelType == 1) {
            player.$logo.css('background', 'url(' + channel.channelIcon + ')');
            $.each(channel.content, function(k, content) {

                var programLogo = content.logoUrl;
                if (content.content) {
                    $.each(content.content, function(key, video) {
                        var startTime = video[0].start_time ? player.stringToTime(video[0].start_time) : 0,
                            endTime = video[0].end_time ? player.stringToTime(video[0].end_time) : 86400,
                            lengthTime = endTime - startTime;
                        channel.channelPlaylist.push({
                            0: {
                                id: video[0].video_id,
                                name: video[0].name,
                                src: video[0].src,
                                subtitle: video[0].subtitle,
                                startTime: startTime,
                                endTime: endTime,
                                runTime: video[0].runtime,
                                autoNext: key == content.content.length - 1 ? false : true,
                                logoUrl: programLogo
                            }
                        });
                    });
                } else {
                    var startTime = content.start_time ? player.stringToTime(content.start_time) : 0,
                        endTime = content.end_time ? player.stringToTime(content.end_time) : 86400,
                        lengthTime = endTime - startTime;
                    channel.channelPlaylist.push({
                        0: {
                            id: content.video_id,
                            name: content.video_name,
                            src: content.url,
                            subtitle: content.subtitle,
                            startTime: startTime,
                            endTime: endTime,
                            runTime: content.runtime,
                            autoNext: false,
                            logoUrl: programLogo
                        }
                    });
                }

            });
        } else if (channel.channelType == 2) {
            player.$logo.css('background', 'transparent');
            player.$logo2.css('background', 'transparent');
            channel.channelPlaylist = [{
                0: {
                    id: channel.channelId,
                    name: channel.channelName,
                    src: channel.channelUrl,
                    subtitle: [],
                }
            }];
        }

        localStorage.defaultChannel = channel.channelId;

        _this.clearNextVideo();
        player.setLive(true);
        player.$clockBar.show();
        player.setAutoNext(false);
        player.setPlaylist(channel.channelPlaylist);

        var videoId = 0,
            seekTime = 0;
        if (channel.channelType == 2) {
            player.setVideo(videoId, seekTime);
        } else if (channel.channelType == 1) {
            $.each(player.options.playlist, function(k, video) {
                if (_this.clock.timerange >= video[0].startTime) {
                    videoId = k;
                    return;
                }
            });

            var video = player.options.playlist[videoId][0];
            seekTime = _this.clock.timerange - video.startTime;
            player.on('setVideo', function() {
                _this.ui.unlockEpg();
                var currentVideo = player.getCurrentVideo().index;

                if (player.options.playlist[currentVideo][0].logoUrl) {
                    player.$logo2.empty().css('background', 'url(' + player.options.playlist[currentVideo][0].logoUrl + ')');
                } else {
                    player.$logo2.css('background', 'transparent').text("VP9.TV");
                }
                /*hungpd*/
                if (player.options.playlist[currentVideo][0].autoNext === true) {
                    player.setAutoNext(true);
                } else {
                    player.setAutoNext(false);
                    player.on('ended', function() {
                        console.log('---------------------------------------ended');
                        if (player.options.playlist[currentVideo + 1]) {
                            var nextTime = player.options.playlist[currentVideo + 1][0].startTime - _this.clock.timerange;
                            _this.clearNextVideo();

                            if (nextTime <= 0) {
                                player.setVideo(currentVideo + 1);
                            } else {
                                _this.ui.lockEpg();

                                _this.nextVideoTimeout = setTimeout(function() {
                                    player.setVideo(videoId + 1);
                                }, nextTime * 1000);

                                player.$mesgBar.html('<p>Còn <span>00:00:00</span> đến chương trình tiếp theo</p>').show();
                                _this.nextVideoInterval = setInterval(function() {
                                    player.$mesgBar.find('span').html(player.timeToString(nextTime--));
                                    //console.log(nextTime);
                                    if (nextTime <= 0) {
                                        _this.ui.unlockEpg();
                                        player.setVideo(currentVideo + 1);
                                    }
                                }, 1000);
                            }
                        } else {
                            VP9.remote.request.stop();
                            _this.clearNextVideo();
                            _this.ui.lockEpg();
                            _this.ui.showEpg();
                            player.options.playlist = [];

                        }
                    });
                }
            });
            player.setVideo(videoId, seekTime);
            //player.$epg.hide();

            console.log(videoId, seekTime, video.runTime);
        }
    }

    this.loadChannel = function(id, date) {
        var channel = $.getJSON(player.options.epg.url + 'Channel_' + id + '_' + date + '.json?v=' + Date.now(), function(data, textStatus, jqXHR) {
                _this.ui.loadChannel(data);
            })
            .fail(function(jqxhr, textStatus, error) {
                player.$epgList.find('.epg_channels[data-id=' + id + '] .show_sms').html('Chưa có lịch chiếu').show();
                _this.ui.loadChannelFail(id);
            });
    }

    this.playAchannel = function(id, date) {
        var channel = $.getJSON(player.options.epg.url + 'Channel_' + id + '_' + date + '.json?v=' + Date.now(), function(data, textStatus, jqXHR) {
                _this.playChannel(data);
            })
            .fail(function(jqxhr, textStatus, error) {
                console.log(jqxhr, textStatus, error);
            });
    }

    this.stop = function() {
        _this.ui.lockEpg();
        _this.ui.showEpg();
        player.setPause();
    }

    this.ui = {};

    this.ui.channelStatus = function(data) {
        _this.channelStatus = data;

        if ($('.epg_grid_channellist ul li').length > 0) {
            $.each(data, function(k, val) {
                var $channel = $('.epg_grid_channellist ul li[data-id=' + k + ']');
                if (data[k] && data[k].error != 0) {
                    $channel.addClass('die');

                } else {
                    $channel.removeClass('die');
                }
            });
        };
    }

    this.ui.channelStatusMsg = function(channelStatus) {
        var msg = '';
        switch (channelStatus.error) {
            case 1:
                msg = 'Nội dung bị gián đoạn';
                break;
            case 3:
                msg = 'Nội dung bị gián đoạn';
                break;
            case 100:
                msg = 'Nội dung bị gián đoạn';
                break;
            default:
                break;
        }
        player.$mesgBar.html(msg);
    }

    this.ui.hideEpg = function() {
        player.$controls.removeClass('lock');
        player.$epgPopup.hide().find('.epg_pop_play').hide();
        //player.$epg.hide();
        player.$epg.addClass('invisible');
    }

    this.ui.showEpg = function() {
        player.$controls.addClass('lock');
        //player.$epg.show();
        player.$epg.removeClass('invisible');
        if (_this.current) {
            _this.scrollTime();
        }
    }

    this.ui.lockEpg = function() {
        player.$controls.addClass('lock');
        player.$epg.addClass('lock');
        player.$menuBtn.addClass('disabled');
        player.$playBtn.addClass('disabled');
    }

    this.ui.unlockEpg = function() {
        player.$controls.removeClass('lock');
        player.$epg.removeClass('lock');
        player.$menuBtn.removeClass('disabled');
        player.$playBtn.removeClass('disabled');
    }

    this.ui.loadChannelDescription = function(groupchannels) {
        player.$epgGroupChannel.empty();
        $('<li data-col=0 data-row=0><a href="#" data-id=-1>Tất cả</a></li>')
            .appendTo(player.$epgGroupChannel)
            .on('click', function(event) {
                event.preventDefault();
                /*hungpd 190514*/
                if (_this.EPG_GRID) {
                    $(".epg_gird_content ul").empty();
                } else {
                    player.$epgList.empty();
                }
                $(".epg_gird_menu ul li.active").removeClass('active');
                //$(".epg_gird_menu ul li.hover").removeClass('hover');
                $(this).addClass('active');
                _this.channels = [];
                $.each(groupchannels, function(k, groupchannel) {
                    $.each(groupchannel.channelList, function(k, channel) {
                        _this.channels.push(channel);
                    });
                });

                _this.ui.loadGroupChannel(_this.channels);
            });

        $.each(groupchannels, function(k, groupchannel) {
            $('<li data-col=' + k + ' data-row=0><a href="#" data-id=' + groupchannel.groupIndex + '>' + groupchannel.groupName + '</a></li>')
                .appendTo(player.$epgGroupChannel)
                .on('click', function(event) {
                    event.preventDefault();
                    if (_this.EPG_GRID) {
                        //$(".epg_gird_content ul").empty();
                    } else {
                        player.$epgList.empty();
                    }
                    $(".epg_gird_menu ul li.active").removeClass('active');
                    $(this).addClass('active');
                    //$(".epg_gird_menu ul li.hover").removeClass('hover');
                    /*_this.ui.loadGroupChannel(groupchannel.channelList);*/
                    $(".epg_grid_channellist ul li").hide();
                    $.each(groupchannel.channelList, function(k, channel) {
                        $('.epg_grid_channellist ul li[data-id=' + channel.channelId + ']').show();
                    });

                    var key = 0;
                    $.each($(".epg_gird_content ul li"), function(k, channelElem) {
                        if ($(channelElem).is(':visible')) {
                            $(channelElem).attr({
                                'data-col': key % 4,
                                'data-row': Math.floor(key / 4)
                            });
                            key++;
                        } else {
                            $(channelElem).removeAttr('data-col').removeAttr('data-row').removeClass('hover');
                        }
                    });
                });
        });

        _this.setDay(_this.clock.dateString);
    }

    this.ui.loadGroupChannel = function(channelList) {
        _this.live = true;
        channelList.sort(function(a, b) {
            var x = a['channelId'];
            var y = b['channelId'];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
        if (_this.EPG_GRID) {
            $.each(channelList, function(k, channel) {
                var defaultChannel = localStorage.defaultChannel;
                var active = '';
                if (defaultChannel == channel.channelId) {
                    active = 'active';
                };

                if (_this.channelStatus[channel.channelId] && _this.channelStatus[channel.channelId].error != 0) {
                    active += ' die';
                };

                var $item = $('<li data-id="' + channel.channelId + '" class="col-xs-4 col-sm-3 ' + active + '"><p class="alternative">' + channel.channelName + '</p><span>' + channel.channelId + '</span></li>')
                    .appendTo(".epg_gird_content ul")
                    .data("channel", channel);
                $('<img src="' + channel.channelIcon + '"/>').load(function() {
                    $item.find('.alternative').replaceWith(this);
                });
                _this.loadChannel(channel.channelId, _this.day);
            });

            $.each($(".epg_gird_content ul li"), function(k, channelElem) {
                $(channelElem).attr({
                    'data-col': k % 4,
                    'data-row': Math.floor(k / 4)
                });
            });
        } else {
            $.each(channelList, function(k, channel) {
                $('<div class="epg_channels" data-id=' + channel.channelId + '>' + '<div class="epg_logo">' + '<a href="#" style="background: url(' + channel.channelIcon + ')">' + channel.channelName + '</a>' + '<span>' + channel.channelId + '</span>' + '</div>' + '<p class="show_sms">Loading...</p>' + '<div class="epg_channel">' + '</div>' + '</div><!--End channel-->')
                    .appendTo(player.$epgList)
                    .find('.epg_channel')
                    .css('left', $('.epg_main_cont .epg_head').css('left'));

                $('.epg_logo').on('mouseenter', function() {
                    $('.epg_logo span').show();
                });

                $('.epg_logo').on('mouseleave', function() {
                    $('.epg_logo span').hide();
                });
                _this.loadChannel(channel.channelId, _this.day);
            });
        }
    }


    this.ui.loadChannelFail = function(channelId) {

        if (_this.EPG_GRID) {
            $('.epg_gird_content ul li[data-id=' + channelId + ']')
                .on('click', function(event) {
 
                    if ($(this).hasClass('active')) {
                        var channel = $(this).data("channel");
                        if (channel.channelUrl) {
                            var channelPlaylist = [{
                                0: {
                                    id: channel.channelId,
                                    name: channel.channelName,
                                    src: channel.channelUrl,
                                    subtitle: [],
                                }
                            }];
                            player.setLive(true);
                            player.setPlaylist(channelPlaylist);
                            player.setVideo(0, 0);
                            _this.ui.hideEpg();
                        };
                    } else {
                        $(".epg_gird_content ul li.active").removeClass('active');
                        $(this).addClass('active');
                        $(".epg_grid_schedule").empty().html('<div class="channel_item"><h3 class="no-schedule">Chưa có lịch chiếu</h3></div>');
                    }
                });
        };
    }

    this.ui.loadChannel = function(channel) {
        if (channel.channelType > 0) {
            if (_this.EPG_GRID) {
                var defaultChannel = localStorage.defaultChannel;
                if (defaultChannel == channel.channelId) {
                    _this.ui.updateSchedule(channel);
                };
                $('.epg_gird_content ul li[data-id=' + channel.channelId + ']')
                    .on('click', function(event) {
                        player.$mesgBar.empty();
                        if ($(this).hasClass('active')) {
                            _this.playChannel(channel);
                        } else {
                            $(".epg_gird_content ul li.active").removeClass('active');
                            $(this).addClass('active');
                            _this.ui.updateSchedule(channel);
                        }
                    });
                return false;
            }

            channel.content = channel.content || [];
            $.each(channel.content, function(k, content) {
                var startTime = content.start_time ? player.stringToTime(content.start_time) : 0,
                    endTime = content.end_time ? player.stringToTime(content.end_time) : 86400,
                    lengthTime = endTime - startTime;
                content.lengthTime = lengthTime;
                $('<div class="channel_item">' + '<h3 class="name">' + content.video_name + '</h3>' + '</div>')
                    .css({
                        'width': (lengthTime / 86400 * 100) + '%',
                        'left': (startTime / 86400 * 100) + '%'
                    })
                    .appendTo(player.$epgList.find('.epg_channels[data-id=' + channel.channelId + '] .epg_channel'))
                    .on('click', function(event) {
                        _this.ui.showPopup(content, channel.channelType);
                    });
            });
            player.$epgList.find('.epg_channels[data-id=' + channel.channelId + '] .epg_logo').on('click', function(event) {
                _this.playChannel(channel);
            });
            player.$epgList.find('.epg_channels[data-id=' + channel.channelId + '] .show_sms').hide();
            if (channel.content.length == 0) {
                player.$epgList.find('.epg_channels[data-id=' + channel.channelId + '] .show_sms').html('Chưa có lịch chiếu').show();
            }

        }
    }

    this.ui.showPopup = function(content, channelType) {
        player.$epgPopup.show();
        player.$epgPopup.find('.content').html('<p>Tên chương trình: <span>' + content.video_name + '</span></p>' + '<p>Thể loại: <span>' + content.genre + '</span></p>' + '<p>Giờ bắt đầu: <span>' + content.start_time + '</span></p>' + '<p>Thời lượng: <span>' + player.timeToString(content.lengthTime) + '</span></p>');
        player.$epgPopup.find('.epg_pop_play').hide();
        if (channelType == 1) {
            player.$epgPopup.find('.epg_pop_play').show().off('click')
                .on('click', function(event) {
                    event.preventDefault();
                    event.stopPropagation();

                    _this.clearNextVideo();

                    player.setLive(false);
                    player.$clockBar.hide();

                    player.setAutoNext(true);
                    console.log(content);
                    if (content.content) {
                        var playlist = [];
                        $.each(content.content, function(k, video) {
                            console.log(video[0].video_name);
                            playlist.push({
                                0: {
                                    id: video[0].video_id,
                                    name: video[0].name,
                                    src: video[0].src,
                                    subtitle: video[0].subtitle,
                                    autoNext: k == content.content.length - 1 ? false : true
                                }
                            });
                        });
                        player.setPlaylist(playlist);
                    } else {
                        player.setPlaylist([{
                            0: {
                                id: content.video_id,
                                name: content.video_name,
                                src: content.url,
                                subtitle: content.subtitle,
                                autoNext: false
                            }
                        }]);
                    }
                    console.log(playlist);
                    player.setVideo(0);
                    _this.ui.hideEpg();
                });
        }
    }

    this.ui.updateSchedule = function(channel) {
            var $schedule = $(".epg_grid_schedule").removeClass('offline').empty();
            if (channel.content.length == 0) {
                $schedule.html('<div class="channel_item"><div class="item_title"><h3 class="no-schedule">Chưa có lịch chiếu</h3></div></div>');
            };

            var recordUrl = 'http://f.vp9.tv/truyenhinh/' + _this.day.substr(0, 4) + '/' + _this.day.substr(4, 2) + '/' + _this.day.substr(6, 2) + '/' + channel.channelId + '/';
            $.each(channel.content, function(k, item) {
                var startTime = item.start_time ? player.stringToTime(item.start_time) : 0,
                    endTime = item.end_time ? player.stringToTime(item.end_time) : 86400,
                    lengthTime = endTime - startTime;
                item.lengthTime = lengthTime;
                var active = '';
                if (_this.current && startTime < _this.clock.timerange && endTime > _this.clock.timerange) {
                    active = 'active';
                };
                var $channel = $('<div class="channel_item ' + active + '" data-col=0 data-row=' + k + '>' + '<div class="item_title">' + '<span>' + item.start_time.substr(0, item.start_time.length - 3) + '</span>' + '<h3>' + item.video_name + '</h3>' + '</div>' + '<div class="item_info">' + '<p>Tên chương trình: <span> ' + item.video_name + '</span></p>' + '<p>Thể loại: <span> ' + item.genre + '</span></p>' + '<p>Giờ bắt đầu: <span> ' + item.start_time + '</span></p>' + '<p>Thời lượng: <span> ' + player.timeToString(item.lengthTime) + '</span></p>' + '</div>' + '</div>')
                    .data('startTime', startTime)
                    .data('endTime', endTime)
                    .data('playlist', {
                        id: item.video_id,
                        name: item.video_name,
                        src: recordUrl + item.start_time.replace(/:/gi, '') + '.mp4',
                        subtitle: item.subtitle,
                    })
                    .attr('data-record', item.start_time.replace(/:/gi, ''))
                    .appendTo('.epg_grid_schedule')
                    .on('click', function(evt) {
                        evt.preventDefault();
                        //_this.ui.showPopup(item, channel.channelType);
                        $('.epg_grid_schedule .channel_item').not(this).removeClass('view').find('.item_info').hide();
                        $(this).toggleClass('view').find('.item_info').slideToggle(200);
                    });

                if (channel.channelType == 1) {
                    $channel.addClass('offline');
                    $('<a href="#">Xem ngay</a>').appendTo($channel.find('.item_info'))
                        .wrap('<p class="item_play"></p>')
                        .on('click', function(event) {
                            event.preventDefault();

                            player.$logo.css('background', 'url(' + channel.channelIcon + ')');
                            console.log(item);
                            var playlist = {};
                            var logo = item.logoUrl;
                            if (item.content) {
                                var pl = [];
                                $.each(item.content, function(k, video) {
                                    pl.push({
                                        0: {
                                            id: video[0].video_id,
                                            name: video[0].name,
                                            src: video[0].src,
                                            subtitle: video[0].subtitle,
                                            autoNext: k == item.content.length - 1 ? false : true,
                                            logoUrl: logo
                                        }
                                    });
                                });
                                playlist = pl;
                            } else {
                                playlist = [{
                                    0: {
                                        id: item.video_id,
                                        name: item.video_name,
                                        src: item.url,
                                        subtitle: item.subtitle,
                                        autoNext: false,
                                        logoUrl: logo
                                    }
                                }]
                            }

                            var data = {
                                pll: playlist,
                                metadata: {
                                    video_name: item.video_name,
                                }
                            }
                            player.options.metadata = {
                                video_name: item.video_name
                            }
                            _this.playPlaylist(data);
                        });
                }
            });

            if (channel.channelType == 2) {
                var records = [];
                $.get(recordUrl + '/list.txt?v=' + Date.now(), function(data) {
                    records = data.split("\n");
                    $.each(records, function(k, record) {
                        var currentTime = player.timeToString(_this.clock.timerange).replace(/:/gi, '');
                        console.log(record, currentTime);
                        if (record < currentTime) {
                            var $channel = $('.channel_item[data-record=' + record + ']').addClass('offline');
                            $('<a href="#">Xem ngay</a>').appendTo($channel.find('.item_info'))
                                .wrap('<p class="item_play"></p>')
                                .on('click', function(event) {
                                    event.preventDefault();

                                    var data = {
                                        pll: [{
                                            0: $channel.data('playlist')
                                        }]
                                    }
                                    player.options.metadata = '';
                                    _this.playPlaylist(data);
                                });
                        }
                    });

                }).fail(function() {
                    //console.log('Không có records');
                });
            }
            if (_this.current) {
                var scroll = $('.channel_item.active').index() - 3 >= 0 ? $('.channel_item.active').index() - 3 : 0;
                $(".epg_grid_schedule").scrollTo('.channel_item:nth-child(' + scroll + ')');
            }
        }

    this.playPlaylist = function(data) {
        VP9.remote.request.playPlaylist(data);
        _this.ui.hideEpg();
        _this.clearNextVideo();
        player.setLive(false);
        player.$clockBar.hide();
        player.setAutoNext(true);

        player.setPlaylist(data.pll);
        //player.$logo.css('background', 'transparent');
        player.setVideo(0);
    }

    this.clearNextVideo = function() {
        clearInterval(_this.nextVideoInterval);
        clearTimeout(_this.nextVideoTimeout);
        player.$epg.removeClass('lock');
        player.$mesgBar.empty();
    }

    this.scrollTime = function() {
        if (_this.EPG_GRID) return false;
        var left = -player.$epgLine.position().left + player.$epgContent.width() / 2;
        $('.epg_main_cont .epg_head, .epg_main_cont .epg_channel').css('left', left);
    }

    this.setDay = function(dayStr) {
        VP9.remote.request.change_date(dayStr);
        _this.day = dayStr;
        var date = _this.parseTime($.datepicker.parseDate("yymmdd", dayStr));
        player.$epgDay.find('.month').html(_this.weekdays[date.day]);
        player.$epgDay.find('.date').html(date.date + '/' + date.month + '/' + date.year);

        if (dayStr == _this.clock.dateString) {
            player.$epgLine.show();
            _this.current = true;
        } else {
            player.$epgLine.hide();
            _this.current = false;
        }

        player.$epgGroupChannel.find('li').first().trigger('click');
    }

    this.setTime = function() {
        _this.day = _this.clock.dateString;
        $(".box_cal").datepicker("option", "defaultDate", _this.clock.dateString);
        player.$epgDay.find('.month').html(_this.weekdays[_this.clock.day]);
        player.$epgDay.find('.date').html(_this.clock.date + '/' + _this.clock.month + '/' + _this.clock.year);
        player.$clockSec.html(player.numberToString(_this.clock.seconds));
        player.$clockMin.html(player.numberToString(_this.clock.minutes));
        player.$clockHr.html(player.numberToString(_this.clock.hours));
    }

    this.updateTime = function(timeObj) {
        _this.clockInterval = setInterval(function() {
            _this.clock.timestamp += 1000;
            _this.clock.timerange += 1;
            if (_this.clock.seconds < 59) {
                player.$clockSec.html(player.numberToString(++_this.clock.seconds));
            } else {
                player.$clockSec.html(player.numberToString(_this.clock.seconds = 0));
                if (_this.clock.minutes < 59) {
                    player.$clockMin.html(player.numberToString(++_this.clock.minutes));
                } else {
                    player.$clockMin.html(player.numberToString(_this.clock.minutes = 0));
                    if (_this.clock.hours < 23) {
                        player.$clockHr.html(player.numberToString(++_this.clock.hours));
                    } else {
                        clearInterval(_this.clockInterval);
                        _this.clock = this.parseTime(new Date(_this.clock.timestamp));
                        _this.setTime();
                        _this.ui.updateTime();
                    }
                }
            }

            if (_this.current) {
                if (_this.EPG_GRID) {
                    var $current = $(".epg_grid_schedule .channel_item")
                        .filter(function() {
                            return $(this).data("startTime") < _this.clock.timerange && $(this).data("endTime") > _this.clock.timerange;
                        });
                    $(".epg_grid_schedule .channel_item.active").removeClass("active");
                    $current.addClass('active');
                } else {
                    player.$epgLine.css('left', _this.clock.timerange / 86400 * 100 + '%');
                }
            }
        }, 1000);
    }

    this.parseTime = function(time) {
            return {
                day: time.getDay(),
                date: player.numberToString(time.getDate()),
                month: player.numberToString(time.getMonth() + 1),
                year: time.getFullYear(),
                hours: time.getHours(),
                minutes: time.getMinutes(),
                seconds: time.getSeconds(),
                timestamp: Date.parse(time.toString()),
                timerange: time.getHours() * 3600 + time.getMinutes() * 60 + time.getSeconds(),
                dateString: '' + time.getFullYear() + player.numberToString(time.getMonth() + 1) + player.numberToString(time.getDate())
            };
        }

    this.ui.move;
    this.ui.scrollRight = function() {
            if (_this.EPG_GRID) return false;
            _this.live = false;
            clearInterval(_this.ui.move);
            $('.hover_right').show();
            _this.ui.move = setInterval(function() {
                if ($('.epg_main_cont .epg_head').position().left <= -_this.maxLeft) {
                    $('.hover_right').hide();
                    clearInterval(_this.ui.move);
                } else {
                    var left = $('.epg_main_cont .epg_head').position().left - 100 > -_this.maxLeft ? $('.epg_main_cont .epg_head').position().left - 100 : -_this.maxLeft;
                    $('.epg_main_cont .epg_head, .epg_main_cont .epg_channel').css('left', left);
                }
            }, 100);
        }

    this.ui.scrollLeft = function() {
            if (_this.EPG_GRID) return false;
            _this.live = false;
            clearInterval(_this.ui.move);
            $('.hover_left').show();
            _this.ui.move = setInterval(function() {
                if ($('.epg_main_cont .epg_head').position().left >= 0) {
                    $('.hover_left').hide();
                    clearInterval(_this.ui.move);
                } else {
                    var left = $('.epg_main_cont .epg_head').position().left + 100 < 0 ? $('.epg_main_cont .epg_head').position().left + 100 : 0;
                    $('.epg_main_cont .epg_head, .epg_main_cont .epg_channel').css('left', left);
                }
            }, 100);
        }

    this.ui.scrollTop = function($div) {
        _this.live = false;
        clearInterval(_this.ui.move);
        _this.ui.move = setInterval(function() {
            if (_this.EPG_GRID && $div) {
                if ($div.scrollTop() == 0) {
                    clearInterval(_this.ui.move)
                };
                $div.scrollTop($div.scrollTop() - 150);
                return false;
            }
            console.log('top');
            if ($('.epg_main_cont .epg_list').position().top >= 60) {
                //$('.hover_left').hide();
                clearInterval(_this.ui.move);
            } else {
                var top = $('.epg_main_cont .epg_list').position().top + 100 < 60 ? $('.epg_main_cont .epg_list').position().top + 100 : 60;
                $('.epg_main_cont .epg_list').css('top', top);
            }
        }, 100);
    }

    this.ui.scrollBottom = function($div) {
        _this.live = false;
        clearInterval(_this.ui.move);
        //$('.hover_left').show();
        _this.ui.move = setInterval(function() {
            if (_this.EPG_GRID && $div) {
                if ($div.scrollTop() == 0) {
                    clearInterval(_this.ui.move)
                };
                $div.scrollTop($div.scrollTop() + 150);
                return false;
            }
            console.log('bottom');
            var maxTop = $('.epg_main_cont .epg_list').height() - $('.epg_main_cont').height();
            if ($('.epg_main_cont .epg_list').position().top <= -maxTop) {
                //$('.hover_left').hide();
                clearInterval(_this.ui.move);
            } else {
                var top = $('.epg_main_cont .epg_list').position().top - 100 > -maxTop ? $('.epg_main_cont .epg_list').position().top - 100 : -maxTop;
                $('.epg_main_cont .epg_list').css('top', top);
            }
        }, 100);
    }

    this.init();
}
