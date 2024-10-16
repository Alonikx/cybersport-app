import pymysql.cursors
from config import password, user, db_name, host
import pymysql

def insert_user(vkid, first_name, last_name):
    try:
        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            db=db_name,
            cursorclass=pymysql.cursors.DictCursor
        )

        try:
            with connection.cursor() as cursor:
                select_query = f"INSERT INTO `participants`(vkid, role, first_name, last_name) VALUES ({vkid}, 'Участник', '{first_name}', '{last_name}')"
                cursor.execute(select_query)
                connection.commit()
                print('Запись добавлена')
        finally:
            connection.close()

    except Exception as ex:
        print('Ошибка подключения 1', ex)


def select_users(user_id):
    try:

        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            db=db_name,
            cursorclass=pymysql.cursors.DictCursor
        )

        try:
            with connection.cursor() as cursor:
                select_query = f"SELECT * FROM  participants where vkid={user_id}"
                cursor.execute(select_query)
                rows = cursor.fetchone()
                return rows
        finally:
            connection.close()

    except Exception as ex:
        print('Ошибка подключения 2', ex)

def select_all_users():
    try:

        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            db=db_name,
            cursorclass=pymysql.cursors.DictCursor
        )

        try:
            with connection.cursor() as cursor:
                select_query = "SELECT * FROM participants"
                cursor.execute(select_query)
                rows = cursor.fetchall()
                return rows
        finally:
            connection.close()

    except Exception as ex:
        print('Ошибка подключения 2.1', ex)


def add_team(vkid, teamname, teamid, type):
    try:
        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            db=db_name,
            cursorclass=pymysql.cursors.DictCursor
        )

        try:
            with connection.cursor() as cursor:
                select_query = f"INSERT INTO `teams`(team_id, team_name, team_type) VALUES ({teamid}, '{teamname}', '{type}')"
                select_query2 = f"INSERT INTO `team_participants`(teams_team_id, users_vkid) VALUES ({teamid}, '{vkid}')"
                cursor.execute(select_query)
                cursor.execute(select_query2)
                connection.commit()
                print('Запись добавлена')
        finally:
            connection.close()

    except Exception as ex:
        print('Ошибка подключения 3', ex)


def select_teams(user_id):
    try:

        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            db=db_name,
            cursorclass=pymysql.cursors.DictCursor
        )

        try:
            with connection.cursor() as cursor:
                select_query = f'''SELECT teams.team_id, teams.team_name, teams.team_type,  GROUP_CONCAT(participants.vkid, " . ", participants.first_name, " . ",
                participants.last_name, " . ", participants.role) AS team_members
                                FROM teams
                                JOIN team_participants ON teams.team_id = team_participants.teams_team_id
                                JOIN participants ON team_participants.users_vkid = participants.vkid
                                where participants.vkid={user_id}
                                GROUP BY teams.team_id;'''
                cursor.execute(select_query)
                rows = cursor.fetchall()
                return rows
        finally:
            connection.close()

    except Exception as ex:
        print('Ошибка подключения 4', ex)

def select_teams_by_type(user_id, type):
    try:

        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            db=db_name,
            cursorclass=pymysql.cursors.DictCursor
        )

        try:
            with connection.cursor() as cursor:
                select_query = f'''SELECT teams.team_id, teams.team_name, teams.team_type,
                                        GROUP_CONCAT(participants.vkid, " . ", participants.first_name, " . ",
                                                        participants.last_name, " . ", participants.role) AS team_members
                                    FROM teams
                                    JOIN team_participants ON teams.team_id = team_participants.teams_team_id
                                    JOIN participants ON team_participants.users_vkid = participants.vkid
                                    WHERE teams.team_type = '{type}'
                                    AND teams.team_id IN (
                                        SELECT teams.team_id
                                        FROM teams
                                        JOIN team_participants ON teams.team_id = team_participants.teams_team_id
                                        WHERE team_participants.users_vkid = {user_id}
                                    )
                                    GROUP BY teams.team_id;'''
                cursor.execute(select_query)
                rows = cursor.fetchall()
                return rows
        finally:
            connection.close()

    except Exception as ex:
        print('Ошибка подключения 4', ex)
def add_notification(vkid, teamid, teamName):
    try:

        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            db=db_name,
            cursorclass=pymysql.cursors.DictCursor
        )

        try:
            with connection.cursor() as cursor:
                post_query = f'insert into invites(vkid, teamID, teamName) values({vkid}, {teamid}, "{teamName}")'
                cursor.execute(post_query)
                connection.commit()
                print('Запись добавлена')
        finally:
            connection.close()
    except Exception as ex:
        print('Ошибка подключения 5', ex)



def select_notifications(user_id):
    try:
        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            db=db_name,
            cursorclass=pymysql.cursors.DictCursor
        )

        try:
            with connection.cursor() as cursor:
                select_query = f"SELECT * FROM invites where vkid={user_id}"
                cursor.execute(select_query)
                rows = cursor.fetchone()
                return rows
        finally:
            connection.close()

    except Exception as ex:
        print('Ошибка подключения 6', ex)


