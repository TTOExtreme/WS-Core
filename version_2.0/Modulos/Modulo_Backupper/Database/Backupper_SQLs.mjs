export default {


    /**
     * Atualiza os dados do Backup
     */
    //sql_edit_backupper_config: "UPDATE _Users SET email = ? , nome = ? , atualizado_por = ? , atualizado_em = CURRENT_TIMESTAMP() WHERE id = ? AND _Users.excluido=0;",

    /**
     * Atualiza os dados do Backup
     */
    //sql_edit_user_pass: "UPDATE _Users SET password = ? , hash_salt = ? , atualizado_por = ? , atualizado_em = CURRENT_TIMESTAMP() WHERE id = ? AND _Users.excluido=0;",

    /**
     * insere novo Backup
     */
    sql_add_backupper_config: "INSERT INTO Modulo_Backupper_Config (criado_por,nome,email,descricao,preferences,tempo_restart,crontab,salvar_log,ativo) VALUES (?,?,?,?,?,?,?,?,?);",

    /**
     * Retorna todos os registros nao excluidos
     */
    sql_list_backupper_config: "SELECT * FROM Modulo_Backupper_Config WHERE excluido=0;",

    /**
     * Retorna todos os registros nao excluidos e ativos
     */
    sql_list_active_backupper_config: "SELECT * FROM Modulo_Backupper_Config WHERE excluido=0 AND ativo=1;",

    /**
     * Exclui o registro para nao aparecer em nenhuma pesquisa
     */
    sql_delete_backupper_config: "UPDATE Modulo_Backupper_Config SET  excluido_em=CURRENT_TIMESTAMP(), excluido_por=? , atualizado_por = ?, excluido=?, atualizado_em = CURRENT_TIMESTAMP() WHERE id = ?;",

    /**
     * Disativa o usuario para filtros e acesso
     */
    sql_active_backupper_config: "UPDATE Modulo_Backupper_Config SET atualizado_por = ?, ativo=?, atualizado_em = CURRENT_TIMESTAMP() WHERE id = ?;",

}