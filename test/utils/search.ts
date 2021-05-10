export const makeSearchParams = (beforeValues) => Object
	.entries(beforeValues)
	.reduce(
		(beforeSearchParams, [key, value]) => {
			const theValue = !Array.isArray(value) ? [value] : value
			theValue.forEach(v => {
				beforeSearchParams.append(key, v)
			})
			return beforeSearchParams
		},
		new URLSearchParams()
	)
