execute as @e[type=armor_stand,tag=particle,limit=1] at @s run tp ~0.2 ~ ~
function jip:realtime-ingame-check
scoreboard players add x map 1
execute if score x map < limit map positioned ~1 ~ ~ run function jip:newmap/x