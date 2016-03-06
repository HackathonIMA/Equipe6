// Express settings
var express = require('express');
var bodyParser = require('body-parser');
var Q = require('q');
var mysql = require('mysql');


var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'bolacha0153',
  database : 'hackaton'
});
connection.connect();


var app = express();

// Start everything up
app.use(require('cors')());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());

// Routes
var router = express.Router();

router.route('/receitas')
	.get(function (req, res) {
    var queryString = 'SELECT NATUREZAS.descricao, (RECEITAS.valorPrevisao + RECEITAS.valorPrevisaoAcrescimo) as VALOR_PREVISTO, (RECEITAS.valorRealizado + RECEITAS.valorRealizadoAcrescimo) as VALOR_RECEBIDO, ((RECEITAS.valorPrevisao + RECEITAS.valorPrevisaoAcrescimo) - (RECEITAS.valorRealizado + RECEITAS.valorRealizadoAcrescimo)) as VALOR_A_RECEBER FROM NATUREZAS LEFT JOIN RECEITAS ON NATUREZAS.naturezaReceita = RECEITAS.naturezaReceita WHERE substring(RECEITAS.anoMesEmissao,1,4) > 2014';
    connection.query(queryString, function(err, rows, fields) {
        if (err) throw err;
        res.status(200).json(rows);
    });
});

app.use(router);

// Start Server
var server = require('http').createServer(app);
server.listen(3001, process.env.IP, function() {
	console.log('Express server listening on %d, in %s mode', process.env.PORT || 3001, app.get(
		'env'));
});
exports.app = app;
