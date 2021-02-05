export default class DetailedError extends Error {
	constructor(message: string, ...items: any[]) {
		console.log("\n📕 Error details:")
		console.log(...items)
		super(message)
	}
}