def accept_invite(vkid, team_id):
    try:
        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            db=db_name,
            cursorclass=pymysql.cursors.DictCursor
        )

        try:
            with connection.cursor() as cursor:
                select_query = f"delete from invites where vkid={vkid}"
                cursor.execute(select_query)
                query2 = f"insert into team_participants(teams_team_id, users_vkid) values({team_id}, {vkid})"
                cursor.execute(query2)
                connection.commit()
        finally:
            connection.close()

    except Exception as ex:
        print('Ошибка подключения 7', ex)


def decline_invite(vkid):
    try:
        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            db=db_name,
            cursorclass=pymysql.cursors.DictCursor
        )

        try:
            with connection.cursor() as cursor:
                select_query = f"delete from invites where vkid={vkid}"
                cursor.execute(select_query)
                connection.commit()
        finally:
            connection.close()

    except Exception as ex:
        print('Ошибка подключения 8', ex)


def select_tournirs():
    try:
        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            db=db_name,
            cursorclass=pymysql.cursors.DictCursor
        )

        try:
            with connection.cursor() as cursor:
                select_query = "SELECT * FROM tournirs"
                cursor.execute(select_query)
                rows = cursor.fetchall()
                return rows
        finally:
            connection.close()

    except Exception as ex:
        print('Ошибка подключения 9', ex)


def delete_member(vkid, team_id):
    try:
        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            db=db_name,
            cursorclass=pymysql.cursors.DictCursor
        )

        try:
            with connection.cursor() as cursor:
                select_query = f"delete from team_participants where users_vkid = {vkid} and teams_team_id={team_id}"
                cursor.execute(select_query)
                connection.commit()
                print('Запись удалена')
        finally:
            connection.close()

    except Exception as ex:
        print('Ошибка подключения 10', ex)


def delete_team(teamID):
    try:
        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            db=db_name,
            cursorclass=pymysql.cursors.DictCursor
        )

        try:
            with connection.cursor() as cursor:
                select_query = f"delete from team_participants where teams_team_id = {teamID}"
                select_query2 = f"delete from teams where team_id = {teamID}"
                select_query3 = f"delete from invites where teamID = {teamID}"
                select_query4 = f"delete from teams_waiting where team_id = {teamID}"
                select_query5 = f"delete from tournir_teamparticipants where teams_team_id = {teamID}"
                cursor.execute(select_query)
                cursor.execute(select_query5)
                cursor.execute(select_query3)
                cursor.execute(select_query4)
                cursor.execute(select_query2)
                connection.commit()
                print('Запись удалена')
        finally:
            connection.close()

    except Exception as ex:
        print('Ошибка подключения 11', ex)


def select_teamParticipants(team_id):
    try:
        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            db=db_name,
            cursorclass=pymysql.cursors.DictCursor
        )

        try:
            with connection.cursor() as cursor:
                select_query = f"SELECT * FROM team_participants where teams_team_id = {team_id}"
                cursor.execute(select_query)
                rows = cursor.fetchall()
                return rows
        finally:
            connection.close()

    except Exception as ex:
        print('Ошибка подключения 12', ex)


def add_teamsWaiting(team_id, team_name, team_quantity, tournir_id):
    try:
        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            db=db_name,
            cursorclass=pymysql.cursors.DictCursor
        )

        try:
            with connection.cursor() as cursor:
                select_query = f"insert into teams_waiting(team_id, team_name, team_quantity, tournir_id) values ({team_id}, '{team_name}', {team_quantity}, {tournir_id})"
                cursor.execute(select_query)
                connection.commit()
                print('Заявка добавлена')
        finally:
            connection.close()

    except Exception as ex:
        print('Ошибка подключения 13', ex)


def select_teamWaiting(tournir_id):
    try:
        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            db=db_name,
            cursorclass=pymysql.cursors.DictCursor
        )

        try:
            with connection.cursor() as cursor:
                query = f"select * from teams_waiting where tournir_id={tournir_id}"
                cursor.execute(query)
                rows = cursor.fetchall()
                return rows
        finally:
            connection.close()

    except Exception as ex:
        print('Ошибка подключения 14', ex)


def select_teamWaitingByuser(team_id, tournir_id):
    try:
        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            db=db_name,
            cursorclass=pymysql.cursors.DictCursor
        )

        try:
            with connection.cursor() as cursor:
                query = f"select * from teams_waiting where team_id = {team_id} and tournir_id={tournir_id}"
                cursor.execute(query)
                rows = cursor.fetchone()
                return rows
        finally:
            connection.close()

    except Exception as ex:
        print('Ошибка подключения 14.1', ex)

