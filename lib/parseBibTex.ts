import { parseBibFile } from "bibtex";
import Cite from "citation-js"
import fs from "fs";

export function parseBibTex(filepath: string) {
    let str = fs.readFileSync(filepath, "utf-8");
    let citations = Cite.input(str);
    let bibFile = parseBibFile(str);
    for (const citation of citations) {
        let entry = bibFile.getEntry(citation.id);
        citation["poster"] = entry.getFieldAsString("poster");
    }
}