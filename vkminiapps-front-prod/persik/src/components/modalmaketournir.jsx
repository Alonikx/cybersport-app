import { Div, Button, FormItem, CustomSelect, Input, Textarea, File} from '@vkontakte/vkui'
import { useEffect, useState } from 'react' 
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'



const ModalMakeTournir = ()=>{
	const routeNavigator = useRouteNavigator()

	async function onClick() {
		try {
			const request1 = new Request('https://alonikx.pythonanywhere.com/tournirs', {
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'POST',
				body: JSON.stringify({
					title: input1,
					description: input2,
					description_inside: input3,
					game_type: gameName,
					prize: input4
				}),
			})
			const resp = await fetch(request1)
			console.log(resp)
			routeNavigator.hideModal()
			routeNavigator.backToFirst()
		} catch (err) {
			console.log(err)
		}
		
		setInput1('')
		setInput2('')
		setInput3('')
		setInput4('')


	}

	const [input1, setInput1] = useState('')
	const [input2, setInput2] = useState('')
	const [input3, setInput3] = useState('')
	const [input4, setInput4] = useState('')

	const [gameName, setGameName] = useState('')


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
		setGameName(value)
	}

	const onChange5 = e => {
		const { value } = e.currentTarget
		setInput4(value)
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
	] 

	

    return (
			<Div>
				<FormItem required>
					<FormItem top='Название игры' htmlFor='select-id'>
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
						top='Введите описание турнира:'
						bottom={`${input2.length}/150`}
					>
						<Input onChange={onChange2} maxLength={150} />
					</FormItem>
					<FormItem
						top='Введите описание, которое будет внутри:'
						bottom={`${input3.length}/255`}
					>
						<Textarea onChange={onChange3} maxLength={255} />
					</FormItem>

					<FormItem top='Введите призовую сумму турнира:'>
						<Input onChange={onChange5} />
					</FormItem>
					<FormItem>
						<Button
							onClick={onClick}
							size='l'
							stretched
							disabled={!input1 || !input2 || !input3 || !gameName || !input4}
						>
							Добавить
						</Button>
					</FormItem>
				</FormItem>
			</Div>
		)
}

export default ModalMakeTournir