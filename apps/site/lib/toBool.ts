export default function (value: string) {
	return value?.toLowerCase() === "false" ? false : true
}