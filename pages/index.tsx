import Head from "next/head";
import { Personal, PersonalType } from "@/components/personal";
import { PublicationType } from "@/components/publication";
import { PublicationList } from "@/components/publication-list";
import {
  getBlurb,
  getCollaborators,
  getInterests,
  getPersonalData,
  getProjects,
  getPublications,
  getCompilationDate,
  getAllPosts,
  getAwards
} from "@/lib/fetch";
import DateFormatter from "@/components/date-formatter";
import classes from "@/styles/index.module.css";
import { useCallback, useState } from "react";
import { useMemo } from "react";

interface IProps {
  personal: PersonalType;
  blurb: string;
  compilationDate: string;
  publications: PublicationType[];
  // projects: typeof import("@/data/projects.json");
  // group_members: typeof import("@/data/group.json");
  awards: typeof import("@/data/awards.json");
  posts: any[];
}

export default function Home(props: IProps) {
  const { personal, blurb, posts, publications,awards, compilationDate } = props;
  const regex = /(<([^>]+)>)/gi;
  const blurbText = blurb.replace(regex, "");
  const [showMore, setShowMore] = useState(false);
  // const collabCategories = useMemo(() => Object.keys(group_members), [group_members]);

  const toggleShowMore = useCallback(() => setShowMore((val) => !val), []);

  return (
    <div className={classes.container}>
      <Head>
        <title>Linghao Chen's Homepage</title>
        <meta name="description" content={blurbText} />
      </Head>

      <Personal {...personal} />

      <section>
        <h2>About Me</h2>
        <div className={classes.blurb} dangerouslySetInnerHTML={{ __html: blurb }}></div>
        {<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          <div>
            <h3 style={{ color: "#000000", opacity: 0.6 }}>Interests</h3>
            <ul>
              {personal.interests.map((interest) => (
                <li key={interest}>{interest}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 style={{ color: "#000000", opacity: 0.6 }}>Education</h3>
            <ul>
              {personal.education.map((edu) => (
                <li key={edu.degree}>
                  <div>
                    {edu.degree}
                  </div>
                  <div style={{ color: "#666" }}>
                    <small>{edu.institution}</small><small>, {edu.year}</small>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>}
      </section>

      {/*<section>*/}
      {/*  <h2>Recent News</h2>*/}
      {/*  <ul>*/}
      {/*    {(showMore ? posts : posts.slice(0, 3)).map(({ title, slug, withContent }) => (*/}
      {/*      <li key={slug}>*/}
      {/*        {title}{" "}*/}
      {/*        {withContent && (*/}
      {/*          <span>*/}
      {/*            (<a href={`/post/${slug}`}>Read More</a>)*/}
      {/*          </span>*/}
      {/*        )}*/}
      {/*      </li>*/}
      {/*    ))}*/}
      {/*  </ul>*/}
      {/*  {posts.length > 3 && (*/}
      {/*    <div className={classes.showMore}>*/}
      {/*      <button onClick={toggleShowMore}>{showMore ? "Show Less" : "Show More"}</button>*/}
      {/*    </div>*/}
      {/*  )}*/}
      {/*</section>*/}


      <PublicationList publications={publications} />

      {/*<section>*/}
      {/*  <h2>Group</h2>*/}
      {/*  /!* <div className={classes.smallText}>sorted by date.</div> *!/*/}
      {/*  <ul>*/}
      {/*    {collabCategories.map((group) => (*/}
      {/*      <li key={group}>*/}
      {/*        <div style={{ display: "inline" }}>{group}:&nbsp;</div>*/}
      {/*        {group_members[group].map(({ name, link }) => (*/}
      {/*          <span key={name} className={classes.collaborator}>*/}
      {/*            <a href={link}>{name}</a>*/}
      {/*          </span>*/}
      {/*        ))}*/}
      {/*        .*/}
      {/*      </li>*/}
      {/*    ))}*/}
      {/*  </ul>*/}
      {/*</section>*/}

      <section>
        <h2>Awards</h2>
        <ul>
          {awards.map(({ name, year }) => (
            <li key={name}>
              <span>{name}, {year}</span>
            </li>
          ))}
        </ul>
      </section>

      <footer className={classes.footer}>
        <p>
          Last updated on <DateFormatter dateString={compilationDate} />
        </p>
        {/* <p>
          Made with the amazing <a href="https://reactjs.org/">React.js</a> and <a href="https://nextjs.org">Next.js</a>{" "}
          with the indispensable help from <a href="https://github.com/Pomevak">Hongcheng Zhao</a>.
        </p> */}
        <p>© 2020-{new Date().getFullYear()} Linghao Chen. All rights reserved.</p>
      </footer>
    </div>
  );
}

export async function getStaticProps(): Promise<{ props: IProps; revalidate: number }> {
  const posts = getAllPosts(["title", "slug", "lastmod", "content"]);
  for (const post of posts) {
    post.withContent = post.content.trim() !== "";
    delete post.content;
    delete post.lastmod;
  }

  return {
    props: {
      personal: getPersonalData(),
      blurb: await getBlurb(),
      publications: getPublications(),
      // projects: getProjects(),
      // group_members: getCollaborators(),
      awards: getAwards(),
      compilationDate: getCompilationDate(),
      posts: posts
    },
    revalidate: 900 // in seconds
  };
}
