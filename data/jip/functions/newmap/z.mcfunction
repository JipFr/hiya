execute as @e[type=armor_stand,tag=particle,limit=1] at @s run tp ~ ~ ~0.2
scoreboard players set y map 0
function jip:newmap/y
execute as @e[type=armor_stand,tag=particle,limit=1] at @s run tp ~ ~-4 ~
scoreboard players add z map 1
execute if score z map < limit map positioned ~ ~ ~1 run function jip:newmap/z