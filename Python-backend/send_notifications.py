import requests 
from config import token, app_id, admin_id
from mysqlcoding import select_appNotif, delete_appNotif


def isallowed(user_id):
    return requests.get(f'https://api.vk.com/method/apps.isNotificationsAllowed?user_id={user_id}&apps_id={app_id}&access_token={token}&v=5.199').json()['response']['is_allowed']

def send_notif():
    text = select_appNotif()
    if len(text) != 0:
        notif_text = text[0]['notification_text']
        reqs = requests.get('https://alonikx.pythonanywhere.com').json()
        for i in range(0, len(reqs), 100):
            users_with_alowed_notifs = ','.join(
                [str(i['vkid']) for i in reqs if i['role'] != 'Судья' and isallowed(i['vkid']) == True][i:i+100])
            requests.get(
                f'https://api.vk.com/method/notifications.sendMessage?user_ids={users_with_alowed_notifs}&message={notif_text}&access_token={token}&v=5.199')
            print('Уведомление отправлено')
        delete_appNotif()
    else:
        print('Нет сообщения')

def plan():
    send_notif()

plan()

