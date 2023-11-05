class ContextCreator {

    ContextScreens = {};

    constructor() {
        _events.on("ContextCreator.Create", (data, callback = (id) => { }) => {
            let ctxDiv = document.createElement("div");
            let id = BCypher.generateString();
            this.ContextScreens[id] = { element: ctxDiv };

            ctxDiv.setAttribute("id", id);
            ctxDiv.setAttribute("class", "contextMenu");
            //ctxDiv.setAttribute("style", "top:" + data.data[0].y + "px;left:" + data.data[0].x + "px;");
            let table = document.createElement("table");
            ctxDiv.appendChild(table);
            //include a close button

            let tr = document.createElement("tr");

            let th1 = document.createElement('th');
            th1.setAttribute('style', 'text-align: left;')
            let move = document.createElement('i');
            move.setAttribute('class', "material-symbols-outlined move_menu");
            move.innerText = "menu";
            let move_func = (ev) => { this.move_screen(ev, ctxDiv); }
            move.onmousedown = () => {
                document.body.addEventListener('mousemove', move_func)
            }
            move.onmouseup = () => {
                document.body.removeEventListener('mousemove', move_func);
            }
            th1.appendChild(move);

            let th2 = document.createElement('th');
            th2.setAttribute('style', 'text-align: right;')
            let close = document.createElement('i');
            close.setAttribute('class', "material-symbols-outlined close_menu");
            close.innerText = "close";
            close.onclick = () => {
                _events.emit("ContextCreator.Close", id);
            };
            th2.appendChild(close);

            tr.appendChild(th1);
            tr.appendChild(th2);

            table.appendChild(tr);


            if (data != {} && data != null) {
                data.items.forEach(item => {
                    let tr = document.createElement("tr");
                    tr.innerHTML = "<td><p " + ((item.active) ? "" : "class='ctx-item-disabled'") + ">" + item.name + "</p></td>";
                    if (item.input != undefined) {
                        if (item.inputType == 'element') {
                            let td = document.createElement('td');
                            td.appendChild(item.input);
                            tr.appendChild(td);
                        } else {
                            tr.innerHTML += "<td>" + item.input + "</td>";
                        }
                    }
                    if (item.event != undefined) {
                        if (typeof (item.event.call) == 'function') {
                            tr.onclick = () => {
                                //_events.emit("ContextCreator.Close", id);
                                item.event.call(item.event.data);
                            }
                        }
                    }
                    table.appendChild(tr);
                });
            }
            document.body.appendChild(ctxDiv);
            callback(id);
        })

        _events.on("ContextCreator.Close", (id) => {
            if (id) {
                if (this.ContextScreens[id] != undefined) {
                    document.body.removeChild(this.ContextScreens[id].element)
                    delete this.ContextScreens[id];
                }
            }
        })
    }

    /**
     * Realiza a movimentação do elemento
     * @param {Event} ev Evento do mouse move
     * @param {Element} div Elemento a ser movido
     */
    move_screen(ev, div) {
        div.style.top = "calc(" + (ev.clientY - 20) + "px - 1em)";
        div.style.left = "calc(" + (ev.clientX - 20) + "px - 1em)";
        div.style.transform = "translate(15px,15px)";

    }


    /**
     * Cria um Context Dummy para testes e Exemplo
     */
    CreateDummy() {
        let input = document.createElement('input');
        let textarea = document.createElement('textarea');
        _events.emit("ContextCreator.Create",
            {
                items: [
                    {
                        active: true,
                        name: "Teste Nome 1",
                        input: "<input value='Input Texto'>",/*
                        event: {
                            call: (dados) => { console.log("On click evento1", dados) },
                            data: "Payload1"
                        }//*/
                    },
                    {
                        active: true,
                        name: "Teste Nome 2",
                        input: input,
                        inputType: 'element',/*
                        event: {
                            call: (dados) => { console.log("On click evento2", dados) },
                            data: "Payload5"
                        }//*/
                    },
                    {
                        active: true,
                        name: "Teste Nome 3",
                        input: textarea,
                        inputType: 'element',/*
                        event: {
                            call: (dados) => { console.log("On click evento3", dados) },
                            data: "Payload3"
                        }//*/
                    },
                    {
                        active: true,
                        name: "Teste Nome 4",/*
                        event: {
                            call: (dados) => { console.log("On click evento4", dados) },
                            data: "Payload4"
                        }//*/
                    },
                    {
                        active: true,
                        name: "",/*
                        event: {
                            call: (dados) => { console.log("On click evento4", dados) },
                            data: "Payload4"
                        }//*/
                    },
                ]
            }
            , (id) => {
                console.log("ID Contexto", id);
            })
    }

}
