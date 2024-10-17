from flask_cors import CORS
from mysqlcoding import (insert_user, select_teams_by_type, select_users, add_team, select_teams,
                         add_notification, select_notifications, decline_invite,
                         accept_invite, select_tournirs, delete_member, delete_team,
                         select_teamParticipants, add_teamsWaiting, select_teamWaiting,
                         delete_teamWaiting, accept_teamWaiting, show_tournirTeams, delete_tournirTeams,
                         makeFirstBracket, show_matches, update_score, insert_results, add_winners, select_winners,
                         add_tournir, delete_tournir, change_role, exit_team, select_videos, add_video, delete_video,
                         goto_final, changeroletoadmin, select_appNotif, delete_appNotif, add_appNotif, select_AddInfo,
                         add_AdditionInfo, delete_AddInfo, returnBracket, change_AdditionInfo, add_description, return_description,
                         change_description, select_teamWaitingByuser)
from tournir_brackets import firstBracke
from flask import Flask, request, send_file, send_from_directory, jsonify
from write_excell import making_excell
from write_excell2 import making_excell2
from flask_restful import Api, Resource
from ishashvalid import isvalid
import random
import os
import json
import base64
import re
from datetime import datetime
from collections import defaultdict

attempts = defaultdict(list)

def make_error(status_code, message):
    response = jsonify({
        'status': status_code,
        'message': message,
    })
    response.status_code = status_code
    return response


app = Flask(__name__)
CORS(app)
# pattern = r'https://prod-app52101863-[a-f0-9]{12}\.pages-ac\.vk-apps\.com'
# def check_origin(origin):
#     return re.match(pattern, origin) is not None
# cors = CORS(app, resources={
#     r"/*": {
#         "origins": lambda origin: check_origin(origin) if origin else True
#     }
# })
api = Api(app)


class Home(Resource):
    def get(self):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error(message='Invalid authorization header', status_code=401)

        try:
            access_token = base64.b64decode(auth_header.split()[1]).decode('utf-8')
        except Exception as e:
            return make_error(message='Failed to decode authorization token', status_code=401)

        if isvalid(access_token):
            user_id = access_token.strip('?').split('vk_user_id=')[1].split('&')[0]
            return select_users(user_id=user_id)
        else:
            return make_error(message='Invalid access token', status_code=403)


    def post(self):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error(message='Invalid authorization header', status_code=401)

        try:
            access_token = base64.b64decode(auth_header.split()[1]).decode('utf-8')
        except Exception as e:
            return make_error(message='Failed to decode authorization token', status_code=401)

        if isvalid(access_token):
            user_id = access_token.strip('?').split('vk_user_id=')[1].split('&')[0]
            if not select_users(user_id=user_id):
                first_name = request.get_json().get('first_name')
                last_name = request.get_json().get('last_name')

                if first_name.strip() and last_name.strip():
                    insert_user(vkid=user_id, first_name=first_name,
                                last_name=last_name)
                    print('Пользователь записан')
                    # Успешная регистрация
                    return {'message': 'User successfully registered'}, 201
                else:
                    return make_error(message='All fields are required', status_code=400)
        else:
            return make_error(message='Invalid access token', status_code=403)


class TeamMaking(Resource):
    def get(self, type):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error(message='Invalid authorization header', status_code=401)

        try:
            access_token = base64.b64decode(auth_header.split()[1]).decode('utf-8')
        except Exception:
            return make_error(message='Failed to decode authorization token', status_code=401)

        if isvalid(access_token):
            user_id = access_token.strip('?').split('vk_user_id=')[1].split('&')[0]
            user_role = select_users(user_id=user_id)['role']

            if user_role in ['Участник', 'Капитан']:
                if type in ['5X5', '1X1']:
                    teams = select_teams_by_type(user_id=user_id, type=type)
                    if teams:
                        return teams
                    else:
                        return make_error(message='No teams available for this user', status_code=404)
            else:
                return make_error(message='Insufficient permissions', status_code=403)
        else:
            return make_error(message='Invalid access token', status_code=403)

    def post(self, type):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error(message='Invalid authorization header', status_code=401)

        try:
            access_token = base64.b64decode(auth_header.split()[1]).decode('utf-8')
        except Exception:
            return make_error(message='Failed to decode authorization token', status_code=401)

        if isvalid(access_token):
            user_id = access_token.strip('?').split('vk_user_id=')[1].split('&')[0]
            user_role = select_users(user_id=user_id)['role']

            if user_role in ['Участник', 'Капитан']:
                teamname = request.get_json().get('teamname')
                teamid = random.randint(1000000, 9999999)

                if not (user_role == 'Участник' and type == '5X5'):
                    if teamname and teamname.strip() and type and type.strip():
                        existing_teams = select_teams(user_id=user_id)
                        if not existing_teams or type not in [str(i['team_type']) for i in existing_teams]:
                            add_team(teamname=teamname, teamid=teamid,
                                    vkid=user_id, type=type)
                            # Успешное создание команды
                            return {'message': 'Team successfully created'}, 201
                        else:
                            return make_error(message='You are already in a team', status_code=409)
                    else:
                        return make_error(message='All fields are required', status_code=400)
                else:
                    return make_error(message='Participants cannot create 5X5 teams', status_code=403)
            else:
                return make_error(message='Insufficient permissions', status_code=403)
        else:
            return make_error(message='Invalid access token', status_code=403)


class Notifications(Resource):
    def get(self):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error(message='Invalid authorization header', status_code=401)

        try:
            access_token = base64.b64decode(auth_header.split()[1]).decode('utf-8')
        except:
            return make_error(message='Invalid header format', status_code=401)

        if isvalid(access_token):
            user_id = access_token.strip('?').split('vk_user_id=')[1].split('&')[0]
            notifications = select_notifications(user_id=user_id)
            if notifications:
                return notifications
            else:
                return make_error(message='No invites available', status_code=404)
        else:
            return make_error(message='Invalid access token', status_code=403)


    def post(self):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error(message='Invalid authorization header', status_code=401)
        try:
            access_token = base64.b64decode(auth_header.split()[1]).decode('utf-8')
        except:
            return make_error(message='Invalid header format', status_code=401)

        if isvalid(access_token):
            user_id = access_token.strip('?').split('vk_user_id=')[1].split('&')[0]
            if not select_AddInfo(user_id=user_id):
                return make_error(message='Additional information required', status_code=400)
            user_role = select_users(user_id=user_id).get('role')
            if user_role != 'Капитан':
                return make_error(message='Unauthorized role', status_code=403)
            if '5X5' not in [i['team_type'] for i in select_teams(user_id=user_id)]:
                return make_error(message='Team not found', status_code=404)
            user = request.get_json().get('users')
            if not user:
                return make_error(message='User ID must be provided', status_code=400)
            if not select_AddInfo(user_id=user):
                return make_error(message='User additional information is missing', status_code=400)
            if not select_users(user_id=user):
                return make_error(message='User is not registered', status_code=404)
            if select_teams(user_id=user) and '5X5' in [i['team_type'] for i in select_teams(user_id=user)]:
                return make_error(message='User already has a team', status_code=409)
            if select_notifications(user_id=user):
                return make_error(message='User already ivited', status_code=409)
            team = next((i for i in select_teams(user_id=user_id)
                        if i['team_type'] == '5X5'), None)
            if team:
                add_notification(
                    vkid=user, teamid=team['team_id'], teamName=team['team_name'])
                return make_error(message='Notification added successfully', status_code=200)
            else:
                return make_error(message='Team not found', status_code=404)
        else:
            return make_error(message='Invalid access token', status_code=403)

