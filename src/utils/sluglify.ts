export function sluglify(text: string) {
	return text
		.toString()
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/&/g, '')
		.replace(/[^\w\-]+/g, '')
		.replace(/\-\-+/g, '-')
		.replace(/^-+/, '')
		.replace(/-+$/, '')
}

export function unsluglify(text: string) {
	return text.replace(/-/g, ' ')
}
