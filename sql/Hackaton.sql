CREATE TABLE funcoes (
	id CHAR(12) NOT NULL,
	descricao VARCHAR(50),
	codigoFuncao INT,
	PRIMARY KEY(id),
	INDEX(codigoFuncao)
);

CREATE TABLE empenhos (
	id CHAR(12) NOT NULL,
	codigoFuncao INT,
	notaEmpenho VARCHAR(50),
	PRIMARY KEY(id),
	INDEX(notaEmpenho)
);

CREATE TABLE despesas (
	id CHAR(12) NOT NULL,
	anoMes CHAR(6),
	notaEmpenho VARCHAR(50),
	valorEmpenho DECIMAL(15,2),
	PRIMARY KEY(id)
);

CREATE TABLE naturezas (
	id CHAR(12) NOT NULL,
	descricao VARCHAR(500),
	naturezaReceita VARCHAR(20),
	PRIMARY KEY(id),
	INDEX(naturezaReceita)
);

CREATE TABLE receitas (
	id CHAR(12) NOT NULL PRIMARY KEY,
	anoMesEmissao CHAR(6),
	valorPrevisao DECIMAL(15,2),
	valorRealizado DECIMAL(15,2),
	valorPrevisaoAcrescimo DECIMAL(15,2),
	valorRealizadoAcrescimo DECIMAL(15,2),
	naturezaReceita VARCHAR(20)
);