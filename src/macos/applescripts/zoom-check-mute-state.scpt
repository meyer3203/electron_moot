property muteTitle : "Mute Audio"
property unmuteTitle : "Unmute Audio"

if application "zoom.us" is running then
    tell application "System Events"
        tell application process "zoom.us"
            if exists (menu item muteTitle of menu 1 of menu bar item "Meeting" of menu bar 1) then
                set returnValue to "Unmuted"
            else if exists (menu item unmuteTitle of menu 1 of menu bar item "Meeting" of menu bar 1) then
                set returnValue to "Muted"
            else
                set returnValue to "n/a"
            end if
        end tell
    end tell
else
    set returnValue to "n/a"
end if

return returnValue
