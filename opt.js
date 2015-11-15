var express = require('express');
var app = express();

app.use(express.static('public'));

/* set up jade templating */
app.set('views', './views');
app.set('view engine', 'jade');

var rootDir = '/home/jacob/Documents/code/mtg_opt/';

app.get('/', (req, res) => {
	res.render('index');
});

app.get('/origins', (req,res) => {
	var options = {
		root: rootDir
	};
	res.sendFile('public/card_data/ori.json', options);
});

var server = app.listen(3000, () => {
	var host = server.address().address;
	var port = server.address().port;
	console.log('app listening at http://%s:%s', host, port);
});
