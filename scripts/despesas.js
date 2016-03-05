var request = require('request');
var Q = require('q');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bancodedados_a');

/*
{
    "id": "e8850334da6f",
    "anoMes": 201101,
    "diaLancamento": 20110101,
    "diaVencimento": 20110114,
    "notaEmpenho": "097200000072011NE00001",
    "processoDescricao": "10/10/41136    ",
    "valorEmpenho": 94000,
    "valorLiquidado": 0,
    "valorALiquidar": 0,
    "valorPago": 0,
    "valorAPagar": 0,
    "valorAcrescrimoEmpenho": 94000,
    "valorAcrescimoLiquidado": 0,
    "valorAcrescimoALiquidar": 0,
    "valorAcrescimoPago": 0,
    "valorAcrescimoAPagar": 0
  }
*/

var Despesas = mongoose.model('despesas', {
    id: {
        type: 'String',
        index: { unique: true }
    },
    anoMes:  { type: 'number'},
    diaLancamento:  { type: 'number'},
    diaVencimento:  { type: 'number'},
    notaEmpenho:  { type: 'string'},
    processoDescricao:  { type: 'string'},
    valorEmpenho:  { type: 'number'},
    valorLiquidado:  { type: 'number'},
    valorALiquidar:  { type: 'number'},
    valorPago:  { type: 'number'},
    valorAPagar:  { type: 'number'},
    valorAcrescrimoEmpenho:  { type: 'number'},
    valorAcrescimoLiquidado:  { type: 'number'},
    valorAcrescimoALiquidar:  { type: 'number'},
    valorAcrescimoPago:  { type: 'number'},
    valorAcrescimoAPagar:  { type: 'number'}
});

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
        limit: limit
        //,fields : 'codigoBairro,nomeBairro'
    }
    }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        deferred.resolve(info);
        
    } else {
        console.log(error);
    }
    });   
   return deferred.promise; 
}


var limit = 100;
var offset = 10000;

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
                console.log(documents.id);
                var despesa = new Despesas(documents);
                despesa.save();
                original_documents.push(documents);
            });
        }
    });
    
    return original_documents;
}).then(function(orig) {
    console.log(orig.length);
    
    console.log(offset);
    console.log(limit);
});