def delete_teamWaiting(teamid,tournir_id):
    try:
        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            db=db_name,
            cursorclass=pymysql.cursors.DictCursor
        )

        try:
            with connection.cursor() as cursor:
                query = f"delete from teams_waiting where team_id = {teamid} and tournir_id={tournir_id}"
                cursor.execute(query)
                connection.commit()
                print('Заявка откланена')
        finally:
            connection.close()

    except Exception as ex:
        print('Ошибка подключения 15', ex)


def accept_teamWaiting(teamid, tournirid):
    try:
        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            db=db_name,
            cursorclass=pymysql.cursors.DictCursor
        )

        try:
            with connection.cursor() as cursor:
                query = f"delete from teams_waiting where team_id = {teamid} and tournir_id = {tournirid}"
                cursor.execute(query)
                query1 = f"insert into tournir_teamparticipants(teams_team_id, tournirs_tournir_id) values ({teamid}, {tournirid})"
                cursor.execute(query1)
                connection.commit()
                print('Завка одобрена')
        finally:
            connection.close()

    except Exception as ex:
        print('Ошибка подключения 16', ex)


def show_tournirTeams(tournir_id):
    try:
        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            db=db_name,
            cursorclass=pymysql.cursors.DictCursor
        )

        try:
            with connection.cursor() as cursor:
                select_query = f'''SELECT
                                        tournirs.tournir_id,
                                        GROUP_CONCAT(CONCAT(teams.team_id, ' . ', teams.team_name, ' . ', team_member_count) SEPARATOR ', ') AS tournir_members
                                    FROM
                                        tournirs
                                    JOIN
                                        tournir_teamparticipants ON tournirs.tournir_id = tournir_teamparticipants.tournirs_tournir_id
                                    JOIN
                                        teams ON tournir_teamparticipants.teams_team_id = teams.team_id
                                    LEFT JOIN
                                        (
                                            SELECT
                                                teams_team_id,
                                                COUNT(DISTINCT users_vkid) AS team_member_count
                                            FROM
                                                team_participants
                                            GROUP BY
                                                teams_team_id
                                        ) AS team_counts ON teams.team_id = team_counts.teams_team_id
                                    WHERE
                                        tournirs.tournir_id = {tournir_id}
                                    GROUP BY
                                        tournirs.tournir_id;'''
                cursor.execute(select_query)
                rows = cursor.fetchall()
                return rows
        finally:
            connection.close()

    except Exception as ex:
        print('Ошибка подключения 17', ex)


def delete_tournirTeams(team_id, tournir_id):
    try:

        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            db=db_name,
            cursorclass=pymysql.cursors.DictCursor
        )

        try:
            with connection.cursor() as cursor:
                select_query = f'delete from tournir_teamparticipants where teams_team_id = {team_id} and tournirs_tournir_id = {tournir_id}'
                cursor.execute(select_query)
                connection.commit()
                print('Запись удалена')
        finally:
            connection.close()

    except Exception as ex:
        print('Ошибка подключения 18', ex)


def makeFirstBracket(team1, team2, stage, group_id, tournir_id):
    try:

        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            db=db_name,
            cursorclass=pymysql.cursors.DictCursor
        )

        try:
            with connection.cursor() as cursor:
                if stage == 'semifinal':
                    format = 'BO5'
                elif stage == 'final':
                    format = 'BO7'
                else:
                    format = 'BO3'

                if team2 == []:
                    select_query = f'insert into matches(tournir_id, team1, team2, stage, group_id, format) values ({tournir_id}, "{team1}", "", "{stage}", {group_id}, "{format}")'
                else:
                    select_query = f'insert into matches(tournir_id, team1, team2, stage, group_id, format) values ({tournir_id}, "{team1}", "{team2}", "{stage}", {group_id}, "{format}")'
                select_query2 = f'update tournirs set cur_stage = "firstStage" where tournir_id = {tournir_id}'
                cursor.execute(select_query)
                cursor.execute(select_query2)
                connection.commit()
                print('Запись создана')
        finally:
            connection.close()

    except Exception as ex:
        print('Ошибка подключения 19', ex)


def show_matches():
    try:
        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            db=db_name,
            cursorclass=pymysql.cursors.DictCursor
        )

        try:
            with connection.cursor() as cursor:
                select_query = "SELECT * FROM matches"
                cursor.execute(select_query)
                rows = cursor.fetchall()
                return rows
        finally:
            connection.close()

    except Exception as ex:
        print('Ошибка подключения 20', ex)


def update_score(match_id, team1Score, team2Score):
    try:
        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            db=db_name,
            cursorclass=pymysql.cursors.DictCursor
        )

        try:
            with connection.cursor() as cursor:
                select_query = f"update matches set team1_score={team1Score}, team2_score={team2Score} where idmatches={match_id}"
                cursor.execute(select_query)
                connection.commit()
                print('Запись обновлена')
        finally:
            connection.close()

    except Exception as ex:
        print('Ошибка подключения 21', ex)


