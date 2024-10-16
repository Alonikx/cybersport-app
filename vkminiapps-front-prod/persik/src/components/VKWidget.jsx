import { Div } from '@vkontakte/vkui'
import React, { useEffect } from 'react'
const VkWidget = ({ url, width, height }) => {
	useEffect(() => {
		const script = document.createElement('script')
		script.src = 'https://vk.com/js/api/videoplayer.js'
		document.body.appendChild(script)
	}, [])

	return (
		<iframe
			style={{ borderRadius: '8px' }}
			src={`https://vk.com/video_ext.php?oid=${url[0]}&id=${url[1]}&hd=2&autoplay=0`}
			width={width}
			height={height}
			allow='autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;'
			frameBorder='0'
		></iframe>
	)
}

export default VkWidget
