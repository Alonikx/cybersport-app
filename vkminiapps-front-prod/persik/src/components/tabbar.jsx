import { Tabbar, TabbarItem } from '@vkontakte/vkui'
import { Icon28CupOutline, Icon28UserCircleOutline, Icon28LogoVkVideoOutline } from '@vkontakte/icons'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'

export function AppTabbar({ activeStory }) {
	const routeNavigator = useRouteNavigator()
	return (
		<Tabbar style={{zIndex:1}}>
			<TabbarItem
				selected={activeStory === 'home'}
				data-story='home'
				text='Турниры'
				onClick={() => routeNavigator.push('/')}
			>
				<Icon28CupOutline />
			</TabbarItem>
			<TabbarItem
				selected={activeStory === 'videos'}
				data-story='videos'
				text='Видео'
				onClick={() => routeNavigator.push('/videos')}
			>
				<Icon28LogoVkVideoOutline />
			</TabbarItem>
			<TabbarItem
				selected={activeStory === 'profile'}
				data-story='profile'
				text='Профиль'
				onClick={() => routeNavigator.push('/profile')}
			>
				<Icon28UserCircleOutline />
			</TabbarItem>
		</Tabbar>
	)
}
