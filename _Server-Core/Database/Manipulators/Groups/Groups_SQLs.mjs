export default {

    /**
     * Seleciona as permissoes concatenadas sobre os grupos do usuário usando de base o UUID
     */
    sql_select_permissions_from_group: "SELECT DISTINCT _Permissions.permissao,_Permissions.nome,_Permissions.descricao, IFNULL(Permissao_User.tipo,Permissao_Group.tipo) as tipo FROM _Groups " +
        " LEFT JOIN Permissao_Group on Permissao_Group.group_id = _Groups.id  AND Permissao_Group.ativo = 1" +
        " LEFT JOIN _Permissions on _Permissions.id = Permissao_User.permissao_id OR  _Permissions.id = Permissao_Group.permissao_id " +
        " WHERE _Groups.nome = ?",

    /**
     * Realiza o update de Preferencias do Usuario em base o UUID
     */
    sql_group_add_user: "INSERT INTO Group_User (user_id,group_id,criado_por,ativo) VALUES(?,?,?,?);",
    /**
     * Realiza o update de Preferencias do Usuario em base o UUID
     */
    sql_group_add: "INSERT INTO _Groups (nome,code,descricao,criado_por,ativo) VALUES(?,?,?,?,?);",

    /**
     * Retorna o user_id em base o username
     */
    sql_get_userid: "SELECT id FROM _Users WHERE username = ?;",

    /**
     * Retorna o group_id em base o username
     */
    sql_get_groupid: "SELECT id FROM _Groups WHERE code = ?;",

}