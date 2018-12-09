const express = require('express');
var bodyParser = require('body-parser');
var DataBase = require('./database');

var db = new DataBase();

var jsonParser = bodyParser.json(); // Для парсу тіла запиту
const app = express();

app.listen(3000, function() {
	console.log('listening on 3000')
});
// Для дозволу крос-доменних запитів
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
	res.header('Access-Control-Allow-Credentials', 'true');
	res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
	res.header('Access-Control-Expose-Headers', 'Content-Length');
	res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
	if (req.method === 'OPTIONS') {
		return res.sendStatus(200);
	} else {
		return next();
	}
});

app.get('/currency', function (req, res) {
	res.setHeader('Content-Type', 'application/json');
	db.getCollection('currency', function (error, result) {
		if (!error) {
			res.status(200).send(JSON.stringify(result));
		} else {
			res.status(400).send(JSON.stringify({"error": error}));
		}
	});
});

app.get('/operation', function (req, res) {
	res.setHeader('Content-Type', 'application/json');
	db.getCollection('operations', function (error, result) {
		if (!error) {
			res.status(200).send(JSON.stringify(result));
		} else {
			res.status(400).send(JSON.stringify({"error": error}));
		}
	})
});

app.post('/operation', jsonParser, function (req, res) {
	res.setHeader('Content-Type', 'application/json');
	db.insertToCollection('operations', req.body, function (error, result) {
		if (!error) {
			res.status(200).send(JSON.stringify(result));
		} else {
			res.status(400).send(JSON.stringify({"error": error}));
		}
	})
});

app.delete('/operation', jsonParser, function (req, res) {
	res.setHeader('Content-Type', 'application/json');
	db.removeFromCollection('operations', req.body.id, function (error, result) {
		if (!error) {
			res.status(200).send(JSON.stringify(result));
		} else {
			res.status(400).send(JSON.stringify({"error": error}));
		}
	})
});

app.get('/group_by_currency', function (req, res) {
	res.setHeader('Content-Type', 'application/json');
	db.groupByCurrency(function (error, result) {
		if (error) {
			res.status(400).send(JSON.stringify({"error": error}));
		} else {
			try {
				result.toArray(function (err, array) {
					res.status(200).send(JSON.stringify(array));
				});
			} catch (e) {
				res.status(400).send(JSON.stringify({'error': e.message}));
			}
		}
	})
});

app.get('/great_spendings', function (req, res) {
	res.setHeader('Content-Type', 'application/json');
	db.greatSpending(function (error, result) {
		if (error) {
			res.status(400).send(JSON.stringify({"error": error}));
		} else {
			try {
				result.toArray(function (err, array) {
					res.status(200).send(JSON.stringify(array));
				});
			} catch (e) {
				res.status(400).send(JSON.stringify({'error': e.message}));
			}
		}
	})
});

app.get('/convert_uah', function (req, res) {
	res.setHeader('Content-Type', 'application/json');
	db.convertIntoUah(function (error, result) {
		if (error) {
			res.status(400).send(JSON.stringify({"error": error}));
		} else {
			try {
				result.toArray(function (err, array) {
					res.status(200).send(JSON.stringify(array));
				});
			} catch (e) {
				res.status(400).send(JSON.stringify({'error': e.message}));
			}
		}
	})
});