def insert_results(stage, tournir_id):
    try:
        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            db=db_name,
            cursorclass=pymysql.cursors.DictCursor
        )

        try:
            with connection.cursor() as cursor:
                select_query = f"select * from tournir_teamparticipants where tournirs_tournir_id = {tournir_id}"
                cursor.execute(select_query)
                rows = cursor.fetchall()
                select_query2 = f"select * from matches where stage = '{stage}'"
                cursor.execute(select_query2)
                rows1 = cursor.fetchall()
                for i in rows1:
                    team1 = int(i['team1_score'])
                    team2 = int(i['team2_score'])
                    if team1>team2:
                        winner = i['team1']
                        loser = i['team2']
                    elif team2>team1:
                        winner = i['team2']
                        loser = i['team1']
                    else:
                        winner = 'Нету победителя'

                    if winner != 'Нету победителя':
                        query = f'''insert into results(tournir_id, match_id, team1_name, team2_name, team1_score, team2_score, winner_name, stage, loser_name)
                        values ({i['tournir_id']}, {i['idmatches']}, '{i['team1']}', '{i['team2']}', {i['team1_score']}, {i['team2_score']}, '{winner}', '{i['stage']}', '{loser}')'''
                        cursor.execute(query)
                        connection.commit()
                        print('Запись создана')
                query2 = f'delete from matches where stage = "{stage}" and tournir_id = {rows[0]["tournirs_tournir_id"]}'
                cursor.execute(query2)
                connection.commit()

                stages_for_128 = ['firstStage', 'secondStage', 'thirdStage', 'fourthStage', 'fifthStage', 'semifinal', 'thirdplace', 'final']
                stages_for_64 = ['firstStage', 'secondStage', 'thirdStage', 'semifinal', 'thirdplace', 'final']
                stages_for_32 = ['firstStage', 'secondStage', 'semifinal', 'thirdplace', 'final']
                stages_for_16 = ['firstStage', 'secondStage', 'semifinal', 'thirdplace', 'final']
                stages_for_8 = ['firstStage', 'secondStage', 'thirdplace', 'final']
                stages_for_4 = ['firstStage', 'final']

                # Предполагаем, что rows — это список команд
                if 128 >= len(rows) > 64:
                    stages = stages_for_128
                elif 64 >= len(rows) > 32:
                    stages = stages_for_64
                elif 32 >= len(rows) > 16:
                    stages = stages_for_32
                elif 16 >= len(rows) > 8:
                    stages = stages_for_16
                elif 8 >= len(rows) > 4:
                    stages = stages_for_8
                elif len(rows) == 4:
                    stages = stages_for_4

                select_query3 = f"select tournir_id, winner_name, stage, loser_name from results where stage='{stage}'"
                cursor.execute(select_query3)
                rows2 = cursor.fetchall()
                if len(rows) % 2 != 0:
                    query3 = f"update matches set team2 = '{rows2[-1]['winner_name']}' where team2 = '' and tournir_id={tournir_id} and team1 is not null"
                    cursor.execute(query3)
                    connection.commit()
                    print('Запись обновлена')
                    for i in range(0, len(rows2)-1, 2):
                        stages_formatches = stages[stages.index(rows2[i]['stage'])+1]
                        if stages_formatches == 'semifinal':
                            format = 'BO5'
                        elif stages_formatches == 'final' or stages_formatches == 'thirdplace':
                            format = 'BO7'
                        else:
                            format = 'BO3'
                        if stages_formatches == 'thirdplace':
                            query4 = f'''insert into matches(tournir_id, team1, team2, stage, group_id, team1_score, team2_score, format)
                            values ({tournir_id}, '{rows2[i]['winner_name']}', '{rows2[i+1]['winner_name']}', 'final', {i}, 0, 0, '{format}')'''
                            query5 = f'''insert into matches(tournir_id, team1, team2, stage, group_id, team1_score, team2_score, format)
                            values ({tournir_id}, '{rows2[i]['loser_name']}', '{rows2[i+1]['loser_name']}', '{stages_formatches}', {i}, 0, 0, '{format}')'''
                            cursor.execute(query4)
                            cursor.execute(query5)
                            connection.commit()
                            print('Матч создан')
                        else:
                            query4 = f'''insert into matches(tournir_id, team1, team2, stage, group_id, team1_score, team2_score, format)
                            values ({tournir_id}, '{rows2[i]['winner_name']}', '{rows2[i+1]['winner_name']}', '{stages_formatches}', {i}, 0, 0, '{format}')'''
                            cursor.execute(query4)
                            connection.commit()
                    cursor.execute(
                        f"update tournirs set cur_stage = '{stages[stages.index(rows2[-1]['stage'])+1]}' where tournir_id = {tournir_id}")
                    connection.commit()
                else:
                    for i in range(0, len(rows2)-1, 2):
                        stages_formatches = stages[stages.index(
                            rows2[i]['stage'])+1]
                        if stages_formatches == 'semifinal':
                            format = 'BO5'
                        elif stages_formatches == 'final':
                            format = 'BO7'
                        else:
                            format = 'BO3'
                        if stages_formatches == 'thirdplace':
                            query4 = f'''insert into matches(tournir_id, team1, team2, stage, group_id, team1_score, team2_score, format)
                            values ({tournir_id}, '{rows2[i]['winner_name']}', '{rows2[i+1]['winner_name']}', 'final', {i}, 0, 0, '{format}')'''
                            query5 = f'''insert into matches(tournir_id, team1, team2, stage, group_id, team1_score, team2_score, format)
                            values ({tournir_id}, '{rows2[i]['loser_name']}', '{rows2[i+1]['loser_name']}', '{stages_formatches}', {i}, 0, 0, '{format}')'''
                            cursor.execute(query4)
                            cursor.execute(query5)
                            connection.commit()
                            print('Матч создан')
                        else:
                            query4 = f'''insert into matches(tournir_id, team1, team2, stage, group_id, team1_score, team2_score, format)
                            values ({tournir_id}, '{rows2[i]['winner_name']}', '{rows2[i+1]['winner_name']}', '{stages_formatches}', {i}, 0, 0, '{format}')'''
                            cursor.execute(query4)
                            connection.commit()
                    qery_upd = f"update tournirs set cur_stage = '{stages[stages.index(rows2[-1]['stage'])+1]}' where tournir_id = {tournir_id}"
                    cursor.execute(qery_upd)
                    connection.commit()
                    print('Стадия обновлена')
        finally:
            connection.close()

    except Exception as ex:
        print('Ошибка подключения 22', ex)


