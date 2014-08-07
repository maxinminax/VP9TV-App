// var IsAndroid = /android/i.test(navigator.userAgent.toLowerCase());
var IsAndroid = (navigator.userAgent.toLowerCase().indexOf("applewebkit/534.30 (khtml, like gecko) version/4.0 safari/534.30") > -1) && /android/i.test(navigator.userAgent.toLowerCase());
var userAgent = navigator.userAgent.toLowerCase();
// alert(navigator.userAgent.toLowerCase());
RemoteKey();
function RemoteKey()
{
    RemoteKey.checkFullscreen = function(ev)
    {
        var kcode = window.event ? ev.keyCode : ev.which;
        return (kcode === 13 && ev.altKey);
    },
    RemoteKey.Fullscreen = function(){},
    RemoteKey.PlayPause = function(){},
    RemoteKey.Stop = function(){},
    RemoteKey.Previous = function(){},
    RemoteKey.Next = function(){},
    RemoteKey.Rewind = function(){},
    RemoteKey.Forward = function(){},
    RemoteKey.Up = function(){},
    RemoteKey.Down = function(){},
    RemoteKey.Left = function(){},
    RemoteKey.Right = function(){},
    RemoteKey.PgUp = function(){},
    RemoteKey.PgDown = function(){},
    RemoteKey.Enter = function(){},
    RemoteKey.Esc = function(){},
    RemoteKey.Tab = function(){},
    RemoteKey.Window = function(){},
    RemoteKey.Open = function(){},
    RemoteKey.Backspace = function(){},
    RemoteKey.AltTab = function(){},
    RemoteKey.MyPC = function(){},
    RemoteKey.Desktop = function(){},

    RemoteKey.Power = function(){},
    RemoteKey.Email = function(){},
    RemoteKey.WWW = function(){},
    RemoteKey.Close = function(){},
    RemoteKey.Music = function(){},
    RemoteKey.Video = function(){},
    RemoteKey.Photo = function(){},
    RemoteKey.Tivi = function(){},

    RemoteKey.Numpad = function(){},
    RemoteKey.DownUpLeftRight = function(){},
    RemoteKey.OK = function(){},


    RemoteKey.state = 0;
    RemoteKey.oldKey = 0;
    RemoteKey.init = function()
    {
    }();
    RemoteKey.wait = false;
    RemoteKey.timeout;
    RemoteKey.keyup = function (ev) {
        RemoteKey.wait = false;
        clearTimeout(RemoteKey.timeout);
    },
    RemoteKey.keydown = function (ev) {
        if (RemoteKey.wait){
            return;
        }
        RemoteKey.wait = true;
        var kcode = window.event ? ev.keyCode : ev.which;
        var statekey = kcode;
        // RemoteKey.wait = kcode > 30 || kcode == 9 || kcode == 13 || kcode == 27;
        switch (kcode) {
            case 8:
                setTimeout(RemoteKey.Backspace, 0);
                break;
            case 9:
                setTimeout(RemoteKey.Tab, 0);
                break;
            case 27:
                setTimeout(RemoteKey.Esc, 0);
                break;
            case 92:
                setTimeout(RemoteKey.Window, 0);
                break;
            case 79:
                if (ev.ctrlKey)
                    setTimeout(RemoteKey.Open, 0);
                break;
            case 13: //51
                // if (ev.altKey) RemoteKey.Fullscreen(); 
                // else{
                    var e = ev;
                    setTimeout(function(){
                        RemoteKey.OK(e);
                    }, 0);
                // }
                // setTimeout(ev.altKey ? RemoteKey.Fullscreen : RemoteKey.Enter,0);
                break;
            case 18:
                setTimeout(function () {
                    // if (RemoteKey.state === 18)
                    // RemoteKey.AltTab();
                }, 15);
                break;
            case 33: setTimeout(RemoteKey.PgUp, 0);
                break;
            case 34: setTimeout(RemoteKey.PgDown, 0);
                break;
            case 37:
            case 38: 
            case 39:
            case 40: 
                if (!ev.ctrlKey && !ev.altKey){
                    var e = ev;
                    setTimeout(function(){
                        RemoteKey.DownUpLeftRight(e);
                    }, 0);
                }
                break;
            case 68: //52
                if (ev.ctrlKey && ev.shiftKey) {
                    setTimeout(RemoteKey.Tivi, 0);
                }
                else {
                    if (RemoteKey.state === 91) {
                        setTimeout(RemoteKey.Desktop, 0);
                        statekey = 91;
                    }
                    else {
                        setTimeout(RemoteKey.Window, 0);
                    }
                }
                break;
            case 91: // except 68
                setTimeout(function () {
                    if (RemoteKey.oldKey === 91) {
                        setTimeout(RemoteKey.MyPC, 0);
                    }
                }, 15);
                break;
            case 112: //49, 65
                if (ev.ctrlKey && ev.altKey) {
                    setTimeout(RemoteKey.Music, 0);
                }
                break;
            case 113: //50, 66
                if (ev.ctrlKey && ev.altKey) {
                    setTimeout(RemoteKey.Video, 0);
                }
                break;
            case 114: //51, 67
                if (ev.ctrlKey && ev.altKey) {
                    setTimeout(RemoteKey.Photo, 0);
                }
                break;
            case 115:
                if (ev.altKey) {
                    setTimeout(RemoteKey.Close, 0);
                }
                break;
            case 176:
                setTimeout(RemoteKey.Next, 0);
                break;
            case 177:
                setTimeout(RemoteKey.Previous, 0);
                break;
            case 178:
                setTimeout(RemoteKey.Stop, 0);
                break;
            case 179:
                RemoteKey.PlayPause();
                // setTimeout(RemoteKey.PlayPause,0);
                break;
            case 74: case 75: case 76: 
                RemoteKey.Enter();
                // setTimeout(RemoteKey.Enter,0);
                break;
            case 71: case 72: case 73: 
                if (!ev.ctrlKey && !ev.altKey) setTimeout(RemoteKey.Left, 0);
                break;
            case 65:
                // if (!ev.ctrlKey && !ev.altKey) 
                    setTimeout(RemoteKey.Left, 0);
                break;
            case 66: case 67:
                if (!ev.ctrlKey && !ev.altKey)
                    setTimeout(RemoteKey.Up, 0);
                break;
            case 77: case 78: case 79: 
                if (!ev.ctrlKey && !ev.altKey) setTimeout(RemoteKey.Right, 0);
                break;
            case 84: case 85: case 86:
                if (!ev.ctrlKey && !ev.altKey) setTimeout(RemoteKey.Down, 0);
                break;
            case 188: case 190: case 191:
                if (!ev.ctrlKey && !ev.altKey) setTimeout(RemoteKey.Tab, 0);
                break;
            case 'f'.charCodeAt(0): case 'F'.charCodeAt(0):
                // if (!MUtil.IsAndroid()) {
                    RemoteKey.Fullscreen();
                    break;
                // }
            case 68: 
                setTimeout(RemoteKey.Right, 0);
                break;
            case 69: case 70:
                if (!ev.ctrlKey && !ev.altKey) setTimeout(RemoteKey.Window, 0);
                break;
            case 32:  /*conflick with Window key*/case 48:
                if (!ev.ctrlKey && !ev.altKey) setTimeout(RemoteKey.AltTab, 0);
                break;
            case 83:
                if (!ev.ctrlKey && !ev.altKey){
                    var e = ev;
                    setTimeout(function(){
                        RemoteKey.Down(e);
                    }, 0);
                }
                break;

            case 80: case 81: case 82:                    // W = 87, A = 65, D = 68, S = 83
                setTimeout(RemoteKey.Open, 0);
                break;
            case 87: 
                setTimeout(RemoteKey.Up, 0);
                break;
            case 88: case 89: case 90:
                setTimeout(RemoteKey.Esc, 0);
                break;
            case 141:
                alert(141);
                break;
            case 142:
                alert(142);
                break;
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
                if (!ev.ctrlKey && !ev.altKey && !ev.shiftKey){
                    var e = ev;
                    setTimeout(function(){
                        RemoteKey.Numpad(e);
                    }, 0);
                }
                break;
            default:
                RemoteKey.wait = false;
                break;
        }

        RemoteKey.timeout = setTimeout(function () {
            RemoteKey.wait = false;
        }, 500);
        RemoteKey.oldKey = kcode;
        // $('#onoffListsub').html(kcode+' '+ev.ctrlKey + ev.altKey+RemoteKey.wait+' '+$('#onoffListsub').html());
    }

  
}
