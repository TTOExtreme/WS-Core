#!/bin/bash

case "$1" in 
start)
        if [ ! -d  ./log ]; then
                mkdir ./log
        fi
        if [ -e  ./log/log3.log ]; then
                rm -f  ./log/log3.log
        fi
        if [ -e  ./log/log2.log ]; then
                mv  ./log/log2.log  ./log/log3.log
        fi
        if [ -e ./log/log1.log ]; then
            mv  ./log/log1.log  ./log/log2.log
        fi
        if [ -e ./log/log0.log ]; then
                mv  ./log/log0.log  ./log/log1.log
        fi

	node ./_Server-Run.js >  ./log/log0.log &
	echo $!>/var/run/wscore_v2.0.pid
   	;;
stop)
   	kill `cat /var/run/wscore_v2.0.pid`
   	rm /var/run/wscore_v2.0.pid
   	;;
restart)
   	$0 stop
   	$0 start
   	;;
status)
   	if [ -e /var/run/wscore_v2.0.pid ]; then
      		echo wscore is running, pid=`cat /var/run/wscore_v2.0.pid`, log=
		cat ./log/log0.log
   	else
      		echo WS-Core is NOT running
      		exit 1
   	fi
   	;;
*)
   	echo "Usage: $0 {start|stop|status|restart}"
esac

exit 0 
