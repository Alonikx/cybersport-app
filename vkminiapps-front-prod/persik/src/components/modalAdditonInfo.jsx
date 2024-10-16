import { Div, Button, Text, Spinner, ScreenSpinner } from '@vkontakte/vkui'
import { useEffect, useState } from 'react'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import axios from 'axios'

function ModalAdittionInfo({ user }) {
	const [addInfo, setAddInfo] = useState([])
	const [isLoadingAddInfo, setIsLoadingAddInfo] = useState(false)
	useEffect(() => {
		async function fetchAddInfo() {
			setIsLoadingAddInfo(true) // Устанавливаем состояние загрузки в true
			try {
				const response = await axios.get(
					'https://alonikx.pythonanywhere.com/addition_info',
					{
						headers: {
							Authorization: `Bearer ${btoa(window.location.search)}`,
						},
					}
				)
				setAddInfo(response.data)
			} catch (err) {
			} finally {
				setIsLoadingAddInfo(false) // Устанавливаем состояние загрузки в false
			}
		}
		fetchAddInfo()
	}, [])

	async function onClickDeleteAddInfo() {
		const result = await axios.post(
			'https://alonikx.pythonanywhere.com/delete_addition_info',
			{},
			{
				headers: {
					Authorization: `Bearer ${btoa(window.location.search)}`,
					'Content-Type': 'application/json',
				},
			}
		)
		routeNavigator.showPopout(<ScreenSpinner state='loading' />)
		setTimeout(() => {
			routeNavigator.hideModal()
			window.location.href = window.location.href
			location.reload(true) // Перезагрузка страницы
			routeNavigator.hidePopout() // Скрываем спиннер
		}, 1000)
	}

	function findUserid() {
		if (addInfo.length != 0 && typeof user != 'undefined') {
			for (let i = 0; i <= addInfo.length - 1; i++) {
				if (addInfo[`${i}`].vkid == user.id) {
					return addInfo[`${i}`]
				}
			}
		}
	}
	const rightuserId = findUserid()
	const date = rightuserId && rightuserId.birth_date.split('-')
	const routeNavigator = useRouteNavigator()
	if (isLoadingAddInfo) {
		return (
			<Div>
				<Spinner size='medium' />
			</Div>
		)
	}
	return (
		<Div>
			<Div style={{ padding: '0px' }}>
				<Text style={{ fontSize: '16px', paddingBottom: '10px' }}>
					ФИО: {rightuserId && rightuserId.fio}
				</Text>
				{date ? (
					<Text style={{ fontSize: '16px', paddingBottom: '10px' }}>
						Дата рождения: {`${date[2]}-${date[1]}-${date[0]}`}
					</Text>
				) : (
					<Text style={{ fontSize: '16px', paddingBottom: '10px' }}>
						Дата рождения:
					</Text>
				)}
				<Text style={{ fontSize: '16px', paddingBottom: '10px' }}>
					Гражданство: {rightuserId && rightuserId.citizenship}
				</Text>
				<Text style={{ fontSize: '16px', paddingBottom: '10px' }}>
					Номер телефона: {rightuserId && rightuserId.phone_number}
				</Text>
				<Text style={{ fontSize: '16px', paddingBottom: '10px' }}>
					Никнейм: {rightuserId && rightuserId.nickname}
				</Text>
				<Text style={{ fontSize: '16px', paddingBottom: '10px' }}>
					Разряд: {rightuserId && rightuserId.sport_category}
				</Text>
				<Text style={{ fontSize: '16px', paddingBottom: '15px' }}>
					УИН: {rightuserId && rightuserId.uin_gto}
				</Text>
			</Div>
			{rightuserId && (
				<Div
					style={{
						padding: '0px 0px 10px 0px',
						display: 'flex',
						justifyContent: 'center',
					}}
				>
					<Button stretched onClick={() => routeNavigator.push('/change_info')}>
						Редактировать информацию
					</Button>
				</Div>
			)}
			{rightuserId && (
				<Div
					style={{ padding: '0px', display: 'flex', justifyContent: 'center' }}
				>
					<Button stretched onClick={onClickDeleteAddInfo}>
						Удалить информацию
					</Button>
				</Div>
			)}
			{!rightuserId && (
				<Div
					style={{ padding: '0px', display: 'flex', justifyContent: 'center' }}
				>
					<Button stretched onClick={() => routeNavigator.push('/add_info')}>
						Заполнить
					</Button>
				</Div>
			)}
		</Div>
	)
}

export default ModalAdittionInfo
