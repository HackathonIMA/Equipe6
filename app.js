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
    var query = req.query;
    var queryString;
    if(query.option == 'PREVISTO') {
      queryString = 'SELECT naturezas.descricao, (receitas.valorPrevisao + receitas.valorPrevisaoAcrescimo) as VALOR_PREVISTO, (receitas.valorRealizado + receitas.valorRealizadoAcrescimo) as VALOR_RECEBIDO, ((receitas.valorPrevisao + receitas.valorPrevisaoAcrescimo) - (receitas.valorRealizado + receitas.valorRealizadoAcrescimo)) as VALOR_A_RECEBER FROM naturezas LEFT JOIN receitas ON naturezas.naturezaReceita = receitas.naturezaReceita WHERE substring(receitas.anoMesEmissao,1,4) > 2014 ORDER BY VALOR_PREVISTO DESC LIMIT 10';
    } else if(query.option == 'RECEBIDO') {
      queryString = 'SELECT naturezas.descricao, (receitas.valorPrevisao + receitas.valorPrevisaoAcrescimo) as VALOR_PREVISTO, (receitas.valorRealizado + receitas.valorRealizadoAcrescimo) as VALOR_RECEBIDO, ((receitas.valorPrevisao + receitas.valorPrevisaoAcrescimo) - (receitas.valorRealizado + receitas.valorRealizadoAcrescimo)) as VALOR_A_RECEBER FROM naturezas LEFT JOIN receitas ON naturezas.naturezaReceita = receitas.naturezaReceita WHERE substring(receitas.anoMesEmissao,1,4) > 2014 ORDER BY VALOR_RECEBIDO DESC LIMIT 10';
    } else if(query.option == 'ARECEBER') {
      queryString = 'SELECT naturezas.descricao, (receitas.valorPrevisao + receitas.valorPrevisaoAcrescimo) as VALOR_PREVISTO, (receitas.valorRealizado + receitas.valorRealizadoAcrescimo) as VALOR_RECEBIDO, ((receitas.valorPrevisao + receitas.valorPrevisaoAcrescimo) - (receitas.valorRealizado + receitas.valorRealizadoAcrescimo)) as VALOR_A_RECEBER FROM naturezas LEFT JOIN receitas ON naturezas.naturezaReceita = receitas.naturezaReceita WHERE substring(receitas.anoMesEmissao,1,4) > 2014 ORDER BY VALOR_A_RECEBER DESC LIMIT 10';
    }
    
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
