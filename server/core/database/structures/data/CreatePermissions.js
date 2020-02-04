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
    }
]

module.exports = { _DB }