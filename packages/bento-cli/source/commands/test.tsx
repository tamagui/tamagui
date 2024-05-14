import React from "react";
import { Text } from "ink";
import zod from "zod";

export const options = zod.object({
	name: zod.string().default("Stranger").describe("Name"),
});

type Props = {
	options: zod.infer<typeof options>;
};

export default function Index({ options }: Props) {
	return (
		<Text>
			Hello there, <Text color="green">{options.name}</Text>
		</Text>
	);
}
