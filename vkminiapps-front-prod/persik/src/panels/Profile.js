import {
	Panel,
	PanelHeader,
	Group,
	Header,
	Div,
	Cell,
	Avatar,
	IconButton,
	Text,
	Button,
	Headline,
	PullToRefresh,
	CellButton,
	Tappable,
	SimpleCell,
	Checkbox,
	Spinner,
	Snackbar,
	ScreenSpinner,
} from '@vkontakte/vkui'
import {
	Icon24GearOutline,
	Icon28AddCircleOutline,
	Icon20ChevronRight,
	Icon28ErrorCircleOutline,
	Icon28CheckCircleOutline,
} from '@vkontakte/icons'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { useState, useEffect, useCallback } from 'react'
import bridge from '@vkontakte/vk-bridge'
import { onClickDownloadAllUsers } from '../functions'
import AppNotif from '../components/appNotif'
import axios from 'axios'
import {saveAs} from 'file-saver';
export const Profile = ({ id1, fetchedUser, tableuser, platform }) => {
	const { photo_200, id, first_name, last_name } = { ...fetchedUser }
	const [team_5x5, SetTeam5X5] = useState()
	const [team_1x1, SetTeam1X1] = useState()
	const routeNavigator = useRouteNavigator()
	const [notifications, SetNotifications] = useState([])
	const [fetching, setFetching] = useState(false)
	const [version, setVersion] = useState(0)
	const [snackbars, setSnackbars] = useState([])
	const TeamName = notifications && notifications.teamName
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min) + min)
	}
	const onRefresh = useCallback(() => {
		setFetching(true)
		setTimeout(() => {
			setFetching(false)
			window.location.reload()
		}, getRandomInt(600, 2000))
	}, [])
	const [addInfo, setAddInfo] = useState([])
	useEffect(() => {
		async function fetchAddInfo() {
			const request = await axios.get(
				`https://alonikx.pythonanywhere.com/addition_info`,
				{
					headers: { Authorization: `Bearer ${btoa(window.location.search)}` },
				}
			)
			setAddInfo(request.data)
		}
		try {
			fetchAddInfo()
		} catch (err) {}
	}, [])

	const closeSnackbar = id => {
		setSnackbars(prev => prev.filter(snackbar => snackbar.id !== id))
	}

	const openSuccess = id => {
		setSnackbars(prev => [
			...prev,
			{
				id: Date.now(),
				message: `Приглашение пользователю ${id} отправлено`,
				type: 'success',
			},
		])
	}
	const openError = id => {
		setSnackbars(prev => [
			...prev,
			{
				id: Date.now(),
				message: `Ошибка при отправке приглашения пользователю ${id}`,
				type: 'error',
			},
		])
	}

	const [isLoadingTeam, setIsLoadingTeam] = useState(false)
	const [isLoadingNotifications, setIsLoadingNotifications] = useState(false)

	const fetchData = async () => {
		try {
			setIsLoadingTeam(true)
			try {
				const response5X5 = await axios.get(
					`https://alonikx.pythonanywhere.com/team/5X5`,
					{
						headers: {
							Authorization: `Bearer ${btoa(window.location.search)}`,
						},
					}
				)
				SetTeam5X5(response5X5.data)
			} catch (err) {}
			try {
				const response1X1 = await axios.get(
					`https://alonikx.pythonanywhere.com/team/1X1`,
					{
						headers: {
							Authorization: `Bearer ${btoa(window.location.search)}`,
						},
					}
				)
				SetTeam1X1(response1X1.data)
			} catch (err) {}
		} catch (error) {
			console.error('Ошибка при получении данных:', error)
		} finally {
			setIsLoadingTeam(false)
		}
	}
	useEffect(() => {
		fetchData()
	}, [version])

	useEffect(() => {
		async function fetchNotificationsInv() {
			setIsLoadingNotifications(true) // Устанавливаем состояние загрузки в true
			try {
				const request = await axios.get(
					`https://alonikx.pythonanywhere.com/notifications`,
					{
						headers: {
							Authorization: `Bearer ${btoa(window.location.search)}`,
						},
					}
				)
				SetNotifications(request.data)
			} catch (err) {
			} finally {
				setIsLoadingNotifications(false) // Устанавливаем состояние загрузки в false
			}
		}
		fetchNotificationsInv()
	}, [version])

	async function onClick() {
		try {
			const request = await bridge.send('VKWebAppGetFriends', { multi: true })
			if (typeof request !== 'undefined') {
				for (let i = 0; i < request.users.length; i++) {
					try {
						const response = await axios.post(
							'https://alonikx.pythonanywhere.com/notifications',
							{
								users: request.users[i]['id'],
							},
							{
								headers: {
									Authorization: `Bearer ${btoa(window.location.search)}`,
									'Content-Type': 'application/json',
								},
							}
						)
						// Если запрос был успешен, показываем уведомление об успехе
						openSuccess(
							`${request.users[i]['first_name']} ${request.users[i]['last_name']}`
						)
					} catch (err) {
						// В случае ошибки показываем уведомление об ошибке для текущего пользователя
						openError(
							`${request.users[i]['first_name']} ${request.users[i]['last_name']}`
						)
					}
				}
			}
		} catch (err) {}
	}

	async function onClickAcc() {
		try {
			const response = await axios.post(
				'https://alonikx.pythonanywhere.com/notifications/accept',
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
			window.location.href = window.location.href
			location.reload(true) // Перезагрузка страницы
			routeNavigator.hidePopout() // Скрываем спиннер
		}, 1000)
		} catch (err) {}
	}

	async function onClickDec() {
		try {
			const response = await axios.post(
				'https://alonikx.pythonanywhere.com/notifications/decline',
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
				window.location.href = window.location.href
				location.reload(true) // Перезагрузка страницы
				routeNavigator.hidePopout() // Скрываем спиннер
			}, 1000)
		} catch (err) {}
	}
	async function onClickDelete(someid) {
		try {
			const response = await axios.post(
				'https://alonikx.pythonanywhere.com/team/delete',
				{ users: someid },
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

	async function onClickDeleteTeam(team_id) {
		try {
			const response = await axios.post(
				'https://alonikx.pythonanywhere.com/team/deleteTeam',
				{ teamID: team_id },
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
		} catch (err) {}
	}
	function findUserid() {
		if (addInfo.length != 0 && tableuser && tableuser.length != 0) {
			for (let i = 0; i <= addInfo.length - 1; i++) {
				if (addInfo[`${i}`].vkid == tableuser.vkid) {
					return addInfo[`${i}`]
				}
			}
		}
	}
	const rightuserId = findUserid()

	const [checked, setChecked] = useState('')
	const [version_notif, setVersionNotif] = useState(0)

	useEffect(() => {
		async function fetchNotifications() {
			const request = await bridge.send('VKWebAppGetLaunchParams')
			setChecked(request.vk_are_notifications_enabled == 0 ? false : true)
		}
		try {
			fetchNotifications()
		} catch (err) {}
	}, [version_notif])

	async function notificationsWindow() {
		try {
			if (checked == false) {
				const req = await bridge.send('VKWebAppAllowNotifications')
				setVersionNotif(version_notif + 1)
			} else {
				const req = await bridge.send('VKWebAppDenyNotifications')
				setVersionNotif(version_notif + 2)
			}
		} catch (err) {}
	}
	const fetchFileDesk = async () => {
		try {
			const response = await axios.get(
				'https://alonikx.pythonanywhere.com/downloadExcell',
				{
					headers: {
						Authorization: `Bearer ${btoa(window.location.search)}`,
					},
					responseType: 'blob', // Указываем, что ожидаем бинарные данные
				}
			)
			const url = window.URL.createObjectURL(new Blob([response.data]))
			const a = document.createElement('a')
			a.href = url
			a.target = '_self'
			a.download = 'Выгрузка.xlsx' // Укажите имя файла здесь
			console.log(a)
			document.body.appendChild(a)
			a.click()
			document.body.removeChild(a)
			window.URL.revokeObjectURL(url) // Освобождаем память
		} catch (err) {
			console.error('Ошибка при скачивании файла:', err)
		}
	}
	const fetchFileMobil = async () => {
		 try {
			const response = await axios.get(
				'https://alonikx.pythonanywhere.com/downloadExcell',
				{
					headers: {
						Authorization: `Bearer ${btoa(window.location.search)}`,
					},
					responseType: 'blob',
				}
			)

			const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'  })
			saveAs(blob, 'Выгрузка.xlsx')
			
		} catch (err) {
			console.error('Ошибка при скачивании файла:', err)
		}
	}
	async function exitTeamonClick() {
		try {
			const result = await axios.post(
				'https://alonikx.pythonanywhere.com/team/exit',
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
				window.location.href = window.location.href
				location.reload(true) // Перезагрузка страницы
				routeNavigator.hidePopout() // Скрываем спиннер
			}, 1000)
		} catch (err) {}
	}

	if (!fetchedUser || !tableuser) {
		return (
			<Panel id={id}>
				<PanelHeader>Профиль</PanelHeader>{' '}
				<PullToRefresh onRefresh={onRefresh} isFetching={fetching}>
					<Div style={{ textAlign: 'center' }}>
						Профиль еще не создан, обновите страницу
					</Div>
				</PullToRefresh>
			</Panel>
		)
	}
	if (!fetchedUser || !tableuser) {
		return <Spinner size='medium' />
	}
	return (
		<Panel id={id1}>
			<PanelHeader>Профиль</PanelHeader>
			<PullToRefresh onRefresh={onRefresh} isFetching={fetching}>
				{fetchedUser && tableuser && (
					<Group>
						<Cell
							key={id}
							before={photo_200 && <Avatar src={photo_200} />}
							subtitle={
								tableuser && tableuser.role
									? `id: ${id} Роль: ${tableuser.role}`
									: `id: ${id}`
							}
							after={
								<Div padding={'0px'}>
									<IconButton
										label='Редактировать'
										onClick={() => routeNavigator.showModal('modalEdit')}
									>
										<Icon24GearOutline />
									</IconButton>
								</Div>
							}
						>
							{`${first_name} ${last_name}`}
						</Cell>
						{tableuser && tableuser.role != 'Судья' && (
							<CellButton
								onClick={() => routeNavigator.showModal('ModalAddittionInfo')}
								after={
									<Div>
										<Icon20ChevronRight />
									</Div>
								}
								style={{ color: 'white' }}
							>
								{platform == 'web' ? (
									<Text style={{ fontSize: 16 }}>
										Дополнительная информация
									</Text>
								) : (
									<Text style={{ fontSize: 14 }}>
										Дополнительная информация
									</Text>
								)}
							</CellButton>
						)}
						{tableuser && tableuser.role != 'Судья' && (
							<SimpleCell
								after={
									<Checkbox
										onClick={() => notificationsWindow()}
										checked={checked}
										style={{ paddingRight: '2px' }}
									/>
								}
								style={{ color: 'white' }}
							>
								{platform == 'web' ? (
									<Text style={{ fontSize: 16 }}>
										Уведомления о предстоящих турнирах
									</Text>
								) : (
									<Text style={{ fontSize: 14 }}>
										Уведомления о предстоящих турнирах
									</Text>
								)}
							</SimpleCell>
						)}
					</Group>
				)}

				{tableuser && tableuser.role != 'Судья' && (
					<Group
						header={
							<Header mode='secondary'>
								Регистрация для командного участия
							</Header>
						}
					>
						{team_5x5 && team_5x5[0] && !isLoadingTeam && (
							<Div
								id={team_5x5[0] && team_5x5[0].team_id}
								key={team_5x5[0] && team_5x5[0].team_id}
							>
								<Headline style={{ textAlign: 'center', fontSize: 22 }}>
									<Div>{team_5x5[0] && team_5x5[0].team_name}</Div>
								</Headline>
								<Div
									style={{
										padding: '0px',
										border: '1px solid white',
										borderRadius: '6px',
									}}
								>
									{team_5x5[0] &&
										team_5x5[0].team_members &&
										team_5x5[0].team_members.split(',').map(el => (
											<Div
												key={el.split(' . ')[0]}
												style={{
													padding: '0px',
												}}
											>
												<Cell
													key={el.split(' . ')[0]}
													after={
														el.split(' . ')[0] != id &&
														tableuser &&
														tableuser.role == 'Капитан' && (
															<Div style={{ padding: '0px' }}>
																<Button
																	onClick={() =>
																		onClickDelete(el.split(' . ')[0])
																	}
																>
																	Исключить
																</Button>
															</Div>
														)
													}
												>
													<Text key={team_5x5[0] && team_5x5[0].team_id}>
														{el.split(' . ')[1]} {el.split(' . ')[2]}
													</Text>
												</Cell>
											</Div>
										))}
								</Div>

								{tableuser && tableuser.role == 'Капитан' && (
									<Div style={{ display: 'flex', justifyContent: 'center' }}>
										<Button onClick={onClick}>Добавить участника</Button>
									</Div>
								)}
								{tableuser && tableuser.role == 'Капитан' && (
									<Div style={{ display: 'flex', justifyContent: 'center' }}>
										<Button
											onClick={() =>
												onClickDeleteTeam(team_5x5[0] && team_5x5[0].team_id)
											}
										>
											Удалить команду
										</Button>
									</Div>
								)}

								{tableuser && tableuser.role == 'Участник' && (
									<Div style={{ display: 'flex', justifyContent: 'center' }}>
										<Button onClick={exitTeamonClick}>Выйти из команды</Button>
									</Div>
								)}
							</Div>
						)}
						{isLoadingTeam && <Spinner size='medium' />}

						{!team_5x5 &&
							tableuser &&
							tableuser.role == 'Капитан' &&
							addInfo.length != 0 && (
								<Tappable
									onClick={() => routeNavigator.showModal('modalAddTeam5x5')}
								>
									<Div
										style={{
											display: 'flex',
											justifyContent: 'center',
											gap: 5,
										}}
									>
										<Icon28AddCircleOutline />
										<Text style={{ paddingTop: 6, fontSize: 15 }}>
											Создать команду
										</Text>
									</Div>
								</Tappable>
							)}
						{!rightuserId &&
							tableuser &&
							tableuser.role == 'Капитан' &&
							!isLoadingTeam && (
								<Text
									style={{
										textAlign: 'center',
										fontSize: '16px',
										padding: '30px',
									}}
								>
									Чтобы создать команду, нужно заполнить дополнительную
									информацию
								</Text>
							)}
						{!team_5x5 && tableuser && tableuser.role == 'Участник' && (
							<Div style={{ padding: '0px' }}>
								<Div style={{ display: 'flex', justifyContent: 'center' }}>
									<Text style={{ fontSize: '16px' }}>
										Вы не состоите в команде
									</Text>
								</Div>
								{!rightuserId && !isLoadingTeam && (
									<Div style={{ display: 'flex', justifyContent: 'center' }}>
										<Text style={{ fontSize: '16px', textAlign: 'center' }}>
											Чтобы вступать в команды, необходимо заполнить
											дополнительную информацию
										</Text>
									</Div>
								)}
							</Div>
						)}
						{snackbars.map(
							(snackbar, index) =>
								index < 6 && (
									<Snackbar
										key={snackbar.id}
										onClose={() => closeSnackbar(snackbar.id)}
										before={
											snackbar.type === 'success' ? (
												<Icon28CheckCircleOutline fill='var(--vkui--color_icon_positive)' />
											) : (
												<Icon28ErrorCircleOutline fill='var(--vkui--color_icon_negative)' />
											)
										}
										style={{ marginBottom: 60 * (index + 1) }}
									>
										{snackbar.message}
									</Snackbar>
								)
						)}
					</Group>
				)}
				{notifications &&
					tableuser &&
					tableuser.role == 'Участник' &&
					notifications.length != 0 && (
						<Group header={<Header mode='secondary'>Приглашения</Header>}>
							<Div>
								Вас приглашают в "{TeamName}"
								<Div style={{ display: 'flex', gap: 10 }}>
									<Button onClick={onClickAcc}>Принять</Button>
									<Button onClick={onClickDec}>Отказаться</Button>
								</Div>
							</Div>
						</Group>
					)}

				{tableuser && tableuser.role != 'Судья' && (
					<Group
						header={
							<Header mode='secondary'>
								Регистрация для индивидуального участия
							</Header>
						}
					>
						{!team_1x1 &&
							tableuser &&
							tableuser.role != 'Судья' &&
							rightuserId && (
								<Tappable
									onClick={() => routeNavigator.showModal('modalAddTeam1x1')}
								>
									<Div
										style={{
											display: 'flex',
											justifyContent: 'center',
											gap: 5,
										}}
									>
										<Icon28AddCircleOutline />
										<Text style={{ paddingTop: 6, fontSize: 15 }}>
											Создать команду
										</Text>
									</Div>
								</Tappable>
							)}
						{isLoadingTeam && <Spinner size='medium' />}

						{!rightuserId && !isLoadingTeam && !team_1x1 && !team_5x5 && (
							<Text
								style={{
									textAlign: 'center',
									fontSize: '16px',
									padding: '30px',
								}}
							>
								Чтобы создать команду, нужно заполнить дополнительную информацию
							</Text>
						)}

						{team_1x1 && (
							<Div id={team_1x1[0].team_id} key={team_1x1[0].team_id}>
								<Headline style={{ textAlign: 'center', fontSize: 22 }}>
									<Div>{team_1x1[0].team_name}</Div>
								</Headline>
								<Div
									style={{
										padding: '0px',
										border: '1px solid white',
										borderRadius: '6px',
									}}
								>
									<Div
										key={team_1x1[0].team_members.split(' . ')[0]}
										style={{
											padding: '0px',
										}}
									>
										<Cell key={team_1x1[0].team_members.split(' . ')[0]}>
											<Text key={team_1x1[0].team_id}>
												{team_1x1[0].team_members.split(' . ')[1]}{' '}
												{team_1x1[0].team_members.split(' . ')[2]}
											</Text>
										</Cell>
									</Div>
								</Div>
								{tableuser && tableuser.role != 'Судья' && (
									<Div style={{ display: 'flex', justifyContent: 'center' }}>
										<Button
											onClick={() => onClickDeleteTeam(team_1x1[0].team_id)}
										>
											Удалить команду
										</Button>
									</Div>
								)}
							</Div>
						)}
					</Group>
				)}
				{tableuser && tableuser.role == 'Судья' && (
					<Group header={<Header mode='secondary'>Уведомления</Header>}>
						{!isLoadingNotifications ? <AppNotif /> : <Spinner size='medium' />}
					</Group>
				)}
				{tableuser && tableuser.role == 'Судья' && platform == 'web' && (
					<Group header={<Header mode='secondary'>Выгрузка</Header>}>
						<Div style={{ display: 'flex', justifyContent: 'center' }}>
							<Button
								stretched
								style={{ height: '30px' }}
								onClick={fetchFileDesk}
							>
								Выгрузить все
							</Button>
						</Div>
					</Group>
				)}
				{tableuser && tableuser.role == 'Судья' && platform == 'mobile-web' && (
					<Group header={<Header mode='secondary'>Выгрузка</Header>}>
						<Div style={{ display: 'flex', justifyContent: 'center' }}>
							<Button
								stretched
								style={{ height: '30px' }}
								onClick={fetchFileMobil}
							>
								Выгрузить все
							</Button>
						</Div>
					</Group>
				)}
				{tableuser &&
					tableuser.role == 'Судья' &&
					(platform == 'android' || platform == 'ios') && (
						<Group header={<Header mode='secondary'>Выгрузка</Header>}>
							<Button
								stretched
								style={{ height: '30px' }}
								onClick={onClickDownloadAllUsers}
							>
								Выгрузить все
							</Button>
						</Group>
					)}
			</PullToRefresh>
		</Panel>
	)
}
