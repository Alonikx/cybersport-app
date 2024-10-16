import { Tabs, TabsItem, HorizontalScroll } from '@vkontakte/vkui'
import { useSearchParams } from '@vkontakte/vk-mini-apps-router'


export const TabPanel = ({ tab }) => {
	const [params, setParams] = useSearchParams()

	const handleTabChange = (value) => {
		value === 'tournirs' ? params.set('tab1', 'tournirs') : params.delete('tab1')
		setParams(params)
	}
	return (
		<Tabs layoutFillMode='auto'>
			<HorizontalScroll arrowSize='m'>
				<Tabs>
					<TabsItem
						selected={tab === 'info'}
						onClick={() => handleTabChange('info')}
						id='tab-info'
						aria-controls='tab-contetn-info'
					>
						Информация
					</TabsItem>
					<TabsItem
						selected={tab === 'tournirs'}
						onClick={() => handleTabChange('tournirs')}
						id='tab-tournirs'
						aria-controls='tab-content-tournirs'
					>
						Матчи
					</TabsItem>
				</Tabs>
			</HorizontalScroll>
		</Tabs>
	)
}

