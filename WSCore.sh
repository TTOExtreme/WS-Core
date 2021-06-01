#!/bin/bash

case "$1" in 
start)
        if [ -e  /opt/Programas/WS-Core/log/log3.log ]; then
                rm -f  /opt/Programas/WS-Core/log/log3.log
        fi
        if [ -e  /opt/Programas/WS-Core/log/log2.log ]; then
                mv  /opt/Programas/WS-Core/log/log2.log  /opt/Programas/WS-Core/log/log3.log
        fi
        if [ -e /opt/Programas/WS-Core/log/log1.log ]; then
            mv  /opt/Programas/WS-Core/log/log1.log  /opt/Programas/WS-Core/log/log2.log
        fi
        if [ -e /opt/Programas/WS-Core/log/log0.log ]; then
                mv  /opt/Programas/WS-Core/log/log0.log  /opt/Programas/WS-Core/log/log1.log
        fi

	node /opt/Programas/WS-Core/_server.js >  /opt/Programas/WS-Core/log/log0.log &
	echo $!>/var/run/wscore.pid
   	;;
stop)
   	kill `cat /var/run/wscore.pid`
   	rm /var/run/wscore.pid
   	;;
restart)
   	$0 stop
   	$0 start
   	;;
status)
   	if [ -e /var/run/wscore.pid ]; then
      		echo wscore is running, pid=`cat /var/run/wscore.pid`, log=`cat /opt/Programas/WS-Core/log/log0.log`
   	else
      		echo wscore.sh is NOT running
      		exit 1
   	fi
   	;;
*)
   	echo "Usage: $0 {start|stop|status|restart}"
esac

exit 0 