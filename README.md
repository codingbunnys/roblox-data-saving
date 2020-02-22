# RobloxData (aka RobloxDataSaving/RDS)
## An Alternative to Datastores
### About
RDS allows you, and I mean ***__YOU__*** to save your data on your server


### Setting up
Setting up _RDS_ is pretty simple. <br>
1. Clone this repo to some location of your choice.<br>
2. Install NODEJS if you haven't already<br>
3. Run `node .` in that directory _(This will run the server sided stuff_ :eyes:_)_<br>
4. Copy the contents of robloxfile.lua into a ***MODULESCRIPT*** in ServerScriptService.
5. ***important to not have 0 security:*** Set the AUTHENTICATION token to some random string in the index.js file - cannot include any path manipulating/etc... characters (like `/`, `#` or `?`)
6. Copy said authentication token over to the Modulescript.
7. Remove robloxfile.lua if you want.
8. You're done! Congrats!
