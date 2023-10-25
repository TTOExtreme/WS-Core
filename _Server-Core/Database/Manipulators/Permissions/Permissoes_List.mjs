export default {
    PermissionsList: [
        //Permissões Base usuarios
        {
            nome: "Administrador do sistema, acesso a todo o sistema",
            permissao: "adm/system",
            descricao: "",
            ativo: 1
        },
        {
            nome: "Permite logar no sistema",
            permissao: "adm/login",
            descricao: "",
            ativo: 1
        },
        {
            nome: "Adicionar usuários no sistema",
            permissao: "user/add",
            descricao: "",
            ativo: 1
        },
        {
            nome: "Editar usuários do sistema",
            permissao: "user/edt",
            descricao: "",
            ativo: 1
        },
        {
            nome: "Desabilitar/Habilitar usuários do sistema",
            permissao: "user/active",
            descricao: "",
            ativo: 1
        },
        {
            nome: "Adicionar grupos no sistema",
            permissao: "group/add",
            descricao: "",
            ativo: 1
        },
        {
            nome: "Editar grupos do sistema",
            permissao: "group/edt",
            descricao: "",
            ativo: 1
        },
        {
            nome: "Desabilitar/Habilitar grupos do sistema",
            permissao: "group/active",
            descricao: "",
            ativo: 1
        },

        //Permissões de Telas

        {
            nome: "Aba Home",
            permissao: "Navbar/home",
            descricao: "",
            ativo: 1
        },
        {
            nome: "Aba Terminal",
            permissao: "Navbar/terminal",
            descricao: "",
            ativo: 1
        },
        {
            nome: "Aba Favoritos",
            permissao: "Navbar/favoritos",
            descricao: "",
            ativo: 1
        },
        {
            nome: "Aba Configurações",
            permissao: "Navbar/configuracoes",
            descricao: "",
            ativo: 1
        },
        {
            nome: "Aba Configurações/Usuários",
            permissao: "Navbar/configuracoes/usuarios",
            descricao: "",
            ativo: 1
        },
        {
            nome: "Aba Configurações/Grupos",
            permissao: "Navbar/configuracoes/grupos",
            descricao: "",
            ativo: 1
        },
        {
            nome: "Aba Configurações/Permissoes",
            permissao: "Navbar/configuracoes/permissoes",
            descricao: "",
            ativo: 1
        },
        {
            nome: "Aba Módulos",
            permissao: "Navbar/modulos",
            descricao: "",
            ativo: 1
        },

    ]
}

/***
 * 
                    add_LeftNavbar_Button('star', 'material-symbols-outlined', "Favoritos", (ev) => { });
                    add_LeftNavbar_Button('settings', 'material-icons', "Configurações", (ev) => { });
                    add_LeftNavbar_Button('token', 'material-icons', "Modulos");
                    add_LeftNavbar_Button('terminal', 'material-icons', "Terminal");
                    add_TopNavbar_Button('terminal', 'Terminal', (ev) => { })
                    add_TopNavbar_Button('home', 'Home', (ev) => { })
 */