class DeclineNotif(Resource):
    def post(self):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error(message='Invalid authorization header', status_code=401)

        try:
            access_token = base64.b64decode(auth_header.split()[1]).decode('utf-8')
        except Exception as e:
            return make_error(message='Failed to decode authorization token', status_code=401)

        if isvalid(access_token):
            user_id = access_token.strip('?').split('vk_user_id=')[1].split('&')[0]
            if select_users(user_id=user_id)['role'] == 'Участник':
                if select_notifications(user_id=user_id):
                    decline_invite(vkid=user_id)
                else:
                    return make_error(message='You do not have an invitation', status_code=409)
            else:
                return make_error(message='Invalid role', status_code=403)
        else:
            return make_error(message='Invalid access token', status_code=403)


class AcceptNotif(Resource):
    def post(self):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error(message='Invalid authorization header', status_code=401)

        try:
            access_token = base64.b64decode(auth_header.split()[1]).decode('utf-8')
        except Exception as e:
            return make_error(message='Failed to decode authorization token', status_code=401)

        if isvalid(access_token):
            user_id = access_token.strip('?').split('vk_user_id=')[1].split('&')[0]
            if select_users(user_id=user_id)['role'] == 'Участник':
                if not select_teams(user_id=user_id) or '5X5' not in [i['team_type'] for i in select_teams(user_id=user_id)]:
                    team_id = int(select_notifications(user_id=user_id)['teamID'])
                    accept_invite(vkid=user_id, team_id=team_id)
                else:
                    return make_error(message='You are already in a team', status_code=409)
            else:
                return make_error(message='Invalid role', status_code=403)
        else:
            return make_error(message='Invalid access token', status_code=403)


class Tournir(Resource):
    def get(self):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error('invalid authorization header', 401)
        try:
            access_token = base64.b64decode(
                auth_header.split()[1]).decode('utf-8')
        except Exception as e:
            return make_error(message='Failed to decode authorization token', status_code=401)
        if isvalid(access_token):
            return select_tournirs()
        else:
            return make_error(message='Invalid access token', status_code=403)

    def post(self):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error(message='Invalid authorization header', status_code=401)

        try:
            access_token = base64.b64decode(auth_header.split()[1]).decode('utf-8')
        except Exception as e:
            return make_error(message='Failed to decode authorization token', status_code=401)

        if isvalid(access_token):
            user_id = access_token.strip('?').split('vk_user_id=')[1].split('&')[0]
            if select_users(user_id=user_id)['role'] == 'Судья':
                title = request.get_json().get('title')
                description = request.get_json().get('description')
                gameName = request.get_json().get('game_type')
                prize = request.get_json().get('prize')
                tournir_main = request.get_json().get('tournir_main')
                tournir_type = request.get_json().get('tournir_type')

                if title.strip() and description.strip() and tournir_type.strip() and tournir_type.strip() in ['5X5', '1X1'] and \
                        tournir_main.strip() and gameName.strip() and gameName in [i.split('.')[0] for i in os.listdir('/home/Alonikx/python-backend-vkminiapp/assets')]:
                    add_tournir(title=title, description=description, gameName=gameName,
                                prize=prize if prize and prize.isdigit() else 0, tournir_main=tournir_main, tournir_type=tournir_type)
                else:
                    return make_error(message='Not all fields are filled in or filled in incorrectly', status_code=409)
            else:
                return make_error(message='Insufficient rights', status_code=409)
        else:
            return make_error(message='Invalid access token', status_code=403)


class DeleteMember(Resource):

    def post(self):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error(message='Invalid authorization header', status_code=401)

        try:
            access_token = base64.b64decode(auth_header.split()[1]).decode('utf-8')
        except Exception as e:
            return make_error(message='Failed to decode authorization token', status_code=401)

        if isvalid(access_token):
            user_id = access_token.strip('?').split('vk_user_id=')[1].split('&')[0]
            if select_users(user_id=user_id)['role'] == 'Капитан':
                user = request.get_json().get('users')

                if user and select_users(user_id=int(user)):
                    if select_teams(user_id=user) and select_teams(user_id=user_id):
                        team1 = [
                            int(i['team_id']) for i in select_teams(user_id=user_id) if i['team_type'] == '5X5'
                        ][0]

                        team2 = [
                            int(i['team_id']) for i in select_teams(user_id=user) if i['team_type'] == '5X5'
                        ][0]
                        if team1 == team2:
                            delete_member(vkid=user, team_id=team2)
                        else:
                            return make_error(message='The user is not in your team', status_code=409)
                    else:
                        return make_error(message='One of the users does not have a team', status_code=409)
                else:
                    return make_error(message='Field is not filled in', status_code=409)
            else:
                return make_error(message='Insufficient rights', status_code=409)
        else:
            return make_error(message='Invalid access token', status_code=403)


class DeleteTeam(Resource):
    def post(self):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error(message='Invalid authorization header', status_code=401)
        try:
            access_token = base64.b64decode(auth_header.split()[1]).decode('utf-8')
        except Exception as e:
            return make_error(message='Failed to decode authorization token', status_code=401)

        if isvalid(access_token):
            user_id = access_token.strip('?').split('vk_user_id=')[1].split('&')[0]
            team_id = request.get_json().get('teamID')

            if team_id:
                if int(team_id) in [int(i['team_id']) for i in select_teams(user_id=user_id)]:
                    if select_users(user_id=user_id)['role'] == 'Капитан' or [i['team_type'] for i in select_teams(user_id=user_id) if int(i['team_id']) == int(team_id)][0] == '1X1':
                        delete_team(teamID=team_id)
                    else:
                        return make_error(message='You are not in this team', status_code=409)
                else:
                    return make_error(message='You are not in this team', status_code=409)
            else:
                return make_error(message='Invalid team ID', status_code=409)
        else:
            return make_error(message='Invalid access token', status_code=403)


class TeamParticipants(Resource):
    def get(self):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error(message='Invalid authorization header', status_code=401)

        try:
            access_token = base64.b64decode(auth_header.split()[1]).decode('utf-8')
        except Exception as e:
            return make_error(message='Failed to decode authorization token', status_code=401)

        if isvalid(access_token):
            user_id = access_token.strip('?').split('vk_user_id=')[1].split('&')[0]
            team_id = select_teams(user_id=user_id)
            if team_id:
                return select_teamParticipants(team_id==team_id)
            else:
                return make_error(message='You do not have a team', status_code=409)
        else:
            return make_error(message='Invalid access token', status_code=403)

