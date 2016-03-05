var request = require('request');
var Q = require('q');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bancodedados_a');

/*
 {
    "id": "a61cf823da70",
    "anoMesEmissao": 201101,
    "codigoOrigemRecurso": "0",
    "valorPrevisao": 370000,
    "valorPrevisaoInicial": 370000,
    "valorPrevisaoAdicional": 0,
    "valorPrevisaoDeducao": 0,
    "valorPrevisaoAnulacao": 0,
    "valorRealizado": 0,
    "valorDeduzido": 0,
    "valorARealizar": 0,
    "valorARealizarDeduzido": 0,
    "valorPrevisaoAcrescimo": 370000,
    "valorPrevisaoInicialAcrescimo": 370000,
    "valorPrevisaoDeducaoAcrescimo": 0,
    "valorPrevisaoAnulacaoAcrescimo": 0,
    "valorRealizadoAcrescimo": 0,
    "valorRealizadoDeduzidoAcrescimo": 0,
    "valorARealizarAcrescimo": 370000,
    "valorARealizarDeduzidoAcrescimo": 0,
    "naturezaReceita": "19909911"
  },
*/

var Receitas = mongoose.model('receitas', {
    id: {
        type: 'String',
        index: { unique: true }
    }, 
    anoMesEmissao: { type: 'number'},
    codigoOrigemRecurso: 0,
    valorPrevisao: { type: 'number'},
    valorPrevisaoInicial: { type: 'number'},
    valorPrevisaoAdicional: { type: 'number'},
    valorPrevisaoDeducao: { type: 'number'},
    valorPrevisaoAnulacao: { type: 'number'},
    valorRealizado: { type: 'number'},
    valorDeduzido: { type: 'number'},
    valorARealizar: { type: 'number'},
    valorARealizarDeduzido: { type: 'number'},
    valorPrevisaoAcrescimo: { type: 'number'},
    valorPrevisaoInicialAcrescimo: { type: 'number'},
    valorPrevisaoDeducaoAcrescimo: { type: 'number'},
    valorPrevisaoAnulacaoAcrescimo: { type: 'number'},
    valorRealizadoAcrescimo: { type: 'number'},
    valorRealizadoDeduzidoAcrescimo: { type: 'number'},
    valorARealizarAcrescimo: { type: 'number'},
    valorARealizarDeduzidoAcrescimo: { type: 'number'},
    naturezaReceita: { type: 'string'}
});

function martelada(limit, offset) {
    var deferred = Q.defer();
    request({
    url: 'http://api.ima.sp.gov.br/v1/transparencia/receitas',
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
var offset = 0;

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
                var receitas = new Receitas(documents);
                receitas.save();
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
