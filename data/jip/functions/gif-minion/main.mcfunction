scoreboard objectives add gif-minion dummy
execute as @s[scores={gif-minion=0}] run function jip:gif-minion/0
execute as @s[scores={gif-minion=2}] run function jip:gif-minion/1
execute as @s[scores={gif-minion=4}] run function jip:gif-minion/2
execute as @s[scores={gif-minion=6}] run function jip:gif-minion/3
execute as @s[scores={gif-minion=8}] run function jip:gif-minion/4
execute as @s[scores={gif-minion=10}] run function jip:gif-minion/5
execute as @s[scores={gif-minion=12}] run function jip:gif-minion/6
execute as @s[scores={gif-minion=14}] run function jip:gif-minion/7
execute as @s[scores={gif-minion=16}] run function jip:gif-minion/8
execute as @s[scores={gif-minion=18}] run function jip:gif-minion/9
execute as @s[scores={gif-minion=20}] run function jip:gif-minion/10
execute as @s[scores={gif-minion=22}] run function jip:gif-minion/11
execute as @s[scores={gif-minion=24}] run function jip:gif-minion/12
execute as @s[scores={gif-minion=26}] run function jip:gif-minion/13
scoreboard players set @e[scores={gif-minion=28..}] gif-minion 0
scoreboard players add @s gif-minion 1