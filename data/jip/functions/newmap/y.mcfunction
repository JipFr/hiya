execute as @e[type=armor_stand,tag=particle,limit=1] at @s run tp ~ ~0.2 ~
scoreboard players set x map 0
function jip:newmap/x
execute as @e[type=armor_stand,tag=particle,limit=1] at @s run tp ~-6 ~ ~
scoreboard players add y map 1
execute if score y map < limit map positioned ~ ~1 ~ run function jip:newmap/y