let Menus = {
    Name: "WPMA",
    Id: "wpma/left/menu",
    Icon: "",
    Event: () => { },
    SubItems: [
        {
            Name: "Dashboard",
            Id: "wpma/aba/dashboard",
            Icon: "",
            EventCall: "Load",
            EventData: "./module/WPMA/js/dashboard/list.js",
            TopItems: [
                {
                    Name: "Status",
                    Id: "wpma/aba/dashboard",
                    EventCall: "Load",
                    EventData: "./module/WPMA/js/dashboard/list.js",
                }
            ],
        },
        {
            Name: "Sites",
            Id: "wpma/aba/sites",
            Icon: "",
            EventCall: "Load",
            EventData: "./module/WPMA/js/sites/list.js",
            TopItems: [
                {
                    Name: "Lista",
                    Id: "wpma/aba/sites",
                    EventCall: "Load",
                    EventData: "./module/WPMA/js/sites/list.js",
                },
                {
                    Name: "Adicionar",
                    Id: "wpma/site/add",
                    EventCall: "Load",
                    EventData: "./module/WPMA/js/sites/add.js",
                }
            ],
        },
        {
            Name: "Menus",
            Id: "wpma/aba/menus",
            Icon: "",
            EventCall: "Load",
            EventData: "./module/WPMA/js/menus/list.js",
            TopItems: [
                {
                    Name: "Lista",
                    Id: "wpma/aba/menus",
                    EventCall: "Load",
                    EventData: "./module/WPMA/js/menus/list.js",
                },
                {
                    Name: "Adicionar",
                    Id: "wpma/site/add",
                    EventCall: "Load",
                    EventData: "./module/WPMA/js/menus/add.js",
                }
            ],
        },
        {
            Name: "Posts",
            Id: "wpma/aba/posts",
            Icon: "",
            EventCall: "Load",
            EventData: "./module/WPMA/js/posts/list.js",
            TopItems: [
                {
                    Name: "Lista",
                    Id: "wpma/aba/posts",
                    EventCall: "Load",
                    EventData: "./module/WPMA/js/posts/list.js",
                },
                {
                    Name: "Adicionar",
                    Id: "wpma/site/add",
                    EventCall: "Load",
                    EventData: "./module/WPMA/js/posts/add.js",
                }
            ],
        },
        {
            Name: "Paginas",
            Id: "wpma/aba/pages",
            Icon: "",
            EventCall: "Load",
            EventData: "./module/WPMA/js/pages/list.js",
            TopItems: [
                {
                    Name: "Lista",
                    Id: "wpma/aba/pages",
                    EventCall: "Load",
                    EventData: "./module/WPMA/js/pages/list.js",
                },
                {
                    Name: "Adicionar",
                    Id: "wpma/site/add",
                    EventCall: "Load",
                    EventData: "./module/WPMA/js/pages/add.js",
                }
            ],
        }
    ],
    TopItems: [],
}

module.exports = { Menus }