import { Tabs, TabsItem, HorizontalScroll } from '@vkontakte/vkui'
import { useSearchParams } from '@vkontakte/vk-mini-apps-router'
import { useState, useEffect } from 'react'
import axios from 'axios'
export const Scrollable = ({ tab }) => {
	const [params, setParams] = useSearchParams()
	const [tournirTeam, setTournirTeam] = useState([])

	useEffect(() => {
		async function fetchTournirTeam() {
			const response = await axios.get(
				`https://alonikx.pythonanywhere.com/tournirs/${params.get('id')}/teams`,
				{
					headers: {
						Authorization: `Bearer ${btoa(window.location.search)}`,
					},
				}
			)
			setTournirTeam(response.data)
		}
		try {
			fetchTournirTeam()
		} catch (err) {}
	}, [])

	const obj = {
		first: (
			<TabsItem
				key={'firstStage'}
				selected={tab === 'firstStage'}
				onClick={() => handleTabChange('firstStage')}
				id='firstStage'
				aria-controls='firstStage-content'
			>
				Первый этап
			</TabsItem>
		),
		second: (
			<TabsItem
				key={'secondStage'}
				selected={tab === 'secondStage'}
				onClick={() => handleTabChange('secondStage')}
				id='secondStage'
				aria-controls='secondStage-content'
			>
				Второй этап
			</TabsItem>
		),
		third: (
			<TabsItem
				key={'thirdStage'}
				selected={tab === 'thirdStage'}
				onClick={() => handleTabChange('thirdStage')}
				id='thirdStage'
				aria-controls='thirdStage-content'
			>
				Третий этап
			</TabsItem>
		),
		fourth: (
			<TabsItem
				key={'fourthStage'}
				selected={tab === 'fourthStage'}
				onClick={() => handleTabChange('fourthStage')}
				id='fourthStage'
				aria-controls='fourthStage-content'
			>
				Четвертый этап
			</TabsItem>
		),
		fifth: (
			<TabsItem
				key={'fifthStage'}
				selected={tab === 'fifthStage'}
				onClick={() => handleTabChange('fifthStage')}
				id='fifthStage'
				aria-controls='fifthStage-content'
			>
				Пятый этап
			</TabsItem>
		),
		semifinal: (
			<TabsItem
				key={'semifinal'}
				selected={tab === 'semifinal'}
				onClick={() => handleTabChange('semifinal')}
				id='semifinal'
				aria-controls='semifinal-content'
			>
				Полуфинал
			</TabsItem>
		),
		final: (
			<TabsItem
				key={'final'}
				selected={tab === 'final'}
				onClick={() => handleTabChange('final')}
				id='final'
				aria-controls='final-content'
			>
				Финал
			</TabsItem>
		),
		thirdplace: (
			<TabsItem
				key={'thirdplace'}
				selected={tab === 'thirdplace'}
				onClick={() => handleTabChange('thirdplace')}
				id='thirdplace'
				aria-controls='thirdplace-content'
			>
				За 3-е место
			</TabsItem>
		),
	}

	const handleTabChange = value => {
		if (value === 'secondStage') {
			params.set('tab2', 'secondStage')
		} else if (value === 'thirdStage') {
			params.set('tab2', 'thirdStage')
		} else if (value === 'fourthStage') {
			params.set('tab2', 'fourthStage')
		} else if (value === 'fifthStage') {
			params.set('tab2', 'fifthStage')
		} else if (value === 'thirdplace') {
			params.set('tab2', 'thirdplace')
		} else if (value === 'semifinal') {
			params.set('tab2', 'semifinal')
		} else if (value === 'final') {
			params.set('tab2', 'final')
		} else {
			params.delete('tab2')
		}
		setParams(params)
	}
	return (
		<HorizontalScroll arrowSize='m'>
			{tournirTeam &&
				tournirTeam.length != 0 &&
				tournirTeam[0].tournir_members.split(',').length >= 64 && (
					<Tabs>
						{obj.first}
						{obj.second}
						{obj.third}
						{obj.fourth}
						{obj.fifth}
						{obj.semifinal}
						{obj.thirdplace}
						{obj.final}
					</Tabs>
				)}
			{tournirTeam &&
				tournirTeam.length != 0 &&
				tournirTeam[0].tournir_members.split(',').length > 32 &&
				tournirTeam[0].tournir_members.split(',').length <= 64 && (
					<Tabs>
						{obj.first}
						{obj.second}
						{obj.third}
						{obj.fourth}
						{obj.semifinal}
						{obj.thirdplace}
						{obj.final}
					</Tabs>
				)}
			{tournirTeam &&
				tournirTeam.length != 0 &&
				tournirTeam[0].tournir_members.split(',').length > 16 &&
				tournirTeam[0].tournir_members.split(',').length <= 32 && (
					<Tabs>
						{obj.first}
						{obj.second}
						{obj.third}
						{obj.semifinal}
						{obj.thirdplace}
						{obj.final}
					</Tabs>
				)}
			{tournirTeam &&
				tournirTeam.length != 0 &&
				tournirTeam[0].tournir_members.split(',').length > 8 &&
				tournirTeam[0].tournir_members.split(',').length <= 16 && (
					<Tabs>
						{obj.first}
						{obj.second}
						{obj.semifinal}
						{obj.thirdplace}
						{obj.final}
					</Tabs>
				)}
			{tournirTeam &&
				tournirTeam.length != 0 &&
				tournirTeam[0].tournir_members.split(',').length > 4 &&
				tournirTeam[0].tournir_members.split(',').length <= 8 && (
					<Tabs>
						{obj.first}
						{obj.second}
						{obj.thirdplace}
						{obj.final}
					</Tabs>
				)}
		</HorizontalScroll>
	)
}
