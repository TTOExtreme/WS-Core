#!/bin/bash

case "$1" in 
start)
        if [ -e  /opt/PMV/WS-Core/log/log3.log ]; then
                rm -f  /opt/PMV/WS-Core/log/log3.log
        fi
        if [ -e  /opt/PMV/WS-Core/log/log2.log ]; then
                mv  /opt/PMV/WS-Core/log/log2.log  /opt/PMV/WS-Core/log/log3.log
        fi
	if [ -e log1.log ]; then
		mv  /opt/PMV/WS-Core/log/log1.log  /opt/PMV/WS-Core/log/log2.log
	fi
        if [ -e log0.log ]; then
                mv  /opt/PMV/WS-Core/log/log0.log  /opt/PMV/WS-Core/log/log1.log
        fi

	node /opt/PMV/WS-Core/server.js >  /opt/PMV/WS-Core/log/log0.log &
	echo $!>/var/run/ws-core.pid
   	;;
stop)
   	kill `cat /var/run/ws-core.pid`
   	rm /var/run/ws-core.pid
   	;;
restart)
   	$0 stop
   	$0 start
   	;;
status)
   	if [ -e /var/run/ws-core.pid ]; then
      		echo ws-core is running, pid=`cat /var/run/ws-core.pid`, log=`tail -n -30 /opt/PMV/WS-Core/log/log0.log`
   	else
      		echo ws-core.sh is NOT running
      		exit 1
   	fi
   	;;
*)
   	echo "Usage: $0 {start|stop|status|restart}"
esac

exit 0 
