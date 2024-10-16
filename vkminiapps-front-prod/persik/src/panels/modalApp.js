import {
	ModalRoot,
	ModalCard,
	Div,
	Button,
	FormItem,
	CustomSelect,
	Input,
	ScreenSpinner,
} from '@vkontakte/vkui'
import {
	useActiveVkuiLocation,
	useRouteNavigator,
	useSearchParams,
} from '@vkontakte/vk-mini-apps-router'
import { useEffect, useState } from 'react'
import AddVideo from '../components/modalAddVideo'
import ChangeRoletoAdmin from '../components/changeroletoadmin'
import AddAppNotif from '../components/modalAddNotif'
import ModalAdittionInfo from '../components/modalAdditonInfo'
import axios from 'axios'

export const AppModalRoot = ({ user, tableuser }) => {
	const routeNavigator = useRouteNavigator()
	async function addTeam(type) {
		try {
			const response = await axios.post(
				`https://alonikx.pythonanywhere.com/team/${type}`,
				{
					teamname: TeamName,
				},
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
		} catch {}
	}
	const [role, setRole] = useState('')
	async function changeRole() {
		try {
			const response = await axios.post(
				'https://alonikx.pythonanywhere.com/changeRole',
				{
					Role: role,
				},
				{
					headers: {
						Authorization: `Bearer ${btoa(window.location.search)}`,
						'Content-Type': 'application/json',
					},
				}
			)
		} catch (err) {}
		routeNavigator.showPopout(<ScreenSpinner state='loading' />)
		setTimeout(() => {
			routeNavigator.hideModal()
			window.location.href = window.location.href
			location.reload(true) // Перезагрузка страницы
			routeNavigator.hidePopout() // Скрываем спиннер
		}, 1000)
	}
	const [TeamName, setTeamName] = useState('')
	const { modal: activeModal } = useActiveVkuiLocation()

	const users = [
		{
			value: 'Участник',
			label: 'Участник',
		},
		{
			value: 'Капитан',
			label: 'Капитан',
		},
	]
	const onChange = e => {
		const { value } = e.currentTarget
		setTeamName(value)
	}

	const onRoleChange = e => {
		const { value } = e.currentTarget
		setRole(value)
	}
	return (
		<ModalRoot
			activeModal={activeModal}
			onClose={() => routeNavigator.hideModal()}
		>
			<ModalCard id='modalEdit'>
				<FormItem
					top='Роль'
					htmlFor='select-id'
					bottom='Ваша команда и заявки на турнир будут удалены'
				>
					<CustomSelect
						onChange={onRoleChange}
						id='select-id'
						placeholder={tableuser && tableuser.role}
						options={users}
					/>
				</FormItem>
				<FormItem>
					<Button
						onClick={changeRole}
						size='l'
						stretched
						disabled={!role || role == tableuser.role}
					>
						Сменить
					</Button>
				</FormItem>
				{tableuser && tableuser.role != 'Судья' && (
					<FormItem>
						<Button
							onClick={() => routeNavigator.showModal('ModalChangeRoletoAdmin')}
							size='l'
							stretched
						>
							Стать судьей
						</Button>
					</FormItem>
				)}
			</ModalCard>
			<ModalCard id='modalAddTeam5x5'>
				<FormItem
					htmlFor='teamNameinput'
					top='Название команды'
					required
					bottom={`${TeamName.length}/45`}
				>
					<Input id='teamNameinput' onChange={onChange} maxLength={45} />
				</FormItem>
				<FormItem>
					<Button
						size='l'
						stretched
						disabled={!TeamName || !TeamName.trim()}
						onClick={() => addTeam('5X5')}
					>
						Создать
					</Button>
				</FormItem>
			</ModalCard>
			<ModalCard id='modalAddTeam1x1'>
				<FormItem
					htmlFor='teamNameinput'
					top='Название команды'
					required
					bottom={`${TeamName.length}/45`}
				>
					<Input id='teamNameinput' onChange={onChange} maxLength={45} />
				</FormItem>
				<FormItem>
					<Button
						size='l'
						stretched
						disabled={!TeamName || !TeamName.trim()}
						onClick={() => addTeam('1X1')}
					>
						Создать
					</Button>
				</FormItem>
			</ModalCard>
			<ModalCard id='ModalAddVideo'>
				<AddVideo />
			</ModalCard>
			<ModalCard id='ModalChangeRoletoAdmin'>
				<ChangeRoletoAdmin user={user} />
			</ModalCard>
			<ModalCard id='ModalAddNotif'>
				<AddAppNotif />
			</ModalCard>
			<ModalCard id='ModalAddittionInfo'>
				<ModalAdittionInfo user={user} />
			</ModalCard>
		</ModalRoot>
	)
}
