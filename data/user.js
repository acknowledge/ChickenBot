function userC (userIDp,namep,isAdminp,isModop,isBanp,mpChannelIDp){
    this.userID =userIDp; // user id de la presonne
    this.name = namep; // son pesudo
    this.isAdmin = isAdminp; // est admin
    this.isModo = isModop; // est modo
    this.isBan = isBanp; // est ban
    this.mpChannelID = mpChannelIDp || "" // son chanel de mp avec le bot
    
}


userList = [new userC("93784478299725824","ChickenStorm",true,true,false,"133315338774380544"),
		    new userC("132783770532184064","Oxymore",true,true,false,""),
		    new userC("128272446259200000","luneverte",false,true,false,""),
		    new userC("132931838841716736","Sufx et Whab",false,true,false),
		    new userC("92374890794975232","Liador",true,true,false,""),
		    new userC("127830681492520960","Zahius",false,true,false,"")
		    ]
exports.users = userList;

exports.isAdmin = function(userID){
    retrunval = false;
	
	for(var i in userList){
	    
		if (userID ==userList[i].userID ) {
		    
			return userList[i].isAdmin;
		}
	}
	
	return retrunval;
}
exports.isModo = function(userID){
     retrunval = false;
	
	for(var i in userList){
		if (userID ==userList[i].userID ) {
			return userList[i].isModo;
		}
	}
	
	return retrunval;
}

exports.isBan = function(userID){
    retrunval = false;
	
	for(var i in userList){
		if (userID ==userList[i].userID ) {
			return userList[i].isBan;
		}
	}
	
	return retrunval;
}
