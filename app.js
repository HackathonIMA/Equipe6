// Express settings
var express = require('express');
var bodyParser = require('body-parser');
var Q = require('q');
var mysql = require('mysql');


var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'root',
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

    if(query.ano === undefined || query.ano === null || query.ano.length == 0) {
      return res.status(400).json({
        CODE: "CAMPO_ANO_FALTANDO"
      });
    }

    var queryString;

    if(query.option == 'previsto') {
      queryString = "SELECT	naturezas.naturezaReceita, "+
								"naturezas.descricao AS DESCRICAO, "+
								"(receitas.valorPrevisao + receitas.valorPrevisaoAcrescimo) as VALOR_PREVISTO, "+
								"(receitas.valorRealizado + receitas.valorRealizadoAcrescimo) as VALOR_RECEBIDO, "+
								"((receitas.valorPrevisao + receitas.valorPrevisaoAcrescimo) - (receitas.valorRealizado + receitas.valorRealizadoAcrescimo)) as VALOR_A_RECEBER "+
					"FROM naturezas "+
					"LEFT JOIN receitas ON naturezas.naturezaReceita = receitas.naturezaReceita "+
					"WHERE substring(receitas.anoMesEmissao, 1, 4) = " + query.ano + " "
					"GROUP BY naturezas.naturezaReceita "+
					"ORDER BY VALOR_RECEBIDO DESC "+
					"LIMIT 0,10;";
    } else if(query.option == 'recebido') {
      queryString = "SELECT naturezas.naturezaReceita, "+
							"naturezas.descricao AS DESCRICAO, "+
							"(receitas.valorPrevisao + receitas.valorPrevisaoAcrescimo) as VALOR_PREVISTO, "+
							"(receitas.valorRealizado + receitas.valorRealizadoAcrescimo) as VALOR_RECEBIDO, "+
							"((receitas.valorPrevisao + receitas.valorPrevisaoAcrescimo) - (receitas.valorRealizado + receitas.valorRealizadoAcrescimo)) as VALOR_A_RECEBER "+
					"FROM naturezas "+
					"LEFT JOIN receitas ON naturezas.naturezaReceita = receitas.naturezaReceita "+
					"WHERE substring(receitas.anoMesEmissao,1,4) = " + query.ano + " "
					"GROUP BY naturezas.naturezaReceita "+
					"ORDER BY VALOR_RECEBIDO DESC "+
					"LIMIT 0,10;";
    }

    connection.query(queryString, function(err, rows, fields) {
        if (err) throw err;

        if(query.graph == "arrays") {
          var labels = [];
          var previsto = [];
          var areceber = [];
          var recebido = [];

          rows.map(function(items) {
            labels.push(items.descricao);
            previsto.push(items.VALOR_PREVISTO);
            areceber.push(items.VALOR_RECEBIDO);
            recebido.push(items.VALOR_A_RECEBER);
          });

          res.status(200).json({
            labels : labels,
            previsto: previsto,
            areceber: areceber,
            recebido: recebido
          });
        } else {
            res.status(200).json(rows);
        }
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
