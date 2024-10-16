import { Div, Button, FormItem, Textarea, ScreenSpinner } from '@vkontakte/vkui'
import { useEffect, useState } from 'react'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import axios from 'axios'
const AddAppNotif = () => {
	const routeNavigator = useRouteNavigator()
	const [input1, setInput1] = useState('')

	async function onClick() {
		try {
			const result = await axios.post(
				'https://alonikx.pythonanywhere.com/appNotif',
				{
					text: input1,
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

	const onChange = e => {
		const { value } = e.currentTarget
		setInput1(value)
	}

	return (
		<Div>
			<FormItem required>
				<FormItem top='Введите текст уведомления'>
					<Textarea onChange={onChange} maxLength={230} />
				</FormItem>
				<FormItem>
					<Button
						onClick={onClick}
						size='l'
						stretched
						disabled={!input1 || !input1.trim()}
					>
						Добавить уведомление
					</Button>
				</FormItem>
			</FormItem>
		</Div>
	)
}

export default AddAppNotif
