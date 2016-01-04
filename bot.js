var http = require('http');
var url = require("url");
var querystring = require('querystring');
var DiscordClient = require('discord.io');
var os = require('os');
var fs = require("fs");
var userList =  require('./data/user.js');
var bot;
var enable = true


var emailBot="";
var passwordBot = "";

fs.readFile('login.txt','ascii', function (err, data) {
	dataTemp= data.split(";");
	emailBot = dataTemp[0];
	passwordBot = dataTemp[1];
	initBot();
});





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
		if (enable) {
		bot.setPresence({
			idle_since: null,
			game: "Status : enable"
		 });
		}
		else{
		bot.setPresence({
			idle_since: Date.now(),
			game: "Status : disable"
		});
	}
	});
	
	/*bot.on('message', function(user, userID, channelID, message, rawEvent) {
	fs.appendFile('message.txt', 'user : '+user +'; userID : '+userID+'; channelID : '+channelID+'; message : '+message+os.EOL, function (err) {
	  if (err) throw err;
	  //console.log('The "data to append" was appended to file!');
	});
	
	});
	
	*/
	
	
	bot.on('message', function(user, userID, channelID, message, rawEvent) {
		
		for(var i in commandManage){
			if (commandManage[i].testInput(user, userID, channelID, message, rawEvent)) {
				commandManage[i].func(user, userID, channelID, message, rawEvent);
			}
		}
		if (enable) {
			
			for(var i in commandList){
				if (commandList[i].testInput(user, userID, channelID, message, rawEvent)) {
					commandList[i].func(user, userID, channelID, message, rawEvent);
				}
			}
			
		}
		
		
	});
	
	
}




/*var server = http.createServer(function(req, res) {
    var page = url.parse(req.url).pathname;
	var params = querystring.parse(url.parse(req.url).query);
	res.writeHead(200, {"Content-Type": "text/plain"});

	
    //console.log(page);
    
    //res.write('Bien le bonjour');
    res.end();
});

server.listen(80);
*/

/***************************************************************************************************************************************************************/
/***************************************************************************************************************************************************************/


function commandC(testInputp,funcp,inputDescriptionp,descrp,showHelpp) {
    this.testInput = testInputp; // fonction de teste sur l'entrée
    this.func = funcp; // fonction a executer
    this.inputDescription= inputDescriptionp; // aide : affiche linput demander
    this.descr = descrp; // aide : afffiche ce que la commande fait
    this.showHelp= showHelpp;// fonction qui déteermine si l'aide
}


truefunc = function(){
    return true
}

var commandList = [new commandC(
				function(user, userID, channelID, message, rawEvent){
				    if(message=="!ping"){
					return true
				    }
				    else{
					return false
				    }
				},
				function(user, userID, channelID, message, rawEvent){
				    bot.sendMessage({
					to: channelID,
					message: "pong"
				    });
				},
				"!ping", "affiche pong",truefunc
				),
		   new commandC(
				function(user, userID, channelID, message, rawEvent){
				    if(message=="!help"){
					    return true
				    }
				    else{
					    return false
				    }
				},
				function(user, userID, channelID, message, rawEvent){
				    
				    for (var i in commandListAll){
					if (commandListAll[i].showHelp(user, userID, channelID, message, rawEvent)) {
					    
					    
					    bot.sendMessage({
						to: channelID,
						message: commandListAll[i].inputDescription + " : "+commandListAll[i].descr
					    });
					}
				    }
				    
				},
				"!help", "affiche la lise des commandes",truefunc
				),
		   new commandC(
				function(user, userID, channelID, message, rawEvent){
				    if(message=="!info"){
					    return true
				    }
				    else{
					    return false
				    }
				},
				function(user, userID, channelID, message, rawEvent){
				    
					    bot.sendMessage({
						to: channelID,
						message: 'user : '+user +'; userID : '+userID+'; channelID : '+channelID+'; message : '+message
					    });
				},
				"!info", "retourne les infos sur le message",truefunc
				),
		   new commandC(
				function(user, userID, channelID, message, rawEvent){
				    if(message=="!mort"){
					    return true
				    }
				    else{
					    return false
				    }
				},
				function(user, userID, channelID, message, rawEvent){
					bot.sendMessage({
					    to: channelID,
					    message: "A MORT HELIOR"
					});
				},
				"!mort", "A MORT HELIOR",truefunc
				)
		   


]

var commandManage = [
		    new commandC(
				function(user, userID, channelID, message, rawEvent){
				    if(message=="!enable" && userList.isModo(userID)){
					    return true
				    }
				    else{
					    return false
				    }
				},
				function(user, userID, channelID, message, rawEvent){
				    
				    enable = true;
				    bot.sendMessage({
					to: channelID,
					message: "enable"
				    });
				    bot.setPresence({
					 idle_since: null,
					game: "Status : enable"
				    });
				},
				"!enable", "active le bot (modo)",function(user, userID, channelID, message, rawEvent){return userList.isModo(userID) || userList.isAdmin(userID)}
				),
		   new commandC(
				function(user, userID, channelID, message, rawEvent){
				    if(message=="!disable" && userList.isModo(userID)){
					    return true
				    }
				    else{
					    return false
				    }
				},
				function(user, userID, channelID, message, rawEvent){
				    
				    enable = true;
				    bot.sendMessage({
					to: channelID,
					message: "sleeping"
				    });
				    bot.setPresence({
					 idle_since: Date.now(),
					game: "Status : disable"
				    });
				    
				},
				"!disable", "desactive le bot (modo)",function(user, userID, channelID, message, rawEvent){return userList.isModo(userID) || userList.isAdmin(userID)}
				),
		   new commandC(
				function(user, userID, channelID, message, rawEvent){
				    if(message=="!exit" && userList.isAdmin(userID)){
					    return true
				    }
				    else{
					    return false
				    }
				},
				function(user, userID, channelID, message, rawEvent){
				    
				    enable = true;
				    bot.sendMessage({
					to: channelID,
					message: "stopping"
				    });
				    bot.setPresence({
					idle_since: Date.now(),
					game: "Status : stop"
				});
				setTimeout("process.exit()", 1000); // ça généère une erreur :(

				},
				"!exit", "arrête le bot (admin)",function(user, userID, channelID, message, rawEvent){return userList.isAdmin(userID)}
				)
]

commandListAll = commandList.concat(commandManage);
