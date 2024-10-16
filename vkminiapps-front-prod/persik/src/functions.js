import bridge from '@vkontakte/vk-bridge'

export async function onClickDownload(tournir_id) {
	try {
		const request = await bridge.send('VKWebAppDownloadFile', {
			url: `https://alonikx.pythonanywhere.com/downloadresults/${tournir_id}/adminpassword/android`,
			filename: `Турнир ${tournir_id}.xlsx`,
		})
	} catch (err) {}
}

export async function onClickDownloadAllUsers() {
  try {
    const request = await bridge.send("VKWebAppDownloadFile", {"url": `https://alonikx.pythonanywhere.com/downloadExcell2/adminpassword/android`, "filename": "Выгрузка.xlsx"});
  } catch (err) {
    console.error('Ошибка:', err);
  }
}

