ClientEvents.on("wsfinan/fichas/move", () => {
    ClientEvents.emit("close_menu", 'wsfinan_ficha_move_div')
    let data = {
        name: "",
        description: "",
        valueAttached: 0,
        valueReserved: 0,
        valuePending: 0,
        active: 1
    }

    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsfinan_add_div menu_dragger");
    div.setAttribute("id", "wsfinan_ficha_move_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_wsfinan_ficha' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsfinan_ficha_move_div')>&#9776;</td><td class='wsfinan_edt_label'><p class='wsfinan_ficha_closeButton' onclick=ClientEvents.emit(\"close_menu\",'wsfinan_ficha_move_div')>X</p></td></tr>" +

        "<tr><td class='wsfinan_edt_label'>Valor:</td><td><input id='wsfinan_ficha_produto_value' type='number'></td></tr>" +
        "<tr><td class='wsfinan_edt_label'>Ficha Origem:</td><td><input id='wsfinan_ficha_produto_out' type='text'></td></tr>" +
        "<tr><td class='wsfinan_edt_label'>Ficha Destino:</td><td><input id='wsfinan_ficha_produto_in' type='text'></td></tr>" +
        "<tr style='display:none'><td class='wsfinan_edt_label'>Ficha Origem:</td><td><input id='wsfinan_ficha_produto_outset' type='text'></td></tr>" +
        "<tr style='display:none'><td class='wsfinan_edt_label'>Ficha Destino:</td><td><input id='wsfinan_ficha_produto_inset' type='text'></td></tr>" +
        "<tr><td class='wsfinan_edt_label'>Motivo:</td><td><input id='wsfinan_ficha_produto_motivo' type='text'></td></tr>" +
        "<tr><td colspan=2 class='wsfinan_edt_label_info' id='wsfinan_ficha_produto_info'></td></tr>" +
        "<tr><td></td><td><input id='wpma_sites_submit' value='Mover' type='button' onclick='ClientEvents.emit(\"WSFinan/ficha/movevalue\")' ></td></tr>" +
        "</table>";

    document.body.appendChild(div);
    ClientEvents.emit("SendSocket", "WSFinan/fichas/lstauto");
});


ClientEvents.on("WSFinan/ficha/movevalue", () => {
    ClientEvents.emit("SendSocket", "WSFinan/ficha/move", {
        value: document.getElementById("wsfinan_ficha_produto_value").value,
        id_in: document.getElementById("wsfinan_ficha_produto_inset").value,
        id_out: document.getElementById("wsfinan_ficha_produto_outset").value,
        motivo: document.getElementById("wsfinan_ficha_produto_motivo").value
    });
    /**
     * save data and closes the page if success
     * closing part from server command
     */
})



ClientEvents.on("wsfinan/fichas/lstauto", (arr) => {
    ClientEvents.emit("wsfinan/fichas/setauto", arr, "wsfinan_ficha_produto_out", "wsfinan_ficha_produto_outset");
    ClientEvents.emit("wsfinan/fichas/setauto", arr, "wsfinan_ficha_produto_in", "wsfinan_ficha_produto_inset");
});

ClientEvents.on("wsfinan/fichas/setauto", (arr, id, valueset) => {
    let inp = document.getElementById(id);
    var currentFocus;


    let addActive = (x) => {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }

    let removeActive = (x) => {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    let closeAllLists = (elmnt) => {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }


    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        let lim = 8;
        let set = false;
        for (i = 0; i < arr.length; i++) {
            let name = arr[i].name + " | " + arr[i].responsavel;
            if ((name + "").toLowerCase().indexOf((val + "").toLowerCase()) > -1 && lim >= 0) {
                lim--;
                b = document.createElement("DIV");
                b.setAttribute("id", arr[i].id)
                let namehtml = ((name).replace(new RegExp((val).toLowerCase(), "g"), "<strong>" + val.toUpperCase() + "</strong>"));
                namehtml = ((namehtml).replace(new RegExp((val).toUpperCase(), "g"), "<strong>" + val.toUpperCase() + "</strong>"));
                b.innerHTML = namehtml;
                b.innerHTML += "<input type='hidden' value='" + (arr[i].name + "") + "'>";
                b.addEventListener("click", function (e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    document.getElementById(valueset).value = this.getAttribute("id");
                    closeAllLists();
                });
                if (!set && arr[i] != undefined) {
                    set = true;
                    document.getElementById(valueset).value = arr[i].id;// set do primeiro item como selecionado
                }
                a.appendChild(b);
            }
        }
    });
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) { //down
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) { //up
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) { //enter
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
});

