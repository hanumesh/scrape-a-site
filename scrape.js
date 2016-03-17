var request = require("request");
var cheerio = require("cheerio");
var fs = require('fs');

	request({
			uri: "http://www.rentomojo.com",
		}, function(error, response, body) {

			var $ = cheerio.load(body);
			var hrefs = [];
				
			$("link").each(function() {
				var link = $(this);
				var href = link.attr("href");
				hrefs.push(href)
			});

			fs.writeFile('hrefs.csv', hrefs, 'utf8', function(err) {
				if (err) {
					console.log('file is either not saved or corrupted file is saved.');
				} else {
					console.log('href link saved onto file');
				}
			});
		});
	