var CONFIG = CONFIG || {};

CONFIG.FILE_CONFIG = "vp9server.txt";
CONFIG.FILE_CHANNEL_LIST = "vp9channel.txt";
CONFIG.FILE_GENERAL_CONFIG = "vp9setting.txt";
CONFIG.SERVER_VP9 = "http://tv.vp9.tv";
CONFIG.SERVER_PHUNN = "http://10.10.10.159/hungvv/phunn";

CONFIG.SETTING_NAME = 'servers'; //ten file

CONFIG.REQUEST_PATH = '/serverInfo1.json'

CONFIG.VP9APP = CONFIG.VP9APP || {};
CONFIG.VP9APP.package = "com.vp9.tv";
CONFIG.VP9APP.activity = ".MainActivity";
CONFIG.VP9APP.icon = "./img/img_vp9Logo.png";
CONFIG.VP9APP.server = "http://tv.vp9.tv";


// CONFIG.VP9_AppPackages = [{
// 							"name" : "FILM",
// 							"icon" : "./img/movie.png",
// 							"server" : "http://tv.vp9.tv",
// 							"type" : "film"
// 						},
// 						{
// 							"name" : "ÂM NHẠC",
// 							"icon" : "./img/music.png",
// 							"server" : "http://tv.vp9.tv",
// 							"type" : "music"
// 						},

// 						{
// 							"name" : "GAME",
// 							"icon" : "./img/game.png",
// 							"server" : "http://tv.vp9.tv",
// 							"type" : "game"
// 						},
// 						{
// 							"name" : "KARAOKE",
// 							"icon" : "./img/karaoke.png",
// 							"server" : "http://tv.vp9.tv",
// 							"type" : "karaoke"
// 						},
// 						{
// 							"name" : "TRUYỀN HÌNH",
// 							"icon" : "./img/tivi.png",
// 							"server" : "http://tv.vp9.tv",
// 							"type" : "tivi"
// 						}];

CONFIG.VP9_AppPackages = [{	"id":1,
							"name":"TV VP9",
							"address":"http://tv.vp9.tv",
							"status":1,
							"contents();":[
								{"id":1,"name":"Truyền hình","services":"tivi","status":1,"icon":"http://tv.vp9.tv/images/home/tivi.svg"},
								{"id":2,"name":"Karaoke","services":"karaoke","status":1,"icon":"http://tv.vp9.tv/images/home/karaoke.svg"},
								{"id":3,"name":"Film","services":"film","status":1,"icon":"http://tv.vp9.tv/images/home/movie.svg"},
								{"id":5,"name":"Music","services":"music","status":1,"icon":"http://tv.vp9.tv/images/home/music.svg"},
								{"id":6,"name":"Game","services":"game","status":1,"icon":"http://tv.vp9.tv/images/home/game.svg"}
							]
						}						
					];
CONFIG.VP9_PACKAGES = {
   "http://tv.vp9.tv": {
      "id": 1,
      "name": "TV VP9",
      "address": "http://tv.vp9.tv",
      "status": 1,
      "services": [
         {
            "id": 1,
            "name": "Truyền hình",
            "service": "tivi",
            "status": 1,
            "icon": "http://tv.vp9.tv/images/home/tivi.svg"
         },
         {
            "id": 2,
            "name": "Karaoke",
            "service": "karaoke",
            "status": 1,
            "icon": "http://tv.vp9.tv/images/home/karaoke.svg"
         },
         {
            "id": 3,
            "name": "Film",
            "service": "film",
            "status": 1,
            "icon": "http://tv.vp9.tv/images/home/movie.svg"
         },
         {
            "id": 5,
            "name": "Music",
            "service": "music",
            "status": 1,
            "icon": "http://tv.vp9.tv/images/home/music.svg"
         },
         {
            "id": 6,
            "name": "Game",
            "service": "game",
            "status": 1,
            "icon": "http://tv.vp9.tv/images/home/game.svg"
         }
      ]
   }
};




CONFIG.ApkUrl = "http://tv.vp9.tv/Vp9Tivi.apk"

CONFIG.DefaultChannel = [
							{"appModel" : CONFIG.VP9_AppPackages[0], "number" : "1"}, 
							{"appModel" : CONFIG.VP9_AppPackages[1], "number" : "2"},
							{"appModel" : CONFIG.VP9_AppPackages[2], "number" : "3"},
							{"appModel" : CONFIG.VP9_AppPackages[3], "number" : "4"},
							{"appModel" : CONFIG.VP9_AppPackages[4], "number" : "5"},
							{"appModel" : CONFIG.VP9_AppPackages[5], "number" : "6"},
						];

/*state khi load app*/
CONFIG.STATE = {
					"NOT_LOADING" : 0,
					"LOADING" : 1,
					"LOADED" : 2
					}
/*so app se load*/
CONFIG.LoadApp = 10;


/*Lay thong tin app VP9 */
CONFIG.getAppVP9FromNetwork = function(result, url){
	var xhr = new XMLHttpRequest();
    xhr.onreadystatechange=function(){
        if (xhr.readyState==4 && xhr.status==200){
            var response = xhr.responseText;
            result = JSON.parse(response);
        }else{
        	result = CONFIG.VP9_AppPackages;
        }
    }
    xhr.open("GET", url, false);
    xhr.send();
}