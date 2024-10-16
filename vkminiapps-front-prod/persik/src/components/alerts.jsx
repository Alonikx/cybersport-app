import { Alert, Text } from '@vkontakte/vkui'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'

export const OpenAction = ({tournir_name, func}) => {
    const routeNavigator = useRouteNavigator()
    return (
			<Alert
				actions={[
					{
						title: 'Удалить',
						mode: 'destructive',
						action: func,
					},
					{
						title: 'Отмена',
						mode: 'cancel',
					},
				]}
				actionsLayout='horizontal'
				onClose={() => routeNavigator.hideModal()}
				header='Подтвердите действие'
				text={<Text style={{fontSize:'15px'}}>Вы уверены, что хотите удалить {tournir_name}</Text>}
			/>
		)   
}

