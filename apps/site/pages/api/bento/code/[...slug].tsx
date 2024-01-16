import { protectApiRoute } from "@lib/protectApiRoute";
import fs from "fs";
import path from "path";

const CODE_ASSETS_DIR = "./bento";
const handler = async (req, res) => {
	const { user } = await protectApiRoute({ req, res });
	// TODO: check if correct user is authorized to access this file
	if (user.role !== "bento") res.status(401).json({ error: "Unauthorized" });
	const codePath = req.query.slug?.join("/");
	const filePath = path.resolve(`${CODE_ASSETS_DIR}/${codePath}`);
	if (!filePath.startsWith(path.resolve(CODE_ASSETS_DIR))) {
		res.status(404).json({ error: "Not found" });
	}
	const fileBuffer = fs.readFileSync(filePath + ".txt");
	res.setHeader("Content-Type", "text/plain");
	return res.send(fileBuffer);
};

export default handler;
