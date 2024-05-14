// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Text } from "ink";
import open from "open";
import { useGithubAuth } from "../hooks/useGithubAuth.js";

export default function Login() {
	const { data, error, isLoading } = useGithubAuth();

	useEffect(() => {
		if (isLoading) return;
		if (error) return;
		if (!data) return;
		open("https://github.com/login/device");
	}, [data, error, isLoading]);
	return (
		<>
			{isLoading ? (
				<Text>Requesting Github login code...</Text>
			) : (
				<Text>
					`Enter the following access code in browser ${data.user_code}`
				</Text>
			)}
		</>
	);
}
