exports.message = (response) => {
	if(response === null) { console.error("Response null"); return }
	if(response === undefined) { console.error("Response undefined"); return }
	console.log(response)
	const thisStatus = response.status ? response.status : "status?"
	const thisFunction = response.data?.function ? response.data.function : "function?"
	const thisMessage = response.data?.message ? response.data.message : "message?"
	console.error(`(Status ${thisStatus}) ${thisFunction}(): ${thisMessage}`)
}