class tournirAddTeamAdmin(Resource):
    def get(self, tournir_id):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error('Invalid authorization header', 401)
        try:
            access_token = base64.b64decode(
                auth_header.split()[1]).decode('utf-8')
        except Exception as e:
            return make_error('Failed to decode authorization token', 401)
        if isvalid(access_token):
            access_token = access_token.strip('?').split(
                'vk_user_id=')[1].split('&')[0]
            if tournir_id and tournir_id.isdigit() and int(tournir_id) in [int(i['tournir_id']) for i in select_tournirs()]:
                if select_users(user_id=access_token)['role'] == 'Судья':
                    return select_teamWaiting(tournir_id=tournir_id)
                else:
                    return make_error('Insufficient rights', 403)
            else:
                return make_error('Invalid tournament ID', 404)
        else:
            return make_error('Invalid access token', 403)

class tournirAddTeam(Resource):
    def get(self, tournir_id, team_id):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error('Invalid authorization header', 401)
        try:
            access_token = base64.b64decode(
                auth_header.split()[1]).decode('utf-8')
        except Exception as e:
            return make_error('Failed to decode authorization token', 401)
        if isvalid(access_token):
            access_token = access_token.strip('?').split(
                'vk_user_id=')[1].split('&')[0]
            if tournir_id and tournir_id.isdigit() and int(tournir_id) in [int(i['tournir_id']) for i in select_tournirs()]:
                if select_users(user_id=access_token)['role'] in ['Участник', 'Капитан']:
                    if team_id and select_teamWaitingByuser(team_id=team_id, tournir_id=tournir_id) and int(team_id) in [int(i['team_id']) for i in select_teams(user_id=access_token)]:
                        return select_teamWaitingByuser(team_id=team_id, tournir_id=tournir_id)
                    else:
                        return make_error(message='Incorrect team ID', status_code=404)

                else:
                    return make_error('Insufficient rights', 403)
            else:
                return make_error('Invalid tournament ID', 404)
        else:
            return make_error('Invalid access token', 403)


    def post(self, tournir_id, team_id):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error('Invalid authorization', 401)
        try:
            access_token = base64.b64decode(
                auth_header.split()[1]).decode('utf-8')
        except:
            return make_error(message='Invalid header', status_code=401)
        if isvalid(access_token):
            access_token = access_token.strip('?').split(
                'vk_user_id=')[1].split('&')[0]
            if int(team_id):
                team = [i for i in select_teams(user_id=access_token) if int(
                    i['team_id']) == int(team_id)]
                if team and team != []:
                    if access_token in team[0]['team_members']:
                        team_name = team[0]['team_name']
                        team_quantity = len(team[0]['team_members'].split(','))
                        if tournir_id and tournir_id.isdigit() and int(tournir_id) in [int(i['tournir_id']) for i in select_tournirs()]:
                            if int(team_id) not in [int(i['team_id']) for i in select_teamWaiting(tournir_id=tournir_id)]:
                                if select_users(user_id=access_token)['role'] == 'Капитан' or [i['team_type'] for i in select_teams(user_id=access_token) if int(i['team_id']) == int(team_id)][0] == '1X1':
                                    add_teamsWaiting(
                                        team_id=team_id, team_name=team_name, team_quantity=team_quantity, tournir_id=tournir_id)
                                else:
                                    return make_error('Invalid role or you don\'t have a team', 403)
                            else:
                                return make_error('You already have a pending application', 409)
                        else:
                            return make_error('No such tournament', 404)
                    else:
                        return make_error('You are not a member of this team', 403)
                else:
                    return make_error('No such team', 404)
            else:
                return make_error(message='empty role', status_code=409)
        else:
            return make_error(message='invalid access token', status_code=403)


class tournirDecline(Resource):
    def post(self, tournir_id):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error('Invalid authorization', 401)
        try:
            access_token = base64.b64decode(
                auth_header.split()[1]).decode('utf-8')
        except:
            return make_error(message='Invalid header', status_code=401)
        if isvalid(access_token):
            access_token = access_token.strip('?').split(
                'vk_user_id=')[1].split('&')[0]
            if select_users(user_id=access_token)['role'] == 'Судья':
                team_id = request.get_json()['teamID']
                if team_id and int(team_id) in [int(i['team_id']) for i in select_teamWaiting(tournir_id=tournir_id)]\
                        and tournir_id and tournir_id.isdigit() and int(tournir_id) in [int(i['tournir_id']) for i in select_tournirs()]:
                    delete_teamWaiting(teamid=team_id, tournir_id=tournir_id)
                else:
                    return make_error('Empty field or team not found', 409)
            else:
                return make_error('Invalid role', 403)
        else:
            return make_error(message='invalid access token', status_code=403)


class tournirAccept(Resource):
    def post(self, tournir_id):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error('Invalid authorization', 401)
        try:
            access_token = base64.b64decode(auth_header.split()[1]).decode('utf-8')
        except:
            return make_error(message='Invalid header', status_code=401)
        if isvalid(access_token):
            access_token = access_token.strip('?').split('vk_user_id=')[1].split('&')[0]
            user_id = access_token
            if select_users(user_id=user_id)['role'] == 'Судья':
                team_id = request.get_json()['teamID']
                if team_id and int(team_id) in [int(i['team_id']) for i in select_teamWaiting(tournir_id=tournir_id)]\
                        and tournir_id and tournir_id.isdigit() and int(tournir_id) in [int(i['tournir_id']) for i in select_tournirs()]:
                    accept_teamWaiting(teamid=team_id, tournirid=tournir_id)
                else:
                    return make_error('Empty field or team not found', 409)
            else:
                return make_error('Invalid role', 403)
        else:
            return make_error(message='invalid access token', status_code=403)


class showTournirTeams(Resource):
    def get(self, tournir_id):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error('Invalid authorization', 401)
        try:
            access_token = base64.b64decode(
                auth_header.split()[1]).decode('utf-8')
        except:
            return make_error(message='Invalid header', status_code=401)
        if isvalid(access_token):
            if tournir_id and int(tournir_id) in [int(i['tournir_id']) for i in select_tournirs()]:
                return show_tournirTeams(tournir_id=tournir_id)
            else:
                return make_error('Invalid tournir_id', 409)
        else:
            return make_error(message='invalid access token', status_code=403)


class deleteTournirTeams(Resource):
    def post(self, tournir_id):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error(message='Unauthorized access', status_code=401)
        try:
            access_token = base64.b64decode(
                auth_header.split()[1]).decode('utf-8')
        except:
            return make_error(message='Invalid authorization header', status_code=401)
        if isvalid(access_token):
            user_id = access_token.strip('?').split(
                'vk_user_id=')[1].split('&')[0]
            if select_users(user_id=user_id)['role'] == 'Судья':
                if tournir_id and tournir_id.isdigit() and int(tournir_id) in [int(i['tournir_id']) for i in select_tournirs()]:
                    team_id = request.get_json()['teamID']
                    print(show_tournirTeams(tournir_id=tournir_id))
                    if team_id and str(team_id) in [str(i['tournir_members'].split(' . ')[0]) for i in show_tournirTeams(tournir_id=tournir_id)]:
                        delete_tournirTeams(
                            team_id=team_id, tournir_id=tournir_id)
                        return make_error(message='Team deleted successfully', status_code=200)
                    else:
                        return make_error(message='Invalid team ID', status_code=404)
                else:
                    return make_error(message='Invalid tournir ID', status_code=404)
            else:
                return make_error(message='User role is not authorized', status_code=403)
        else:
            return make_error(message='Invalid access token', status_code=403)


