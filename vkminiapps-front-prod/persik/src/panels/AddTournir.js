import {
	Div,
	Button,
	FormItem,
	CustomSelect,
	Input,
	ScreenSpinner,
	Panel,
} from '@vkontakte/vkui'
import { useEffect, useState } from 'react'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import axios from 'axios'
export const AddTournir = id => {
	const routeNavigator = useRouteNavigator()
	async function onClick() {
		try {
			const result = await axios.post(
				'https://alonikx.pythonanywhere.com/tournirs',
				{
					title: input1,
					description: input2,
					game_type: gameName,
					prize: input4,
					tournir_main: input5,
					tournir_type: input6,
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
				routeNavigator.push('/')
				window.location.href = window.location.href
				location.reload(true) // Перезагрузка страницы
				routeNavigator.hidePopout() // Скрываем спиннер
			}, 1000) // Задержка в 1 секунду
		} catch (err) {}
	}

	const [input1, setInput1] = useState('')
	const [input2, setInput2] = useState('')
	const [input4, setInput4] = useState('')
	const [input5, setInput5] = useState('')
	const [input6, setInput6] = useState('')

	const [gameName, setGameName] = useState('')

	const onChange1 = e => {
		const { value } = e.currentTarget
		setInput1(value)
	}

	const onChange2 = e => {
		const { value } = e.currentTarget
		setInput2(value)
	}

	const onChange4 = e => {
		const { value } = e.currentTarget
		setGameName(value)
	}

	const onChange5 = e => {
		const { value } = e.currentTarget
		setInput4(value)
	}
	const onChange6 = e => {
		const { value } = e.currentTarget
		setInput5(value)
	}
	const onChange7 = e => {
		const { value } = e.currentTarget
		setInput6(value)
	}

	const games = [
		{
			value: 'CS2',
			label: 'CS2',
		},
		{
			value: 'Dota2',
			label: 'Dota2',
		},
		{
			value: 'PUBG_MOBILE',
			label: 'PUGB MOBILE',
		},
		{
			value: 'PUBG',
			label: 'PUGB',
		},
		{
			value: 'MLBB',
			label: 'Mobile legends bang bang',
		},
		{
			value: 'HEARTHSTONE',
			label: 'Hearthstone',
		},
		{
			value: 'TEKKEN',
			label: 'Tekken',
		},
		{
			value: 'FIFA',
			label: 'FIFA',
		},
		{
			value: 'LOL',
			label: 'League of Legends',
		},
		{
			value: 'JUSTDANCE',
			label: 'JUST DANCE',
		},
	]

	const types = [
		{
			value: '5X5',
			label: '5X5',
		},
		{
			value: '1X1',
			label: '1X1',
		},
	]

	return (
		<Panel id={id}>
			<Div>
				<FormItem required>
					<FormItem top='Введите название основного турнира:'>
						<Input onChange={onChange6} maxLength={60} />
					</FormItem>
					<FormItem top='Выберите тип турнира' htmlFor='select-id1'>
						<CustomSelect
							onChange={onChange7}
							id='select-id1'
							placeholder={types[0].label}
							options={types}
						/>
					</FormItem>
					<FormItem top='Выберите дисциплину' htmlFor='select-id'>
						<CustomSelect
							onChange={onChange4}
							id='select-id'
							placeholder={games[0].label}
							options={games}
						/>
					</FormItem>
					<FormItem
						bottom={`${input1.length}/75`}
						top='Введите название турнира:'
					>
						<Input onChange={onChange1} maxLength={75} />
					</FormItem>
					<FormItem
						top='Введите краткое описание:'
						bottom={`${input2.length}/125`}
					>
						<Input onChange={onChange2} maxLength={125} />
					</FormItem>
					<FormItem
						top='Введите призовой фонд:'
						bottom='Оставьте пустым, если его нет'
					>
						<Input onChange={onChange5} maxLength={15} />
					</FormItem>
					<FormItem>
						<Button
							onClick={onClick}
							size='l'
							stretched
							disabled={
								!input1.trim() ||
								!input2.trim() ||
								!gameName.trim() ||
								!input5.trim() ||
								!input6.trim() ||
								(input4.trim() !== '' && Number.isNaN(Number(input4)))
							}
						>
							Добавить
						</Button>
					</FormItem>
				</FormItem>
			</Div>
		</Panel>
	)
}
