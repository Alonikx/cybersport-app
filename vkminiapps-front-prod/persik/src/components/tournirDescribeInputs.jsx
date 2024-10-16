import {
	Div,
	Button,
	FormItem,
	CustomSelect,
	Input,
	Textarea,
	File,
	Text,
	Gallery,
	ScreenSpinner,
} from '@vkontakte/vkui'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { useState } from 'react'
import { Icon24Camera } from '@vkontakte/icons'
import axios from 'axios'
export const DescribeInputs = ({ tournir_id, platform }) => {
	const routeNavigator = useRouteNavigator()
	const [image, setImage] = useState(null)
	const [image1, setImage1] = useState(null)
	const [image2, setImage2] = useState(null)
	const [file, setFile] = useState(null)
	const [file1, setFile1] = useState(null)
	const [file2, setFile2] = useState(null)
	const [title, setTitle] = useState('')
	const [info_block1, setInfoBlock1] = useState('')
	const [info_block2, setInfoBlock2] = useState('')
	const [info_block3, setInfoBlock3] = useState('')
	const onImageChange = event => {
		if (event.target.files && event.target.files[0]) {
			setImage(URL.createObjectURL(event.target.files[0]))
			setFile(event.target.files[0])
		}
	}
	const onImageChange1 = event => {
		if (event.target.files && event.target.files[0]) {
			setImage1(URL.createObjectURL(event.target.files[0]))
			setFile1(event.target.files[0])
		}
	}
	const onImageChange2 = event => {
		if (event.target.files && event.target.files[0]) {
			setImage2(URL.createObjectURL(event.target.files[0]))
			setFile2(event.target.files[0])
		}
	}
	const onChange = e => {
		const { value } = e.currentTarget
		setTitle(value)
	}
	const onChange1 = e => {
		const { value } = e.currentTarget
		setInfoBlock1(value)
	}
	const onChange2 = e => {
		const { value } = e.currentTarget
		setInfoBlock2(value)
	}
	const onChange3 = e => {
		const { value } = e.currentTarget
		setInfoBlock3(value)
	}
	const [slideIndex, setSlideIndex] = useState(0)
	const formData = new FormData()
	if (file) {
		formData.append('file1', file)
	}
	if (file1) {
		formData.append('file2', file1)
	}
	if (file2) {
		formData.append('file3', file2)
	}
	const jsonObject = {
		title: title,
		info_block1: info_block1,
		info_block2: info_block2 ? info_block1 : '',
		info_block3: info_block3 ? info_block3 : '',
	}
	formData.append('jsonField', JSON.stringify(jsonObject))
	async function onClickAddDescription() {
		try {
			const result = await axios.post(
				`https://alonikx.pythonanywhere.com/tournirs/tournir_description/${tournir_id}`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${btoa(window.location.search)}`,
						'Content-Type': 'multipart/form-data',
					},
				}
			)
			routeNavigator.showPopout(<ScreenSpinner state='loading' />)
			setTimeout(() => {
				window.location.href = window.location.href
				location.reload(true) // Перезагрузка страницы
				routeNavigator.hidePopout() // Скрываем спиннер
			}, 1000) // Задержка в 1 секунду
		} catch (err) {}
	}

	return (
		<Div style={{ padding: '0px' }}>
			<Div
				style={{ padding: '0px', display: 'flex', justifyContent: 'center' }}
			>
				<FormItem top={<Text style={{ textAlign: 'center' }}>Название</Text>}>
					<Input onChange={onChange} maxLength={50} align='center' />
				</FormItem>
			</Div>
			<Div style={{ padding: '0px' }}>
				<FormItem top='Блок информации 1'>
					<Textarea maxLength={1500} onChange={onChange1} />
				</FormItem>
			</Div>
			<Div style={{ padding: '0px' }}>
				<FormItem top='Блок информации 2'>
					<Textarea maxLength={1500} onChange={onChange2} />
				</FormItem>
			</Div>
			<Div style={{ padding: '0px' }}>
				<FormItem top='Блок информации 3'>
					<Textarea maxLength={1500} onChange={onChange3} />
				</FormItem>
			</Div>
			<Div>
				<Gallery
					slideWidth='100%'
					bullets='light'
					align='left'
					style={{ border: '1px solid white' }}
					slideIndex={slideIndex}
					onChange={setSlideIndex}
					dragDisabled={platform == 'web' ? true : false}
					showArrows={true}
				>
					<img src={`${image}`} style={{ display: 'block' }} />
					<img src={`${image1}`} style={{ display: 'block' }} />
					<img src={`${image2}`} style={{ display: 'block' }} />
				</Gallery>
			</Div>
			<Div style={{ paddingBottom: '10px', paddingTop: '0px' }}>
				<FormItem
					style={{ display: 'flex', justifyContent: 'center', gap: 15 }}
				>
					{image ? (
						<Button onClick={() => (setImage(null), setFile(null))}>
							Удалить 1 фотку
						</Button>
					) : (
						<File
							before={
								platform == 'web' ? <Icon24Camera role='presentation' /> : false
							}
							size='m'
							accept='.jpg, .jpeg, .png'
							onChange={onImageChange}
						>
							Загрузить 1 фотку
						</File>
					)}

					{image1 ? (
						<Button onClick={() => (setImage1(null), setFile1(null))}>
							Удалить 2 фотку
						</Button>
					) : (
						<File
							before={
								platform == 'web' ? <Icon24Camera role='presentation' /> : false
							}
							size='m'
							accept='.jpg, .jpeg, .png'
							onChange={onImageChange1}
						>
							Загрузить 2 фотку
						</File>
					)}
					{image2 ? (
						<Button onClick={() => (setImage2(null), setFile2(null))}>
							Удалить 3 фотку
						</Button>
					) : (
						<File
							before={
								platform == 'web' ? <Icon24Camera role='presentation' /> : false
							}
							size='m'
							accept='.jpg, .jpeg, .png'
							onChange={onImageChange2}
						>
							Загрузить 3 фотку
						</File>
					)}
				</FormItem>
			</Div>
			<Div style={{ padding: '0px' }}>
				<FormItem
					style={{ display: 'flex', justifyContent: 'center', gap: 15 }}
				>
					<Button
						disabled={!title || !info_block1}
						onClick={onClickAddDescription}
					>
						Подтвердить
					</Button>
				</FormItem>
			</Div>
		</Div>
	)
}