class makeBracket1(Resource):
    def get(self):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error('Invalid authorization', 401)
        try:
            access_token = base64.b64decode(
                auth_header.split()[1]).decode('utf-8')
        except:
            return make_error(message='Invalid header', status_code=401)
        if isvalid(access_token):
            return show_matches()
        else:
            return make_error(message='Invalid access token', status_code=403)

    def post(self):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error(message='Unauthorized access', status_code=401)
        try:
            access_token = base64.b64decode(
                auth_header.split()[1]).decode('utf-8')
        except Exception:
            return make_error(message='Invalid authorization header', status_code=401)

        if isvalid(access_token):
            user_id = access_token.strip('?').split(
                'vk_user_id=')[1].split('&')[0]
            if select_users(user_id=user_id)['role'] == 'Судья':
                tournir_id = request.get_json().get('tournirID')
                if tournir_id and int(tournir_id) in [int(i['tournir_id']) for i in select_tournirs()]:
                    firstStage = firstBracke(tournir_id=tournir_id)['firstStage']
                    secondStage = firstBracke(tournir_id=tournir_id)['secondStage']

                    for i in range(len(firstStage)):
                        makeFirstBracket(
                            team1=firstStage[i][0], team2=firstStage[i][1], stage='firstStage', group_id=i+1, tournir_id=tournir_id)

                    for i in range(len(secondStage)):
                        makeFirstBracket(
                            team1=secondStage[i][0], team2=secondStage[i][1], stage='secondStage', group_id=i+1, tournir_id=tournir_id)

                    return make_error(message='Brackets created successfully', status_code=200)
                else:
                    return make_error(message='Invalid tournir ID', status_code=404)
            else:
                return make_error(message='User role is not authorized', status_code=403)
        else:
            return make_error(message='Invalid access token', status_code=403)


class updateScores(Resource):
    def post(self):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error(message='Unauthorized access', status_code=401)

        try:
            access_token = base64.b64decode(
                auth_header.split()[1]).decode('utf-8')
        except Exception:
            return make_error(message='Invalid authorization header', status_code=401)

        if isvalid(access_token):
            user_id = access_token.strip('?').split('vk_user_id=')[1].split('&')[0]
            if select_users(user_id=user_id)['role'] == 'Судья':
                match_id = request.get_json().get('matchID')
                team1_score = request.get_json().get('team1Score', None)
                team2_score = request.get_json().get('team2Score', None)

                if match_id and int(match_id) in [int(i['idmatches']) for i in show_matches()]:
                    if team1_score is not None and team2_score is not None and team1_score.isdigit() and team2_score.isdigit():
                        update_score(team1Score=int(team1_score), team2Score=int(
                            team2_score), match_id=int(match_id))
                        return make_error(message='Scores updated successfully', status_code=200)
                    else:
                        return make_error(message='Team scores are empty or invalid', status_code=409)
                else:
                    return make_error(message='Invalid match ID', status_code=404)
            else:
                return make_error(message='User role is not authorized', status_code=403)
        else:
            return make_error(message='Invalid access token', status_code=403)


class goNext(Resource):
    def post(self):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
                return make_error(message='Unauthorized access', status_code=401)
        try:
            access_token = base64.b64decode(
                auth_header.split()[1]).decode('utf-8')
        except:
            return make_error(message='Invalid authorization header', status_code=401)
        if isvalid(access_token):
            user_id = access_token.strip('?').split(
                'vk_user_id=')[1].split('&')[0]
            if select_users(user_id=user_id)['role'] == 'Судья':
                tournir_id = request.get_json()['tournirID']
                print(tournir_id)
                print([i['tournir_id'] for i in select_tournirs()])
                print([i['cur_stage'] for i in select_tournirs() if int(
                        i['tournir_id']) == tournir_id])
                if int(tournir_id) in [int(i['tournir_id']) for i in select_tournirs()]:
                    insert_results(stage=[i['cur_stage'] for i in select_tournirs() if int(
                        i['tournir_id']) == int(tournir_id)][0], tournir_id=int(tournir_id))
                else:
                    return make_error(message='Invalid tournir ID', status_code=404)
            else:
                return make_error(message='User role is not authorized', status_code=403)
        else:
            return make_error(message='Invalid access token', status_code=403)


class add_winner(Resource):
    def post(self):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error(message='Unauthorized access', status_code=401)

        try:
            access_token = base64.b64decode(
                auth_header.split()[1]).decode('utf-8')
        except Exception:
            return make_error(message='Invalid authorization header', status_code=401)

        if isvalid(access_token):
            user_id = access_token.strip('?').split(
                'vk_user_id=')[1].split('&')[0]
            if select_users(user_id=user_id)['role'] == 'Судья':
                tournir_id = request.get_json().get('tournirID')

                if tournir_id and int(tournir_id) in [int(i['tournir_id']) for i in select_tournirs() if i['cur_stage'] == 'final']:
                    add_winners(tournir_id=tournir_id)
                    return make_error(message='Winner added successfully', status_code=200)
                else:
                    return make_error(message='Invalid tournir_id', status_code=409)
            else:
                return make_error(message='Insufficient permissions', status_code=403)
        else:
            return make_error(message='Invalid access token', status_code=403)

    def get(self):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error(message='Unauthorized access', status_code=401)

        try:
            access_token = base64.b64decode(
                auth_header.split()[1]).decode('utf-8')
        except Exception:
            return make_error(message='Invalid authorization header', status_code=401)

        if isvalid(access_token):
            return select_winners()
        else:
            return make_error(message='Invalid access token', status_code=403)


class deleteTournir(Resource):
    def post(self):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error(message='Unauthorized access', status_code=401)
        try:
            access_token = base64.b64decode(
                auth_header.split()[1]).decode('utf-8')
        except Exception:
            return make_error(message='Invalid authorization header', status_code=401)

        if isvalid(access_token):
            user_id = access_token.strip('?').split(
                'vk_user_id=')[1].split('&')[0]
            if select_users(user_id=user_id)['role'] == 'Судья':
                tournir_id = request.get_json().get('tournirID')
                if tournir_id and int(tournir_id) in [int(i['tournir_id']) for i in select_tournirs()]:
                    delete_tournir(tournir_id=tournir_id)
                    return make_error(message='Tournament successfully deleted', status_code=200)
                else:
                    return make_error(message='Tournament does not exist', status_code=409)
            else:
                return make_error(message='Invalid user role', status_code=403)
        else:
            return make_error(message='Unauthorized activity detected', status_code=403)


class selectResults(Resource):
    def get(self, tournir_id):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error(message='Unauthorized access', status_code=401)
        try:
            access_token = base64.b64decode(
                auth_header.split()[1]).decode('utf-8')
        except Exception:
            return make_error(message='Invalid authorization header', status_code=401)

        if isvalid(access_token):
            user_id = access_token.strip('?').split(
                'vk_user_id=')[1].split('&')[0]

            if int(tournir_id) in [int(i['tournir_id']) for i in select_tournirs()]:
                if select_users(user_id=user_id)['role'] == 'Судья':
                    making_excell(tournir_id=tournir_id)
                    dirfiles = os.listdir('/home/Alonikx/python-backend-vkminiapp/excel/')
                    path = f'/home/Alonikx/python-backend-vkminiapp/excel/{dirfiles[0]}'

                    if os.path.exists(path):
                        return send_file(path, as_attachment=True)
                    else:
                        return make_error(message='Excel file not found', status_code=404)
                else:
                    return make_error(message='Invalid user role', status_code=403)
            else:
                return make_error(message='Tournament does not exist', status_code=404)
        else:
            return make_error(message='Unauthorized activity detected', status_code=403)


