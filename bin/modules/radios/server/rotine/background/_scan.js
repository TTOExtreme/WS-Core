
require('./icmp-scan')((data) => { console.log("DONE") })

/*
require('./scan.js')(() => { });
/*
require('./scanSubnet.js').fullScanNet({ ip: "192.168.0" }, () => {
    console.log("done")
    process.exit();
});
//*/

