import {
	Panel,
	PanelHeader,
	Group,
	Div,
	Header,
	Text,
	Button,
	Spinner,
	PullToRefresh,
	ScreenSpinner,
} from '@vkontakte/vkui'
import VkWidget from '../components/VKWidget.jsx'
import { useState, useCallback, useEffect } from 'react'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import axios from 'axios'
export const VideosPage = ({ id, platform, tableuser }) => {
	const routeNavigator = useRouteNavigator()
	const [video, setVideo] = useState([])
	const [version, setVersion] = useState(0)
	const [isLoadingVideos, setIsLoadingVideos] = useState(false)
	const [fetching, setFetching] = useState(false)
	const [visibleCount1, setVisibleCount1] = useState(2) // Состояние для хранения количества видимых видео
	const handleShowMore1 = () => {
		setVisibleCount1(prevCount => prevCount + 2) // Увеличиваем количество видимых видео на 4
	}
	const [visibleCount2, setVisibleCount2] = useState(1) // Состояние для хранения количества видимых видео

	const handleShowMore2 = () => {
		setVisibleCount2(prevCount => prevCount + 1) // Увеличиваем количество видимых видео на 4
	}
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
	async function onClick(vidId) {
		try {
			const result = await axios.post(
				'https://alonikx.pythonanywhere.com/videos/delete',
				{
					video_id: vidId,
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
	async function onClickDeleteVideo(vidId) {
		try {
			const response = await axios.post(
				'https://alonikx.pythonanywhere.com/videos/delete',
				{
					videoID: vidId,
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
		async function fetchVideos() {
			setIsLoadingVideos(true) // Устанавливаем состояние загрузки в true
			try {
				const request = await axios.get(
					`https://alonikx.pythonanywhere.com/videos`,
					{
						headers: {
							Authorization: `Bearer ${btoa(window.location.search)}`,
						},
					}
				)
				setVideo(request.data)
			} catch (err) {
			} finally {
				setIsLoadingVideos(false) // Устанавливаем состояние загрузки в false
			}
		}
		fetchVideos()
	}, [version]) // Зависимость от version

	const streamslist = []
	const streams =
		video && video.map(el => el.type === 'Трансляции' && streamslist.push(el))
	const videoslist = []
	const videos =
		video && video.map(el => el.type === 'Видео' && videoslist.push(el))
	const size = platform == 'web' ? false : true

	if (isLoadingVideos) {
		return <Spinner size='medium' />
	}
	if (!video && !streams) {
		return (
			<Panel id={id}>
				<PanelHeader>Трансляции</PanelHeader>{' '}
				<Div style={{ textAlign: 'center' }}>Видео и трансляций еще нет</Div>
			</Panel>
		)
	}

	return (
		<Panel id={id}>
			<PanelHeader>Трансляции</PanelHeader>
			<PullToRefresh onRefresh={onRefresh} isFetching={fetching}>
				<Group header={<Header mode='secondary'>Трансляции</Header>}>
					{tableuser && tableuser.role === 'Судья' && (
						<Div
							style={{
								display: 'flex',
								justifyContent: 'center',
								paddingBottom: '40px',
							}}
							key='addvideo'
						>
							<Button onClick={() => routeNavigator.showModal('ModalAddVideo')}>
								Добавить трансляцию/видео
							</Button>
						</Div>
					)}
					<>
						{!size && (
							<Div style={{ padding: '0px' }} key='key'>
								{streamslist.length !== 0 &&
									streamslist.slice(0, visibleCount2).map(el => (
										<Div style={{ padding: '0px' }} key={el.videos_id}>
											<Div
												style={{
													display: 'flex',
													justifyContent: 'center',
													padding:0
												}}
											>
												<VkWidget
													url={el.url.split('video')[1].split('_')}
													width={850}
													height={480}
												/>
											</Div>
											<Div
												style={{
													display: 'flex',
													justifyContent: 'center',
													paddingBottom:20
												}}
											>
												{tableuser && tableuser.role === 'Судья' && (
													<Button
														style={{ width: '230px', marginTop: '10px' }}
														onClick={() => onClickDeleteVideo(el.videos_id)}
													>
														Удалить трансляцию
													</Button>
												)}
											</Div>
										</Div>
									))}
								{visibleCount2 < streamslist.length && ( // Проверяем, есть ли еще трансляции для отображения
									<Div style={{ textAlign: 'center', paddingBottom:'20px'  }}>
										<Button onClick={handleShowMore2}>Показать больше</Button>
									</Div>
								)}
							</Div>
						)}
						{size && (
							<Div style={{ padding: '0px' }}>
								{streamslist.length !== 0 &&
									streamslist.slice(0, visibleCount2).map(el => (
										<Div key={el.videos_id + 2}>
											<Div
												style={{
													display: 'flex',
													justifyContent: 'center',
												}}
											>
												<VkWidget
													url={el.url.split('video')[1].split('_')}
													width={850}
													height={300}
												/>
											</Div>
											<Div
												style={{
													display: 'flex',
													justifyContent: 'center',
												}}
											>
												{tableuser && tableuser.role === 'Судья' && (
													<Button
														style={{ width: '230px', marginTop: '10px' }}
														onClick={() => onClickDeleteVideo(el.videos_id)}
													>
														Удалить трансляцию
													</Button>
												)}
											</Div>
										</Div>
									))}
								{visibleCount2 < streamslist.length && ( // Проверяем, есть ли еще трансляции для отображения
									<Div style={{ textAlign: 'center' }}>
										<Button onClick={handleShowMore2}>Показать больше</Button>
									</Div>
								)}
							</Div>
						)}
					</>
					{streamslist.length == 0 && (
						<Div style={{ textAlign: 'center' }}>
							<Text style={{ fontSize: 16 }}>Трансляций еще нет</Text>
						</Div>
					)}
				</Group>
				<Group header={<Header mode='secondary'>Видео</Header>}>
					{!size && (
						<Div>
							<Div
								style={{
									display: 'flex',
									gap: 20,
									flexWrap: 'wrap',
									padding: '0px',
									justifyContent: 'center',
								}}
							>
								{videoslist.slice(0, visibleCount1).map(el => (
									<Div style={{ padding: '0px' }} key={el.videos_id}>
										<Div style={{ padding: '0px', width: 'calc(50% - 10px)' }}>
											<VkWidget
												url={el.url.split('video')[1].split('_')}
												width={415}
												height={320}
											/>
										</Div>
										<Div
											style={{
												padding: '0px',
												display: 'flex',
												justifyContent: 'center',
											}}
										>
											{tableuser && tableuser.role === 'Судья' && (
												<Button
													onClick={() => onClickDeleteVideo(el.videos_id)}
													style={{ marginTop: '10px' }}
												>
													Удалить видео
												</Button>
											)}
										</Div>
									</Div>
								))}
							</Div>
							{visibleCount1 < videoslist.length && ( // Проверяем, есть ли еще видео для отображения
								<Div style={{ textAlign: 'center', marginTop: '10px' }}>
									<Button onClick={handleShowMore1}>Показать больше</Button>
								</Div>
							)}
						</Div>
					)}
					<>
						{size && (
							<Div style={{ padding: '0px' }}>
								<Div style={{ padding: '0px' }}>
									{videoslist.length !== 0 && (
										<>
											{videoslist.slice(0, visibleCount1).map(el => (
												<Div key={el.videos_id + 1}>
													<Div
														style={{
															display: 'flex',
															justifyContent: 'center',
															paddingBottom: '20px',
														}}
													>
														<VkWidget
															url={el.url.split('video')[1].split('_')}
															width={850}
															height={300}
														/>
													</Div>
													<Div
														style={{
															padding: '0px',
															display: 'flex',
															justifyContent: 'center',
														}}
													>
														{tableuser && tableuser.role === 'Судья' && (
															<Button
																onClick={() => onClickDeleteVideo(el.videos_id)}
																style={{ marginTop: '10px' }}
															>
																Удалить видео
															</Button>
														)}
													</Div>
												</Div>
											))}
											{visibleCount1 < videoslist.length && ( // Проверяем, есть ли еще видео для отображения
												<Div style={{ textAlign: 'center', marginTop: '10px' }}>
													<Button onClick={handleShowMore1}>
														Показать больше
													</Button>
												</Div>
											)}
										</>
									)}
								</Div>
							</Div>
						)}
						{videoslist.length === 0 && (
							<Div style={{ textAlign: 'center' }}>
								<Text style={{ fontSize: 16 }}>Видео еще нет</Text>
							</Div>
						)}
					</>
				</Group>
			</PullToRefresh>
		</Panel>
	)
}
