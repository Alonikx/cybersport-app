import {
	Div,
	Button,
	FormItem,
	CustomSelect,
	Input,
	Textarea,
	File,
	Checkbox,
	Link,
	Panel,
	Text,
	DateInput,
	PanelHeader,
	PanelHeaderBack,
	FormLayoutGroup,
	ScreenSpinner,
} from '@vkontakte/vkui'
import { useState } from 'react'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import axios from 'axios'
export const AddInfo = ({ platform, id }) => {
	const routeNavigator = useRouteNavigator()
	async function onClick() {
		try {
			const response = await axios.post(
				'https://alonikx.pythonanywhere.com/addition_info',
				{
					fio: input1 + ' ' + input8 + ' ' + input9,
					birth_date: input2,
					citizenship: input3,
					nickname: input4,
					sport_category: input5,
					uin_gto: input6,
					phone_number: input7,
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
				routeNavigator.push('/profile')
				window.location.href = window.location.href
				location.reload(true) // Перезагрузка страницы
				routeNavigator.hidePopout() // Скрываем спиннер
			}, 1000)
		} catch (err) {}
	}

	const [input1, setInput1] = useState('')
	const [input2, setInput2] = useState('')
	const [input3, setInput3] = useState('')
	const [input4, setInput4] = useState('')
	const [input5, setInput5] = useState('')
	const [input6, setInput6] = useState('')
	const [input7, setInput7] = useState('')
	const [input8, setInput8] = useState('')
	const [input9, setInput9] = useState('')

	const onChange1 = e => {
		const { value } = e.currentTarget
		setInput1(value)
	}
	const onChange2 = e => {
		const { value } = e.currentTarget
		setInput2(value)
	}

	const onChange3 = e => {
		const { value } = e.currentTarget
		setInput3(value)
	}

	const onChange4 = e => {
		const { value } = e.currentTarget
		setInput4(value)
	}

	const onChange5 = e => {
		const { value } = e.currentTarget
		setInput5(value)
	}
	const onChange6 = e => {
		const { value } = e.currentTarget
		setInput6(value)
	}
	const onChange7 = e => {
		const { value } = e.currentTarget
		setInput7(value)
	}
	const onChange8 = e => {
		const { value } = e.currentTarget
		setInput8(value)
	}
	const onChange9 = e => {
		const { value } = e.currentTarget
		setInput9(value)
	}
	const grade = [
		{
			value: 'Нет разряда',
			label: 'Нет разряда',
		},
		{
			value: '1 юношеский разряд',
			label: '1 юношеский разряд',
		},
		{
			value: '2 юношеский разряд',
			label: '2 юношеский разряд',
		},
		{
			value: '3 юношеский разряд',
			label: '3 юношеский разряд',
		},
		{
			value: '1 спортивный разряд',
			label: '1 спортивный разряд',
		},
		{
			value: '2 спортивный разряд',
			label: '2 спортивный разряд',
		},
		{
			value: '3 спортивный разряд',
			label: '3 спортивный разряд',
		},
		{
			value: 'Кандидат в мастера спорта',
			label: 'Кандидат в мастера спорта',
		},
		{
			value: 'Мастер спорта',
			label: 'Мастер спорта',
		},
	]
	const UIN_reg = /^\d{2}-\d{2}-\d{7}$/
	let minAgeDate = new Date()
	minAgeDate.setFullYear(minAgeDate.getFullYear() - 14)
	return (
		<Panel id={id}>
			<PanelHeader
				before={
					<PanelHeaderBack onClick={() => routeNavigator.push('/profile')} />
				}
			/>
			<Div>
				<FormItem>
					<FormLayoutGroup mode={platform == 'web' ? 'horizontal' : 'vertical'}>
						<FormItem
							htmlFor='name'
							top='Имя'
							required
							status={input1 ? 'valid' : `error`}
						>
							<Input id='name' onChange={onChange1} maxLength={30} />
						</FormItem>
						<FormItem
							htmlFor='lastname'
							top='Фамилия'
							required
							status={input2 ? 'valid' : `error`}
						>
							<Input id='lastname' onChange={onChange8} maxLength={35} />
						</FormItem>
					</FormLayoutGroup>
					<FormItem
						top='Отчество'
						htmlFor='surname'
						bottom='Оставьте пустым, если его нет'
					>
						<Input id='surname' onChange={onChange9} maxLength={30} />
					</FormItem>
					<FormItem
						top='Выберите дату рождения'
						bottom={
							new Date(input2) > minAgeDate && 'Вам должно быть не менее 14 лет'
						}
						status={new Date(input2) <= minAgeDate ? 'valid' : 'error'}
					>
						<Input type='date' onChange={onChange2} />
					</FormItem>
					<FormItem
						required
						top='Введите свое гражданство'
						status={input3 ? 'valid' : `error`}
					>
						<Input onChange={onChange3} maxLength={35} />
					</FormItem>
					<FormItem
						required
						top='Введите номер телефона'
						status={
							!Number.isInteger(Number(input7)) || input7.length != 11
								? 'error'
								: 'valid'
						}
						bottom={
							!Number.isInteger(Number(input7)) ||
							(input7.length != 11 && 'Введите номер в формате 8XXXXXXXXXX')
						}
					>
						<Input onChange={onChange7} maxLength={11} defaultValue='8' />
					</FormItem>

					<FormItem
						top='Введите никнейм'
						status={input4 ? 'valid' : `error`}
						required
					>
						<Input onChange={onChange4} maxLength={35} />
					</FormItem>
					<FormItem
						top='Выберите ваш разряд'
						htmlFor='select-id'
						required
						status={input5 ? 'valid' : `error`}
					>
						<CustomSelect onChange={onChange5} id='select-id' options={grade} />
					</FormItem>
					<FormItem
						bottom={
							!UIN_reg.test(input6) &&
							'Введите свой УИН в формате XX-XX-XXXXXXX:'
						}
						status={UIN_reg.test(input6) ? 'valid' : 'error'}
						top={
							<Text>
								Узнать свой УИН можно на{' '}
								<Link href='https://user.gto.ru/user/login' target='_blank'>
									сайте
								</Link>
							</Text>
						}
					>
						<Input
							onChange={onChange6}
							maxLength={13}
							placeholder='XX-XX-XXXXXXX'
						/>
					</FormItem>
					<FormItem
						htmlFor='button-id'
						bottom={
							<Text>
								Нажимая "Отправить", вы соглашаетесь с{' '}
								<Link onClick={() => routeNavigator.push('/policy')}>
									протоколом
								</Link>
							</Text>
						}
					>
						<Button
							id='button-id'
							onClick={onClick}
							size='l'
							stretched
							disabled={
								!input1.trim() ||
								!input2.trim() ||
								!input3.trim() ||
								!input4.trim() ||
								!input5.trim() ||
								!input6.trim() ||
								!input7.trim() ||
								!input8.trim() ||
								new Date(input2) > minAgeDate ||
								!Number.isInteger(Number(input7)) ||
								input7.length != 11 ||
								!UIN_reg.test(input6)
							}
						>
							Отправить
						</Button>
					</FormItem>
				</FormItem>
			</Div>
		</Panel>
	)
}
