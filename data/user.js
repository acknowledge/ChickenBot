function userC (userIDp,namep,isAdminp,isModop,isBanp,mpChannelIDp){
    this.userID =userIDp;
    this.name = namep;
    this.isAdmin = isAdminp;
    this.isModo = isModop;
    this.isBan = isBanp;
    this.mpChannelID = mpChannelIDp || ""
    
}


userList = [new userC("93784478299725824","ChickenStorm",true,true,false,"133315338774380544"),
		    new userC("132783770532184064","Oxymore",true,true,false,""),
		    new userC("128272446259200000","luneverte",false,true,false,"")
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
