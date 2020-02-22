--[[
  Copyright (c) 2017-2020 TStudios.
  Licensed under the AGPL 3.0 only.
--]]
local apiserver = "http://localhost" -- SET THIS TO THE SERVER
local port = 3000 -- NEEDS TO BE EQUAL TO THE ONE ON THE SERVER
local version = "0.0.0" -- DO NOT CHANGE
local token = "Example*Token." -- KEEP YOUR TOKEN PRIVATE! Enter the token that was found on the server here

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
local HttpService = game:GetService("HttpService")
print("Correct enviroment detected\nLoading!")

function getdat(userid)
  local response
  local data
  -- Use pcall in case something goes wrong
  pcall(function ()
    response = HttpService:GetAsync(apiserver .. ":" .. port .. "/getdat/" .. userid)
    data = HttpService:JSONDecode(response)
  end)
  if not data then return false end
  print(data.text)
  if data.error == true then print("ERROR") return false end
  if data.exists == false then return false end
  return data.data
end

print(getdat(0))


function setdat(userid,dat)
  local response
  local data = dat
  data.userid=userid
  -- Use pcall in case something goes wrong
  pcall(function ()
    response = HttpService:GetAsync(apiserver .. ":" .. port .. "/setdat/" .. token .. "/" .. HttpService:JSONEncode(data))
  end)
end

local module = {}
module.getdat=getdat
module.setdat=setdat
return module
