Config = {}

Config.ChangeJobCooldown = 30
Config.StatusCooldown = 30
Config.SubCooldown = 30

Config.Companies = {
    { name = "Ambulance", job = "ambulance", img = "ems", showStatus = true },
    { name = "Politiet", job = "police", img = "politiet", showStatus = false },
    { name = "Retsbygningen", job = "retten", img = "retten", showStatus = true },
    { name = "Auto Exotic", job = "mecano", img = "mekaniker", showStatus = true },
    { name = "Bilforhandler", job = "bilforhandler", img = "bilforhandler", showStatus = true },
    { name = "MC Forhandler", job = "mcforhandler", img = "mcforhandler", showStatus = true },
    { name = "Ejendomsmægler", job = "realestate", img = "realestate", showStatus = true },
    { name = "Taxi", job = "taxi", img = "taxi", showStatus = true },
    { name = "Weazel News", job = "weazel", img = "weazel", showStatus = true },
}

print_r = function(t)
    local print_r_cache = {}
    local function sub_print_r(t, indent)
        if (print_r_cache[tostring(t)]) then
            print(indent .. "*" .. tostring(t))
        else
            print_r_cache[tostring(t)] = true
            if (type(t) == "table") then
                for pos, val in pairs(t) do
                    if (type(val) == "table") then
                        print(indent .. "[" .. pos .. "] => " .. tostring(t) .. " {")
                        sub_print_r(val, indent .. string.rep(" ", string.len(pos) + 8))
                        print(indent .. string.rep(" ", string.len(pos) + 6) .. "}")
                    else
                        print(indent .. "[" .. pos .. "] => " .. tostring(val))
                    end
                end
            else
                print(indent .. tostring(t))
            end
        end
    end

    sub_print_r(t, "  ")
end

tableContains = function(t, val)
    for k, v in pairs(t) do
        if v == val then
            return true
        end
    end
    return false
end

tablelength = function(T)
    local count = 0
    for _ in pairs(T) do count = count + 1 end
    return count
end
