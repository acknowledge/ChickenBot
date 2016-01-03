var http = require('http');
var url = require("url");
var querystring = require('querystring');
var DiscordClient = require('discord.io');
var os = require('os');
var fs = require("fs");
var bot;
var enable = true

var suUser=["ChickenStorm","Liador","Oxymore"];

var emailBot="";
var passwordBot = "";

fs.readFile('login.txt','ascii', function (err, data) {
	dataTemp= data.split(";");
	emailBot = dataTemp[0];
	passwordBot = dataTemp[1];
	initBot();
});



var commandList = [
{
input: function(user, userID, channelID, message, rawEvent){
	if(message=="!ping"){
		return true
	}
	else{
		return false
	}
	},
func: function(user, userID, channelID, message, rawEvent){
	bot.sendMessage({
            to: channelID,
            message: "pong"
        });
	},
descr:"affiche pong",
inp :"!ping"
},
{
input: function(user, userID, channelID, message, rawEvent){
	if(message=="!help"){
		return true
	}
	else{
		return false
	}
	},
func: function(user, userID, channelID, message, rawEvent){
	
	for (var i in commandList){
		bot.sendMessage({
		    to: channelID,
		    message: commandList[i].inp + " : "+commandList[i].descr
		});
	}
	},
descr:" affiche la lise des commandes",
inp :"!help",
},
{
input: function(user, userID, channelID, message, rawEvent){
	if(message=="!info"){
		return true
	}
	else{
		return false
	}
	},
func: function(user, userID, channelID, message, rawEvent){
	bot.sendMessage({
            to: channelID,
            message: 'user : '+user +'; userID : '+userID+'; channelID : '+channelID+'; message : '+message
        });
	},
descr:" retourne les infos sur le message",
inp :"!info",
},
{
input: function(user, userID, channelID, message, rawEvent){
	if(message=="!mort"){
		return true
	}
	else{
		return false
	}
	},
func: function(user, userID, channelID, message, rawEvent){
	bot.sendMessage({
            to: channelID,
            message: "A MORT HELIOR"
        });
	},
descr:"A MORT HELIOR",
inp :"!mort",
},

]

function initBot(){
		
	
	bot = new DiscordClient({
	    autorun: true,
	    email: emailBot,
	    password: passwordBot,
	    //OR
	    token: ""
	});
	
	
	bot.on('ready', function() {
	    console.log(bot.username + " - (" + bot.id + ")");
		/*bot.sendMessage({
		    to: "133235989429616641",
		    message: "str"
		});*/
	});
	
	bot.on('message', function(user, userID, channelID, message, rawEvent) {
	fs.appendFile('message.txt', 'user : '+user +'; userID : '+userID+'; channelID : '+channelID+'; message : '+message+os.EOL, function (err) {
	  if (err) throw err;
	  //console.log('The "data to append" was appended to file!');
	});
	
	});
	
	
	/*function sendmsg(str){
	bot.sendMessage({
		    to: "133235989429616641",
		    message: str
		});
	}*/
	
	
	
	bot.on('message', function(user, userID, channelID, message, rawEvent) {
		if (message == "!enable" && isSu(user) ) {
			enable = true;
			bot.sendMessage({
				to: channelID,
				message: "enable"
		});
		}
		else if (message == "!disable" && isSu(user)) {
			enable = false;
			bot.sendMessage({
				to: channelID,
				message: "sleeping"
		});
		}
		else if (message == "!exit" && isSu(user)) {
		enable = false;
		bot.sendMessage({
				to: channelID,
				message: "stoping"
		});
		setTimeout("process.exit()", 1000); // ça généère une erreur :(
		// mais au moins ça quitte après avoir envoyer le message "stoping"
		
		}
		
		if (enable) {
			
			for(var i in commandList){
				if (commandList[i].input(user, userID, channelID, message, rawEvent)) {
					commandList[i].func(user, userID, channelID, message, rawEvent);
				}
			}
			
		}
		
		
	});
}

function isSu(user){
		retrunval = false;
		
		for(var i in suUser){
			if (suUser[i] == user) {
				retrunval=true;
			}
		}
		
		return retrunval;
	}
/*bot.on('message', function(user, userID, channelID, message, rawEvent) {
    if (message === "ping") {
        bot.sendMessage({
            to: channelID,
            message: "pong"
        });
    }
	else if (message === "!info") {
        bot.sendMessage({
            to: channelID,
            message: user + ' '+userID + ' '+channelID+' '+message + ' '+ rawEvent
        });
    }
	else if (message === "!test") {
        bot.sendMessage({
            to: channelID,
            message: "testing testing"
        });
    }
	
	
	else if(message=="!"){
	bot.sendMessage({
            to: channelID,
            message: "A MORT helior"
        });
	}

});*/
/*
var server = http.createServer(function(req, res) {
    var page = url.parse(req.url).pathname;
	var params = querystring.parse(url.parse(req.url).query);
	res.writeHead(200, {"Content-Type": "text/plain"});
	 sendmsg("page")
	
    //console.log(page);
    
    //res.write('Bien le bonjour');
    res.end();
});

server.listen(8080);*/
