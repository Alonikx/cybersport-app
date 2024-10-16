import { Div, Button, Cell, Text } from '@vkontakte/vkui'

const Cells = ({
	el,
	backgroundColor,
	cur_stage,
	tableuser,
	tournirTeams,
	buttonFunc,
	mode,
	platform,
}) => {
	return (
		<Div style={{ padding: '0px' }}>
			{platform == 'web' ? (
				<Div style={{ padding: '0px' }}>
					<Cell
						style={{ backgroundColor: backgroundColor }}
						after={
							<Div style={{ padding: '0px' }}>
								{!cur_stage && tableuser && tableuser.role == 'Судья' && (
									<Button
										mode={mode}
										onClick={() =>
											buttonFunc(el.split(' . ')[0], tournirTeams.tournir_id)
										}
									>
										Исключить
									</Button>
								)}
							</Div>
						}
					>
						<Div
							style={{
								padding: '0px',
								display: 'flex',
								backgroundColor: backgroundColor,
								justifyContent: 'center',
								maxWidth: '100%',
								overflow: 'hidden',
								gap: 15,
							}}
						>
							<Text
								style={{
									whiteSpace: 'normal',
									fontSize: '16px',
									overflow: 'hidden', // Скрыть переполнение
									textOverflow: 'ellipsis', // Добавить многоточие, если текст слишком длинный
									maxWidth: '100%', // Ограничить ширину
								}}
							>
								Название команды: {el.split(' . ')[1]}
							</Text>
							{!cur_stage && (
								<Text
									style={{
										whiteSpace: 'normal', // Добавлено для переноса текста
										fontSize: '16px',
									}}
								>
									Участников: {el.split(' . ')[2]}
								</Text>
							)}
						</Div>
					</Cell>
				</Div>
			) : (
				<Div
					style={{
						padding: '0px',
						display: 'flex',
						backgroundColor: backgroundColor,
						justifyContent: 'center',
						maxWidth: '100%',
						overflow: 'hidden',
					}}
				>
					<Cell
						style={{
							padding: '0px',
							display: 'flex',
							backgroundColor: backgroundColor,
							justifyContent: 'center',
							maxWidth: '100%',
							overflow: 'hidden',
						}}
					>
						<Text
							style={{
								whiteSpace: 'normal',
								textAlign: 'center',
								fontSize: '16px',
								overflow: 'hidden', // Скрыть переполнение
								textOverflow: 'ellipsis', // Добавить многоточие, если текст слишком длинный
								maxWidth: '100%', // Ограничить ширину
							}}
						>
							Название команды: {el.split(' . ')[1]}
						</Text>
						{!cur_stage && (
							<Text
								style={{
									whiteSpace: 'normal',
									textAlign: 'center',
									fontSize: '16px',
									overflow: 'hidden', // Скрыть переполнение
									textOverflow: 'ellipsis', // Добавить многоточие, если текст слишком длинный
									maxWidth: '100%', // Ограничить ширину
								}}
							>
								Участников: {el.split(' . ')[2]}
							</Text>
						)}

						{!cur_stage && tableuser && tableuser.role == 'Судья' && (
							<Div style={{ display: 'flex', justifyContent: 'center' }}>
								<Button
									mode={mode}
									onClick={() =>
										buttonFunc(el.split(' . ')[0], tournirTeams.tournir_id)
									}
								>
									Исключить
								</Button>
							</Div>
						)}
					</Cell>
				</Div>
			)}
		</Div>
	)
}
export default Cells