def add_winners(tournir_id):
    try:
        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            db=db_name,
            cursorclass=pymysql.cursors.DictCursor
        )

        try:
            with connection.cursor() as cursor:
                select_query = f"select * from matches where stage='final' and tournir_id = {tournir_id}"
                cursor.execute(select_query)
                rows = cursor.fetchall()[0]
                if rows['team1_score'] > rows['team2_score']:
                    winner = rows['team1']
                    loser = rows['team2']

                else:
                    winner = rows['team2']
                    loser = rows['team1']

                query = f'''insert into results(tournir_id, match_id, team1_name, team2_name, team1_score, team2_score, winner_name, stage, loser_name) values ({tournir_id},
                {rows['idmatches']}, '{rows['team1']}', '{rows['team2']}', {rows['team1_score']}, {rows['team2_score']}, '{winner}', 'final', '{loser}')'''
                cursor.execute(query)
                connection.commit()
                query2 = f'delete from matches where tournir_id = {tournir_id}'
                cursor.execute(query2)
                connection.commit()
                query3 = f'update tournirs set cur_stage = "end" where tournir_id = {tournir_id}'
                cursor.execute(query3)
                connection.commit()
                print('Турнир закончен')
        finally:
            connection.close()

    except Exception as ex:
        print('Ошибка подключения 23', ex)


def select_winners():
    try:
        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            db=db_name,
            cursorclass=pymysql.cursors.DictCursor
        )

        try:
            with connection.cursor() as cursor:
                select_query = "select tournir_id, winner_name, loser_name from results where stage='final'"
                cursor.execute(select_query)
                rows = cursor.fetchall()
                select_query2 = "select tournir_id, winner_name from results where stage='thirdplace'"
                cursor.execute(select_query2)
                rows2 = cursor.fetchall()
                rows_dict = {}
                rows2_dict = {}
                for i in rows:
                    rows_dict.setdefault(i['tournir_id'], []).append((i['winner_name'], i['loser_name']))
                for i in rows2:
                    rows2_dict.setdefault(i['tournir_id'], []).append(i['winner_name'])
                return [rows_dict, rows2_dict]

        finally:
            connection.close()

    except Exception as ex:
        print('Ошибка подключения 24', ex)


def add_tournir(title, description, gameName, prize, tournir_main, tournir_type):
    try:
        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            db=db_name,
            cursorclass=pymysql.cursors.DictCursor
        )

        try:
            with connection.cursor() as cursor:
                query = f'''insert into tournirs(tournir_title, tournir_description, game_type, prize, tournir_main, tournir_type, cur_stage) values
                ('{title}', '{description}', '{gameName}', {prize}, '{tournir_main}', '{tournir_type}', '')'''
                cursor.execute(query)
                connection.commit()
                print('Турнир добавлен')
        finally:
            connection.close()

    except Exception as ex:
        print('Ошибка подключения 25', ex)


