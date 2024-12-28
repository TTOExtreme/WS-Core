
require('./bin/rotine/sql/delete/database')(() => {
    require('./bin/rotine/sql/create/database')(() => {
        require('./bin/rotine/sql/create/tables')(() => {
            require('./bin/rotine/sql/create/data')(() => {
                console.log("\n\nSuccess!");
                process.exit();
            })
        })
    })
})