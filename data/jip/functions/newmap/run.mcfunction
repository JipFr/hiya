execute as @s at @s unless entity @e[type=armor_stand,tag=particle] run summon minecraft:armor_stand ~-3 ~-3 ~-3 {Tags:["particle"],NoGravity:1b,Invisible:1b,Marker:1b}
scoreboard objectives add map dummy
scoreboard players set limit map 30
scoreboard players set z map 0
execute positioned ~-15 ~-15 ~-15 run function jip:newmap/z
execute as @e[type=armor_stand,tag=particle,limit=1] at @s run tp ~ ~ ~-6
execute at @s run teleport @e[type=armor_stand,tag=particle,limit=1] ~-3 ~-3 ~-3