class selectResults2(Resource):
    def get(self, tournir_id,password):
        if password == '':
                making_excell(tournir_id=tournir_id)
                dirfiles = os.listdir('/home/Alonikx/python-backend-vkminiapp/excel/')
                path = f'/home/Alonikx/python-backend-vkminiapp/excel/{dirfiles[0]}'
                if os.path.exists(path):
                    return send_file(path, as_attachment=True)

class changeRole(Resource):
    def post(self):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error(message='Invalid authorization header', status_code=401)

        try:
            access_token = base64.b64decode(
                auth_header.split()[1]).decode('utf-8')
        except Exception:
            return make_error(message='Invalid token format', status_code=401)

        if isvalid(access_token):
            user_id = access_token.strip('?').split(
                'vk_user_id=')[1].split('&')[0]
            user = select_users(user_id=user_id)

            role = request.get_json().get('Role')
            if str(role) in ['Участник', 'Капитан']:
                change_role(user_id=user_id, new_role=role)

                if user['role'] == 'Капитан':
                    if select_teams(user_id=user_id):
                        for team in select_teams(user_id=user_id):
                            delete_team(teamID=team['team_id'])

                elif user['role'] == 'Участник':
                    if select_teams_by_type(user_id=user_id, type='5X5'):
                        exit_team(userid=user_id, team_id=select_teams_by_type(
                            user_id=user_id, type='5X5')[0]['team_id'])
                    else:
                        return make_error(message='No 5X5 teams associated with the user', status_code=404)

                    if select_teams_by_type(user_id=user_id, type='1X1'):
                        delete_team(teamID=select_teams_by_type(
                            user_id=user_id, type='1X1')[0]['team_id'])

            else:
                return make_error(message='Invalid role specified', status_code=409)
        else:
            return make_error(message='Unauthorized activity detected', status_code=403)


class exitTeam(Resource):
    def post(self):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error(message='Invalid authorization header', status_code=401)
        try:
            access_token = base64.b64decode(
                auth_header.split()[1]).decode('utf-8')
        except Exception:
            return make_error(message='Invalid token format', status_code=401)

        if isvalid(access_token):
            user_id = access_token.strip('?').split(
                'vk_user_id=')[1].split('&')[0]
            user = select_users(user_id=user_id)
            if user['role'] != 'Участник':
                return make_error(message='User is not a participant', status_code=403)
            team = select_teams_by_type(user_id=user_id, type='5X5')
            if team:
                exit_team(userid=user_id, team_id=team[0]['team_id'])
                return {"message": "Successfully exited from the team."}, 200
            else:
                return make_error(message='No 5X5 teams associated with the user', status_code=404)
        else:
            return make_error(message='Unauthorized activity detected', status_code=403)


class Videos(Resource):
    def get(self):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error(message='Invalid authorization header', status_code=401)

        try:
            access_token = base64.b64decode(
                auth_header.split()[1]).decode('utf-8')
        except Exception:
            return make_error(message='Invalid token format', status_code=401)

        if isvalid(access_token):
            videos = select_videos()
            return videos if videos else make_error(message='No videos found', status_code=404)
        else:
            return make_error(message='Unauthorized activity detected', status_code=403)

    def post(self):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error(message='Invalid authorization header', status_code=401)

        try:
            access_token = base64.b64decode(
                auth_header.split()[1]).decode('utf-8')
        except Exception:
            return make_error(message='Invalid token format', status_code=401)

        if isvalid(access_token):
            user_id = access_token.strip('?').split(
                'vk_user_id=')[1].split('&')[0]
            user = select_users(user_id=user_id)

            if user['role'] != 'Судья':
                return make_error(message='User does not have the required role', status_code=403)

            pattern = r'^https:\/\/vk\.com\/video-\d{7,10}_\d{7,10}$'
            URL = request.get_json().get('URL')
            if not URL.strip() or not re.match(pattern, URL):
                return make_error(message='Invalid URL format', status_code=400)

            video_type = request.get_json().get('type')
            if video_type not in ['Видео', 'Трансляции']:
                return make_error(message='Invalid video type', status_code=400)

            try:
                add_video(url=URL, type=video_type)
                return {"message": "Video added successfully"}, 201
            except Exception as e:
                return make_error(message=f'Error while adding video: {str(e)}', status_code=500)

        else:
            return make_error(message='Unauthorized activity detected', status_code=403)


class DeleteVideo(Resource):
    def post(self):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error(message='Invalid authorization header', status_code=401)

        try:
            access_token = base64.b64decode(
                auth_header.split()[1]).decode('utf-8')
        except Exception:
            return make_error(message='Invalid token format', status_code=401)

        if isvalid(access_token):
            user_id = access_token.strip('?').split(
                'vk_user_id=')[1].split('&')[0]
            user = select_users(user_id=user_id)

            if user['role'] != 'Судья':
                return make_error(message='User does not have the required role', status_code=403)

            video_id = request.get_json().get('videoID')
            try:
                int(video_id)
            except:
                return make_error(message='Invalid video ID format', status_code=400)

            if int(video_id) in [int(i['videos_id']) for i in select_videos()]:
                try:
                    delete_video(video_id=video_id)
                    return {"message": "Video deleted successfully"}, 200
                except Exception as e:
                    return make_error(message=f'Error while deleting video: {str(e)}', status_code=500)
            else:
                return make_error(message='Video ID does not exist', status_code=404)
        else:
            return make_error(message='Unauthorized activity detected', status_code=403)


class GotoFinal(Resource):
    def post(self):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error(message='Invalid authorization header', status_code=401)
        try:
            access_token = base64.b64decode(
                auth_header.split()[1]).decode('utf-8')
        except Exception:
            return make_error(message='Invalid token format', status_code=401)
        if isvalid(access_token):
            user_id = access_token.strip('?').split(
                'vk_user_id=')[1].split('&')[0]
            user = select_users(user_id=user_id)
            if user['role'] != 'Судья':
                return make_error(message='User does not have the required role', status_code=403)
            tournir_id = request.get_json().get('tournirID')
            if not int(tournir_id):
                return make_error(message='Invalid tournir ID format', status_code=400)

            if int(tournir_id) in [int(i['tournir_id']) for i in select_tournirs() if i['cur_stage'] == 'thirdplace']:
                try:
                    goto_final(tournir_id=int(tournir_id))
                    return {"message": "Successfully moved to final stage"}, 200
                except Exception as e:
                    return make_error(message=f'Error while processing request: {str(e)}', status_code=500)
            else:
                return make_error(message='Tournir ID is invalid or not in the correct stage', status_code=404)
        else:
            return make_error(message='Unauthorized activity detected', status_code=403)


