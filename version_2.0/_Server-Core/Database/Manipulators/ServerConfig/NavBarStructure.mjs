export default {
    "Navbar/home": {
        title: "Home",
        permissao: "Navbar/home",
        icon: "home",
        icon_class: "material-icons",
        onclick: { type: 'open_top_NavBar' }
    },
    "Navbar/favoritos": {
        title: "Favoritos",
        permissao: "Navbar/favoritos",
        icon: "star",
        icon_class: "material-icons",
        onclick: { type: 'open_top_NavBar' }
    },
    "Navbar/configuracoes": {
        title: "Configurações",
        permissao: "Navbar/configuracoes",
        haschild: true,
        icon: "settings",
        icon_class: "material-icons",
        onclick: { type: 'open_Left_subNavbar' }
    },
    "Navbar/configuracoes/usuarios": {
        title: "Usuários",
        permissao: "Navbar/configuracoes/usuarios",
        parent: "Configurações",
        icon: "manage_accounts",
        icon_class: "material-icons",
        onclick: { type: 'open_top_NavBar', load: '/js/core/users/users.js' }
    },
    "Navbar/configuracoes/grupos": {
        title: "Grupos",
        permissao: "Navbar/configuracoes/grupos",
        parent: "Configurações",
        icon: "group",
        icon_class: "material-icons",
        onclick: { type: 'open_top_NavBar', load: '/js/core/groups/groups.js' }
    },
    "Navbar/modulos": {
        title: "Módulos",
        permissao: "Navbar/modulos",
        icon: "developer_mode",
        haschild: true,
        icon_class: "material-icons",
        onclick: { type: 'open_Left_subNavbar' }
    },
    "Navbar/modulos/lista": {
        title: "Lista Modulos",
        permissao: "Navbar/modulos",
        icon: "list_alt",
        parent: "Módulos",
        icon_class: "material-icons",
        onclick: { type: 'open_top_NavBar', load: '/js/core/modulos/modulos.js' }
    },
    "Navbar/terminal": {
        title: "Terminal",
        permissao: "Navbar/terminal",
        icon: "terminal",
        icon_class: "material-icons",
        onclick: { type: 'load_module', load: '/js/core/terminal.js' }
    },
}