import React, { useState } from "react";
import { Box, Text, useInput } from "ink";

export default function Counter() {
	const [value, setValue] = useState(0);
	useInput(() => setValue(value + 1));

	return (
		<Box marginY={3} justifyContent="center">
			<Box>
				<Text>Press any key to increment: {value}</Text>
			</Box>
		</Box>
	);
}
