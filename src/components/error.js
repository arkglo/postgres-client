exports.message = (response) => {
	console.error(`(Status ${response.status}) ${response.data.function}(): ${response.data.message}`)
}