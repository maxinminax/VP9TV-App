var VP9 = VP9 || {};

VP9.playerProjekktor = function(player) {
    var _this = this;

    this.name = 'Projekktor';

    var default_opts = {
        playerFlashMP4: player.options.swf + 'StrobeMediaPlayback/StrobeMediaPlayback_hls.swf',
        playerFlashMP3: player.options.swf + 'StrobeMediaPlayback/StrobeMediaPlayback_hls.swf',
        volume: 1,
        autoplay: false,
        continuous: false,
        loop: false,
        playlist: []
    };

    this.options = $.extend(default_opts, {
        videoScaling: player.options.scale
    });

    this.init = function() {
        console.log('init Projekktor player');
        _this.player = window.projekktor(player.options.tag, _this.options, function(pl) {
            
            //projekktor hack
            pl._modelUpdateListener = function(type, value) {
                var ref = this,
                    modelRef = this.playerModel;

                if (!this.playerModel.init) return;
                if (type != 'time' && type != 'progress') {
                    $p.utils.log("Update: '" + type, this.playerModel.getSrc(), this.playerModel.getModelName(), value);
                }

                switch (type) {
                    case 'state':
                        this._promote('state', value); // IMPORTANT: STATES must be promoted before being processed!

                        var classes = $.map(this.getDC().attr("class").split(" "), function(item) {
                            return item.indexOf(ref.getConfig('ns') + "state") === -1 ? item : "";
                        });

                        classes.push(this.getConfig('ns') + "state" + value.toLowerCase());
                        this.getDC().attr("class", classes.join(" "));

                        switch (value) {
                            case 'AWAKENING':
                                this._syncPlugins(function() {
                                    if (modelRef.getState('AWAKENING'))
                                        modelRef.displayItem(true);
                                });
                                break;

                            case 'ERROR':
                                this._addGUIListeners();
                                break;

                            case 'PAUSED':
                                if (this.getConfig('disablePause') === true) {
                                    this.playerModel.applyCommand('play', 0);
                                }
                                break;

                            case 'COMPLETED':           
                                return;
                        }
                        break;

                    case 'modelReady':
                        this._maxElapsed = 0;
                        this._promote('item', ref._currentItem);
                        break;

                    case 'displayReady':
                        this._promote('displayReady', true);
                        this._syncPlugins(function() {
                            ref._promote('ready');
                            ref._addGUIListeners();
                            if (!modelRef.getState('IDLE'))
                                modelRef.start();
                        });
                        break;

                    case 'availableQualitiesChange':
                        this.media[this._currentItem].qualities = value;
                        this._promote('availableQualitiesChange', value);
                        break;

                    case 'qualityChange':
                        this.setConfig({
                            playbackQuality: value
                        });
                        this._promote('qualityChange', value);
                        break;

                    case 'volume':
                        this.setConfig({
                            volume: value
                        });
                        this._promote('volume', value);

                        if (value <= 0) {
                            this.env.muted = true;
                            this._promote('mute', value);
                        } else if (this.env.muted === true) {
                            this.env.muted = false;
                            this._promote('unmute', value);
                        }
                        break;

                    case 'playlist':
                        this.setFile(value.file, value.type);
                        break;

                    case 'config':
                        this.setConfig(value);
                        break;

                    case 'time':
                        // track quartiles
                        if (this._maxElapsed < value) {
                            var pct = Math.round(value * 100 / this.getDuration()),
                                evt = false;

                            if (pct < 25) {
                                pct = 25;
                            }
                            if (pct > 25 && pct < 50) {
                                evt = 'firstquartile';
                                pct = 50;
                            }
                            if (pct > 50 && pct < 75) {
                                evt = 'midpoint';
                                pct = 75;
                            }
                            if (pct > 75 && pct < 100) {
                                evt = 'thirdquartile';
                                pct = 100;
                            }

                            if (evt !== false) this._promote(evt, value);
                            this._maxElapsed = (this.getDuration() * pct / 100);
                        }
                        this._promote(type, value);
                        break;

                    case 'fullscreen':
                        if (value === true) {
                            this.getDC().addClass('fullscreen');
                            this._enterFullViewport();
                        } else {
                            this.getDC().removeClass('fullscreen');
                            this._exitFullViewport();
                        }
                        this._promote(type, value);
                        break;

                    case 'error':
                        this._promote(type, value);
                        if (this.getConfig('skipTestcard') && this.getItemCount() > 1) {
                            this.setActiveItem('next');
                        } else {
                            this.playerModel.applyCommand("error", value);
                            this._addGUIListeners();
                        }
                        break;

                    case 'streamTypeChange':
                        if (value == 'dvr') {
                            this.getDC().addClass(this.getNS() + 'dvr');
                        }
                        this._promote(type, value);
                        break;
                    default:
                        this._promote(type, value);
                        break;
                }

            };

            //onReady
            _this.creatDisplay();
            player.creatDisplay();
            _this.creatControls();
            player.creatControls();

            player.plugins.init();

            pl.addListener('displayReady', function() {
                //console.log('displayReady');
            });
            pl.addListener('pluginsReady', function() {
                //console.log('pluginsReady');
            });
            pl.addListener('ready', function() {
                //console.log('ready');
            });
            pl.addListener('scheduled', function() {
                //console.log('scheduled');
                player.$start.show();
            });
            pl.addListener('scheduleLoading', function() {
                //console.log('scheduleLoading');
            });

            pl.addListener('start', function() {
                //console.log('start');
                //player.$controls.removeClass('lock');
            });

            pl.addListener('item', function(item) {
                //console.log('item');
            });

            pl.addListener('time', function(item) {
                //console.log('time');
            });

            pl.addListener('state', function(state) {
                console.log(state);
                switch (state) {
                    case 'IDLE':
                        break;
                    case 'AWAKENING':
                        break;
                    case 'STARTING':
                        break;
                    case 'PLAYING':
                        player.$buffering.addClass('inactive');
                        player.$start.hide();
                        player.$playBtn.addClass('pause');
                        player.$controls.removeClass('lock');
                        break;
                    case 'PAUSED':
                        player.$start.show();
                        player.$playBtn.removeClass('pause');
                        player.$controls.addClass('lock');
                        break;
                    case 'STOPPED':

                        break;
                    case 'COMPLETED':
                        player.$start.hide();
                        player.ui.setStop();
                        console.log(player.options.autoNext);
                        if (player.options.autoNext) {
                            player.setVideo('next');
                        }
                        break;
                    case 'ERROR':
                        player.$controls.removeClass('lock');

                        player.reconnect = setTimeout(function() {
                            player.$mesgBar.html('Lỗi kết nối! Kết nối lại sau 3s');
                            player.setVideo(player.activeVideo, _this.player.getPosition());
                        }, 3000);

                        break;
                    case 'DESTROYING':

                        break;
                    default:
                        break;
                }
            });


            player.$playBtn.removeClass('disabled').on('vclick', function() {
                if (pl.getState('PAUSED') || pl.getState('IDLE')) {
                    pl.setPlay();
                }
                if (pl.getState('PLAYING')) {
                    pl.setPause();
                }
            });

            player.ready.call(this);
            if (typeof(player.options.ready) == 'function') {
                player.options.ready.call(this, player);
            }

            player.setPlaylist(player.options.playlist);
            player.setVideo(player.options.activeVideo);

        });

        //      _this.player.addListener('ready', function() {
        // player.$playBtn.removeClass('disabled');
        //      });

    }

    this.destroy = function() {
        _this.player.selfDestruct();
    }

    this.creatDisplay = function() {
        player.$display = player.$player.find('.ppdisplay');
        player.$media = player.$display.find(player.options.tag + '_media');
        player.$video = null;
        player.$start = player.$player.find('.ppstart').hide();
        player.$buffering = player.$player.find('.ppbuffering').addClass('inactive');
    }

    this.creatControls = function() {
        player.$controls = player.$player.find('.ppcontrols').addClass('lock');

        player.$controls.find('ul.left').empty().addClass('nav');

        player.$controls.find('.ppmute').parent('li').remove();
        player.$controls.find('.ppvslider').parent('li').remove();
        player.$controls.find('.ppvmax').parent('li').remove();

        //fullscreenBtn
        if ($.inArray('fullscreen', player.options.controls) >= 0) {
            player.$fsExitBtn = player.$controls.find('.ppfsexit');
            player.$fsEnterBtn = player.$controls.find('.ppfsenter');
        } else {
            player.$controls.find('.ppfsexit').parent('li').remove();
        }

        //timeleftBar
        if ($.inArray('timeleft', player.options.controls) >= 0) {
            player.$timeleftBar = player.$controls.find('.pptimeleft');
        } else {
            player.$controls.find('.pptimeleft').parent('li').remove();
        }

        //nextBtn
        if ($.inArray('next', player.options.controls) >= 0) {
            player.$nextBtn = player.$controls.find('.ppnext')
                .off('click')
                .on('vclick', function() {
                    console.log('next');
                    player.setVideo('next');
                });
        } else {
            player.$controls.find('.ppnext').parent('li').remove();
        }

        //prevBtn
        if ($.inArray('prev', player.options.controls) >= 0) {
            player.$prevBtn = player.$controls.find('.ppprev')
                .off('click')
                .on('vclick', function() {
                    player.setVideo('prev');
                });
        } else {
            player.$controls.find('.ppprev').parent('li').remove();
        }

        //progress
        if ($.inArray('progress', player.options.controls) >= 0) {
            player.$progressBar = player.$controls.find('.ppscrubber');

            player.$playhead = player.$progressBar.find('.ppplayhead');
            player.$scrubberdrag = player.$progressBar.find('.ppscrubberdrag')
        } else {
            player.$controls.find('.ppscrubber').parent('li').remove();
        }
    }

    //Events

    this.removeEventonStop = function(evt, func) {
        _this.player.addListener('item', function() {
            _this.player.removeListener(evt, func);
        });
        player.on('stop', function() {
            _this.player.removeListener(evt, func);
        });
    }

    player.onReady = function(func) {
        _this.player.addListener('ready', func);
    }

    player.onPlay = function(func) {
        _this.player.addListener('state', function(state) {
            if (state == 'PLAYING') {
                func.call(this);
            }
        });
    }

    var firstPlay = true;
    var onFirstPlay = [];
    player.onFirstPlay = function(func) {
        onFirstPlay.push(func);
        /*_this.player.addListener('start', func);
        _this.removeEventonStop('start', func);*/
        var firstPlayFunc = function() {
            if (firstPlay) {
                firstPlay = false;
                $.each(onFirstPlay, function(k, fpFunc) {
                    fpFunc.call(this);
                });
                onFirstPlay = []
            }
        }
        _this.player.addListener('time', firstPlayFunc);
        _this.removeEventonStop('time', firstPlayFunc);
    }

    player.onPause = function(func) {
        _this.player.addListener('state', function(state) {
            if (state == 'PAUSED') {
                func.call(this);
            }
        });
    }

    player.onEnded = function(func) {
        var onEndedFuc = function(state) {
            if (state == 'COMPLETED') {
                func.call(this);
            }
        }
        _this.player.addListener('state', onEndedFuc);
        _this.removeEventonStop('state', onEndedFuc);
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
        if (_this.player.getState('PAUSED')) {
            return false;
        }
        _this.player.addListener('time', function(time) {
            func.call(this, time);
        });
    }

    player.onError = function(func) {
        _this.player.addListener('state', function(state) {
            if (state == 'ERROR') {
                func.call(this);
            }
        });
    }

    player.onSeeking = function(func) {
        _this.player.addListener('seek', function(state) {
            if (state == 'SEEKING') {
                func.call(this);
            }
        });
    }

    player.onSeeked = function(func) {
        _this.player.addListener('seek', function(state) {
            if (state == 'SEEKED') {
                func.call(this);
            }
        });
    }


    //methods
    player.setPlay = function() {
        _this.player.setPlay();
    }

    player.setPause = function() {
        _this.player.setPause();
    }

    player.setStop = function() {
        player.ui.setStop();
        _this.player.setStop();

        $.each(onStop, function(k, func) {
            func.call(this);
        });

        onStop = [];
    }

    player.setSeek = function(time) {
        _this.player.setSeek(time);
    }

    // hainq: Fix the id of the element in the playlist
    this.fixIndex = function(index) {
        var cnt = 0;
        for (var i = 0; i < index; i++) {
            if (!player.options.playlist[i]) {
                cnt++;
            }
        }
        return (index - cnt);
    }
    // end of hainq

    player.setVideo = function(item, seekTime) {
        player.setStop();
        firstPlay = true;
        var id = player.ui.setVideo(item);

        if (id !== false) {
            id = _this.fixIndex(id);
            _this.player.setActiveItem(id);
            if (player.options.autoplay) {
                _this.player.setPlay();
            }

            if (seekTime) {
                _this.player.setSeek(seekTime);
            }

            $.each(onSetVideo, function(k, func) {
                func.call(this, id);
            });
        }
    }

    player.setPlaylist = function(playlist) {
        player.options.playlist = playlist;
        player.setStop();
        _this.player.setFile(playlist);
        //player.setVideo(player.options.activeVideo);
    }

    player.setAutoNext = function(auto) {
        player.options.autoNext = auto;
        _this.player.config._continuous = auto;
    }

    player.addItem = function(data) {
        player.options.playlist.push(data);
        _this.player.setItem(data);

        return player.options.playlist.length - 1;
    }

    player.removeItem = function(data) {
        var index;
        if ($.isNumeric(data)) {
            index = data;
        } else {
            index = $.inArray(data, player.options.playlist);
        }
        if (index >= 0) {

            if (index == _this.player.getItemIdx()) {
                //console.log('can't remove item when playing', _this.player.media);
                return false;
            } else {
                //delete player.options.playlist[index];
                _this.player.setItem(null, index);
                player.options.playlist.splice(index, 1)
                return index;
            }
        } else {
            return false;
            console.log('delete item not live');
        }
    }

    player.getCurrentVideo = function() {
        return {
            index: _this.player.getItemIdx(),
            duration: _this.player.getDuration()
        }
    }

    player.getCurrentTime = function() {
        return _this.player.getPosition();
    }

    player.getState = function(state) {
        return _this.player.getState(state);
    }

    this.init();
}
