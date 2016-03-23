var request = require('request');
var $       = require('jquery');
var _       = require("underscore");
var S       = require('string');
var jsdom   = require('jsdom');

var startURL    = 'http://www.rentomojo.com';
var host        = 'http://www.rentomojo.com';
var blocked     = [];
var totalDepth  = 5;

var urls        = [];
var ignored     = [];
var results     = [];
var counter     = 0;

processURL(startURL,totalDepth);

function processURL(url,depth) {

    request(url, function (error, response, html) {

      if (!error && response.statusCode == 200) {

        var title = html.match("<title>(.*?)</title>");
            title=title ? title[1] : '';


        var myURL=url;
        myURL = myURL.split(',').join(' ');
        title = title.split(',').join(' ');
        displayURL = myURL.replace(host,'');
        results.push(myURL + ',' + title);
        counter++;

        if(results.length==100) {
            saveResults();
        }


        // if(depth>0) {
        //     jsdom.env({
        //         html: html,
        //         scripts: ['http://code.jquery.com/jquery-1.7.min.js']
        //         }, function (err, window) {
        //         var $ = window.jQuery;
        //         if($!=undefined) {
        //         $('a').each(function() {
        //             var href=$(this).attr('href');
        //             href=fixURL(href);
        //             if(checkURL(href)) {
        //                 addToQueue(href,depth-1);                       
        //             } 
        //         })
        //       }
        //     });
        // }
    }   
});
}

var int=setInterval(function(){checkExit()},10000);

function checkExit() {

    if(results.length==0) {
        process.exit();
    }
    saveResults();
}

function checkURL(url) {

    if(url==undefined) return false;
    if(url=='')  return false;
    if(url=='#') return false;
    if(url=='')  return false;
    if(url=='/') return false;
    if(S(url).startsWith('#')) return false;
    if(url.indexOf('javascript')==0) return false;

    if(url.indexOf("/")==0) {
        url=host+url;
    }

    if(_.contains(urls,url)) {        
        return false;
    }

    if(_.contains(ignored,url)) {        
        return false;
    }    

    $.each(blocked,function(i,d) {
        if(S(url).contains(d)) {
            ignored.push(url);
            return false;
        }
    })

    if(url.indexOf('http')==0) {
        if(S(url).startsWith(host)) {
            return true;
    }   else
            return false;
    }

    return true;                  
}

function addToQueue(url,depth) {

    if(_.contains(urls,url)) {        
        return false;
    }

    if(url.indexOf("/")==0) {
        url=host+url;
    }

    if(!validURL(url)) {
        return;
    }

    processURL(url,depth);
    urls.push(url); 

}

function saveResults() {
    var csv = '';
    $.each(results,function(i,d) {
        csv+=d + '\n';
    })
    writeData(csv);
    results = [];
}

function writeData(data) {
    var fs = require('fs');    
    fs.appendFile(__dirname+'/results.csv', data, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("******The file was saved!******");            
        }
    }); 
}

function validURL(value) {
    var urlregex = new RegExp("^(http:\/\/www.|https:\/\/www.|ftp:\/\/www.|www.){1}([0-9A-Za-z]+\.)");
    if (urlregex.test(value)) {
        return (true);
    }
    return (false);
}

function fixURL(url) {
    if(url==undefined) return '';
    if(url.indexOf("/")==0) {
        return host+url;
    } else {
        return url;
    }
}
