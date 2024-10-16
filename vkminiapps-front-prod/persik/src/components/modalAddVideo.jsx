import {
	Div,
	Button,
	FormItem,
	CustomSelect,
	Input,
	ScreenSpinner,
} from '@vkontakte/vkui'
import { useEffect, useState } from 'react'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import axios from 'axios'
const AddVideo = () => {
	const routeNavigator = useRouteNavigator()
	const [input1, setInput1] = useState('')
	const [input2, setInput2] = useState('')

	async function onClick() {
		try {
			const result = await axios.post(
				'https://alonikx.pythonanywhere.com/videos',
				{
					URL: input2,
					type: input1,
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
			}, 1000) // Задержка в 1 секунду
		} catch (err) {}
	}

	const onChange = e => {
		const { value } = e.currentTarget
		setInput1(value)
	}
	const onChange2 = e => {
		const { value } = e.currentTarget
		setInput2(value)
	}

	const type = [
		{
			value: 'Трансляции',
			label: 'Трансляции',
		},
		{
			value: 'Видео',
			label: 'Видео',
		},
	]
	const pattern = /^https:\/\/vk\.com\/video-\d{7,10}_\d{7,10}$/

	return (
		<Div>
			<FormItem required>
				<FormItem top='Тип видео' htmlFor='select-id'>
					<CustomSelect onChange={onChange} id='select-id' options={type} />
				</FormItem>
				<FormItem
					bottom='Ссылка должна быть в формате: https://vk.com/video-XXXXXXXXX_XXXXXXXXX'
					top='Введите ссылку на ВК видео:'
				>
					<Input onChange={onChange2} />
				</FormItem>
				<FormItem>
					<Button
						onClick={onClick}
						size='l'
						stretched
						disabled={!input1 || !input2 || !pattern.test(input2)}
					>
						Добавить видео
					</Button>
				</FormItem>
			</FormItem>
		</Div>
	)
}

export default AddVideo
