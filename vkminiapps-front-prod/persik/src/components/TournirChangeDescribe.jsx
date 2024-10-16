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
import { useEffect, useState } from 'react'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { Icon24Camera } from '@vkontakte/icons'
import axios from 'axios'
export const ChangeDescribeInputs = ({ tournir_id, obj, platform }) => {
	const routeNavigator = useRouteNavigator()
	const [image, setImage] = useState(null)
	const [image1, setImage1] = useState(null)
	const [image2, setImage2] = useState(null)
	const [photo1, setPhoto1] = useState(obj && obj.photo1_path)
	const [photo2, setPhoto2] = useState(obj && obj.photo2_path)
	const [photo3, setPhoto3] = useState(obj && obj.photo3_path)
	const [file, setFile] = useState(null)
	const [file1, setFile1] = useState(null)
	const [file2, setFile2] = useState(null)
	const [title, setTitle] = useState(obj.title)
	const [info_block1, setInfoBlock1] = useState(obj.info_block1)
	const [info_block2, setInfoBlock2] = useState(obj.info_block2)
	const [info_block3, setInfoBlock3] = useState(obj.info_block3)
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
		info_block2: info_block2 ? info_block2 : '',
		info_block3: info_block3 ? info_block3 : '',
		name1: photo1,
		name2: photo2,
		name3: photo3,
	}
	formData.append('jsonField', JSON.stringify(jsonObject))
	async function onClickAddDescription() {
		try {
			const result = await axios.post(
				`https://alonikx.pythonanywhere.com/tournirs/tournir_description/${tournir_id}/change`,
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
		} catch (err) {
			// Обработка ошибок (если необходимо)
			console.error('Ошибка при отправке данных:', err)
		}
	}
	return (
		<Div style={{ padding: '0px' }}>
			<Div
				style={{ padding: '0px', display: 'flex', justifyContent: 'center' }}
			>
				<FormItem top={<Text style={{ textAlign: 'center' }}>Название</Text>}>
					<Input
						onChange={onChange}
						maxLength={50}
						style={{ minWidth: '250px' }}
						defaultValue={obj.title}
						align='center'
					/>
				</FormItem>
			</Div>
			<Div style={{ padding: '0px' }}>
				<FormItem top='Блок информации 1'>
					<Textarea
						maxLength={1500}
						onChange={onChange1}
						defaultValue={obj.info_block1}
					/>
				</FormItem>
			</Div>
			<Div style={{ padding: '0px' }}>
				<FormItem top='Блок информации 2'>
					{obj && obj.info_block2 != 'NULL' ? (
						<Textarea
							maxLength={1500}
							onChange={onChange2}
							defaultValue={obj && obj.info_block2}
						/>
					) : (
						<Textarea maxLength={1500} onChange={onChange2} />
					)}
				</FormItem>
			</Div>
			<Div style={{ padding: '0px' }}>
				<FormItem top='Блок информации 3'>
					{obj && obj.info_block3 != 'NULL' ? (
						<Textarea
							maxLength={1500}
							onChange={onChange3}
							defaultValue={obj && obj.info_block3}
						/>
					) : (
						<Textarea maxLength={1500} onChange={onChange3} />
					)}
				</FormItem>
			</Div>
			{obj && obj.photo1_path && (
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
						{obj && obj.photo1_path && (
							<img
								src={
									photo1 != 'NULL' && photo1 != null
										? `${`https://alonikx.pythonanywhere.com/tournirs/tournir_description/image/${
												obj && obj.photo1_path
										  }/${btoa(window.location.search)}`}`
										: `${image}`
								}
								style={{ display: 'block' }}
							/>
						)}

						{obj && obj.photo2_path && (
							<img
								src={
									(photo2 != 'NULL' && photo2 != null)
										? `${`https://alonikx.pythonanywhere.com/tournirs/tournir_description/image/${
												obj && obj.photo2_path
										  }/${btoa(window.location.search)}`}`
										: `${image1}`
								}
								style={{ display: 'block' }}
							/>
						)}
						{obj && obj.photo3_path && (
							<img
								src={
									(photo3 != 'NULL' && photo3 != null)
										? `${`https://alonikx.pythonanywhere.com/tournirs/tournir_description/image/${
												obj && obj.photo3_path
										  }/${btoa(window.location.search)}`}`
										: `${image2}`
								}
								style={{ display: 'block' }}
							/>
						)}
					</Gallery>
				</Div>
			)}
			<Div style={{ paddingBottom: '10px', paddingTop: '0px' }}>
				<FormItem
					style={{ display: 'flex', justifyContent: 'center', gap: 15 }}
				>
					{image || (photo1 != 'NULL' && photo1 != null) ? (
						<Button
							onClick={() => (setImage(null), setFile(null), setPhoto1('NULL'))}
						>
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

					{image1 || (photo2 != 'NULL' && photo2 != null) ? (
						<Button
							onClick={() => (
								setImage1(null), setFile1(null), setPhoto2('NULL')
							)}
						>
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
					{image2 || (photo3 != 'NULL' && photo3 != null) ? (
						<Button
							onClick={() => (
								setImage2(null), setFile2(null), setPhoto3('NULL')
							)}
						>
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
						disabled={
							!title ||
							!info_block1 ||
							(title == obj.title &&
								info_block1 == obj.info_block1 &&
								info_block2 == obj.info_block2 &&
								info_block3 == obj.info_block3 &&
								photo1 == image &&
								photo1 != 'NULL' &&
								photo2 == image1 &&
								photo2 != 'NULL' &&
								photo3 == image2 &&
								photo3 != 'NULL')
						}
						onClick={onClickAddDescription}
					>
						Подтвердить изменения
					</Button>
				</FormItem>
			</Div>
		</Div>
	)
}
