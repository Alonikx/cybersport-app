import { Div, Text, Gallery, Skeleton, Spinner } from '@vkontakte/vkui'
import { useEffect, useState } from 'react'

export const TournirDescription = ({ obj, platform, isLoading }) => {
	const [slideIndex, setSlideIndex] = useState(0)
	if (isLoading) {
		return (
			<Div>
				<Div>
					<Spinner size='medium' />
				</Div>
			</Div>
		)
	}
	if (!obj) {
		return (
			<Text style={{ fontSize: 16, textAlign: 'center' }}>
				Описания еще нет
			</Text>
		)
	}
	return (
		<Div style={{ padding: '0px' }}>
			{obj && (
				<Div style={{ padding: '0px' }}>
					<Div
						style={{
							padding: '0px 0px 15px 0px',
							display: 'flex',
							justifyContent: 'center',
						}}
					>
						<Text
							style={{ fontSize: 20, lineHeight: 1.5, textAlign: 'center' }}
						>
							{obj.title}
						</Text>
					</Div>
					<Div>
						<Text
							style={{ fontSize: 16, lineHeight: 2, whiteSpace: 'pre-wrap' }}
						>
							{obj && obj.info_block1}
						</Text>
					</Div>
					{obj.info_block2 != '' && (
						<Div>
							<Text
								style={{ fontSize: 16, lineHeight: 2, whiteSpace: 'pre-wrap' }}
							>
								{obj && obj.info_block2 != 'NULL' && obj.info_block2}
							</Text>
						</Div>
					)}
					{obj.info_block3 != '' && obj.info_block3 != null && (
						<Div>
							<Text
								style={{ fontSize: 16, lineHeight: 2, whiteSpace: 'pre-wrap' }}
							>
								{obj && obj.info_block3 != 'NULL' && obj.info_block3}
							</Text>
						</Div>
					)}

					{obj &&
						[obj.photo1_path, obj.photo2_path, obj.photo3_path].some(
							el => el != 'NULL' && el != null
						) && (
							<Div style={{ padding: '30px 0px 0px 0px' }}>
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
									{obj &&
										obj.photo1_path != 'NULL' &&
										obj.photo1_path != null && (
											<img
												src={`https://alonikx.pythonanywhere.com/tournirs/tournir_description/image/${
													obj && obj.photo1_path
												}/${btoa(window.location.search)}`}
												style={{ display: 'block' }}
											/>
										)}

									{obj &&
										obj.photo2_path != 'NULL' &&
										obj.photo2_path != null && (
											<img
												src={`https://alonikx.pythonanywhere.com/tournirs/tournir_description/image/${
													obj && obj.photo2_path
												}/${btoa(window.location.search)}`}
												style={{ display: 'block' }}
											/>
										)}
									{obj &&
										obj.photo3_path != 'NULL' &&
										obj.photo3_path != null && (
											<img
												src={`https://alonikx.pythonanywhere.com/tournirs/tournir_description/image/${
													obj && obj.photo3_path
												}/${btoa(window.location.search)}`}
												style={{ display: 'block' }}
											/>
										)}
								</Gallery>
							</Div>
						)}
				</Div>
			)}
		</Div>
	)
}
