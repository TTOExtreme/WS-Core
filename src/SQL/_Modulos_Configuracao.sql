
CREATE TABLE _Modulos_Configuracao (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) COMMENT "Nome do módulo do sistema",
    descricao VARCHAR(255) COMMENT "Descrição do módulo do sistema",
    estado INT(1) DEFAULT 0 COMMENT "Estado do módulo quanto a execução do mesmo 0 = offline, 1 = online",
    versao VARCHAR(255) COMMENT "Versão do modulo em questão",
    notas_versao MEDIUMTEXT COMMENT "Notas de lançamento da Versão",
    configuracao MEDIUMTEXT COMMENT "Dados de configuração do módulo para execução pelo Core",

    -- Bloco Padrão de todas as tabelas
    -- TODO: ADICIONAR FOREGN KEY EM TODOS OS COM USUÁRIOS
    criado_em TIMESTAMP COMMENT "Data da criação do registro",
    criado_por BIGINT NOT NULL COMMENT "Usuário que gerou o registro 0 = System",
    editado_em TIMESTAMP COMMENT "Data da edição do registro",
    editado_por BIGINT NOT NULL COMMENT "Usuário que editou o registro 0 = System",
    excluido_em TIMESTAMP COMMENT "Data da exclusão do registro",
    excluido_por BIGINT NOT NULL COMMENT "Usuário que excluiu o registro 0 = System",
    ativado_em TIMESTAMP COMMENT "Data da ativação do registro",
    ativado_por BIGINT NOT NULL COMMENT "Usuário que ativou o registro 0 = System",
    inativado_em TIMESTAMP COMMENT "Data da inativação do registro",
    inativado_por BIGINT NOT NULL COMMENT "Usuário que inativou o registro 0 = System",
    ativo INT(1) DEFAULT 0 COMMENT "Estado do registro 0 = inativo, 1 = ativo",
    excluido INT(1) DEFAULT 0 COMMENT "Estado da exclusão do registro 0 = não excluido, 1 = excluido"
);