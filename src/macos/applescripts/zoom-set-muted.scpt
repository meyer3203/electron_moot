property muteTitle : "Mute Audio"
property unmuteTitle : "Unmute Audio"

if application "zoom.us" is running then
	tell application "System Events"
		tell application process "zoom.us"
			if (exists (menu item muteTitle of menu 1 of menu bar item "Meeting" of menu bar 1)) or (exists (menu item unmuteTitle of menu 1 of menu bar item "Meeting" of menu bar 1)) then
				tell application "zoom.us" to activate
				if exists (menu item muteTitle of menu 1 of menu bar item "Meeting" of menu bar 1) then
					tell application "System Events" to keystroke "a" using {command down, shift down}
				end if
			end if
		end tell
	end tell
end if
