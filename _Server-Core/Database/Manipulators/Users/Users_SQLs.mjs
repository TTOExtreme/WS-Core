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
        " AND _Users.ativo = 1",

    /**
     * Realiza o update de Preferencias do Usuario em base o UUID
     */
    sql_preferences_set: "UPDATE _Users SET preferences = ? WHERE UUID = ?AND _Users.ativo = 1;",

    /**
     * Realiza o update de Preferencias do Usuario em base o UUID
     */
    sql_preferences_get: "SELECT username,preferences FROM _Users WHERE UUID = ?AND _Users.ativo = 1;",

    /**
     * Retorna o username em base o UUID
     */
    sql_username_get: "SELECT username FROM _Users WHERE UUID = ? AND _Users.ativo = 1;",


    /**
     * Usado no Login para retorno do salt para validação da sena
     */
    sql_select_username: "SELECT username, hash_salt FROM _Users WHERE username = ? AND _Users.ativo = 1;",

    /**
     * Retorna o username e UUID em base o usuario e senha
     */
    sql_select_password: "SELECT username,UUID FROM _Users WHERE username = ? AND password = ? AND _Users.ativo = 1;",
}