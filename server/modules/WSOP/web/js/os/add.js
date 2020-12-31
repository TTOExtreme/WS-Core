ClientEvents.on("WSOP/os/add", () => {
    ClientEvents.emit("WSOP/os/close");
    let data = {
        cliente: "",
        id_cliente: "",
        description: "",
        status: 0,
        barcode: "",
        cost: "",
        price: "",
        inventory: "",
        active: 1
    }

    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsop_add_div");
    div.setAttribute("id", "wsop_add_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_wsop_add' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsop_add_div')>&#9776;</td><td class='wsop_edt_label'><p class='wsop_add_closeButton' onclick='ClientEvents.emit(\"WSOP/os/close\")'>X</p></td></tr>" +
        "<tr><td class='wsop_edt_label'>Cliente:</td><td><input id='wsop_add_cliente' type='text' value='" + data.cliente + "'></td></tr>" +
        "<tr style='display:none;'><td class='wsop_edt_label'>Cliente:</td><td><input id='wsop_add_id_cliente' type='text' value='" + data.id_cliente + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Status:</td><td><Select id='wsop_add_status'>" + StatusIdToOptList(data.status) + "</select></td></tr>" +
        "<tr><td class='wsop_edt_label'>Descrição:</td><td><input id='wsop_add_description' type='text' value='" + data.description + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Ativo:</td><td><input id='wsop_add_active' type='checkbox' " + ((data.active == 1) ? "Checked" : "") + "></td></tr>" +
        "<tr><td colspan=2 class='wsop_edt_label_info' id='wsop_add_info'></td></tr>" +
        "<tr><td></td><td><input id='wpma_sites_submit' value='Adicionar' type='button' onclick='ClientEvents.emit(\"WSOP/os/save\")' accept='image/gif, image/jpeg, image/png'></td></tr>" +
        "</table>";

    document.body.appendChild(div);
    ClientEvents.emit("SendSocket", "wsop/os/clientes/lst");
});

ClientEvents.on("WSOP/os/close", () => {
    if (document.getElementById("wsop_add_div")) {
        document.body.removeChild(document.getElementById("wsop_add_div"));
    }
});


ClientEvents.on("WSOP/os/save", () => {
    ClientEvents.emit("SendSocket", "wsop/os/add", {
        id_cliente: document.getElementById("wsop_add_id_cliente").value,
        description: document.getElementById("wsop_add_description").value,
        active: document.getElementById("wsop_add_active").checked,
        status: document.getElementById("wsop_add_status").value,
    });
    /**
     * save data and closes the page if success
     * closing part from server command
     */
})



ClientEvents.on("wsop/os/clientes/lst", (arr) => {
    console.log(arr)
    let inp = document.getElementById("wsop_add_cliente");
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
        for (i = 0; i < arr.length; i++) {
            if ((arr[i].name + "").substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                b = document.createElement("DIV");
                b.setAttribute("id", arr[i].id)
                b.innerHTML = "<strong>" + (arr[i].name + "").substr(0, val.length) + "</strong>";/*make the matching letters bold:*/
                b.innerHTML += (arr[i].name + "").substr(val.length);
                b.innerHTML += "<input type='hidden' value='" + (arr[i].name + "") + "'>";
                b.addEventListener("click", function (e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    document.getElementById("wsop_add_id_cliente").value = this.getAttribute("id");
                    closeAllLists();
                });
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

