# RobloxData (aka RobloxDataSaving/RDS)
## An Alternative to Datastores
### About
RDS allows you to save your data on your server without relying on DataStores<br><br>
Intended for ROBLOX specific usage, but if you ignore the roblox steps below and you write your own code for something else, that will work too


### Setting up
Setting up _RDS_ is pretty simple. <br>
1. Clone this repo to some location of your choice.<br>
2. Install NODEJS if you haven't already<br>
3. ***important to not have 0 security:*** Set the AUTHENTICATION token to some random string in the index.js file - cannot include any path manipulating/etc... characters (like `/`, `#` or `?`)
4. Run `node .` in that directory _(This will run the server sided stuff_ :eyes:_)_<br>
5. Copy the contents of robloxfile.lua into a ***MODULESCRIPT*** in ServerScriptService.
6. Copy said authentication token over to the Modulescript.
7. Remove robloxfile.lua if you want.
8. Set the apiserver variable to either<br>
(a) Your server's DNS address<br>
(b) Your server's IP
9. You're done! Congrats!

<br> Just run `node .` to run the server again if you shut it down!<br>


*The core part of the readme is correct, although it still needs to be fixed up as release 0.0.1 added multi-game-support*
