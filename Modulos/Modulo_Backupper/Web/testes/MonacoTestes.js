
require.config({ paths: { vs: '/js/libs/vs' } });


require(['vs/editor/editor.main'], function () {

    monaco.editor.setTheme('vs-dark');

    /*
    let editor = monaco.editor.create(document.getElementById('middle_screen'), {
        value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
        language: 'javascript'
    });
    //*/


    
    var diffEditor = monaco.editor.createDiffEditor(document.getElementById('middle_screen'));

    Promise.all([xhr('./original.txt'), xhr('./modified.txt')]).then(function (r) {
        var originalTxt = r[0].responseText;
        var modifiedTxt = r[1].responseText;

        diffEditor.setModel({
            original: monaco.editor.createModel(originalTxt, 'javascript'),
            modified: monaco.editor.createModel(modifiedTxt, 'javascript')
        });
    });
        

});

function xhr(url) {
    var req = null;
    return new Promise(
        function (c, e) {
            req = new XMLHttpRequest();
            req.onreadystatechange = function () {
                if (req._canceled) {
                    return;
                }

                if (req.readyState === 4) {
                    if ((req.status >= 200 && req.status < 300) || req.status === 1223) {
                        c(req);
                    } else {
                        e(req);
                    }
                    req.onreadystatechange = function () {};
                }
            };

            req.open('GET', url, true);
            req.responseType = '';

            req.send(null);
        },
        function () {
            req._canceled = true;
            req.abort();
        }
    );
}