class ChangeToAdmin(Resource):
    def post(self):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error(message='Invalid authorization header', status_code=401)

        try:
            access_token = base64.b64decode(
                auth_header.split()[1]).decode('utf-8')
        except Exception:
            return make_error(message='Invalid token format', status_code=401)

        if isvalid(access_token):
            user_id = access_token.strip('?').split(
                'vk_user_id=')[1].split('&')[0]
            user = select_users(user_id=user_id)

            if user['role'] in ['Участник', 'Капитан']:
                password = request.get_json().get('password')

                if password == 'password':
                    changeroletoadmin(user_id=user_id)

                    # Удаление команд, если пользователь был капитаном
                    if user['role'] == 'Капитан':
                        if select_teams(user_id=user_id):
                            for team in select_teams(user_id=user_id):
                                delete_team(teamID=team['team_id'])

                    # Для Участников
                    elif user['role'] == 'Участник':
                        if select_teams_by_type(user_id=user_id, type='5X5'):
                            exit_team(userid=user_id, team_id=select_teams_by_type(
                                user_id=user_id, type='5X5')[0]['team_id'])
                        else:
                            return make_error(message='No 5X5 teams associated with the user', status_code=404)

                        if select_teams_by_type(user_id=user_id, type='1X1'):
                            delete_team(teamID=select_teams_by_type(
                                user_id=user_id, type='1X1')[0]['team_id'])

                    return {"message": "Role changed to Admin successfully"}, 200
                else:
                    return make_error(message='Invalid password', status_code=403)
            else:
                return make_error(message='User does not have the required role', status_code=403)
        else:
            return make_error(message='Unauthorized activity detected', status_code=403)


class Photo(Resource):
    def get(self, photo_name, token):
        auth_header = token
        try:
            access_token = base64.b64decode(auth_header).decode('utf-8')
        except Exception:
            return make_error(message='Invalid token format', status_code=401)

        if isvalid(access_token):
            asset_directory = '/home/Alonikx/python-backend-vkminiapp/assets'
            if photo_name in [i.split('.')[0] for i in os.listdir(asset_directory)]:
                return send_from_directory(asset_directory, f'{photo_name}.png')
            else:
                return make_error(message='Invalid photo name', status_code=404)
        else:
            return make_error(message='Unauthorized activity detected', status_code=403)


class AppNotif(Resource):
    def get(self):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error(message='Invalid authorization header', status_code=401)

        try:
            access_token = base64.b64decode(
                auth_header.split()[1]).decode('utf-8')
        except Exception:
            return make_error(message='Invalid token format', status_code=401)

        if isvalid(access_token):
            user_id = access_token.strip('?').split(
                'vk_user_id=')[1].split('&')[0]
            if select_users(user_id=user_id)['role'] == 'Судья':
                return select_appNotif()
            else:
                return make_error(message='User does not have the required role', status_code=403)
        else:
            return make_error(message='Unauthorized activity detected', status_code=403)

    def post(self):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error(message='Invalid authorization header', status_code=401)

        try:
            access_token = base64.b64decode(
                auth_header.split()[1]).decode('utf-8')
        except Exception:
            return make_error(message='Invalid token format', status_code=401)

        if isvalid(access_token):
            user_id = access_token.strip('?').split(
                'vk_user_id=')[1].split('&')[0]
            if select_users(user_id=user_id)['role'] == 'Судья':
                text = request.get_json().get('text')
                if text.strip():
                    add_appNotif(text=text)
                    return {"message": "Notification added successfully"}, 201
                else:
                    return make_error(message='Text is invalid', status_code=400)
            else:
                return make_error(message='User does not have the required role', status_code=403)
        else:
            return make_error(message='Unauthorized activity detected', status_code=403)


class deleteNotif(Resource):
    def post(self):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error(message='Invalid authorization header', status_code=401)

        try:
            access_token = base64.b64decode(
                auth_header.split()[1]).decode('utf-8')
        except Exception:
            return make_error(message='Invalid token format', status_code=401)

        if isvalid(access_token):
            user_id = access_token.strip('?').split(
                'vk_user_id=')[1].split('&')[0]
            if select_users(user_id=user_id)['role'] == 'Судья':
                if select_appNotif():
                    delete_appNotif()
                    return {"message": "Notification deleted successfully"}, 204
                else:
                    return make_error(message='No notifications to delete', status_code=404)
            else:
                return make_error(message='Unauthorized role', status_code=403)
        else:
            return make_error(message='Unauthorized activity detected', status_code=403)


class AdditionInfo(Resource):
    def get(self):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error(message='Invalid authorization header', status_code=401)

        try:
            access_token = base64.b64decode(
                auth_header.split()[1]).decode('utf-8')
        except Exception:
            return make_error(message='Invalid token format', status_code=401)

        if isvalid(access_token):
            user_id = access_token.strip('?').split(
                'vk_user_id=')[1].split('&')[0]
            addition_info = select_AddInfo(user_id=user_id)
            if addition_info:
                return addition_info
            else:
                return make_error(message='Additional information not found', status_code=404)
        else:
            return make_error(message='Unauthorized activity detected', status_code=403)

    def post(self):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error(message='Invalid authorization header', status_code=401)

        try:
            access_token = base64.b64decode(
                auth_header.split()[1]).decode('utf-8')
        except Exception:
            return make_error(message='Invalid token format', status_code=401)

        if isvalid(access_token):
            user_id = access_token.strip('?').split(
                'vk_user_id=')[1].split('&')[0]
            if select_users(user_id=user_id)['role'] != 'Судья':
                data = request.get_json()
                fio = data.get('fio')
                birth_date_var = data.get('birth_date')
                citizenship = data.get('citizenship')
                nickname = data.get('nickname')
                sport_category = data.get('sport_category')
                uin_gto = data.get('uin_gto')
                phone_number = data.get('phone_number')

                try:
                    birth_date = datetime.strptime(birth_date_var, '%Y-%m-%d')
                    today = datetime.now()
                except ValueError:
                    return make_error(message='Invalid birth date', status_code=400)

                gto_pattern = r'^\d{2}-\d{2}-\d{7}$'
                phone_pattern = r'^8\d{10}$'
                grades = [
                    'Нет разряда',
                    '1 юношеский разряд',
                    '2 юношеский разряд',
                    '3 юношеский разряд',
                    '1 спортивный разряд',
                    '2 спортивный разряд',
                    '3 спортивный разряд',
                    'Кандидат в мастера спорта',
                    'Мастер спорта',
                ]
                if (
                    fio.strip() and len(fio) < 100 and
                    birth_date < today and
                    citizenship.strip() and nickname and
                    sport_category.strip() in grades and
                    uin_gto.strip() and re.match(gto_pattern, uin_gto) and
                    phone_number.strip() and phone_number.isdigit(
                    ) and re.match(phone_pattern, phone_number)
                ):
                    add_AdditionInfo(vkid=user_id, fio=fio, birth_date=birth_date.date(),
                                     citizenship=citizenship, nickname=nickname,
                                     sport_category=sport_category, uin_gto=uin_gto,
                                     phone_number=phone_number)
                    return {"message": "Additional information added successfully"}, 201
                else:
                    return make_error(message='Invalid input data', status_code=400)
            else:
                return make_error(message='Unauthorized role', status_code=403)
        else:
            return make_error(message='Unauthorized activity detected', status_code=403)


