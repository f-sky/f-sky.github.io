import { memo } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { getAllPosts, getPostBySlug } from "@/lib/fetch";
import { mdToHtml } from "@/lib/mdToHtml";
import classes from "@/styles/post.module.css";

interface IProps {
  title: string;
  content: string;
  authors: string[];
  date: string;
  lastmod: string;
}

export const Post = memo<IProps>(function Post(props) {
  const { title, content, lastmod } = props;

  return (
    <div className={classes.container}>
      <article>
        <h1 className={classes.title}>{title}</h1>
        <div className={classes.meta}>
          <span>Last updated on {new Date(lastmod).toLocaleDateString()}</span>
          <span>{Math.ceil(content.length / 860)} min read</span>
        </div>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </article>
    </div>
  );
});

export default Post;

export const getStaticProps: GetStaticProps = async (ctx) => {
  const slug = ctx.params.slug as string;
  const post = getPostBySlug(slug, ["title", "content", "authors", "date", "lastmod"]);
  return {
    props: {
      ...post,
      date: post.date?.toString(),
      lastmod: post.lastmod?.toString(),
      content: await mdToHtml(post.content || "")
    }
  };
};

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  let allPosts = getAllPosts(["slug"]);
  return {
    paths: allPosts.map((post) => ({ params: post })),
    fallback: false
  };
};
