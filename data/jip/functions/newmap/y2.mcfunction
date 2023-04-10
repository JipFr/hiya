scoreboard players set x2 map 0
function jip:newmap/x2
scoreboard players add y2 map 1
execute if score y2 map < limit map positioned ~ ~1 ~ run function jip:newmap/y2