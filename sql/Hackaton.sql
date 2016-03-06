CREATE TABLE projetos_atividades (
	id CHAR(12) NOT NULL,
	descricao VARCHAR(250),
	funcao INT,
	subFuncao INT,
	programa INT,
	projetoAtividade VARCHAR(25),
	PRIMARY KEY(id),
	INDEX(funcao),
	INDEX(subFuncao),
	INDEX(programa)
);

CREATE TABLE funcoes (
	id CHAR(12) NOT NULL,
	descricao VARCHAR(50),
	funcao INT,
	PRIMARY KEY(id),
	INDEX(funcao)
);

CREATE TABLE subfuncoes (
	id CHAR(12) NOT NULL,
	descricao VARCHAR(100),
	subfuncao INT,
	PRIMARY KEY(id),
	INDEX(subfuncao)
);

CREATE TABLE programas (
	id CHAR(12) NOT NULL,
	descricao VARCHAR(100),
	programa INT,
	PRIMARY KEY(id),
	INDEX(programa)
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
	projetoAtividade VARCHAR(25),
	PRIMARY KEY(id),
	INDEX(projetoAtividade)
);

CREATE TABLE naturezas (
	id CHAR(12) NOT NULL,
	descricao VARCHAR(500),
	naturezaReceita VARCHAR(20),
	PRIMARY KEY(id),
	INDEX(naturezaReceita)
);

CREATE TABLE receitas (
	id CHAR(12) NOT NULL,
	anoMesEmissao CHAR(6),
	valorPrevisao DECIMAL(15,2),
	valorRealizado DECIMAL(15,2),
	valorPrevisaoAcrescimo DECIMAL(15,2),
	valorRealizadoAcrescimo DECIMAL(15,2),
	naturezaReceita VARCHAR(20),
	PRIMARY KEY(id),
	INDEX(naturezaReceita)
);