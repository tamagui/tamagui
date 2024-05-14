// import Configstore from "configstore";
import React, { useMemo, useState } from "react";
import { Box, Text } from "ink";
import { TextInput, Select as SelectInput } from "@inkjs/ui";

export default function Select() {
	const [filterText, setFilterText] = useState("");
	const [value, setValue] = useState<string | undefined>();

	const options = useMemo(() => {
		return [
			{
				label: "Red",
				value: "red",
			},
			{
				label: "Green",
				value: "green",
			},
			{
				label: "Yellow",
				value: "yellow",
			},
			{
				label: "Blue",
				value: "blue",
			},
			{
				label: "Magenta",
				value: "magenta",
			},
			{
				label: "Cyan",
				value: "cyan",
			},
			{
				label: "White",
				value: "white",
			},
		].filter((option) => option.label.includes(filterText));
	}, [filterText]);

	return (
		<Box flexDirection="column" gap={1}>
			{!value && (
				<>
					<TextInput onChange={setFilterText} />

					<SelectInput
						highlightText={filterText}
						options={options}
						onChange={setValue}
					/>
				</>
			)}

			{value && <Text>You've selected {value}</Text>}
		</Box>
	);
}
