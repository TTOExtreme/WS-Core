const _DB = [
    {
        name: "System",
        description: "Permissão de Sistema (Garante Acesso Global)",
        code: "adm/system",
        type: "system",
        defaltAdd: 0
    },
    {
        name: "Login",
        description: "Permissão para o login do usuário",
        code: "def/usr/login",
        type: "default",
        defaltAdd: 1
    },
    {
        name: "Mudar senha",
        description: "Permissão para que o usuário mude a senha",
        code: "def/usr/chgpass",
        type: "default",
        defaltAdd: 1
    },
    {
        name: "Mudar nome",
        description: "Permissão para que o usuário mude o nome",
        code: "def/usr/chgname",
        type: "default",
        defaltAdd: 0
    },
    {
        name: "Mudar Username",
        description: "Permissão para que o usuário mude o Username",
        code: "def/usr/chgusername",
        type: "default",
        defaltAdd: 0
    },
    {
        name: "Mostrar IP",
        description: "Mostrar o IP na tela do usuário",
        code: "scr/usr/seeip",
        type: "screen",
        defaltAdd: 1
    },
    {
        name: "Mostrar Nome",
        description: "Mostrar o Nome na tela do usuário",
        code: "scr/usr/seename",
        type: "screen",
        defaltAdd: 1
    },
    {
        name: "Menu Administrativo",
        description: "Abrir o Menu Administração",
        code: "menu/adm",
        type: "adm",
        defaltAdd: 0
    },
    {
        name: "Menu Adm > Usuários",
        description: "Abrir o Menu Usuários",
        code: "menu/adm/usr",
        type: "adm",
        defaltAdd: 0
    },
    {
        name: "Adm > Usuários > Editar",
        description: "Editar Usuários",
        code: "adm/usr/edt",
        type: "adm",
        defaltAdd: 0
    },
    {
        name: "Adm > Usuários > Desativar",
        description: "Desativar Usuários",
        code: "adm/usr/disable",
        type: "adm",
        defaltAdd: 0
    },
    {
        name: "Adm > Usuários > Adicionar",
        description: "Adicionar Usuários",
        code: "menu/adm/usr/add",
        type: "adm",
        defaltAdd: 0
    },
    {
        name: "Adm > Usuários > Permissões",
        description: "Modificar Permissões",
        code: "adm/usr/perm",
        type: "adm",
        defaltAdd: 0
    },
    {
        name: "Adm > Usuários > Grupos",
        description: "Modificar Grupos do Usuário",
        code: "adm/usr/grp",
        type: "adm",
        defaltAdd: 0
    },
    {
        name: "Menu Adm > Grupos",
        description: "Abrir o Menu Grupos",
        code: "menu/adm/grp",
        type: "adm",
        defaltAdd: 0
    },
    {
        name: "Adm > Grupos > Editar",
        description: "Editar Grupos",
        code: "adm/grp/edt",
        type: "adm",
        defaltAdd: 0
    },
    {
        name: "Adm > Grupos > Desativar",
        description: "Desativar Grupos",
        code: "adm/grp/disable",
        type: "adm",
        defaltAdd: 0
    },
    {
        name: "Adm > Grupos > Adicionar",
        description: "Adicionar Grupos",
        code: "menu/adm/grp/add",
        type: "adm",
        defaltAdd: 0
    },
    {
        name: "Adm > Grupos > Permissões",
        description: "Modificar Permissões",
        code: "adm/grp/perm",
        type: "adm",
        defaltAdd: 0
    },
    {
        name: "Adm > Grupos > Grupos",
        description: "Modificar Grupos do Grupo",
        code: "adm/grp/grp",
        type: "adm",
        defaltAdd: 0
    },
]

module.exports = { _DB }