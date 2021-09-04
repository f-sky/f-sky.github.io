import remark from "remark";
import html from "remark-html";

const processor = remark().use(html);

export async function mdToHtml(markdown: string) {
  const res = await processor.process(markdown);
  return res.toString();
}
