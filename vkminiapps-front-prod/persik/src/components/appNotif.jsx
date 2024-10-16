import { Div, Text, Button } from '@vkontakte/vkui'
import { useEffect, useState } from 'react'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import axios from 'axios'
export default function AppNotif() {
	const [notif, setNotif] = useState()
	const [version, setVersion] = useState(0)
	useEffect(() => {
		async function fetchNotifs() {
			const response = await axios.get(
				'https://alonikx.pythonanywhere.com/appNotif',
				{
					headers: {
						Authorization: `Bearer ${btoa(window.location.search)}`,
					},
				}
			)
			setNotif(response.data)
		}
		try {
			fetchNotifs()
		} catch (err) {}
	}, [version])
	const routeNavigator = useRouteNavigator()

	async function onClickDeleteNotif() {
		try {
			const result = await axios.post(
				'https://alonikx.pythonanywhere.com/deleteappNotif',
				{},
				{
					headers: {
						Authorization: `Bearer ${btoa(window.location.search)}`,
						'Content-Type': 'application/json',
					},
				}
			)
			setVersion(version + 1)
		} catch (err) {}
	}

	return (
		<Div style={{ padding: '0px' }}>
			{notif && notif[0] && (
				<Div>
					<Text
						style={{
							display: 'flex',
							justifyContent: 'center',
							fontSize: '16px',
							paddingBottom: '20px',
						}}
					>
						Уведомление будет отправлено всем пользователям, разрешившим
						отправку в 21:00 по московскому времени
					</Text>
					<Text
						style={{
							display: 'flex',
							justifyContent: 'center',
							fontSize: '16px',
						}}
					>
						Текст уведомления: {notif[0].notification_text}
					</Text>
				</Div>
			)}
			{notif && !notif[0] && (
				<Text
					style={{
						display: 'flex',
						justifyContent: 'center',
						fontSize: '16px',
					}}
				>
					Уведомление не создано
				</Text>
			)}
			{notif && notif[0] && (
				<Div style={{ display: 'flex', justifyContent: 'center' }}>
					<Button onClick={onClickDeleteNotif}>Удалить уведомление</Button>
				</Div>
			)}

			{notif && !notif[0] && (
				<Div style={{ display: 'flex', justifyContent: 'center' }}>
					<Button
						onClick={() => routeNavigator.showModal('ModalAddNotif')}
						stretched
					>
						Добавить уведомление
					</Button>
				</Div>
			)}
		</Div>
	)
}
