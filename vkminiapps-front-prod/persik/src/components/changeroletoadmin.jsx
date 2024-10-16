import { Div, Button, FormItem, Input, ScreenSpinner } from '@vkontakte/vkui'
import { useState } from 'react'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import axios from 'axios'
const ChangeRoletoAdmin = () => {
	const routeNavigator = useRouteNavigator()
	const [input1, setInput1] = useState('')
	const onChange = e => {
		const { value } = e.currentTarget
		setInput1(value)
	}

	async function onClick() {
		try {
			const result = await axios.post(
				'https://alonikx.pythonanywhere.com/changetoadmin',
				{
					password: input1,
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

	return (
		<Div>
			<FormItem top='Введите пароль для смены роли'>
				<Input onChange={onChange} />
			</FormItem>
			<FormItem>
				<Button onClick={onClick} size='l' stretched disabled={!input1}>
					Ввести пароль
				</Button>
			</FormItem>
		</Div>
	)
}

export default ChangeRoletoAdmin
