/*
Copyright 2016 ChickenStorm


This file is part of Chicken Bot.

    Foobar is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Chicken Bot is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.

*/

var http = require('http');
var url = require("url");
var querystring = require('querystring');
var DiscordClient = require('discord.io');
var os = require('os');
var fs = require("fs");
var userList =  require('./data/user.js');
/******************************************************************/
var bot;
var enable = true;
var forceEnable = false; //
var forceDisable = false; // au mieux les deux ne sont pas a true en même temps
// sinon c'est forceDisable qui prime
var statusRefreshIntervalRef;
var statusRefreshInterval = 1000000 ; //in millisecond (1000 sec => 16.6667 minutes)
var emailBot="";
var passwordBot = "";

/*********************************************************************/



fs.readFile('login.txt','ascii', function (err, data) { // lit les login du bot
	dataTemp= data.split(";");
	emailBot = dataTemp[0];
	passwordBot = dataTemp[1];
	initBot();
});



/*******************************************************************/

function initBot(){ // initilisation du bot et des différents callbacks
		
	
	bot = new DiscordClient({ // login
	    autorun: true,
	    email: emailBot,
	    password: passwordBot,
	    //OR
	    token: ""
	});
	
	
	switchStatusMessage = function (){ // change le message du bot (sous playing) selon les différents types d'activation
		if (enable) {
			bot.setPresence({
				idle_since: null,
				game: "Status : enable (online)"
			 });
		}
		else{
			bot.setPresence({
				idle_since: Date.now(),
				game: "Status : disable (online)"
			});
		}
		if (forceEnable) {
			bot.setPresence({
				idle_since: null,
				game: "Status : Force enable (online)"
			});
		}
		if (forceDisable) {
			bot.setPresence({
				idle_since: Date.now(),
				game: "Status : Force disable (online)"
			});
		}
	}

	
	bot.on('ready', function() { // quand le bot est pret 
		console.log(bot.username + " - (" + bot.id + ")");
		switchStatusMessage();
		clearInterval(statusRefreshIntervalRef);
		statusRefreshIntervalRef = setInterval(function(){switchStatusMessage();},statusRefreshInterval);
	});
	
	/*bot.on('message', function(user, userID, channelID, message, rawEvent) {
	fs.appendFile('message.txt', 'user : '+user +'; userID : '+userID+'; channelID : '+channelID+'; message : '+message+os.EOL, function (err) {
	  if (err) throw err;
	  //console.log('The "data to append" was appended to file!');
	});
	
	});
	
	*/
	
	
	bot.on('message', function(user, userID, channelID, message, rawEvent) {
		
		for(var i in commandManage){ // regarde sur les commandes qui ne sont pas désactivées même si le bot est désactivé
			if (commandManage[i].testInput(user, userID, channelID, message, rawEvent)) {
				commandManage[i].func(user, userID, channelID, message, rawEvent); // exécute la commande si la condition correcte est verifiée
			}
		}
		if ((enable || forceEnable) && !forceDisable) { // si le bot est activé ou qu'il est forcé d'être activé et qu'il n'est pas forcé d'être désactivé 
			
			for(var i in commandList){
				if (commandList[i].testInput(user, userID, channelID, message, rawEvent)) {
					commandList[i].func(user, userID, channelID, message, rawEvent); // exécute la commande si la condition correcte est verifiée
				}
			}
			
		}
		
	});
	
	
}



// peux être utiliser ça comme interface admin du bot

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

// object commande
function commandC(testInputp,funcp,inputDescriptionp,descrp,showHelpp) {
    this.testInput = testInputp; // fonction de test sur l'entrée
    this.func = funcp; // fonction a executer
    this.inputDescription= inputDescriptionp; // aide : affiche l'input demandé
    this.descr = descrp; // aide : afffiche ce que la commande fait
    this.showHelp= showHelpp; // fonction qui détermine si l'aide
}


truefunc = function(){ // retourne toujours vrai
    return true
}
// liste des commandes
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
				    var messageTemp = "";
				    for (var i in commandListAll){
					if (commandListAll[i].showHelp(user, userID, channelID, message, rawEvent)) {
					    messageTemp += commandListAll[i].inputDescription + " : "+commandListAll[i].descr+"\n"
					    
					    
					}
				    }
				    bot.sendMessage({
						to: channelID,
						message: messageTemp
					    });
				    
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
				),
		   new commandC(
				function(user, userID, channelID, message, rawEvent){
				    if(message=="!about"){
					    return true
				    }
				    else{
					    return false
				    }
				},
				function(user, userID, channelID, message, rawEvent){
					bot.sendMessage({
					    to: channelID,
					    message: "Bonjour, je suis Chicken Bot.\n\n j'ai été créé le 3 janvier 2016 par ChickenStorm pour le serveur Asylamba 2.0 sur Discord.\n\n"+
					    "Mon dépôt git se trouve sous https://github.com/ChickenStorm/ChickenBot\n\n entrez \"!help\" pour voir la liste de mes commandes"
					    
					});
				},
				"!about", "à propos de ce bot",truefunc
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
				    /*bot.setPresence({
					 idle_since: null,
					game: "Status : enable"
				    });*/
				    switchStatusMessage();
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
				    
				    enable = false;
				    bot.sendMessage({
					to: channelID,
					message: "sleeping"
				    });
				    /*bot.setPresence({
					 idle_since: Date.now(),
					game: "Status : disable"
				    });*/
				    switchStatusMessage();
				    
				},
				"!disable", "désactive le bot (modo)",function(user, userID, channelID, message, rawEvent){return userList.isModo(userID) || userList.isAdmin(userID)}
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
					game: "Status : stop (offline)"
				});
				setTimeout(function(){process.exit(0)}, 1000); // ça généère une erreur :(

				},
				"!exit", "arrête le bot (admin)",function(user, userID, channelID, message, rawEvent){return userList.isAdmin(userID)}
				),
		    new commandC(
				function(user, userID, channelID, message, rawEvent){
				    if(message=="!forceEnableToggle" && userList.isAdmin(userID)){
					    return true
				    }
				    else{
					    return false
				    }
				},
				function(user, userID, channelID, message, rawEvent){
				    
				    forceEnable = !forceEnable;
				    
				    if (forceEnable) {
					bot.sendMessage({
						to: channelID,
						message: "forceEnable on"
					});
					forceDisable = false;
				    }
				    else{
					bot.sendMessage({
						to: channelID,
						message: "forceEnable off"
					});
				    }
				    switchStatusMessage();
				    
				},
				"!forceEnableToggle", "change si le bot est forcé à être activé (admin)",function(user, userID, channelID, message, rawEvent){return userList.isAdmin(userID)}
				),
		    new commandC(
				function(user, userID, channelID, message, rawEvent){
				    if(message=="!forceDisableToggle" && userList.isAdmin(userID)){
					    return true
				    }
				    else{
					    return false
				    }
				},
				function(user, userID, channelID, message, rawEvent){
				    
				    forceDisable = !forceDisable;
				    
				    if (forceEnable) {
					bot.sendMessage({
						to: channelID,
						message: "forceDisable on"
					});
					forceEnable = false;
				    }
				    else{
					bot.sendMessage({
						to: channelID,
						message: "forceDisable off"
					});
				    }
				    switchStatusMessage();
				    
				

				},
				"!forceDisableToggle", "change si le bot est forcé à être désactivé (admin)",function(user, userID, channelID, message, rawEvent){return userList.isAdmin(userID)}
				)
]

commandListAll = commandList.concat(commandManage); // toute les commandes