def delete_tournir(tournir_id):
    try:
        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            db=db_name,
            cursorclass=pymysql.cursors.DictCursor
        )

        try:
            with connection.cursor() as cursor:
                query = f"delete from teams_waiting where tournir_id = {tournir_id}"
                query2 = f"delete from matches where tournir_id = {tournir_id}"
                query3 = f"delete from tournir_teamparticipants where tournirs_tournir_id = {tournir_id}"
                query4 = f"delete from tournirs where tournir_id = {tournir_id}"
                query5 = f"delete from description_inside_tournirs where tournir_id = {tournir_id}"
                cursor.execute(query)
                cursor.execute(query2)
                cursor.execute(query3)
                cursor.execute(query4)
                cursor.execute(query5)
                connection.commit()
                print('Турнир удален')
        finally:
            connection.close()

    except Exception as ex:
        print('Ошибка подключения 26', ex)


def select_results(tournir_id):
    try:
            connection = pymysql.connect(
                host=host,
                user=user,
                password=password,
                db=db_name,
                cursorclass=pymysql.cursors.DictCursor
            )

            try:
                with connection.cursor() as cursor:
                    query = f"select * from results where tournir_id={tournir_id}"
                    cursor.execute(query)
                    rows = cursor.fetchall()
                    return rows
            finally:
                connection.close()

    except Exception as ex:
        print('Ошибка подключения 25', ex)

def change_role(user_id, new_role):
    try:
            connection = pymysql.connect(
                host=host,
                user=user,
                password=password,
                db=db_name,
                cursorclass=pymysql.cursors.DictCursor
            )

            try:
                with connection.cursor() as cursor:
                    query = f"update participants set role='{new_role}' where vkid={user_id}"
                    cursor.execute(query)
                    connection.commit()
            finally:
                connection.close()

    except Exception as ex:
        print('Ошибка подключения 26', ex)


def exit_team(userid, team_id):
    try:
            connection = pymysql.connect(
                host=host,
                user=user,
                password=password,
                db=db_name,
                cursorclass=pymysql.cursors.DictCursor
            )

            try:
                with connection.cursor() as cursor:
                    query = f"delete from team_participants where users_vkid = {userid} and teams_team_id={team_id}"
                    cursor.execute(query)
                    connection.commit()
                    print('Запись удалена')
            finally:
                connection.close()

    except Exception as ex:
        print('Ошибка подключения 25', ex)



def select_videos():
    try:
            connection = pymysql.connect(
                host=host,
                user=user,
                password=password,
                db=db_name,
                cursorclass=pymysql.cursors.DictCursor
            )

            try:
                with connection.cursor() as cursor:
                    query = "select * from videos"
                    cursor.execute(query)
                    rows = cursor.fetchall()
                    return rows
            finally:
                connection.close()

    except Exception as ex:
        print('Ошибка подключения 26', ex)


def add_video(url, type):
    try:
            connection = pymysql.connect(
                host=host,
                user=user,
                password=password,
                db=db_name,
                cursorclass=pymysql.cursors.DictCursor
            )

            try:
                with connection.cursor() as cursor:
                    query = f"insert into videos(url, type) values('{url}','{type}')"
                    cursor.execute(query)
                    connection.commit()
                    print('Видео добавлено')
            finally:
                connection.close()

    except Exception as ex:
        print('Ошибка подключения 27', ex)


def delete_video(video_id):
    try:
            connection = pymysql.connect(
                host=host,
                user=user,
                password=password,
                db=db_name,
                cursorclass=pymysql.cursors.DictCursor
            )

            try:
                with connection.cursor() as cursor:
                    query = f"delete from videos where videos_id = {video_id}"
                    cursor.execute(query)
                    connection.commit()
                    print('Видео удалено')
            finally:
                connection.close()

    except Exception as ex:
        print('Ошибка подключения 28', ex)


def goto_final(tournir_id):
    try:
            connection = pymysql.connect(
                host=host,
                user=user,
                password=password,
                db=db_name,
                cursorclass=pymysql.cursors.DictCursor
            )

            try:
                with connection.cursor() as cursor:
                    select_query = f"select * from matches where stage='thirdplace' and tournir_id = {tournir_id}"
                    cursor.execute(select_query)
                    rows = cursor.fetchall()[0]
                    if rows['team1_score'] > rows['team2_score']:
                        winner = rows['team1']
                        loser = rows['team2']

                    else:
                        winner = rows['team2']
                        loser = rows['team1']

                    query = f'''insert into results(tournir_id, match_id, team1_name, team2_name, team1_score, team2_score, winner_name, stage, loser_name) values ({tournir_id},
                    {rows['idmatches']}, '{rows['team1']}', '{rows['team2']}', {rows['team1_score']}, {rows['team2_score']}, '{winner}', 'thirdplace', '{loser}')'''
                    cursor.execute(query)
                    query3 = f'delete from matches where tournir_id = {tournir_id} and stage="thirdplace"'
                    cursor.execute(query3)
                    query2 = f"update tournirs set cur_stage='final' where tournir_id = {tournir_id}"
                    cursor.execute(query2)
                    connection.commit()
                    print('3е место определено')
            finally:
                connection.close()

    except Exception as ex:
        print('Ошибка подключения 29', ex)



