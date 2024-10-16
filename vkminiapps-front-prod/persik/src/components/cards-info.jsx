import {
	Card,
	Div,
	Title,
	Text,
	CardGrid,
	Group,
	Button,
	Input,
	FormItem,
	Spinner,
	ScreenSpinner,
} from '@vkontakte/vkui'
import { useState, useEffect } from 'react'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import axios from 'axios'

export default function CardInfo({ stage, tournir_id, tableUser, teams }) {
	const [matches, setMatches] = useState([])
	const [version, setVersion] = useState(0)
	const [isLoading, setIsloading] = useState(false)
	const routeNavigator = useRouteNavigator()
	useEffect(() => {
		async function fetchMatches() {
			setIsloading(true)
			try {
				const response = await axios.get(
					'https://alonikx.pythonanywhere.com/tournirs/makefirstbracket',
					{
						headers: {
							Authorization: `Bearer ${btoa(window.location.search)}`,
						},
					}
				)
				setMatches(response.data)
			} catch (err) {
			} finally {
				setIsloading(false)
			}
		}

		fetchMatches()
	}, [version])

	const arr = []
	function findStageteams() {
		if (typeof matches !== 'undefined') {
			for (let i = 0; i <= matches.length - 1; i++) {
				if (
					matches[`${i}`].stage == 'firstStage' &&
					stage == null &&
					matches[`${i}`].tournir_id == tournir_id
				) {
					arr.push(matches[`${i}`])
				} else if (
					matches[`${i}`].stage == stage &&
					matches[`${i}`].tournir_id == tournir_id
				) {
					arr.push(matches[`${i}`])
				}
			}
		}
	}
	findStageteams()

	const [input1, setInput1] = useState(0)
	const [input2, setInput2] = useState(0)

	const onChange1 = e => {
		const { value } = e.currentTarget
		setInput1(value)
	}

	const onChange2 = e => {
		const { value } = e.currentTarget
		setInput2(value)
	}

	const [disabled, setdisabled] = useState()

	async function onClick(match_id) {
		setdisabled(false)
		try {
			const result = await axios.post(
				'https://alonikx.pythonanywhere.com/tournirs/update',
				{
					team1Score: input1,
					team2Score: input2,
					matchID: match_id,
				},
				{
					headers: {
						Authorization: `Bearer ${btoa(window.location.search)}`,
						'Content-Type': 'application/json',
					},
				}
			)
			setVersion(version + 1)
		} catch (err) {}
		setInput1('')
		setInput2('')
	}

	const [Tournir, SetTournir] = useState([])
	useEffect(() => {
		async function fetchTournir() {
			const response = await axios.get(
				'https://alonikx.pythonanywhere.com/tournirs',
				{
					headers: {
						Authorization: `Bearer ${btoa(window.location.search)}`,
					},
				}
			)
			SetTournir(response.data)
		}
		try {
			fetchTournir()
		} catch (err) {}
	}, [])

	async function onClickGoNext() {
		try {
			const result = await axios.post(
				'https://alonikx.pythonanywhere.com/tournirs/brackets/gonext',
				{
					tournirID: tournir_id,
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
				window.location.href = window.location.href
				location.reload(true) // Перезагрузка страницы
				routeNavigator.hidePopout() // Скрываем спиннер
			}, 1000)
		} catch (err) {}
	}
	function findTournir() {
		if (typeof Tournir != 'undefined' && typeof tournir_id != 'undefined') {
			for (let i = 0; i < Tournir.length; i++) {
				if (Tournir[i].tournir_id == tournir_id) {
					return Tournir[`${i}`]
				}
			}
		}
	}

	const rightTournir = findTournir()
	async function onClickEnd() {
		try {
			const result = await axios.post(
				'https://alonikx.pythonanywhere.com/tournirs/winners',
				{
					tournirID: rightTournir && rightTournir.tournir_id,
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
				window.location.href = window.location.href
				location.reload(true) // Перезагрузка страницы
				routeNavigator.hidePopout() // Скрываем спиннер
			}, 1000)
		} catch (err) {}
	}

	async function onClickGotoFinal() {
		try {
			const result = await axios.post(
				'https://alonikx.pythonanywhere.com/tournirs/thirdplace',
				{
					tournirID: rightTournir && rightTournir.tournir_id,
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
				window.location.href = window.location.href
				location.reload(true) // Перезагрузка страницы
				routeNavigator.hidePopout() // Скрываем спиннер
			}, 1000)
		} catch (err) {}
	}
	if (isLoading) {
		return (
			<Div>
				<Spinner size='medium' />
			</Div>
		)
	}
	return (
		<Div>
			{arr.length != 0 && (
				<CardGrid size='l' style={{ paddingTop: 10 }}>
					{arr.map(el => (
						<Card id={el.idmatches} key={el.idmatches}>
							<Div>
								<Div
									style={{
										display: 'flex',
										alignItems: 'center',
										flexDirection: 'row',
										justifyContent: 'center',
									}}
								>
									<Div>
										<Text style={{ fontSize: 24 }}>
											{el.team1 ? el.team1 : 'Не определен'}
										</Text>
									</Div>
									<Div>
										<Text style={{ fontSize: 36 }}>VS</Text>
									</Div>

									<Div>
										<Text style={{ fontSize: 24 }}>
											{el.team2 ? el.team2 : 'Не определен'}
										</Text>
									</Div>
								</Div>
								<Text style={{ textAlign: 'center' }}>{el.format}</Text>
								{disabled != el.idmatches &&
									tableUser &&
									tableUser &&
									tableUser.role == 'Судья' && (
										<Div style={{ textAlign: 'center' }}>
											<Text style={{ fontSize: 24 }}>
												{el.team1_score} : {el.team2_score}
											</Text>
											<Div
												style={{ display: 'flex', justifyContent: 'center' }}
											>
												<Button onClick={() => setdisabled(el.idmatches)}>
													Редактировать
												</Button>
											</Div>
										</Div>
									)}
								{disabled == el.idmatches && (
									<Div>
										<Div
											style={{
												display: 'flex',
												justifyContent: 'center',
												gap: 7,
											}}
										>
											<FormItem style={{ padding: '0px' }} required>
												<Input
													key={el.idmatches + 1}
													style={{ width: '35px' }}
													maxLength={1}
													onChange={onChange1}
													align='center'
													required
												/>
											</FormItem>
											:{' '}
											<FormItem style={{ padding: '0px' }} required>
												<Input
													key={el.idmatches + 2}
													style={{ width: '35px' }}
													maxLength={1}
													onChange={onChange2}
													align='center'
													required
												/>
											</FormItem>
										</Div>
										<Div style={{ display: 'flex', justifyContent: 'center' }}>
											<Button onClick={() => onClick(el.idmatches)}>
												Применить изменения
											</Button>
										</Div>
									</Div>
								)}
							</Div>
						</Card>
					))}
				</CardGrid>
			)}
			{rightTournir &&
				rightTournir.cur_stage == '' &&
				arr.length == 0 &&
				teams &&
				teams.tournir_members != '' && (
					<Div style={{ display: 'flex', justifyContent: 'center' }}>
						<Text style={{ fontSize: 16, textAlign: 'center' }}>
							Турнир еще не начался
						</Text>
					</Div>
				)}
			{rightTournir &&
				rightTournir.cur_stage &&
				rightTournir.cur_stage != '' &&
				rightTournir.cur_stage != 'end' &&
				arr.length == 0 && (
					<Div style={{ display: 'flex', justifyContent: 'center' }}>
						<Text style={{ fontSize: 16, textAlign: 'center' }}>
							На этом этапе еще нет матчей
						</Text>
					</Div>
				)}
			{rightTournir &&
				(!rightTournir.cur_stage || rightTournir.cur_stage == '') &&
				arr.length == 0 &&
				!teams && (
					<Div style={{ display: 'flex', justifyContent: 'center' }}>
						<Text style={{ fontSize: 16, textAlign: 'center' }}>
							Недостаточно команд
						</Text>
					</Div>
				)}
			{rightTournir &&
				rightTournir.cur_stage &&
				rightTournir.cur_stage == 'end' && (
					<Div style={{ display: 'flex', justifyContent: 'center' }}>
						<Text style={{ fontSize: 16, textAlign: 'center' }}>
							Турнир уже закончился
						</Text>
					</Div>
				)}
			{rightTournir &&
				rightTournir.cur_stage == stage &&
				stage != 'final' &&
				stage != 'thirdplace' &&
				tableUser &&
				tableUser &&
				tableUser.role == 'Судья' && (
					<Div style={{ display: 'flex', justifyContent: 'center' }}>
						<Button onClick={onClickGoNext}>Перейти на следующий этап</Button>
					</Div>
				)}
			{rightTournir &&
				rightTournir.cur_stage == stage &&
				stage == 'final' &&
				tableUser &&
				tableUser &&
				tableUser.role == 'Судья' && (
					<Div style={{ display: 'flex', justifyContent: 'center' }}>
						<Button onClick={onClickEnd}>Закончить турнир</Button>
					</Div>
				)}

			{rightTournir &&
				rightTournir.cur_stage == stage &&
				stage == 'thirdplace' &&
				tableUser &&
				tableUser &&
				tableUser.role == 'Судья' && (
					<Div
						style={{ display: 'flex', justifyContent: 'center' }}
						onClick={onClickGotoFinal}
					>
						<Button>Перейти в финал</Button>
					</Div>
				)}
		</Div>
	)
}
