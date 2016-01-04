OBJ_FILES = bot.js makefileC data/user.js data/channel.js;

update: 
	wget "https://github.com/ChickenStorm/ChickenBot/archive/master.zip";
	unzip master.zip;
	rm master.zip;
	rm -r data;
	mkdir data;
	cp ChickenBot-master/bot.js bot.js;
	cp ChickenBot-master/data/user.js ./data/user.js;
	cp ChickenBot-master/data/channel.js ./data/channel.js;
	cp ChickenBot-master/makefile makefile;
	cp ChickenBot-master/run.sh run.sh;
	rm -r ChickenBot-master;

