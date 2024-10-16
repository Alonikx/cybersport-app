import {
	Card,
	Div,
	Title,
	Text,
	Image,
	CardGrid,
	Button,
	Accordion,
	Separator,
	Spacing,
	Spinner,
} from '@vkontakte/vkui'
import { useEffect, useState } from 'react'
import { DEFAULT_VIEW_PANELS } from '../routes'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { OpenAction } from './alerts'
import axios from 'axios'
export default function TournamentCard({ tableuser, platform }) {
	const routeNavigator = useRouteNavigator()
	const [version, setVersion] = useState(0)
	const [Tournir, SetTournir] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	function getRublesForm(amount) {
		const absAmount = Math.abs(amount) % 100 // берем абсолютное значение и делим на 100
		const lastDigit = absAmount % 10 // берем последнюю цифру

		if (absAmount > 10 && absAmount < 20) {
			return 'рублей' // для чисел от 11 до 19
		}

		switch (lastDigit) {
			case 1:
				return 'рубль' // для чисел, оканчивающихся на 1
			case 2:
			case 3:
			case 4:
				return 'рубля' // для чисел, оканчивающихся на 2, 3, 4
			default:
				return 'рублей' // для всех остальных случаев
		}
	}
	useEffect(() => {
		async function fetchTournir() {
			setIsLoading(true)
			try {
				const response = await axios.get(
					'https://alonikx.pythonanywhere.com/tournirs',
					{
						headers: {
							Authorization: `Bearer ${btoa(window.location.search)}`,
						},
					}
				)
				SetTournir(response.data)
			} catch (err) {
			} finally {
				setIsLoading(false)
			}
		}

		fetchTournir()
	}, [version])

	async function onClick(tournir_id) {
		try {
			const result = await axios.post(
				'https://alonikx.pythonanywhere.com/deleteTournir',
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
			setVersion(version + 1)
		} catch (err) {}
	}
	const size = platform == 'web' ? 'm' : 'l'
	const groupedTournaments =
		Tournir &&
		Tournir.reduce((acc, tournament) => {
			const key = tournament.tournir_main

			if (!acc[key]) {
				acc[key] = [] // Создаём новый массив, если ключ ещё не существует
			}

			acc[key].push(tournament) // Добавляем текущий объект в массив по ключу

			return acc
		}, {})

	const tournamentList =
		Tournir &&
		Object.entries(groupedTournaments).map(([tournir_main, tournaments]) => {
			return {
				tournir_main,
				tournaments,
				tournament_count: tournaments.length, // Добавим количество турниров в группу
			}
		})
	if (isLoading) {
		return <Spinner size='medium' />
	}
	Tournir &&
		tournamentList.sort((a, b) => {
			const aTournirId = a.tournaments[0]?.tournir_id || Infinity // Используем Infinity, если tournaments пустой
			const bTournirId = b.tournaments[0]?.tournir_id || Infinity // Используем Infinity, если tournaments пустой
			return aTournirId - bTournirId
		})
	return (
		<Div style={{ padding: '0px' }}>
			{Tournir && Tournir.length != 0 ? (
				tournamentList.map(el => (
					<Accordion
						key={el.tournir_main}
						defaultExpanded={
							el.tournir_main == tournamentList[0].tournir_main ? true : false
						}
					>
						<Accordion.Summary iconPosition='after'>
							<Text style={{whiteSpace: 'normal',
														overflowWrap: 'break-word',
														fontSize: 16,}}>{el.tournir_main}</Text>
						</Accordion.Summary>
						<Spacing size={8}>
							<Separator />
						</Spacing>
						<Accordion.Content>
							<CardGrid size={size}>
								{el.tournaments.map(el => (
									<Card key={el.tournir_id}>
										<Div
											style={{
												paddingBottom: '5%',
												display: 'flex',
												alignItems: 'center',
												flexDirection: 'column',
												justifyContent: 'space-around',
												overflow: 'hidden',
												maxWidth: '100%',
											}}
											onClick={() =>
												routeNavigator.push(
													`/${DEFAULT_VIEW_PANELS.INFO}?id=${el.tournir_id}`
												)
											}
										>
											<Image
												src={`https://alonikx.pythonanywhere.com/images/${
													el.game_type
												}/${btoa(window.location.search)}`}
												alt={el.tournir_title}
												noBorder='true'
												size={80}
											/>
											<Div style={{ maxWidth: '100%' }}>
												<Title
													level='1'
													style={{
														whiteSpace: 'normal',
														overflowWrap: 'break-word',
														textAlign: 'center',
														fontSize: 24,
													}}
												>
													{el.tournir_title}
												</Title>
											</Div>

											<Text style={{ textAlign: 'center', maxWidth: '100%' }}>
												{el.tournir_description}
											</Text>
											{el.prize != 0 && (
												<Text style={{ maxWidth: '100%' }}>
													Призовой: {el.prize} {getRublesForm(el.prize)}{' '}
												</Text>
											)}

											<Text style={{ maxWidth: '100%' }}>
												Формат:{' '}
												{el.tournir_type === '5X5'
													? 'Командный'
													: 'Индивидуальный'}
											</Text>
										</Div>
										{tableuser && tableuser.role == 'Судья' && (
											<Button
												onClick={() =>
													routeNavigator.showPopout(
														<OpenAction
															tournir_name={el.tournir_title}
															func={() => onClick(el.tournir_id)}
														/>
													)
												}
												style={{ height: '35px' }}
												stretched
											>
												Удалить
											</Button>
										)}
									</Card>
								))}
							</CardGrid>
						</Accordion.Content>
					</Accordion>
				))
			) : (
				<Div style={{ textAlign: 'center', paddingBottom: 30 }}>
					Турниров еще нет
				</Div>
			)}
		</Div>
	)
}
