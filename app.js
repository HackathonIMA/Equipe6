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
app.use('/',express.static('cliente'));
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
								"SUM(receitas.valorRealizado + receitas.valorRealizadoAcrescimo) as VALOR_RECEBIDO, "+
								"((receitas.valorPrevisao + receitas.valorPrevisaoAcrescimo) - (receitas.valorRealizado + receitas.valorRealizadoAcrescimo)) as VALOR_A_RECEBER "+
					"FROM naturezas "+
					"LEFT JOIN receitas ON naturezas.naturezaReceita = receitas.naturezaReceita "+
					"WHERE substring(receitas.anoMesEmissao, 1, 4) = ? "+
					"GROUP BY naturezas.naturezaReceita "+
					"ORDER BY VALOR_PREVISTO DESC "+
					"LIMIT 0,10;";
    } else if(query.option == 'recebido') {
      queryString = "SELECT naturezas.naturezaReceita, "+
							"naturezas.descricao AS DESCRICAO, "+
							"(receitas.valorPrevisao + receitas.valorPrevisaoAcrescimo) as VALOR_PREVISTO, "+
							"SUM(receitas.valorRealizado + receitas.valorRealizadoAcrescimo) as VALOR_RECEBIDO, "+
							"((receitas.valorPrevisao + receitas.valorPrevisaoAcrescimo) - (receitas.valorRealizado + receitas.valorRealizadoAcrescimo)) as VALOR_A_RECEBER "+
					"FROM naturezas "+
					"LEFT JOIN receitas ON naturezas.naturezaReceita = receitas.naturezaReceita "+
					"WHERE substring(receitas.anoMesEmissao,1,4) = ? "+
					"GROUP BY naturezas.naturezaReceita "+
					"ORDER BY VALOR_RECEBIDO DESC "+
					"LIMIT 0,10;";
    } else if(query.option == 'despesa_funcao') {
			queryString = "SELECT SUM(d.ValorEmpenhoNM) TOTAL, "+
										"TRIM(f.FuncaoDESC) DESCRICAO "+
							"FROM ptr_ft_despesa d "+
							"INNER JOIN ptr_lkp_ne e ON d.NotaEmpenhoID=e.EmpenhoID "+
							"INNER JOIN ptr_lkp_funcao f ON e.FuncaoID=f.FuncaoID "+
							"WHERE SUBSTRING(d.MesEmissaoID, 1, 4) = ? "+
							"GROUP BY f.FuncaoDESC "+
							"ORDER BY Total DESC "+
							"LIMIT 0,10;";
	} else if(query.option == 'despesa_subfuncao') {
		queryString = "SELECT	SUM(d.ValorEmpenhoNM) TOTAL, "+
								"TRIM(sf.SubFuncaoDESC) DESCRICAO "+
						"FROM ptr_ft_despesa d "+
						"INNER JOIN ptr_lkp_projeto_atividade pa ON d.ProjetoAtividadeID=pa.ProjetoAtividadeID "+
						"INNER JOIN ptr_lkp_subfuncao sf ON pa.SubFuncaoID=sf.SubFuncaoID "+
						"WHERE SUBSTRING(d.MesEmissaoID, 1, 4) = ? "+
						"GROUP BY sf.SubFuncaoDESC "+
						"ORDER BY Total DESC "+
						"LIMIT 0,10;";
	} else if(query.option == 'despesa_programa') {
		queryString = "SELECT	SUM(d.ValorEmpenhoNM) TOTAL, "+
								"SUBSTRING(TRIM(p.ProgramaDESC), 1, 40) DESCRICAO "+
					"FROM ptr_ft_despesa d "+
					"INNER JOIN ptr_lkp_projeto_atividade pa ON d.ProjetoAtividadeID=pa.ProjetoAtividadeID "+
					"INNER JOIN ptr_lkp_programa p ON pa.ProgramaID=p.ProgramaID "+
					"WHERE SUBSTRING(d.MesEmissaoID, 1, 4) = ? "+
					"GROUP BY p.ProgramaDESC "+
					"ORDER BY Total DESC "+
					"LIMIT 0,10;";
	}

    connection.query(queryString, [query.ano], function(err, rows, fields) {
        if (err) throw err;

        if(query.graph == "arrays") {
          var labels = [];
          var previsto = [];
          var areceber = [];
          var recebido = [];
		  var despesa = [];
			
		  if(query.option == 'despesa_funcao' || query.option == 'despesa_subfuncao' || query.option == 'despesa_programa') {
			  rows.map(function(items) {
				labels.push(items.DESCRICAO);
				despesa.push(items.TOTAL);
			  });

			  res.status(200).json({
				labels : labels,
				despesa : despesa
			  });
		  } else {
			  rows.map(function(items) {
				labels.push(items.DESCRICAO);
				previsto.push(items.VALOR_PREVISTO);
				recebido.push(items.VALOR_RECEBIDO);
			  });

			  res.status(200).json({
				labels : labels,
				previsto: previsto,
				recebido: recebido
			  });
		  }
			
          
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
