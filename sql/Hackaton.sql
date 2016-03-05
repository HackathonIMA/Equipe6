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
	notaEmpenho CHAR(11),
	PRIMARY KEY(id),
	INDEX(notaEmpenho),
	CONSTRAINT FK_Funcao FOREIGN KEY(codigoFuncao) REFERENCES funcoes(codigoFuncao)
);

CREATE TABLE despesas (
	id CHAR(12) NOT NULL,
	anoMes CHAR(6),
	notaEmpenho CHAR(11),
	valorEmpenho DECIMAL(15,2),
	PRIMARY KEY(id),
	CONSTRAINT FK_Empenho FOREIGN KEY(notaEmpenho) REFERENCES empenhos(notaEmpenho)
);

CREATE TABLE naturezas (
	id CHAR(12) NOT NULL,
	descricao VARCHAR(500),
	naturezaReceita BIGINT,
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
	naturezaReceita BIGINT,
	CONSTRAINT FK_Natureza FOREIGN KEY(naturezaReceita) REFERENCES naturezas(naturezaReceita)
);