scoreboard players set y2 map 0
function jip:newmap/y2
scoreboard players add z2 map 1
execute if score z2 map < limit map positioned ~ ~ ~1 run function jip:newmap/z2