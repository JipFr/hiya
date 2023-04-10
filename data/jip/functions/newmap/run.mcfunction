execute as @s at @s unless entity @e[type=armor_stand,tag=particle] run summon minecraft:armor_stand ~-2 ~-2 ~-2 {Tags:["particle"],NoGravity:1b,Invisible:1b,Marker:1b}
scoreboard objectives add map dummy
scoreboard players set limit map 20
scoreboard players set z map 0
execute positioned ~-10 ~-10 ~-10 run function jip:newmap/z
execute as @e[type=armor_stand,tag=particle,limit=1] at @s run tp ~ ~ ~-4
execute at @s run teleport @e[type=armor_stand,tag=particle,limit=1] ~-2 ~-2 ~-2