class deleteAddInfo(Resource):
    def post(self):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error(message='Invalid authorization header', status_code=401)

        try:
            access_token = base64.b64decode(
                auth_header.split()[1]).decode('utf-8')
        except Exception:
            return make_error(message='Invalid token format', status_code=401)

        if isvalid(access_token):
            user_id = access_token.strip('?').split(
                'vk_user_id=')[1].split('&')[0]
            if select_AddInfo(user_id=user_id):
                delete_AddInfo(vkid=user_id)
                return {"message": "Additional information deleted successfully"}, 204
            else:
                return make_error(message='Additional information not found', status_code=404)
        else:
            return make_error(message='Unauthorized activity detected', status_code=403)


class selectAllUsers(Resource):
    def get(self):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error(message='Invalid authorization header', status_code=401)
        try:
            access_token = base64.b64decode(
                auth_header.split()[1]).decode('utf-8')
        except Exception:
            return make_error(message='Invalid token format', status_code=401)

        if isvalid(access_token):
            user_id = access_token.strip('?').split(
                'vk_user_id=')[1].split('&')[0]
            if select_users(user_id=user_id)['role'] == 'Судья':
                making_excell2()
                dirfiles = os.listdir('/home/Alonikx/python-backend-vkminiapp/excell2/')
                if dirfiles:
                    path = f'/home/Alonikx/python-backend-vkminiapp/excell2/{dirfiles[0]}'
                    if os.path.exists(path):
                        return send_file(path, as_attachment=True)
                    else:
                        return make_error(message='File path does not exist', status_code=404)
                else:
                    return make_error(message='No files found in the directory', status_code=404)
            else:
                return make_error(message='Unauthorized role', status_code=403)
        else:
            return make_error(message='Unauthorized activity detected', status_code=403)

# class selectAllUsers2(Resource):
#     def get(self, token):
#         auth_header = token
#         try:
#             access_token = base64.b64decode(auth_header).decode('utf-8')
#         except Exception:
#             return make_error(message='Invalid token format', status_code=401)

#         if isvalid(access_token):
#             user_id = access_token.strip('?').split(
#                 'vk_user_id=')[1].split('&')[0]
#             if select_users(user_id=user_id)['role'] == 'Судья':
#                 making_excell2()
#                 dirfiles = os.listdir('/home/Alonikx/python-backend-vkminiapp/excell2/')
#                 if dirfiles:
#                     path = f'/home/Alonikx/python-backend-vkminiapp/excell2/{dirfiles[0]}'
#                     if os.path.exists(path):
#                         return send_file(path, as_attachment=True)
#                     else:
#                         return make_error(message='File path does not exist', status_code=404)
#                 else:
#                     return make_error(message='No files found in the directory', status_code=404)
#             else:
#                 return make_error(message='Unauthorized role', status_code=403)
#         else:
#             return make_error(message='Unauthorized activity detected', status_code=403)
class selectAllUsers2(Resource):
    def get(self, password):
        if password == 'adminpassword':
            making_excell2()
            dirfiles = os.listdir('/home/Alonikx/python-backend-vkminiapp/excell2/')
            if dirfiles:
                path = f'/home/Alonikx/python-backend-vkminiapp/excell2/{dirfiles[0]}'
                if os.path.exists(path):
                    return send_file(path, as_attachment=True)

class returnBracketFunc(Resource):
    def post(self):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error(message='Invalid authorization header', status_code=401)

        try:
            access_token = base64.b64decode(
                auth_header.split()[1]).decode('utf-8')
        except Exception:
            return make_error(message='Invalid token format', status_code=401)

        if isvalid(access_token):
            user_id = access_token.strip('?').split(
                'vk_user_id=')[1].split('&')[0]
            if select_users(user_id=user_id)['role'] == 'Судья':
                tournir_id = request.get_json().get('tournirID')
                if tournir_id and int(tournir_id) in [int(i['tournir_id']) for i in select_tournirs()]:
                    returnBracket(tournir_id=tournir_id)
                    return {"message": "Bracket returned successfully"}, 200
                else:
                    return make_error(message='Invalid tournir_id', status_code=409)
            else:
                return make_error(message='Unauthorized role', status_code=403)
        else:
            return make_error(message='Unauthorized activity detected', status_code=403)


class ChangeAdditionInfo(Resource):
    def post(self):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error(message='Invalid authorization header', status_code=401)

        try:
            access_token = base64.b64decode(
                auth_header.split()[1]).decode('utf-8')
        except Exception:
            return make_error(message='Invalid token format', status_code=401)

        if isvalid(access_token):
            user_id = access_token.strip('?').split(
                'vk_user_id=')[1].split('&')[0]
            if select_users(user_id=user_id)['role'] != 'Судья':
                data = request.get_json()
                fio = data.get('fio')
                birth_date_var = data.get('birth_date')
                citizenship = data.get('citizenship')
                nickname = data.get('nickname')
                sport_category = data.get('sport_category')
                uin_gto = data.get('uin_gto')
                phone_number = data.get('phone_number')

                try:
                    birth_date = datetime.strptime(
                        birth_date_var, '%Y-%m-%d').date()
                except ValueError:
                    return make_error(message='Invalid birth date format', status_code=409)

                today = datetime.now().date()
                gto_pattern = r'^\d{2}-\d{2}-\d{7}$'
                phone_pattern = r'^8\d{10}$'

                if all([fio.strip(), birth_date < today, citizenship.strip(), nickname.strip(), sport_category.strip(), uin_gto.strip(), phone_number.strip(),
                        re.match(gto_pattern, uin_gto), phone_number.isdigit(), re.match(phone_pattern, phone_number)]):
                    change_AdditionInfo(vkid=user_id, fio=fio, birth_date=birth_date, citizenship=citizenship,
                                        nickname=nickname, sport_category=sport_category, uin_gto=uin_gto, phone_number=phone_number)
                    return {"message": "Additional information updated successfully"}, 200
                else:
                    return make_error(message='One or more fields are invalid', status_code=409)
            else:
                return make_error(message='Unauthorized role', status_code=403)
        else:
            return make_error(message='Unauthorized activity detected', status_code=403)


