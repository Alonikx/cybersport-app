from mysqlcoding import select_results, selectTournirParticipants
import pandas as pd
import datetime
import os


def making_excell(tournir_id=2):
    # dirfiles = os.listdir('D:\Python-backend\excel')
    # if dirfiles != []:
    #     os.remove(f'D:\Python-backend\excel\{dirfiles[0]}')

    results = select_results(tournir_id=tournir_id)
    participants = selectTournirParticipants(tournir_id=tournir_id)
    s = {}
    k = {}
    for i in results:
        for j, v in i.items():
            s.setdefault(j, []).append(v)
    for i in participants:
        for j, v in i.items():
            k.setdefault(j, []).append(v)
    
    s_translated = {
    'идентификатор результатов': s['idresults'],
    'идентификатор турнира': s['tournir_id'],
    'идентификатор матча': s['match_id'],
    'название команды 1': s['team1_name'],
    'название команды 2': s['team2_name'],
    'счет команды 1': s['team1_score'],
    'счет команды 2': s['team2_score'],
    'имя победителя': s['winner_name'],
    'этап': s['stage'],
    'имя проигравшего': s['loser_name']
    }

    k_translated = {
        'идентификатор пользователя': k['vkid'],
        'ФИО': k['fio'],
        'дата рождения': k['birth_date'],
        'гражданство': k['citizenship'],
        'никнейм': k['nickname'],
        'спортивная категория': k['sport_category'],
        'УИН ГТО': k['uin_gto'],
        'название команды': k['team_name'],
        'идентификатор команды': k['team_id']
    }


    df1 = pd.DataFrame(s_translated)
    df2 = pd.DataFrame(k_translated)
    writer = pd.ExcelWriter(f'D:/Python-backend/excel/Турнир_{tournir_id}.xlsx')
    df1.to_excel(writer, 'Результаты турнира')
    df2.to_excel(writer, 'Участники турнира')
    writer.close()

making_excell()