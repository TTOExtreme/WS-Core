
/**
 * Adiciona Botão a Barra de navegação lateral
 * @param {String} icon_name Nome do icone segundo Google Icons
 * @param {String} icon_class Nome da classe segundo Google Icons
 * @param {String} title Texto Visual para aparecer no botão
 * @param {Null|Function} onclick_callback Callback a ser utilizada ao clicar no mesmo
 */
function add_LeftNavbar_Button(icon_name, icon_class = 'material-icons', title, onclick_callback = null) {

    let a_elem = document.createElement('a');
    let i_elem = document.createElement('i');
    let span_elem = document.createElement('span');

    a_elem.appendChild(i_elem);
    a_elem.appendChild(span_elem);


    a_elem.setAttribute('id', title.replace(/ /g, '_') + "_leftnavbar");
    a_elem.setAttribute('class', 'left_navbar_button');
    a_elem.addEventListener('click', (ev) => {
        select_LeftNavbar_Button(title);
        if (typeof (onclick_callback) == "function") {
            onclick_callback(ev);
        }
    })

    i_elem.setAttribute('id', title.replace(/ /g, '_'));
    i_elem.setAttribute('class', icon_class);
    i_elem.innerText = icon_name;

    span_elem.innerText = title;

    document.getElementById("left_navbar").appendChild(a_elem);

    /*
    <a id="left_navbar_button" class="left_navbar_button">
        <i class="material-icons">cloud</i>
        <span> Texto</span>
    </a>
    //*/
}

/**
 * Seleciona o seguinte botao ao clicar
 * @param {String} title 
 */
function select_LeftNavbar_Button(title) {
    let selecteds = document.getElementsByClassName("left_navbar_button_selecionado")

    for (let index = 0; index < selecteds.length; index++) {
        const element = selecteds[index];
        element.classList.toggle("left_navbar_button_selecionado");
    }
    let select = document.getElementById(title.replace(/ /g, '_') + "_leftnavbar");
    if (select != undefined) {
        select.classList.toggle("left_navbar_button_selecionado");
    }
}


/**
 * Adiciona Botão a Barra de navegação lateral
 * @param {String} icon_name Nome do icone segundo Google Icons
 * @param {String} title Texto Visual para aparecer no botão
 * @param {Null|Function} onclick_callback Callback a ser utilizada ao clicar no mesmo
 * @param {boolean} [isfav=false] Se o icone é Favorito ou nao
 */
function add_TopNavbar_Button(icon_name, title, onclick_callback = null, isfav = false) {

    let a_elem = document.createElement('a');
    let i_elem = document.createElement('i');
    let i2_elem = document.createElement('i');
    let x_elem = document.createElement('i');
    let span_elem = document.createElement('span');

    a_elem.appendChild(i_elem);
    a_elem.appendChild(i2_elem);
    a_elem.appendChild(span_elem);
    a_elem.appendChild(x_elem);


    a_elem.setAttribute('id', title.replace(/ /g, '_') + "_topnavbar");
    a_elem.setAttribute('class', 'top_navbar_button');
    a_elem.addEventListener('click', (ev) => {
        select_TopNavbar_Button(title);
        if (typeof (onclick_callback) == "function") {
            onclick_callback(ev);
        }
    })

    i_elem.setAttribute('id', title.replace(/ /g, '_') + "_fav");
    i_elem.setAttribute('class', (isfav ? 'material-icons' : 'material-symbols-outlined'));
    i_elem.innerText = 'star';
    i_elem.addEventListener('click', (ev) => {
        if (typeof (onclick_callback) == "function") {
            toggle_Favorite(title);
        }
    })

    i2_elem.setAttribute('class', 'material-icons' + " topnavbaricon");
    i2_elem.innerText = icon_name;

    x_elem.setAttribute('class', 'material-icons');
    x_elem.addEventListener('click', (ev) => {
        document.getElementById("top_navbar").removeChild(a_elem);
    })
    x_elem.innerText = 'close';

    span_elem.innerText = title;

    document.getElementById("top_navbar").appendChild(a_elem);

    /*
    <a id="left_navbar_button" class="left_navbar_button">
        <i class="material-icons">cloud</i>
        <span> Texto</span>
    </a>
    //*/
}


/**
 * Seleciona o seguinte botao ao clicar
 * @param {String} title 
 */
function select_TopNavbar_Button(title) {
    let selecteds = document.getElementsByClassName("top_navbar_button_selecionado")

    for (let index = 0; index < selecteds.length; index++) {
        const element = selecteds[index];
        element.classList.toggle("top_navbar_button_selecionado");
    }
    let select = document.getElementById(title.replace(/ /g, '_') + "_topnavbar");
    if (select != undefined) {
        select.classList.toggle("top_navbar_button_selecionado");
    }
    select_LeftNavbar_Button(title);
}

/**
 * Realiza a inversão dos favoritos e envia ao servidor
 * @param {String} title 
 */
function toggle_Favorite(title) {
    SocketEmit('Users.Preferences.Get', (err, Preferences) => {
        /**
         * Preferencias do Usuário 
         * {
         *  Favoritos:[]
         * }
         */
        if (Preferences != undefined) {
            Preferences = JSON.parse(Preferences)
            console.log(Preferences.Favoritos)
            if (Preferences.Favoritos != undefined) {
                if (Preferences.Favoritos.findIndex((value) => { return value == title }) == -1) {
                    Preferences.Favoritos.push(title);
                } else {
                    Preferences.Favoritos = Preferences.Favoritos.filter((value) => { return value != title });
                }
            } else {
                Preferences.Favoritos = [title];
            }
        } else {
            Preferences = {
                Favoritos: [title]
            }
        }
        /**
         * manda as preferencias do Usuário no servidor
         */
        SocketEmit('Users.Preferences.Set', Preferences);
        let favstar = document.getElementById(title.replace(/ /g, '_') + "_fav");
        favstar.classList.toggle('material-symbols-outlined')
        favstar.classList.toggle('material-icons');

    })
}
