export default {

    /**
     * Seleciona as permissoes concatenadas sobre os grupos do usuário usando de base o UUID
     */
    sql_select_permissions_from_uuid: "SELECT DISTINCT _Permissions.*, IFNULL(Permissao_User.tipo,Permissao_Group.tipo) as tipo FROM _Users " +
        " LEFT JOIN Group_User on Group_User.user_id = _Users.id AND Group_User.ativo = 1" +
        " LEFT JOIN _Groups on Group_User.group_id = _Groups.id AND _Groups.ativo = 1" +
        " LEFT JOIN Permissao_Group on Permissao_Group.group_id = _Groups.id  AND Permissao_Group.ativo = 1" +
        " LEFT JOIN Permissao_User on Permissao_User.user_id = _Users.id  AND Permissao_User.ativo = 1" +
        " LEFT JOIN _Permissions on _Permissions.id = Permissao_User.permissao_id OR  _Permissions.id = Permissao_Group.permissao_id " +
        " WHERE _Users.UUID = ?" +
        " AND _Users.excluido=0" +
        " AND _Users.ativo = 1;",

    /**
     * Retorna a permissão especifica caso nao tenha uma negando
     */
    sql_select_permissions_from_uuid_specific: "SELECT DISTINCT MAX(IFNULL(Permissao_User.tipo,Permissao_Group.tipo)) as tipo FROM _Users " +
        " LEFT JOIN Group_User on Group_User.user_id = _Users.id AND Group_User.ativo = 1" +
        " LEFT JOIN _Groups on Group_User.group_id = _Groups.id AND _Groups.ativo = 1" +
        " LEFT JOIN Permissao_Group on Permissao_Group.group_id = _Groups.id  AND Permissao_Group.ativo = 1" +
        " LEFT JOIN Permissao_User on Permissao_User.user_id = _Users.id  AND Permissao_User.ativo = 1" +
        " LEFT JOIN _Permissions on _Permissions.id = Permissao_User.permissao_id OR  _Permissions.id = Permissao_Group.permissao_id " +
        " WHERE _Users.UUID = ?" +
        " AND _Users.ativo = 1" +
        " AND _Users.excluido=0" +
        " AND (_Permissions.permissao = ? OR _Permissions.permissao='adm/system');",


    /**
     * Realiza o update de Preferencias do Usuario em base o UUID
     */
    sql_preferences_set: "UPDATE _Users SET preferences = ? WHERE UUID = ? AND _Users.ativo = 1 AND _Users.excluido=0;",

    /**
     * Realiza o update de Preferencias do Usuario em base o UUID
     */
    sql_preferences_get: "SELECT username,preferences FROM _Users WHERE UUID = ? AND _Users.ativo = 1 AND _Users.excluido=0;",

    /**
     * Atualiza os dados do usuário
     */
    sql_edit_user: "UPDATE _Users SET email = ? , nome = ? , atualizado_por = ? , atualizado_em = CURRENT_TIMESTAMP() WHERE id = ? AND _Users.excluido=0;",

    /**
     * Atualiza os dados do usuário
     */
    sql_edit_user_pass: "UPDATE _Users SET password = ? , hash_salt = ? , atualizado_por = ? , atualizado_em = CURRENT_TIMESTAMP() WHERE id = ? AND _Users.excluido=0;",

    /**
     * insere novo usuário
     */
    sql_add_user: "INSERT INTO _Users (criado_por,username,email,nome,password,hash_salt,ativo) VALUES (?,?,?,?,?,?,?);",

    /**
     * Exclui o registro para nao aparecer em nenhuma pesquisa
     */
    sql_delete_user: "UPDATE _Users SET  excluido_em=CURRENT_TIMESTAMP(), excluido_por=? , atualizado_por = ?, excluido=?, atualizado_em = CURRENT_TIMESTAMP() WHERE id = ?;",

    /**
     * Disativa o usuario para filtros e acesso
     */
    sql_active_user: "UPDATE _Users SET  atualizado_por = ?, ativo=?, atualizado_em = CURRENT_TIMESTAMP() WHERE id = ?;",

    /**
     * Retorna o username em base o UUID
     */
    sql_username_get: "SELECT id, username, nome, email, UUID FROM _Users WHERE UUID = ? AND _Users.ativo = 1 AND _Users.excluido=0;",

    /**
     * Lista os usuarios nao excluidos do sistema
     */
    sql_user_list: "SELECT pry_table.id, pry_table.criado_em, IFNULL(created_User.username, 'SYSTEM') as criado_por, pry_table.atualizado_em, IFNULL(updated_User.username, 'SYSTEM') as atualizado_por, pry_table.excluido_em, IFNULL(excluded_User.username, '-') as excluido_por, pry_table.excluido, pry_table.ativo, pry_table.username, pry_table.email, pry_table.nome, pry_table.UUID, pry_table.preferences, pry_table.online FROM _Users as pry_table" +
        " LEFT JOIN _Users as excluded_User on pry_table.excluido_por = excluded_User.id" +
        " LEFT JOIN _Users as created_User on pry_table.criado_por = created_User.id" +
        " LEFT JOIN _Users as updated_User on pry_table.atualizado_por = updated_User.id" +
        " WHERE pry_table.excluido=0;",

    /**
     * Retorna um unico usuario com todos os dados completos
     */
    sql_user_list_single_id: "SELECT pry_table.id, pry_table.criado_em, IFNULL(created_User.username, 'SYSTEM') as criado_por, pry_table.atualizado_em, IFNULL(updated_User.username, 'SYSTEM') as atualizado_por, pry_table.excluido_em, IFNULL(excluded_User.username, '-') as excluido_por, pry_table.excluido, pry_table.ativo, pry_table.username, pry_table.email, pry_table.nome, pry_table.UUID, pry_table.preferences, pry_table.online FROM _Users as pry_table" +
        " LEFT JOIN _Users as excluded_User on pry_table.excluido_por = excluded_User.id" +
        " LEFT JOIN _Users as created_User on pry_table.criado_por = created_User.id" +
        " LEFT JOIN _Users as updated_User on pry_table.atualizado_por = updated_User.id" +
        " WHERE pry_table.id = ? AND pry_table.excluido=0;",

    /**
     * Usado no Login para retorno do salt para validação da sena
     */
    sql_select_username: "SELECT id,username, hash_salt FROM _Users WHERE username = ? AND _Users.ativo = 1 AND _Users.excluido=0;",

    /**
     * Retorna o username e UUID em base o usuario e senha
     */
    sql_select_password: "SELECT id,username,UUID FROM _Users WHERE username = ? AND password = ? AND _Users.ativo = 1 AND _Users.excluido=0;",

    /**
     * Realiza a atualização de data e estado do usuario
     */
    sql_update_login: "UPDATE _Users SET online=1, ultimo_login=CURRENT_TIMESTAMP() WHERE id=? AND _Users.excluido=0;",

    /**
     * Realiza a atualização de data e estado do usuario
     */
    sql_update_logout: "UPDATE _Users SET online=0, ultimo_logout=CURRENT_TIMESTAMP() WHERE id=? AND _Users.excluido=0;",

}