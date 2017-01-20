
var fs=require('fs');
var HashMap = require('hashmap').HashMap;
var logfile='/Users/micmiu/Downloads/shjc.log';

var readline = require('readline');
var rl = readline.createInterface({
  input: fs.createReadStream(logfile,{
      enconding:'utf8'
  }),
  output: process.stdout,
  terminal: false
});

var hashmap = new HashMap();
rl.on('line',function(line){
    if(line.indexOf('Response')>0){
    	var ids = line.substring(line.indexOf('<succeKeys>')+11,line.indexOf('</succeKeys>'))
        var idarr = ids.split(',');
        for (var i=0, l=idarr.length; i<l; i++){
        	if(hashmap.has(idarr[i])){
        		hashmap.set(idarr[i],hashmap.get(idarr[i])+1);
        	}else{
        		hashmap.set(idarr[i],0);
        	}
        }
     }
});
rl.on("close", function(){
	var dupcount = 0 ;
   hashmap.forEach(function(value, key) {
        if(value >1){
        		console.log(key + " : " + value);
        		dupcount+=value;
        }
	});
   console.log("duplicate count =" +" : " + dupcount);
    process.exit(0);
});
     

