var request = require('request');
var Q = require('q');

function martelada(limit, offset) {
    var deferred = Q.defer();
    request({
		url: 'http://api.ima.sp.gov.br/v1/atendimento',
		method: 'GET',
		headers: {
			Accept : "application/json",
			client_id : "3tkmPQq7piof"
		},
		qs: {
			offset: offset,
			limit: limit
		}
    }, function (error, response, body) {
		if (!error && response.statusCode == 200) {
      console.log(response.statusCode);
			var info = JSON.parse(body);
			deferred.resolve(info);
		} else {
			console.log(response.statusCode);
		}
    });
   return deferred.promise;
}


var limit = 100;
var offset = 0;

var promises = [];
for(var i = 0; i < 200; i++ ) {
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
