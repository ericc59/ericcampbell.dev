import path from "path";
import { getMDXData, type Project } from "./project";

export function getContracts(): Project[] {
	return getMDXData(path.join(process.cwd(), "content/contracts")).filter(
		(project) => project,
	) as Project[];
}