def changeroletoadmin(user_id):
    try:
            connection = pymysql.connect(
                host=host,
                user=user,
                password=password,
                db=db_name,
                cursorclass=pymysql.cursors.DictCursor
            )

            try:
                with connection.cursor() as cursor:
                    query = f"update participants set role='Судья' where vkid={user_id}"
                    cursor.execute(query)
                    connection.commit()
                    print('Роль поменялась')
            finally:
                connection.close()

    except Exception as ex:
        print('Ошибка подключения 30', ex)


def add_appNotif(text):
    try:
            connection = pymysql.connect(
                host=host,
                user=user,
                password=password,
                db=db_name,
                cursorclass=pymysql.cursors.DictCursor
            )

            try:
                with connection.cursor() as cursor:
                    query = f"insert into app_notifications(notification_text) values ('{text}')"
                    cursor.execute(query)
                    connection.commit()
                    print('Создано уведомление')
            finally:
                connection.close()

    except Exception as ex:
        print('Ошибка подключения 31', ex)


def select_appNotif():
    try:
            connection = pymysql.connect(
                host=host,
                user=user,
                password=password,
                db=db_name,
                cursorclass=pymysql.cursors.DictCursor
            )

            try:
                with connection.cursor() as cursor:
                    query = "select notification_text from app_notifications"
                    cursor.execute(query)
                    rows = cursor.fetchall()
                    return rows
            finally:
                connection.close()

    except Exception as ex:
        print('Ошибка подключения 32', ex)


def delete_appNotif():
    try:
            connection = pymysql.connect(
                host=host,
                user=user,
                password=password,
                db=db_name,
                cursorclass=pymysql.cursors.DictCursor
            )

            try:
                with connection.cursor() as cursor:
                    query = "delete from app_notifications"
                    cursor.execute(query)
                    connection.commit()
                    print('Уведомление удалено')
            finally:
                connection.close()

    except Exception as ex:
        print('Ошибка подключения 33', ex)


def select_AddInfo(user_id):
    try:
            connection = pymysql.connect(
                host=host,
                user=user,
                password=password,
                db=db_name,
                cursorclass=pymysql.cursors.DictCursor
            )

            try:
                with connection.cursor() as cursor:
                    query = f"select * from addition_info where vkid={user_id}"
                    cursor.execute(query)
                    rows = cursor.fetchall()
                    return rows
            finally:
                connection.close()

    except Exception as ex:
        print('Ошибка подключения 34', ex)


def add_AdditionInfo(vkid, fio, birth_date, citizenship, nickname, sport_category, uin_gto, phone_number):
    try:
            connection = pymysql.connect(
                host=host,
                user=user,
                password=password,
                db=db_name,
                cursorclass=pymysql.cursors.DictCursor
            )

            try:
                with connection.cursor() as cursor:
                    query = f'''insert into addition_info(vkid, fio, birth_date, citizenship, nickname, sport_category, uin_gto, phone_number) values
                    ({vkid}, '{fio}', '{birth_date}', '{citizenship}', '{nickname}', '{sport_category}', '{uin_gto}', '{phone_number}')'''
                    cursor.execute(query)
                    connection.commit()
            finally:
                connection.close()

    except Exception as ex:
        print('Ошибка подключения 35', ex)



def delete_AddInfo(vkid):
    try:
            connection = pymysql.connect(
                host=host,
                user=user,
                password=password,
                db=db_name,
                cursorclass=pymysql.cursors.DictCursor
            )

            try:
                with connection.cursor() as cursor:
                    selectQuery = f"select teams_team_id from team_participants where users_vkid={vkid}"
                    cursor.execute(selectQuery)
                    team_id = cursor.fetchall()
                    if len(team_id) != 0:
                        delete_team(team_id[0]['teams_team_id'])
                    query = f"delete from addition_info where vkid={vkid}"
                    cursor.execute(query)
                    connection.commit()
                    print('Запись удалена')
            finally:
                connection.close()

    except Exception as ex:
        print('Ошибка подключения 36', ex)


def selectTournirParticipants(tournir_id):
    try:
            connection = pymysql.connect(
                host=host,
                user=user,
                password=password,
                db=db_name,
                cursorclass=pymysql.cursors.DictCursor
            )

            try:
                with connection.cursor() as cursor:
                    query = f'''SELECT
                                ai.vkid,
                                ai.fio,
                                ai.birth_date,
                                ai.citizenship,
                                ai.phone_number,
                                ai.nickname,
                                ai.sport_category,
                                ai.uin_gto,
                                t.team_name,
                                t.team_id
                            FROM
                                addition_info ai
                            JOIN
                                team_participants tp ON ai.vkid = tp.users_vkid
                            JOIN
                                tournir_teamparticipants tnp ON tp.teams_team_id = tnp.teams_team_id
                            JOIN
                                teams t ON tp.teams_team_id = t.team_id
                            WHERE
                                tnp.tournirs_tournir_id = {tournir_id};'''
                    cursor.execute(query)
                    rows = cursor.fetchall()
                    return rows
            finally:
                connection.close()

    except Exception as ex:
        print('Ошибка подключения 37', ex)

