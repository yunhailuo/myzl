# Countdown Timer

The timer is available at `/timer` and defaults to five minutes. Type digits to
set a duration from right to left; `69` displays `00:69` and starts as `01:09`.
Backspace deletes digits, and tapping the display opens the numeric keyboard on
touch devices.

Durations range from zero to 99 minutes; zero cannot be started. Pause preserves
the remaining time, and Reset restores the configured duration. Looping
automatically starts another lap. The 1–15-second alert threshold is configurable
in Settings.

The timer keeps running while navigating within the app. Only its duration,
alert threshold, and looping setting persist across reloads.

The timer circle scales to fit common phone, tablet, and laptop viewports without
page scrolling.

The store refreshes the display every 100 ms and measures actual elapsed time
between updates, preventing delayed browser callbacks from making it drift.
