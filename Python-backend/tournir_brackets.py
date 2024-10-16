from mysqlcoding import show_tournirTeams
import math
import random

def firstBracke():
    def nearest_power_of_two(n):
        return 2 ** math.floor(math.log2(len(n)))


    def findingNumd(n):
        return (len(n) - nearest_power_of_two(n))*2



    teams = [i.split(' . ')[1] for i in show_tournirTeams()
            [0]['tournir_members'].split(',')]
    num1 = findingNumd(teams)
    num2 = len(teams) - num1
    if num1 == 0:
        num1, num2 = num2, num1
    
    firstStageteams, secondStageteams = teams[:num1], teams[len(
        teams) - num2:]
    random.shuffle(firstStageteams)
    random.shuffle(secondStageteams)

    s = {
        'firstStage': [[firstStageteams[i], firstStageteams[i+1]] for i in range(0, num1, 2)],
        'secondStage': [[secondStageteams[i], secondStageteams[i+1]] for i in range(0, num2-1, 2)]
    }
    if num2 % 2 != 0:
        s['secondStage'].append([secondStageteams[-1], []])
    return s
        