def select_ParticipantsAddInfo():
    try:
            connection = pymysql.connect(
                host=host,
                user=user,
                password=password,
                db=db_name,
                cursorclass=pymysql.cursors.DictCursor
            )

            try:
                with connection.cursor() as cursor:
                    query = '''SELECT
                                ai.vkid,
                                ai.fio,
                                ai.birth_date,
                                ai.citizenship,
                                ai.phone_number,
                                ai.nickname,
                                ai.sport_category,
                                ai.uin_gto,
                                t.team_name,
                                t.team_id
                            FROM
                                addition_info ai
                            LEFT JOIN
                                team_participants tp ON ai.vkid = tp.users_vkid
                            LEFT JOIN
                                teams t ON tp.teams_team_id = t.team_id'''
                    cursor.execute(query)
                    rows = cursor.fetchall()
                    return rows
            finally:
                connection.close()

    except Exception as ex:
        print('Ошибка подключения 38', ex)


def returnBracket(tournir_id):
    try:
            connection = pymysql.connect(
                host=host,
                user=user,
                password=password,
                db=db_name,
                cursorclass=pymysql.cursors.DictCursor
            )

            try:
                with connection.cursor() as cursor:
                    query = f"delete from results where tournir_id = {tournir_id}"
                    query1 = f"delete from matches where tournir_id = {tournir_id}"
                    query2 = f"update tournirs set cur_stage='' where tournir_id = {tournir_id}"
                    cursor.execute(query)
                    cursor.execute(query1)
                    cursor.execute(query2)
                    connection.commit()
            finally:
                connection.close()

    except Exception as ex:
        print('Ошибка подключения 39', ex)


def change_AdditionInfo(vkid, fio, birth_date, citizenship, nickname, sport_category, uin_gto, phone_number):
    try:
            connection = pymysql.connect(
                host=host,
                user=user,
                password=password,
                db=db_name,
                cursorclass=pymysql.cursors.DictCursor
            )

            try:
                with connection.cursor() as cursor:
                    query = f'''update addition_info set fio='{fio}', birth_date='{birth_date}', citizenship='{citizenship}', nickname='{nickname}', sport_category='{sport_category}',uin_gto='{uin_gto}',
                    phone_number='{phone_number}' where vkid={vkid}'''
                    cursor.execute(query)
                    connection.commit()
            finally:
                connection.close()

    except Exception as ex:
        print('Ошибка подключения 40', ex)


def add_description(tournir_id, title, info_block1, info_block2, info_block3, photo1_path, photo2_path, photo3_path):
    try:
            connection = pymysql.connect(
                host=host,
                user=user,
                password=password,
                db=db_name,
                cursorclass=pymysql.cursors.DictCursor
            )

            try:
                with connection.cursor() as cursor:
                    query = f'''insert into description_inside_tournirs(tournir_id, title, info_block1, info_block2, info_block3, photo1_path, photo2_path, photo3_path) values
                    ({tournir_id}, '{title}', '{info_block1}', '{info_block2}', '{info_block3}', '{photo1_path}', '{photo2_path}', '{photo3_path}')'''.replace("'None'", "NULL").replace("None", "NULL")
                    cursor.execute(query)
                    connection.commit()
                    print('Запись добавлена')
            finally:
                connection.close()

    except Exception as ex:
        print('Ошибка подключения 41', ex)


def return_description(tournir_id):
    try:
            connection = pymysql.connect(
                host=host,
                user=user,
                password=password,
                db=db_name,
                cursorclass=pymysql.cursors.DictCursor
            )

            try:
                with connection.cursor() as cursor:
                    query = f'select * from `description_inside_tournirs` where tournir_id={tournir_id}'
                    cursor.execute(query)
                    rows = cursor.fetchall()
                    return rows
            finally:
                connection.close()

    except Exception as ex:
        print('Ошибка подключения 42', ex)


def change_description(tournir_id, title, info_block1, info_block2, info_block3, photo1_path, photo2_path, photo3_path):
    try:
            connection = pymysql.connect(
                host=host,
                user=user,
                password=password,
                db=db_name,
                cursorclass=pymysql.cursors.DictCursor
            )

            try:
                with connection.cursor() as cursor:
                    query = f'''update `description_inside_tournirs` set title="{title}", info_block1="{info_block1}", info_block2="{info_block2}",
                    info_block3="{info_block3}", photo1_path="{photo1_path}", photo2_path="{photo2_path}",
                    photo3_path="{photo3_path}" where tournir_id={tournir_id}'''.replace("'None'", "NULL").replace("None", "NULL")
                    cursor.execute(query)
                    connection.commit()
                    print('Запись добавлена')
            finally:
                connection.close()

    except Exception as ex:
        print('Ошибка подключения 43', ex)

