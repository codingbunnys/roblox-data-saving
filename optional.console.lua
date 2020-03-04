--[[
  OPTIONAL CONTENT
  ---------------
  To add, copy the contents of this file and paste them into a modulescript called 'Console' in ServerScriptService or inside of the roblox datasaving modulescript
--]]

-- For JS developers - allows console.log,console.warn,console.error,etc...
-- by me_DS
local config = {
	debugcheck = true; -- If true, sets debug mode to game.ReplicatedStorage.DebugOutput - If false, output anyway
}

local console = {}

if not game.ReplicatedStorage.DebugOutput then
	local debout = Instance.new("BoolValue",game.ReplicatedStorage)
	debout.Name="DebugOutput"
	debout.Value=false
end

local debugmode = true
if config.debugcheck == true and game.ReplicatedStorage.DebugOutput.Value == false then
	debugmode = false
end

console.debugmode = debugmode

console.log = function(text)
	if debugmode then
		print(text)
	end
end

console.info = function(text)
	if debugmode then
		game:GetService("TestService"):Message(text)
	end
end

console.warn = function(text)
	if debugmode then
		game:GetService("TestService"):warn(text)
	end
end

console.warning = console.warn

console.error = function(text)
	if debugmode then
		game:GetService("TestService"):error(text)
	end
end

console.fatalerror = function(text)
	if debugmode then
		game:GetService("TestService"):fatal(text)
	end
end

console.fatal = console.fatalerror

_G.console = console
if not _G.Js then
	_G.Js={}
end
_G.Js.Console = _G.console

game:GetService("TestService"):Message("Loaded JavaScript-Inspired Console module (for JS developers)")

return console
