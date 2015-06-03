# Watchdog

## About
Watchdog is a simple utility for the Twitch diehard. It removes the pain of opening your browser, loading the streamers you follow, and finally (after YEARS of loading screens) seeing if there's anyone even worth watching currently streaming. Instead, you can run a single command from your terminal and immediately know who is streaming - before you've even opened a browser!

## Goals
1. Avoid the hassle that is encountered when trying to use twitch. This means finding streamers and launching the stream without ever having to open a browser and navigating to twitch.tv
2. Provide a clean, easy, and seemless process for viewing your favorite streamers.

Note - This app is NOT a replacement for twitch. You'll still need an account and you'll still need to manage everything through Twitch. This just provides a simpler workflow for receiving notifications of your favorite streamers and then launching that particular stream.

## Installing Watchdog
Watchdog requires that you have node and npm installed on your system. If you don't, please install those first.

1. Clone the repository with `git clone git@github.com:stormageddon/watchdog.git`
2. navigate into the watchdog project
3. Run `npm install` to install the dependencies.

You are now set to begin using Watchdog!

## To run Watchdog
Simply run `node watchdog.js <Your Twitch Username>` in the watchdog directory. It's really that easy!

If you want to make it even easier to see who's online, you can alias the above command to `twitch` or `watchdog` in your baschrc, zshrc, or the config for whichever shell you use. Just make sure to prepend the full directory path before `watchdog.js` in the command.

## Current status
Watchdog is in the very early stages of development. At this point in time, all it will do is display a list of the channels that you watch that are currently streaming.
