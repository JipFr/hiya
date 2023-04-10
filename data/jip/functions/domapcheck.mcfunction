scoreboard players set limit map 15
tellraw @a {"score":{"name":"x","objective":"map"}}
tellraw @a {"score":{"name":"y","objective":"map"}}
tellraw @a {"score":{"name":"z","objective":"map"}}
tellraw @a {"text": "---"}
execute as @e[type=armor_stand,tag=!particle] at @s positioned ~ ~ ~ run function jip:realtime-ingame-check
scoreboard players add x map 1
execute if score x map < limit map positioned ~1 ~ ~ run function jip:domapcheck
scoreboard players add y map 1
execute if score y map < limit map positioned ~ ~1 ~ run function jip:domapcheck
scoreboard players add z map 1
execute if score z map < limit map positioned ~ ~ ~1 run function jip:domapcheck