if application "Meeting Center" is running then
	tell application "System Events" to tell process "Webex Meetings"
		if (exists (menu item "Mute Me" of menu 1 of menu bar item "Participant" of menu bar 1)) or (exists (menu item "Unmute Me" of menu 1 of menu bar item "Participant" of menu bar 1)) then
			return enabled of menu item "Unmute Me" of menu 1 of menu bar item "Participant" of menu bar 1
		end if
	end tell
end if