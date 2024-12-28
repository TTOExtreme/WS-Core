
CREATE TABLE _Modulos_Log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nivel VARCHAR(255) COMMENT "Nível do log, Sistema, Log, Info, Warning, Erros",
    origem VARCHAR(255) COMMENT "Origem do log, sendo o nome do módulo",
    informacao VARCHAR(255) COMMENT "Informação / Titulo do registro do Log",
    detalhes MEDIUMTEXT COMMENT "Detalhes do Log",
    criado_em TIMESTAMP COMMENT "Data da criação do registro"
);