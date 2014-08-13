#! /bin/bash
# wmtowerfall R1 by R. Brandon Kime
# Report bugs on the Steam Community Forums for Towerfall or
# send them to rbrandonkime@gmail.com

# This script connects an arbitrary number of Wii remotes via wminput and
# maps them to virtual Xbox controllers using xboxdrv.
# Should work with any Wii peripherals or Xbox mappings
# with the right wminput/xboxdrv configuration files.

# Cleanup for early interrupt.

int_handle()
{
echo -e "\n"
# Sometimes you have to be harsh with your children.
killall -s SIGKILL wminput 2> /dev/null
sleep 1 # Gives xboxdrv a chance to exit nicely. It usually does.
killall -s SIGKILL xboxdrv 2> /dev/null
rm .event.tmp 2> /dev/null
exit 1
}

trap int_handle INT


# Help text

usage()
{
cat << EOF
This script uses wminput to connect one or more Wii remotes
and maps them to virtual Xbox controllers using xboxdrv.

Usage: wmtowerfall [options]...

Options:
		-h,		Prints this message.
		-n N,		Connects N controllers one at a time.
		-x PATH,	Uses the xboxdrv configuration file at PATH.
		-k,		Kills all wminput/xboxdrv instances.

If no options are given, one controller is connected and default
configuration files are used.
EOF
}

# Default settings

# Checks own directory for configuration files.
MYDIR="$(dirname "$(readlink -f "$0")")"

controllers=1
# TODO: Let script be properly installed by giving config files a home.
xconfig=$MYDIR/web2xbox.xbox
interactive=true

# Command line option processing.
while getopts "hn:x:k" OPTION
do
	case $OPTION in
		h)
			usage
			exit 0
			;;
		n)
			controllers=$OPTARG
			;;
		x)
			xconfig=$OPTARG
			;;
		k)
			killall -s SIGKILL xboxdrv
			exit 0
			;;
		?)
			usage
			exit 1
			;;
	esac
done

ctrlctr=1

ls /dev/input > .event.tmp # XXX: The whole evdev ID process is a hack.
# See lines 131+132.

# Loop through desired controllers.
while [[ $ctrlctr -le $controllers ]]; do 

	echo -e "\nConnecting web controller $ctrlctr\n"
	let 'ctrlctr += 1'
	
	echo -e "Connect to the webctrl server, then press Enter (or n, for 'next'). Press q to abort.\n\nProtip: Configure the 'start' button to be c, so you can use your controller to continue!"
	
	while true ; do # Wait until we get a valid response.
		read -n 1 -s result
		case $result in
		q|Q)
			kill -SIGINT $$ # Same as Ctrl-C
			;;
		n|N|\n) # Continue with current iteration.
			break
			;;
		esac
	done

# Compare the "event" list now to the one from earlier

	event=$(ls /dev/input | diff - .event.tmp | grep event | \
sed 's+[><]\ event+event+') # FIXME

	echo -e "Web controller is on $event, starting xboxdrv."

	xboxdrv -c $xconfig --evdev /dev/input/$event > /dev/null &
# XXX: This --axismap should be in the config file.
# --silent xboxdrv is kinda loud...

	sleep 1 # XXX: Part of the hack that grabs the event device.
# Works though :) Just waits long enough for xboxdrv to set up its own event
# device so that it doesn't interfere with the diff.

	ls /dev/input > .event.tmp

done

echo -e "\nAll controllers connected successfully!"
# Or at least they said they did...

echo "Press Ctrl-C or \"q\" to disconnect controllers and exit."

# We exit with SIGINT regardless, so make it look nice.
# Basically the same INT handler as at the beginning but with exit 0.
trap "echo -e \"\nCompleted successfully, cleaning up.\"
killall -s SIGKILL xboxdrv 2> /dev/null
rm .event.tmp 2>/dev/null
exit 0" INT 

# Wait for a SIGINT.
while true ; do
	read -n 1 -s quitter
	if [[ $quitter == q || Q ]]
		then kill -SIGINT $$
	fi
done


