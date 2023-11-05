export default {

    /**
     * Seleciona as permissoes concatenadas sobre os grupos do usuário usando de base o UUID
     */
    sql_select_permissions_from_group: "SELECT DISTINCT _Permissions.permissao,_Permissions.nome,_Permissions.descricao, IFNULL(Permissao_User.tipo,Permissao_Group.tipo) as tipo FROM _Groups " +
        " LEFT JOIN Permissao_Group on Permissao_Group.group_id = _Groups.id  AND Permissao_Group.ativo = 1 AND Permissao_Group.excluido=0" +
        " LEFT JOIN _Permissions on _Permissions.id = Permissao_User.permissao_id OR _Permissions.id = Permissao_Group.permissao_id" +
        " WHERE _Groups.nome = ? AND _Groups.excluido=0",

    /**
     * Realiza o update de Preferencias do Usuario em base o UUID
     */
    sql_group_add_user: "INSERT INTO Group_User (user_id,group_id,criado_por,ativo) VALUES(?,?,?,?);",

    /**
     * Realiza o update de Preferencias do Usuario em base o UUID
     */
    sql_group_add: "INSERT INTO _Groups (nome,code,descricao,criado_por,ativo) VALUES(?,?,?,?,?);",

    /**
     * Realiza o update de Preferencias do Usuario em base o UUID
     */
    sql_group_edit: "UPDATE _Groups SET atualizado_por=?, atualizado_em=CURRENT_TIMESTAMP(), nome=?,code=?,descricao=?,ativo=? WHERE id=?;",

    /**
     * Realiza o update de Preferencias do Usuario em base o UUID
     */
    sql_group_disable: "UPDATE _Groups SET atualizado_por=?, atualizado_em=CURRENT_TIMESTAMP(), ativo=? WHERE id=?;",

    /**
     * Realiza o update de Preferencias do Usuario em base o UUID
     */
    sql_group_delete: "UPDATE _Groups SET excluido_por=?, excluido_em=CURRENT_TIMESTAMP(), excluido=? WHERE id=?;",

    /**
     * Retorna o user_id em base o username
     */
    sql_get_userid: "SELECT id FROM _Users WHERE username = ? AND excluido=0;",

    /**
     * Retorna o group_id em base o username
     */
    sql_get_groupid: "SELECT id FROM _Groups WHERE code = ? AND _Groups.excluido=0;",

    /**
     * Lista todos os grupos
     */
    sql_list_group: "SELECT * FROM _Groups WHERE _Groups.excluido=0;"

}