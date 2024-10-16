import {
	Panel,
	PanelHeader,
	PanelHeaderBack,
	Div,
	Group,
	Header,
	Button,
	Cell,
	Text,
	Spinner,
	ScreenSpinner,
} from '@vkontakte/vkui'
import {
	useSearchParams,
	useRouteNavigator,
} from '@vkontakte/vk-mini-apps-router'
import { onClickDownload } from '../functions'
import { saveAs } from 'file-saver'
import { TabPanel } from '../components/main-tab'
import { Scrollable } from '../components/scrollable-tab'
import { useState, useEffect } from 'react'
import CardInfo from '../components/cards-info'
import Cells from '../components/cells'
import { DescribeInputs } from '../components/tournirDescribeInputs'
import { TournirDescription } from '../components/TournirDescription'
import { ChangeDescribeInputs } from '../components/TournirChangeDescribe'
import axios from 'axios'

export const TournamentsInfo = ({ id1, tableuser, platform }) => {
	const routeNavigator = useRouteNavigator()
	const [version, setVersion] = useState(0)
	const [params] = useSearchParams()
	const [tab, setTab] = useState(null)
	const [tab1, setTab1] = useState(null)
	const [team, setTeam] = useState('')
	const [teamWaiting, setTeamWaiting] = useState('')
	const [tournirTeam, setTournirTeam] = useState([])
	const [Tournir, SetTournir] = useState()
	const [buttonChange, setButtonChange] = useState()
	const [Tournirdescription_inside, setDescriptionInside] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [isLoading2, setIsLoading2] = useState(false)
	const [isLoading3, setIsLoading3] = useState(false)
	const [isLoadingTournir, setLoadingTournir] = useState(false)
	const cur_tournir =
		Tournir &&
		Tournir.find(tournament => tournament.tournir_id == params.get('id'))
	const cur_stage = cur_tournir && cur_tournir.cur_stage
	const cur_type = cur_tournir && cur_tournir.tournir_type
	const team_id = team && team[0].team_id
	useEffect(() => {
		params.get('tab1') ? setTab('tournirs') : setTab('info')
	}, [params])

	useEffect(() => {
		if (params.get('tab2') === null) {
			setTab1('firstStage')
		} else if (params.get('tab2') === 'secondStage') {
			setTab1('secondStage')
		} else if (params.get('tab2') === 'thirdStage') {
			setTab1('thirdStage')
		} else if (params.get('tab2') === 'fourthStage') {
			setTab1('fourthStage')
		} else if (params.get('tab2') === 'fifthStage') {
			setTab1('fifthStage')
		} else if (params.get('tab2') === 'thirdplace') {
			setTab1('thirdplace')
		} else if (params.get('tab2') === 'winner') {
			setTab1('winner')
		} else if (params.get('tab2') === 'semifinal') {
			setTab1('semifinal')
		} else if (params.get('tab2') === 'final') {
			setTab1('final')
		} else {
			setTab1('')
		}
	}, [params])
	if (!params.get('tab1') && params.get('tab2')) {
		params.delete('tab2')
	}
	useEffect(() => {
		async function fetchTournirTeam() {
			setIsLoading2(true)
			try {
				const request = await axios.get(
					`https://alonikx.pythonanywhere.com/tournirs/${params.get(
						'id'
					)}/teams`,
					{
						headers: {
							Authorization: `Bearer ${btoa(window.location.search)}`,
						},
					}
				)
				setTournirTeam(request.data)
			} catch (err) {
			} finally {
				setIsLoading2(false)
			}
		}
		fetchTournirTeam()
	}, [version])

	useEffect(() => {
		async function fetchTeamWaiting() {
			setIsLoading3(true) // Устанавливаем состояние загрузки
			try {
				if (!tableuser.role) return
				if (tableuser.role!='Судья'){
					const request = await axios.get(
						`https://alonikx.pythonanywhere.com/tournirs/${params.get(
							'id'
						)}/addteam/${team_id}`,
						{
							headers: {
								Authorization: `Bearer ${btoa(window.location.search)}`,
							},
						}
					)
					setTeamWaiting(request.data)
				}
				else{
					const request = await axios.get(
						`https://alonikx.pythonanywhere.com/tournirs/${params.get(
							'id'
						)}/addteam`,
						{
							headers: {
								Authorization: `Bearer ${btoa(window.location.search)}`,
							},
						}
					)
					setTeamWaiting(request.data)
				}
				
			} catch (err) {
				console.error(err)
			} finally {
				setIsLoading3(false)
			}
		}
		fetchTeamWaiting()
	}, [team_id, version, tableuser && tableuser.role])

	useEffect(() => {
		async function fetchTeam() {
			if (!cur_type) return
			const request = await axios.get(
				`https://alonikx.pythonanywhere.com/team/${cur_type}`,
				{
					headers: { Authorization: `Bearer ${btoa(window.location.search)}` },
				}
			)
			setTeam(request.data)
		}
		try {
			fetchTeam()
		} catch (err) {}
	}, [cur_type, version])

	async function onClickAdd() {
		try {
			const response = await axios.post(
				`https://alonikx.pythonanywhere.com/tournirs/${params.get(
					'id'
				)}/addteam/${team_id}`,
				{},
				{
					headers: {
						Authorization: `Bearer ${btoa(window.location.search)}`,
						'Content-Type': 'application/json',
					},
				}
			)
			setVersion(version + 1)
		} catch (err) {
			console.error(err) // Обработка ошибок с выводом в консоль
		}
	}

	async function onClickAccept(team_id) {
		try {
			const response = await axios.post(
				`https://alonikx.pythonanywhere.com/tournirs/${params.get(
					'id'
				)}/addteam/accept`,
				{
					teamID: team_id,
				},
				{
					headers: {
						Authorization: `Bearer ${btoa(window.location.search)}`,
						'Content-Type': 'application/json',
					},
				}
			)
			setVersion(version + 1)
		} catch (err) {
			console.error(err) // Обработка ошибок с выводом в консоль
		}
	}

	async function onClickDecline(team_id) {
		try {
			const response = await axios.post(
				`https://alonikx.pythonanywhere.com/tournirs/${params.get(
					'id'
				)}/addteam/decline`,
				{
					teamID: team_id,
				},
				{
					headers: {
						Authorization: `Bearer ${btoa(window.location.search)}`,
						'Content-Type': 'application/json',
					},
				}
			)
			setVersion(version + 1)
		} catch (err) {
			console.error('Error adding team:', err) // Обработка ошибок с выводом в консоль
		}
	}

	async function onClickDeleteTeam(team_id) {
		try {
			const response = await axios.post(
				`https://alonikx.pythonanywhere.com/tournirs/${params.get(
					'id'
				)}/teamsDelete`,
				{
					teamID: team_id,
				},
				{
					headers: {
						Authorization: `Bearer ${btoa(window.location.search)}`,
						'Content-Type': 'application/json',
					},
				}
			)
			setVersion(version + 1)
		} catch (err) {
			console.error(err) // Обработка ошибок с выводом в консоль
		}
	}

	useEffect(() => {
		async function fetchTournir() {
			setLoadingTournir(true)
			const request = await axios.get(
				'https://alonikx.pythonanywhere.com/tournirs',
				{
					headers: { Authorization: `Bearer ${btoa(window.location.search)}` },
				}
			)
			SetTournir(request.data)
		}
		try {
			fetchTournir()
		} catch (err) {
		} finally {
			setLoadingTournir(false)
		}
	}, [])

	async function makeBracket() {
		try {
			const response = await axios.post(
				'https://alonikx.pythonanywhere.com/tournirs/makefirstbracket',
				{
					tournirID: params.get('id'),
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
		} catch (err) {
			console.error(err) // Обработка ошибок с выводом в консоль
		}
	}
	const [winners, setWinners] = useState('')
	console.log(winners)
	useEffect(() => {
		async function show_winners() {
			const request = await axios.get(
				'https://alonikx.pythonanywhere.com/tournirs/winners',
				{
					headers: { Authorization: `Bearer ${btoa(window.location.search)}` },
				}
			)
			setWinners(request.data)
		}
		try {
			show_winners()
		} catch (err) {}
	}, [])

	async function onClickReturnBracket() {
		try {
			const response = await axios.post(
				'https://alonikx.pythonanywhere.com/tournirs/returnBracket',
				{
					tournirID: params.get('id'),
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
		} catch (err) {
			console.error(err) // Обработка ошибок с выводом в консоль
		}
	}

	useEffect(() => {
		async function fetchDescription() {
			setIsLoading(true) // Устанавливаем isLoading в true перед началом запроса
			try {
				const request = await axios.get(
					`https://alonikx.pythonanywhere.com/tournirs/tournir_description/${params.get(
						'id'
					)}`,
					{
						headers: {
							Authorization: `Bearer ${btoa(window.location.search)}`,
						},
					}
				)
				setDescriptionInside(request.data)
			} catch (err) {
				console.error(err)
			} finally {
				setIsLoading(false) // Устанавливаем isLoading в false после завершения запроса
			}
		}

		fetchDescription()
	}, [version])
	const stages = [
		'firstStage',
		'secondStage',
		'thirdStage',
		'fourthStage',
		'fifthStage',
		'thirdplace',
		'semifinal',
		'winner',
		'final',
	]
	if (
		!isLoadingTournir &&
		Tournir &&
		!Tournir.find(tournament => tournament.tournir_id == params.get('id'))
	) {
		return (
			<Panel>
				<PanelHeader
					before={<PanelHeaderBack onClick={() => routeNavigator.push('/')} />}
				/>
				<Div style={{ textAlign: 'center' }}>Такой турнир еще не создан</Div>
			</Panel>
		)
	}
		const fetchFileDesk = async () => {
			try {
				const response = await axios.get(
					`https://alonikx.pythonanywhere.com/downloadresults/${params.get(
						'id'
					)}`,
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
					`https://alonikx.pythonanywhere.com/downloadresults/${params.get(
						'id'
					)}`,
					{
						headers: {
							Authorization: `Bearer ${btoa(window.location.search)}`,
						},
						responseType: 'blob', // Указываем, что ожидаем бинарные данные
					}
				)

				const blob = new Blob([response.data], {
					type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				})
				saveAs(blob, 'Выгрузка.xlsx')
			} catch (err) {
				console.error('Ошибка при скачивании файла:', err)
			}
		}
	return (
		<Panel id={id1}>
			<PanelHeader
				before={<PanelHeaderBack onClick={() => routeNavigator.push('/')} />}
			>
				<TabPanel tab={tab} />
			</PanelHeader>
			{params.get('tab1') === null && (
				<Group>
					<Group>
						{buttonChange ? (
							<Div style={{ padding: '0px' }}>
								{Tournirdescription_inside[0] ? (
									<ChangeDescribeInputs
										platform={platform}
										obj={Tournirdescription_inside[0]}
										tournir_id={params.get('id')}
									/>
								) : (
									<DescribeInputs
										platform={platform}
										tournir_id={params.get('id')}
									/>
								)}

								<Div
									style={{
										padding: '0px',
										display: 'flex',
										justifyContent: 'center',
									}}
								>
									<Button onClick={() => setButtonChange(null)}>
										Отменить
									</Button>
								</Div>
							</Div>
						) : (
							<Div>
								<TournirDescription
									platform={platform}
									obj={Tournirdescription_inside[0]}
									isLoading={isLoading}
								/>
								{tableuser && tableuser.role == 'Судья' && (
									<Div
										style={{
											padding: '25px 0px 0px 0px',
											display: 'flex',
											justifyContent: 'center',
										}}
									>
										<Button onClick={() => setButtonChange(1)}>
											Редактировать
										</Button>
									</Div>
								)}
							</Div>
						)}
					</Group>
					<Group header={<Header mode='secondary'>Победители</Header>}>
						<Div>
							{winners &&
								!winners[0][params.get('id')] &&
								!winners[1][params.get('id')] && (
									<Text
										style={{
											fontSize: '16px',
											paddingBottom: 10,
										}}
									>
										Еще не определены
									</Text>
								)}
							{!winners && (
								<Text style={{ fontSize: '16px', paddingBottom: '20px' }}>
									Еще не определены
								</Text>
							)}
							{winners &&
								winners[0][params.get('id')] &&
								(
									<Div>
										<Text
											style={{
												fontSize: '16px',
												paddingBottom: '15px',
												fontWeight: 'bold',
											}}
										>
											1-е место: {winners && winners[0][params.get('id')][0][0]}{' '}
											&#129351;
										</Text>
										<Text
											style={{
												fontSize: '16px',
												paddingBottom: '15px',
											}}
										>
											2-е место: {winners && winners[0][params.get('id')][0][1]}{' '}
											&#129352;
										</Text>
										{winners && winners[1][params.get('id')] && 
										<Text
										style={{
											fontSize: '16px',
											paddingBottom: '15px',
										}}
									>
										3-е место: {winners && winners[1][params.get('id')][0]}{' '}
										&#129353;
									</Text>
									}
										
									</Div>
								)}
						</Div>
					</Group>
					{tableuser &&
						tableuser &&
						tableuser.role == 'Судья' &&
						!cur_stage && (
							<Div style={{ padding: '0px' }}>
								<Group
									header={
										<Header mode='secondary'>Команды на рассмотрении</Header>
									}
								>
									{platform == 'web' && !isLoading3 && (
										<Div>
											{teamWaiting &&
												teamWaiting.map(el => (
													<Cell
														key={el.team_id}
														style={{
															border: '0.5px white solid',
															borderRadius: '15px',
															marginBottom: '20px',
														}}
														after={
															<Div style={{ display: 'flex', gap: 10 }}>
																<Button
																	onClick={() => onClickAccept(el.team_id)}
																>
																	Одобрить
																</Button>
																<Button
																	onClick={() => onClickDecline(el.team_id)}
																>
																	Отказать
																</Button>
															</Div>
														}
													>
														<Div style={{ display: 'flex', gap: 10 }}>
															<Text
																style={{
																	textWrap: 'wrap',
																	textAlign: 'center',
																	fontSize: '16px',
																}}
															>
																ID команды: {el.team_id}
															</Text>
															<Text
																style={{
																	textWrap: 'wrap',
																	textAlign: 'center',
																	fontSize: '16px',
																}}
															>
																Название: {el.team_name}
															</Text>
															<Text
																style={{
																	textAlign: 'center',
																	fontSize: '16px',
																}}
															>
																Кол-во Участников: {el.team_quantity}
															</Text>
															<Text
																style={{
																	textAlign: 'center',
																	fontSize: '16px',
																}}
															>
																ID турнира: {el.tournir_id}
															</Text>
														</Div>
													</Cell>
												))}
											{teamWaiting.length == 0 && (
												<Text
													style={{
														fontSize: '16px',
														paddingBottom: 20,
													}}
												>
													Заявок нет
												</Text>
											)}
										</Div>
									)}
									{platform != 'web' && !isLoading3 && (
										<Div>
											{teamWaiting &&
												teamWaiting.map(el => (
													<Cell
														key={el.team_id}
														style={{
															border: '0.5px white solid',
															borderRadius: '15px',
															marginBottom: '15px',
														}}
														after={
															<Div style={{ padding: '0px' }}>
																<Div
																	style={{
																		display: 'flex',
																		justifyContent: 'center',
																		paddingBottom: '5px',
																	}}
																>
																	<Button
																		onClick={() => onClickAccept(el.team_id)}
																	>
																		Одобрить
																	</Button>
																</Div>
																<Div
																	style={{
																		display: 'flex',
																		justifyContent: 'center',
																	}}
																>
																	<Button
																		onClick={() =>
																			onClickDecline(el.team_id, el.tournir_id)
																		}
																	>
																		Отказать
																	</Button>
																</Div>
															</Div>
														}
													>
														<Div>
															<Text
																style={{
																	textWrap: 'wrap',
																	textAlign: 'center',
																	fontSize: '13px',
																}}
															>
																ID команды: {el.team_id}
															</Text>
															<Text
																style={{
																	textWrap: 'wrap',
																	textAlign: 'center',
																	fontSize: '13px',
																}}
															>
																Название: {el.team_name}
															</Text>
															<Text
																style={{
																	textAlign: 'center',
																	fontSize: '13px',
																}}
															>
																Кол-во Участников: {el.team_quantity}
															</Text>
														</Div>
													</Cell>
												))}
											{teamWaiting.length == 0 && (
												<Text
													style={{
														fontSize: '16px',
														paddingBottom: '20px',
													}}
												>
													Заявок нет
												</Text>
											)}
										</Div>
									)}
									{isLoading3 && <Spinner size='medium' />}
								</Group>
							</Div>
						)}

					<Group header={<Header mode='secondary'>Команды</Header>}>
						<Div>
							{tableuser &&
								cur_tournir &&
								((cur_tournir.tournir_type === '5X5' &&
									tableuser.role === 'Капитан') ||
									(cur_tournir.tournir_type === '1X1' &&
										tableuser.role !== 'Судья')) &&
								!cur_stage &&
								team &&
								!teamWaiting && (
									<Div
										style={{
											display: 'flex',
											justifyContent: 'center',
											padding: '15px',
										}}
									>
										<Button onClick={onClickAdd}>Подать заявку</Button>
									</Div>
								)}
							{tableuser &&
								cur_tournir &&
								((cur_tournir.tournir_type === '5X5' &&
									tableuser.role === 'Капитан') ||
									(cur_tournir.tournir_type === '1X1' &&
										tableuser.role !== 'Судья')) &&
								!cur_stage &&
								team &&
								teamWaiting && (
									<Text
										style={{
											fontSize: '16px',
											textAlign: 'center',
											padding: '25px',
										}}
									>
										<b>Вы подали заявку на турнир!</b>
									</Text>
								)}
							{!isLoading2 && tournirTeam && tournirTeam.length != 0 ? (
								tournirTeam[0].tournir_members.split(',').map(el => (
									<Div key={el + 'a'} style={{ padding: '0px' }}>
										{tournirTeam[0] &&
											tournirTeam[0].tournir_members.split(',').indexOf(el) %
												2 !=
												0 && (
												<Cells
													el={el}
													backgroundColor='#585858'
													cur_stage={cur_stage}
													tableuser={tableuser}
													tournirTeams={tournirTeam}
													buttonFunc={onClickDeleteTeam}
													mode='outline'
													platform={platform}
												/>
											)}
										{tournirTeam[0] &&
											tournirTeam[0].tournir_members.split(',').indexOf(el) %
												2 ==
												0 && (
												<Cells
													el={el}
													backgroundColor='#393939'
													cur_stage={cur_stage}
													tableuser={tableuser}
													tournirTeams={tournirTeam}
													buttonFunc={onClickDeleteTeam}
													mode=''
													platform={platform}
												/>
											)}
									</Div>
								))
							) : (
								<Text style={{ fontSize: 16, paddingBottom: 20 }}>
									Команд нет
								</Text>
							)}
							{isLoading2 && <Spinner size='medium' />}
						</Div>
					</Group>

					{tableuser &&
						tableuser &&
						tableuser.role == 'Судья' &&
						!cur_stage &&
						tournirTeam &&
						tournirTeam[0] &&
						tournirTeam[0].tournir_members &&
						tournirTeam[0].tournir_members.split(',').length > 4 && (
							<Div
								style={{
									display: 'flex',
									justifyContent: 'center',
									padding: '0px 0px 15px 0px',
								}}
							>
								<Button onClick={makeBracket} stretched>
									Закрыть регистрацию
								</Button>
							</Div>
						)}
					{tableuser &&
						tableuser &&
						tableuser.role == 'Судья' &&
						cur_stage &&
						(cur_stage == 'firstStage' ||
							cur_stage == 'secondStage' ||
							cur_stage == 'thirdStage') &&
						tournirTeam[0] &&
						tournirTeam[0].tournir_members &&
						tournirTeam[0].tournir_members.split(',').length > 4 && (
							<Div
								style={{
									display: 'flex',
									justifyContent: 'center',
									padding: '0px 0px 15px 0px',
								}}
							>
								<Button onClick={onClickReturnBracket} stretched>
									Удалить сетку
								</Button>
							</Div>
						)}
					{tableuser && tableuser.role == 'Судья' && platform == 'web' && (
						<Div
							style={{
								padding: '0px',
								display: 'flex',
								justifyContent: 'center',
							}}
						>
							<Button stretched onClick={fetchFileDesk} target='_blank'>
								Выгрузить результаты и участников
							</Button>
						</Div>
					)}
					{tableuser &&
						tableuser.role == 'Судья' &&
						platform == 'mobile-web' && (
							<Div
								style={{
									padding: '0px',
									display: 'flex',
									justifyContent: 'center',
								}}
							>
								<Button stretched onClick={fetchFileMobil} target='_blank'>
									Выгрузить результаты и участников
								</Button>
							</Div>
						)}
					{tableuser &&
						tableuser.role == 'Судья' &&
						(platform == 'android' || platform == 'ios') && (
							<Div
								style={{
									padding: '0px',
									display: 'flex',
									justifyContent: 'center',
								}}
							>
								<Button
									stretched
									onClick={() => onClickDownload(params.get('id'))}
								>
									Выгрузить результаты
								</Button>
							</Div>
						)}
				</Group>
			)}
			{params.get('tab1') === 'tournirs' && stages.includes(tab1) && (
				<Group>
					<Scrollable tab={tab1} />
					{params.get('tab2') === null && (
						<CardInfo
							stage='firstStage'
							tournir_id={params.get('id')}
							tableUser={tableuser}
							teams={tournirTeam}
						/>
					)}
					{params.get('tab2') === 'secondStage' && (
						<CardInfo
							stage={params.get('tab2')}
							tournir_id={params.get('id')}
							tableUser={tableuser}
							teams={tournirTeam}
						/>
					)}
					{params.get('tab2') === 'thirdStage' && (
						<CardInfo
							stage={params.get('tab2')}
							tournir_id={params.get('id')}
							tableUser={tableuser}
							teams={tournirTeam}
						/>
					)}
					{params.get('tab2') === 'fourthStage' && (
						<CardInfo
							stage={params.get('tab2')}
							tournir_id={params.get('id')}
							tableUser={tableuser}
							teams={tournirTeam}
						/>
					)}
					{params.get('tab2') === 'fifthStage' && (
						<CardInfo
							stage={params.get('tab2')}
							tournir_id={params.get('id')}
							tableUser={tableuser}
							teams={tournirTeam}
						/>
					)}
					{params.get('tab2') === 'thirdplace' && (
						<CardInfo
							stage={params.get('tab2')}
							tournir_id={params.get('id')}
							tableUser={tableuser}
							teams={tournirTeam}
						/>
					)}
					{params.get('tab2') === 'semifinal' && (
						<CardInfo
							stage={params.get('tab2')}
							tournir_id={params.get('id')}
							tableUser={tableuser}
							teams={tournirTeam}
						/>
					)}
					{params.get('tab2') === 'winner' && (
						<CardInfo
							stage={params.get('tab2')}
							tournir_id={params.get('id')}
							tableUser={tableuser}
							teams={tournirTeam}
						/>
					)}
					{params.get('tab2') === 'final' && (
						<CardInfo
							stage={params.get('tab2')}
							tournir_id={params.get('id')}
							tableUser={tableuser}
							teams={tournirTeam}
						/>
					)}
				</Group>
			)}
			{params.get('tab1') === 'tournirs' && !stages.includes(tab1) && (
				<Div>Такого этапа нет</Div>
			)}
		</Panel>
	)
}
