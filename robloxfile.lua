--[[
  Copyright (c) 2017-2020 TStudios.
  Licensed under the AGPL 3.0 only.
--]]

local apiserver = "http://localhost" -- SET THIS TO THE SERVER'S IP
local port = 42168 -- NEEDS TO BE EQUAL TO THE ONE ON THE SERVER
local version = "0.0.1" -- DO NOT CHANGE
local token = "Example*Token." -- KEEP YOUR TOKEN PRIVATE! Enter the token that was found on the server here
local gamename = "Default_Game" -- Must match the one found corresponding to the token in the server (does that make sense?)

-- Credits - DO NOT REMOVE --
print("RobloxData v" .. version .. " - External server software to replace datastores.\nCopyright (c) 2017-2020 TStudios.\nLicensed under the AGPL 3.0 only.")


-- Ensure is ROBLOX --
if game == nil or game.ServerScriptService == nil then
  return print("\27[31mDid not detect ROBLOX Game Client - Exiting!\27[0m\nFor clueless people, here's what you need to know: This software is not intended for normal raw lua usage")
end

-- Ensure running on server --
if script.ClassName ~= "ModuleScript" or script.Parent ~= game.ServerScriptService then
  print("Error - Not Running on SERVER as a MODULESCRIPT in SERVERSCRIPTSERVICEC\nFor clueless people, here's what you need to know: This software is not intended for local-/modulescripts")
  return script:Destroy()
end





-- Actual Code
local module = {}
local console
local success,msg = pcall(function()
	console = require(game.ServerScriptService.Console)
end)
if not console or not console.log then
    success,msg = pcall(function()
		console = require(script.Console)
		script.Console.Parent=game.ServerScriptService
	end)
end
local log
local info
local warning
if console and console.log then
	log = console.log
	info = console.info
	warning = console.warn
else
	log = print
	info = log
	warning = warn
	warn("Console module failed to load - " .. msg)
end
local HttpService = game:GetService("HttpService")
log("Correct enviroment detected\nLoading!")

function module:getdat(userid)
  local response
  local data
  -- Use pcall in case something goes wrong
  local success, msg = pcall(function()
    response = HttpService:GetAsync(apiserver .. ":" .. port .. "/getdat/" .. gamename .. "/" .. userid)
    data = HttpService:JSONDecode(response)
  end)
  if not data or not response then
	  log("Sending Request to localhost...")
	  info("Using localhost just incase server is running locally\nGetting from main server failed")
	  local success, msg = pcall(function()
	  	response = HttpService:GetAsync("http://localhost:" .. port .. "/getdat/" .. gamename .. "/" .. userid)
	  end)
	  log("Request sent")
	  data = HttpService:JSONDecode(response)
  end
  if not data then return "no_data" end
  if data.error == true then warning("Server-err") return "error" end
  if data.exists == false then return "no_exist" end
  return data.data
end

function module:setdat(userid,dat)
  local response
  local data = dat
  data.userid=userid
  data=HttpService:UrlEncode(HttpService:JSONEncode(data))
  log("Sending Request...")
  local success, msg = pcall(function()
	  response = HttpService:GetAsync(apiserver .. ":" .. port .. "/setdat/" .. token .. "/" .. gamename .. "/" .. data)
	  log("Request sent")
	  data = HttpService:JSONDecode(response)
  end)
  if not data or not response then
	  log("Sending Request to localhost...")
	  info("Using localhost just incase server is running locally\nGetting from main server failed")
	  local success, msg = pcall(function()
	  	response = HttpService:GetAsync("http://localhost:" .. port .. "/setdat/" .. token .. "/" .. gamename .. "/" .. data)
	  end)
	  log("Request sent")
	  data = HttpService:JSONDecode(response)
  end
  if data.error == false then
	return true
  else
	return false
  end
end

function module:unixtime()
  local response
  local data
  log("Sending Request...")
  local success, msg = pcall(function()
	response = HttpService:GetAsync(apiserver .. ":" .. port .. "/utctime")
    data = HttpService:JSONDecode(response)
  end)
  log("Request sent")
  if not data or not response then
	  log("Sending Request to localhost...")
	  info("Using localhost just incase server is running locally\nGetting from main server failed")
	  local success, msg = pcall(function()
	  	response = HttpService:GetAsync("http://localhost:" .. port .. "/utctime")
	  end)
	  log("Request sent")
	  data = HttpService:JSONDecode(response)
  end
  if not data or not response then
	info("Failed to get from localhost and from online API server - using server time")
	local date = os.date(os.time())
	local dat = {}
	dat.time=date.hour .. ":" .. date.min .. ":" .. date.sec
	dat.unix=os.time()
	return dat
  end
  return data
end

return module