class TournirDescription(Resource):
    def get(self, tournir_id):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error(message='Invalid authorization header', status_code=401)

        try:
            access_token = base64.b64decode(
                auth_header.split()[1]).decode('utf-8')
        except Exception:
            return make_error(message='Invalid token format', status_code=401)

        if isvalid(access_token):
            return return_description(tournir_id=tournir_id)
        else:
            return make_error(message='Unauthorized activity detected', status_code=403)

    def post(self, tournir_id):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error(message='Invalid authorization header', status_code=401)

        try:
            access_token = base64.b64decode(
                auth_header.split()[1]).decode('utf-8')
        except Exception:
            return make_error(message='Invalid token format', status_code=401)

        if isvalid(access_token):
            user_id = access_token.strip('?').split(
                'vk_user_id=')[1].split('&')[0]
            if select_users(user_id=user_id)['role'] == 'Судья':
                if tournir_id and int(tournir_id) in [int(i['tournir_id']) for i in select_tournirs()]:
                    file1 = request.files.get('file1')
                    file2 = request.files.get('file2')
                    file3 = request.files.get('file3')
                    json_data = json.loads(
                        request.form.to_dict().get('jsonField', '{}'))
                    title = json_data.get('title')
                    info_block1 = json_data.get('info_block1')
                    # Default to empty string
                    info_block2 = json_data.get('info_block2', '')
                    # Default to empty string
                    info_block3 = json_data.get('info_block3', '')

                    if title.strip() and info_block1.strip():
                        if file1:
                            file1.save(
                                f'/home/Alonikx/python-backend-vkminiapp/TournirImages/{file1.filename}')
                        if file2:
                            file2.save(
                                f'/home/Alonikx/python-backend-vkminiapp/TournirImages/{file2.filename}')
                        if file3:
                            file3.save(
                                f'/home/Alonikx/python-backend-vkminiapp/TournirImages/{file3.filename}')

                        add_description(tournir_id=int(tournir_id), title=title, info_block1=info_block1,
                                        info_block2=info_block2 if info_block2 != '' else None,
                                        info_block3=info_block3 if info_block3 != '' else None,
                                        photo1_path=file1.filename if file1 else None,
                                        photo2_path=file2.filename if file2 else None,
                                        photo3_path=file3.filename if file3 else None)
                        return {"message": "Description added successfully"}, 201
                    else:
                        return make_error(message='Title and first info block are required', status_code=409)
                else:
                    return make_error(message='Invalid tournir_id', status_code=409)
            else:
                return make_error(message='Unauthorized role', status_code=403)
        else:
            return make_error(message='Unauthorized activity detected', status_code=403)


class TournirPhoto(Resource):
    def get(self, photo_name, token):
        auth_header = token
        try:
            access_token = base64.b64decode(auth_header).decode('utf-8')
        except Exception:
            return make_error(message='Invalid token format', status_code=401)
        if isvalid(access_token):
            if photo_name in os.listdir('/home/Alonikx/python-backend-vkminiapp/TournirImages'):
                return send_from_directory('/home/Alonikx/python-backend-vkminiapp/TournirImages/', photo_name)
            else:
                return make_error(message='Invalid photo name', status_code=409)
        else:
            return make_error(message='Unauthorized activity detected', status_code=403)


class ChangeTournirDescription(Resource):
    def post(self, tournir_id):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return make_error(message='Invalid authorization header', status_code=401)

        try:
            access_token = base64.b64decode(
                auth_header.split()[1]).decode('utf-8')
        except Exception:
            return make_error(message='Invalid token format', status_code=401)

        if isvalid(access_token):
            user_id = access_token.strip('?').split(
                'vk_user_id=')[1].split('&')[0]
            if select_users(user_id=user_id)['role'] == 'Судья':
                if tournir_id and tournir_id.isdigit() and int(tournir_id) in [int(i['tournir_id']) for i in select_tournirs()]:
                    file1 = request.files.get('file1')
                    file2 = request.files.get('file2')
                    file3 = request.files.get('file3')
                    json_data = json.loads(
                        request.form.to_dict().get('jsonField', '{}'))
                    title = json_data.get('title')
                    info_block1 = json_data.get('info_block1')
                    info_block2 = json_data.get(
                        'info_block2', None)  # Default to None
                    info_block3 = json_data.get(
                        'info_block3', None)  # Default to None
                    file1_name = json_data.get('name1')
                    file2_name = json_data.get('name2')
                    file3_name = json_data.get('name3')

                    if title.strip() and info_block1.strip():
                        filename1 = file1.filename if file1 else file1_name
                        filename2 = file2.filename if file2 else file2_name
                        filename3 = file3.filename if file3 else file3_name

                        if file1:
                            file1.save(
                                f'/home/Alonikx/python-backend-vkminiapp/TournirImages/{filename1}')
                        if file2:
                            file2.save(
                                f'/home/Alonikx/python-backend-vkminiapp/TournirImages/{filename2}')
                        if file3:
                            file3.save(
                                f'/home/Alonikx/python-backend-vkminiapp/TournirImages/{filename3}')

                        change_description(
                            tournir_id=int(tournir_id),
                            title=title,
                            info_block1=info_block1,
                            info_block2=info_block2,
                            info_block3=info_block3,
                            photo1_path=filename1,
                            photo2_path=filename2,
                            photo3_path=filename3
                        )
                        return {"message": "Description updated successfully"}, 200
                    else:
                        return make_error(message='Title and first info block are required', status_code=409)
                else:
                    return make_error(message='Invalid tournir_id', status_code=409)
            else:
                return make_error(message='Unauthorized role', status_code=403)
        else:
            return make_error(message='Unauthorized activity detected', status_code=403)


api.add_resource(Home, '/')
api.add_resource(TeamMaking, '/team/<type>')
api.add_resource(Notifications, '/notifications')
api.add_resource(AcceptNotif, '/notifications/accept')
api.add_resource(DeclineNotif, '/notifications/decline')
api.add_resource(Tournir, '/tournirs')
api.add_resource(DeleteMember, '/team/delete')
api.add_resource(DeleteTeam, '/team/deleteTeam')
api.add_resource(TeamParticipants, '/teamParticipants')
api.add_resource(tournirAddTeam, '/tournirs/<tournir_id>/addteam/<team_id>')
api.add_resource(tournirDecline, '/tournirs/<tournir_id>/addteam/decline')
api.add_resource(tournirAccept, '/tournirs/<tournir_id>/addteam/accept')
api.add_resource(showTournirTeams, '/tournirs/<tournir_id>/teams')
api.add_resource(deleteTournirTeams, '/tournirs/<tournir_id>/teamsDelete')
api.add_resource(makeBracket1, '/tournirs/makefirstbracket')
api.add_resource(updateScores, '/tournirs/update')
api.add_resource(goNext, '/tournirs/brackets/gonext')
api.add_resource(add_winner, '/tournirs/winners')
api.add_resource(deleteTournir, '/deleteTournir')
api.add_resource(selectResults, '/downloadresults/<tournir_id>')
api.add_resource(selectResults2, '/downloadresults/<tournir_id>/<password>/android')
api.add_resource(changeRole, '/changeRole')
api.add_resource(exitTeam, '/team/exit')
api.add_resource(Videos, '/videos')
api.add_resource(DeleteVideo, '/videos/delete')
api.add_resource(GotoFinal, '/tournirs/thirdplace')
api.add_resource(ChangeToAdmin, '/changetoadmin')
api.add_resource(Photo, '/images/<photo_name>/<token>')
api.add_resource(AppNotif, '/appNotif')
api.add_resource(deleteNotif, '/deleteappNotif')
api.add_resource(AdditionInfo, '/addition_info')
api.add_resource(deleteAddInfo, '/delete_addition_info')
api.add_resource(selectAllUsers, '/downloadExcell')
api.add_resource(selectAllUsers2, '/downloadExcell2/<password>/android')
api.add_resource(returnBracketFunc, '/tournirs/returnBracket')
api.add_resource(ChangeAdditionInfo, '/addition_info/change')
api.add_resource(TournirDescription,
                 '/tournirs/tournir_description/<tournir_id>')
api.add_resource(
    TournirPhoto, '/tournirs/tournir_description/image/<photo_name>/<token>')
api.add_resource(ChangeTournirDescription,
                 '/tournirs/tournir_description/<tournir_id>/change')
api.add_resource(tournirAddTeamAdmin, '/tournirs/<tournir_id>/addteam')

if __name__ == '__main__':
    app.run()

