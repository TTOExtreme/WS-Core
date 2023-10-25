export default {

    /**
     * Seleciona as permissoes concatenadas sobre os grupos do usuário usando de base o UUID
     */
    sql_select_permissions_from_uuid: "SELECT DISTINCT _Permissions.permissao,_Permissions.nome,_Permissions.descricao, IFNULL(Permissao_User.tipo,Permissao_Group.tipo) as tipo FROM _Users " +
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
    sql_permissions_add_user: "INSERT INTO Permissao_User (user_id,permissao_id,ativo,tipo) VALUES(?,?,?,?);",

    /**
     * Realiza o update de Preferencias do Usuario em base o UUID
     */
    sql_permissions_add_group: "INSERT INTO Permissao_Group (group_id,permissao_id,ativo,tipo) VALUES(?,?,?,?);",

    /**
     * Retorna o user_id em base o username
     */
    sql_get_userid: "SELECT id FROM _Users WHERE username = ?;",

    /**
     * Retorna o group_id em base o username
     */
    sql_get_groupid: "SELECT id FROM _Groups WHERE code = ?;",


    /**
     * Retorna o user_id em base o username
     */
    sql_get_permissionid: "SELECT id FROM _Permissions WHERE permissao = ?;",


    /**
     * Usado no Login para retorno do salt para validação da sena
     */
    sql_select_username: "SELECT username, hash_salt FROM _Users WHERE username = ? AND _Users.ativo = 1;",

    /**
     * Retorna o username e UUID em base o usuario e senha
     */
    sql_select_password: "SELECT username,UUID FROM _Users WHERE username = ? AND password = ? AND _Users.ativo = 1;",
}