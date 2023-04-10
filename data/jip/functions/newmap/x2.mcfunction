function jip:realtime-ingame-check
scoreboard players add x2 map 1
execute if score x2 map < limit map positioned ~1 ~ ~ run function jip:newmap/x2