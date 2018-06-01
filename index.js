var inputTopic = process.argv[2];
var ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
var ffmpeg = require("fluent-ffmpeg");
var createReadStream = require("streamifier").createReadStream;
var querystring = require("querystring");
var request = require("request");
ffmpeg.setFfmpegPath(ffmpegPath);
var video = ffmpeg();

function getWikipediaFirstParagraphText(topic) {
	return new Promise(function(resolve, reject) {
		request("http://en.wikipedia.org/w/api.php?" + querystring.stringify({
			action: "query",
			prop: "extracts",
			format: "json",
			exintro: "",
			explaintext: "",
			titles: topic
		})), function(error, response, body) {
			var pages = JSON.parse(body).query.pages;
			var bodytext;
			for (var prop in pages) {
				if (pages.hasOwnProperty(prop)) {
					bodytext = pages[prop].extract;
					break;
				}
			}
			resolve(bodytext);
		});
	});
}
