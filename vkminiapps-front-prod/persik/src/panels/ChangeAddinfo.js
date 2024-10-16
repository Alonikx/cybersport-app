import {
	Div,
	Button,
	FormItem,
	CustomSelect,
	Input,
	Link,
	Panel,
	Text,
	PanelHeader,
	PanelHeaderBack,
	FormLayoutGroup,
	ScreenSpinner,
} from '@vkontakte/vkui'
import { useState, useEffect } from 'react'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import axios from 'axios'
export const ChangeAddInfo = ({ id, platform, tableuser }) => {
	const routeNavigator = useRouteNavigator()
	const [addInfo, setAddInfo] = useState()
	useEffect(() => {
		async function fetchAddInfo() {
			const response = await axios.get(
				'https://alonikx.pythonanywhere.com/addition_info',
				{
					headers: {
						Authorization: `Bearer ${btoa(window.location.search)}`,
					},
				}
			)
			setAddInfo(response.data)
		}
		try {
			fetchAddInfo()
		} catch (err) {}
	}, [])

	async function onClick() {
		try {
			const result = await axios.post(
				'https://alonikx.pythonanywhere.com/addition_info/change',
				{
					fio:
						(input1 ? input1 : fio && fio.split(' ')[0]) +
						' ' +
						(input8 ? input8 : fio && fio.split(' ')[1]) +
						' ' +
						(input9 ? input9 : fio && fio.split(' ')[2]),
					birth_date: input2 ? input2 : birth_date,
					citizenship: input3 ? input3 : citizenship,
					nickname: input4 ? input4 : nickname,
					sport_category: input5 ? input5 : sport_category,
					uin_gto: input6 ? input6 : uin_gto,
					phone_number: input7 ? input7 : phone_number,
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
	const result = {}
	addInfo &&
		addInfo.forEach(item => {
			const { vkid, ...rest } = item // Извлекаем vkid и остальные элементы
			result[vkid] = rest // Добавляем в результат
		})
	const values = result[`${tableuser && tableuser.vkid}`]
	const {
		fio,
		birth_date,
		citizenship,
		nickname,
		sport_category,
		phone_number,
		uin_gto,
	} = { ...values }
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
				<FormItem required>
					<FormLayoutGroup mode={platform == 'web' ? 'horizontal' : 'vertical'}>
						<FormItem
							htmlFor='name'
							top='Имя'
							status={input1 || (fio && fio.split(' ')[0]) ? 'valid' : `error`}
						>
							<Input
								id='name'
								onChange={onChange1}
								defaultValue={fio && fio.split(' ')[0]}
								maxLength={30}
							/>
						</FormItem>
						<FormItem
							htmlFor='lastname'
							top='Фамилия'
							status={input2 || (fio && fio.split(' ')[1]) ? 'valid' : `error`}
						>
							<Input
								id='lastname'
								onChange={onChange8}
								defaultValue={fio && fio.split(' ')[1]}
								maxLength={35}
							/>
						</FormItem>
					</FormLayoutGroup>
					<FormItem
						top='Отчество'
						htmlFor='surname'
						bottom='Оставьте пустым, если его нет'
					>
						<Input
							id='surname'
							onChange={onChange9}
							defaultValue={fio && fio.split(' ')[2]}
							maxLength={30}
						/>
					</FormItem>
					<FormItem
						top='Дата рождения'
						status={
							(new Date(input2) > minAgeDate ||
								new Date(birth_date) > minAgeDate) &&
							'error'
						}
						bottom={
							(new Date(input2) > minAgeDate ||
								new Date(birth_date) > minAgeDate) &&
							'Вам должно быть не менее 14 лет'
						}
					>
						<Input type='date' onChange={onChange2} defaultValue={birth_date} />
					</FormItem>
					<FormItem
						top='Гражданство'
						status={input3 || citizenship ? 'valid' : `error`}
					>
						<Input
							onChange={onChange3}
							maxLength={35}
							placeholder='Россия'
							defaultValue={citizenship}
						/>
					</FormItem>
					{!input7 ? (
						<FormItem top='Номер телефона'>
							<Input
								onChange={onChange7}
								maxLength={11}
								defaultValue={phone_number}
							/>
						</FormItem>
					) : (
						<FormItem
							top='Номер телефона'
							status={
								!Number.isInteger(Number(input7)) || input7.length != 11
									? 'error'
									: 'valid'
							}
							bottom={
								!Number.isInteger(Number(input7)) || input7.length != 11
									? 'Введите номер в формате 8XXXXXXXXXX '
									: 'Все правильно'
							}
						>
							<Input
								onChange={onChange7}
								maxLength={11}
								defaultValue={phone_number}
							/>
						</FormItem>
					)}

					<FormItem
						top='Никнейм'
						status={input4 || nickname ? 'valid' : `error`}
					>
						<Input
							onChange={onChange4}
							maxLength={35}
							defaultValue={nickname}
						/>
					</FormItem>
					<FormItem
						top='Разряд'
						htmlFor='select-id'
						status={input5 || sport_category ? 'valid' : `error`}
					>
						<CustomSelect
							onChange={onChange5}
							id='select-id'
							defaultValue={sport_category}
							options={grade}
						/>
					</FormItem>
					{!input6 ? (
						<FormItem top='УИН ГТО'>
							<Input
								onChange={onChange6}
								maxLength={13}
								defaultValue={uin_gto}
							/>
						</FormItem>
					) : (
						<FormItem
							bottom={
								UIN_reg.test(input6)
									? 'Все правильно'
									: 'Ваш УИН должен быть в формате XX-XX-XXXXXXX'
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
					)}
					<FormItem
						htmlFor='button-id'
						bottom={<Text>Пустые поля не будут изменены</Text>}
					>
						<Button
							id='button-id'
							onClick={onClick}
							size='l'
							stretched
							disabled={
								(!input1.trim() &&
									!input2.trim() &&
									!input3.trim() &&
									!input4.trim() &&
									!input5.trim() &&
									!input6.trim() &&
									!input7.trim() &&
									!input8.trim()) ||
								(input7
									? !Number.isInteger(Number(input7))
									: !Number.isInteger(Number(phone_number))) ||
								(input7 ? input7.length != 11 : phone_number.length != 11) ||
								!UIN_reg.test(input6 ? input6 : uin_gto) ||
								new Date(input2) > minAgeDate
							}
						>
							Подтвердить изменения
						</Button>
					</FormItem>
				</FormItem>
			</Div>
		</Panel>
	)
}
