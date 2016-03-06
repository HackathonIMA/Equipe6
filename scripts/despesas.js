var request = require('request');
var Q = require('q');

var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'root',
  database : 'hackaton'
});

connection.connect();


function martelada(limit, offset) {
    var deferred = Q.defer();
    request({
		url: 'http://api.ima.sp.gov.br/v1/transparencia/despesas',
		method: 'GET',
		headers: {
			Accept : "application/json",
			client_id : "4zkL7Edheb5R"
		},
		qs: {
			offset: offset,
			limit: limit,
			anoMes: "201404"
		}
    }, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var info = JSON.parse(body);
			deferred.resolve(info);
		} else {
			console.log(response.statusCode);
		}
    });
   return deferred.promise;
}


var limit = 30;
var offset = 9000;

var promises = [];
for(var i = 0; i < 100; i++ ) {
    promises.push(martelada(limit,offset));
	offset = offset + limit;
}

var original_documents = [];

Q.all(promises).then(function(results){
    results.map(function(itens){
        if(itens instanceof Array) {
            itens.map(function(documents){
				if(documents.id != null) {
					console.log(documents.id);
					connection.query("INSERT INTO despesas (id, anoMes, notaEmpenho, valorEmpenho) VALUES (?, ?, ?, ?);", [documents.id, documents.anoMes, documents.notaEmpenho, documents.valorEmpenho]);
					original_documents.push(documents);
				}
            });
        }
    });

    return original_documents;
}).then(function(orig) {
    console.log(orig.length);
    console.log(offset);
});
