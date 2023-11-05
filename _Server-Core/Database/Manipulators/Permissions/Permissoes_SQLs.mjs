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
        " AND _Users.excluido=0" +
        " AND _Users.ativo = 1;",

    /**
     * Seleciona as permissoes concatenadas sobre os grupos do usuário usando de base o id
     */
    sql_select_permissions_from_id: "SELECT DISTINCT _Permissions.permissao,_Permissions.nome,_Permissions.descricao, IFNULL(Permissao_User.tipo,Permissao_Group.tipo) as tipo FROM _Users " +
        " LEFT JOIN Group_User on Group_User.user_id = _Users.id AND Group_User.ativo = 1 AND Group_User.excluido=0" +
        " LEFT JOIN _Groups on Group_User.group_id = _Groups.id AND _Groups.ativo = 1 AND _Groups.excluido=0" +
        " LEFT JOIN Permissao_Group on Permissao_Group.group_id = _Groups.id  AND Permissao_Group.ativo = 1 AND Permissao_Group.excluido=0" +
        " LEFT JOIN Permissao_User on Permissao_User.user_id = _Users.id  AND Permissao_User.ativo = 1 AND Permissao_User.excluido=0" +
        " LEFT JOIN _Permissions on _Permissions.id = Permissao_User.permissao_id OR  _Permissions.id = Permissao_Group.permissao_id " +
        " WHERE _Users.id = ?" +
        " AND _Users.excluido=0" +
        " AND _Users.ativo = 1;",

    /**
     * Seleciona as permissoes do usuário usando de base o id
     */
    sql_permissions_list_user: "SELECT ? as user_id,_Permissions.id,_Permissions.permissao,_Permissions.nome, IFNULL(userperms.tipo,'-') as tipo,IFNULL(userperms.ativo,'-') as ativo,IFNULL(userperms.criado_em,'-') as criado_em,IFNULL(criado_por.username,'-') as criado_por,IFNULL(atualizado_por.username,'-') as atualizado_por ,IFNULL(userperms.atualizado_em,'-') as atualizado_em  FROM _Permissions" +
        " LEFT JOIN (" +
        " SELECT DISTINCT _Permissions.permissao,_Permissions.nome,_Permissions.descricao, " +
        "	Permissao_User.* FROM _Permissions " +
        "		LEFT JOIN Permissao_User on Permissao_User.permissao_id  = _Permissions.id AND Permissao_User.excluido=0" +
        "		LEFT JOIN _Users on Permissao_User.user_id  = _Users.id  AND _Users.ativo = 1  AND _Users.excluido=0" +
        "		WHERE _Users.id = ?" +
        ") as userperms on userperms.permissao = _Permissions.permissao" +
        " LEFT JOIN _Users as criado_por on criado_por.id = userperms.criado_por" +
        " LEFT JOIN _Users as atualizado_por on atualizado_por.id = userperms.atualizado_por",

    /**
     * Seleciona as permissoes do usuário usando de base o id
     */
    sql_permissions_list_group: "SELECT ? as group_id,_Permissions.id,_Permissions.permissao,_Permissions.nome, IFNULL(userperms.tipo,'-') as tipo,IFNULL(userperms.ativo,'-') as ativo,IFNULL(userperms.criado_em,'-') as criado_em,IFNULL(criado_por.username,'-') as criado_por,IFNULL(atualizado_por.username,'-') as atualizado_por ,IFNULL(userperms.atualizado_em,'-') as atualizado_em  FROM _Permissions" +
        " LEFT JOIN (" +
        " SELECT DISTINCT _Permissions.permissao,_Permissions.nome,_Permissions.descricao, " +
        "	Permissao_Group.* FROM _Permissions " +
        "		LEFT JOIN Permissao_Group on Permissao_Group.permissao_id  = _Permissions.id AND Permissao_Group.excluido=0" +
        "		LEFT JOIN _Groups on Permissao_Group.group_id  = _Groups.id  AND _Groups.ativo = 1  AND _Groups.excluido=0" +
        "		WHERE _Groups.id = ?" +
        ") as userperms on userperms.permissao = _Permissions.permissao" +
        " LEFT JOIN _Users as criado_por on criado_por.id = userperms.criado_por" +
        " LEFT JOIN _Users as atualizado_por on atualizado_por.id = userperms.atualizado_por",

    /**
     * Realiza o update de permissoes do Usuario em base o UUID
     */
    sql_permissions_add_user: "INSERT INTO Permissao_User (criado_por,user_id,permissao_id,ativo,tipo) VALUES(?,?,?,?,?);",

    /**
     * Exclui o registro
     */
    sql_permissions_delete_user: "UPDATE Permissao_User SET excluido_por =?, excluido_em=CURRENT_TIMESTAMP(),excluido = ? WHERE user_id=? AND permissao_id=?",

    /**
     * Realiza o update de permissoes do Usuario em base o id
     */
    sql_permissions_active_user: "UPDATE Permissao_User SET atualizado_por =?, atualizado_em=CURRENT_TIMESTAMP(),ativo = ? WHERE user_id=? AND permissao_id=?;",

    /**
     * Realiza o update de permissoes do Usuario em base o id
     */
    sql_permissions_edit_user: "UPDATE Permissao_User SET atualizado_por =?, atualizado_em=CURRENT_TIMESTAMP(),ativo = ?,tipo=? WHERE user_id=? AND permissao_id=?;",

    /**
     * Realiza o update de permissoes do Usuario em base o UUID
     */
    sql_permissions_add_group: "INSERT INTO Permissao_Group (criado_por,group_id,permissao_id,ativo,tipo) VALUES(?,?,?,?,?);",

    /**
     * Exclui o registro
     */
    sql_permissions_delete_group: "UPDATE Permissao_Group SET excluido_por =?, excluido_em=CURRENT_TIMESTAMP(),excluido = ? WHERE group_id=? AND permissao_id=?",

    /**
     * Realiza o update de permissoes do Usuario em base o id
     */
    sql_permissions_active_group: "UPDATE Permissao_Group SET atualizado_por =?, atualizado_em=CURRENT_TIMESTAMP(),ativo = ? WHERE group_id=? AND permissao_id=?;",

    /**
     * Realiza o update de permissoes do Usuario em base o id
     */
    sql_permissions_edit_group: "UPDATE Permissao_Group SET atualizado_por =?, atualizado_em=CURRENT_TIMESTAMP(),ativo = ?,tipo=? WHERE group_id=? AND permissao_id=?;",

    /**
     * Retorna o user_id em base o username
     */
    sql_get_userid: "SELECT id FROM _Users WHERE username = ? AND _Users.excluido=0;",

    /**
     * Retorna o group_id em base o username
     */
    sql_get_groupid: "SELECT id FROM _Groups WHERE code = ? AND excluido=0;",

    /**
     * Retorna o user_id em base o username
     */
    sql_get_permissionid: "SELECT id FROM _Permissions WHERE permissao = ? AND excluido=0;",

    /**
     * Usado no Login para retorno do salt para validação da sena
     */
    sql_select_username: "SELECT username, hash_salt FROM _Users WHERE username = ? AND _Users.ativo = 1 AND _Users.excluido=0;",

    /**
     * Retorna o username e UUID em base o usuario e senha
     */
    sql_select_password: "SELECT username,UUID FROM _Users WHERE username = ? AND password = ? AND _Users.ativo = 1 AND _Users.excluido=0;",
}