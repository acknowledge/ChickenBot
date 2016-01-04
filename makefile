OBJ_FILES = bot.js makefileC data/user.js data/channel.js;

update : 
    wget "https://github.com/ChickenStorm/ChickenBot/archive/master.zip";
    unzip master.zip;
    rm master.zip;
    OBJ_FILES;
    rm -r ChickenBot-master;
    

%.js :
     cp ChickenBot-master\%.js %.js
%.txt :
     cp ChickenBot-master\%.txt %.txt
makefileC :
    cp ChickenBot-master\makefile makefile
