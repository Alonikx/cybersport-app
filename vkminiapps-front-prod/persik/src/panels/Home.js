import {
	Panel,
	PanelHeader,
	Tappable,
	Div,
	Text,
	Group,
	PullToRefresh,
} from '@vkontakte/vkui'
import TournamentCard from '../components/cards'
import { Icon28AddCircleOutline } from '@vkontakte/icons'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { useState, useCallback } from 'react'
export const Home = ({ id, user, platform }) => {
	const routeNavigator = useRouteNavigator()
	const [fetching, setFetching] = useState(false)
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min) + min)
	}
	const onRefresh = useCallback(() => {
		setFetching(true)
		setTimeout(() => {
			setFetching(false)
			window.location.reload()
		}, getRandomInt(600, 2000))
	}, [])

	return (
		<Panel id={id}>
			<PanelHeader>Главная</PanelHeader>
			<PullToRefresh onRefresh={onRefresh} isFetching={fetching}>
				<Group>
					<TournamentCard tableuser={user} platform={platform} />
					{user && user.role == 'Судья' && (
						<Tappable onClick={() => routeNavigator.push('/add_tournir')}>
							<Div
								style={{
									display: 'flex',
									justifyContent: 'center',
									gap: 5,
								}}
							>
								<Icon28AddCircleOutline />
								<Text style={{ paddingTop: 6, fontSize: 15 }}>
									Создать турнир
								</Text>
							</Div>
						</Tappable>
					)}
				</Group>
			</PullToRefresh>
		</Panel>
	)
}
