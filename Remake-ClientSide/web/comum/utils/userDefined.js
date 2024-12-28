function init_UserDefined() {
    if (indb.UserDefined.theme != undefined) {
        loadCSSCall("comum/css/" + indb.UserDefined.theme + ".css", () => {
            if (indb.UserDefined.customColors != undefined) {
                /*indb.UserDefined.customColors.forEach(ccolor => {
                    document.documentElement.style.setProperty(ccolor.name, ccolor.value);
                });//*/
            }
        })

    }
}