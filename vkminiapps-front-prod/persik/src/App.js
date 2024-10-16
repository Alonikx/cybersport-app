import { useState, useEffect, lazy } from 'react'
import bridge from '@vkontakte/vk-bridge'
import { View, SplitLayout, SplitCol, Epic } from '@vkontakte/vkui'
import {
	useActiveVkuiLocation,
	usePopout,
} from '@vkontakte/vk-mini-apps-router'
import { AppTabbar } from './components/tabbar'
import {
	Profile,
	Home,
	TournamentsInfo,
	VideosPage,
	AddInfo,
	AddTournir,
	ChangeAddInfo,
} from './panels'
import { DEFAULT_VIEW_PANELS } from './routes'
import axios from 'axios'
import { AppModalRoot } from './panels/modalApp'
import { Policy } from './panels/PolicyPage'

export const App = () => {
	const { panel: activePanel = DEFAULT_VIEW_PANELS.HOME } =
		useActiveVkuiLocation()
	const [fetchedUser, setUser] = useState()
	const [tableUser, setTableUser] = useState([])
	const [platform, setPlatform] = useState()

	useEffect(() => {
		async function fetchUser() {
			try {
				const response = await bridge.send('VKWebAppGetUserInfo')
				setUser(response)
			} catch (error) {
				console.error('Error getting user info: ', error)
			}
		}

		fetchUser()
	}, [])

	useEffect(() => {
		async function fetchTableUser() {
			try {
				const response = await axios.get(
					'https://alonikx.pythonanywhere.com/',
					{
						headers: {
							Authorization: `Bearer ${btoa(window.location.search)}`,
						},
					}
				)
				setTableUser(response.data)
			} catch (error) {
				console.error('Error getting user info: ', error)
			}
		}
		fetchTableUser()
	}, [])

	useEffect(() => {
		if (!fetchedUser) return

		async function addUser() {
			try {
				const result = await axios.post(
					'https://alonikx.pythonanywhere.com/',
					{
						first_name: fetchedUser.first_name,
						last_name: fetchedUser.last_name,
					},
					{
						headers: {
							Authorization: `Bearer ${btoa(window.location.search)}`,
							'Content-Type': 'application/json',
						},
					}
				)
			} catch (error) {
				console.error('Error adding user: ', error)
			}
		}

		addUser()
	}, [fetchedUser])

	useEffect(() => {
		async function searchPlatform() {
			const req = await bridge.send('VKWebAppGetClientVersion')
			setPlatform(req['platform'])
		}
		try {
			searchPlatform()
		} catch (err) {}
	}, [])

	const routerPopout = usePopout()

	return (
		<SplitLayout
			modal={<AppModalRoot user={fetchedUser} tableuser={tableUser} />}
			popout={routerPopout}
		>
			<SplitCol>
				<Epic
					activeStory={activePanel}
					tabbar={<AppTabbar activeStory={activePanel} />}
				>
					<View id={activePanel} activePanel={activePanel}>
						<Home
							id={DEFAULT_VIEW_PANELS.HOME}
							user={tableUser}
							platform={platform}
						/>
						<Profile
							id={DEFAULT_VIEW_PANELS.PROFILE}
							fetchedUser={fetchedUser}
							tableuser={tableUser}
							platform={platform}
						/>
						<TournamentsInfo
							id={DEFAULT_VIEW_PANELS.INFO}
							fetcheduser={fetchedUser}
							tableuser={tableUser}
							platform={platform}
						/>
						<VideosPage
							id={DEFAULT_VIEW_PANELS.VIDEOS}
							platform={platform}
							tableuser={tableUser}
						/>
						<AddInfo
							id={DEFAULT_VIEW_PANELS.ADD_INFO}
							platform={platform}
							tableuser={tableUser}
						/>
						<Policy id={DEFAULT_VIEW_PANELS.POLICY} />
						<AddTournir id={DEFAULT_VIEW_PANELS.ADD_TOURNIR} />
						<ChangeAddInfo
							id={DEFAULT_VIEW_PANELS.CHANGE_INFO}
							tableuser={tableUser}
							platform={platform}
						/>
					</View>
				</Epic>
			</SplitCol>
		</SplitLayout>
	)
}
