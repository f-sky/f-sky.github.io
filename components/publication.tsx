import React, { memo } from "react";
import classes from "@/styles/publication.module.css";

export type PublicationType = any;

export const Publication = memo<Omit<PublicationType, "date">>(function Publication(props) {
  const { title, shorttitle, poster, author, issued, note, URL, DOI } = props;
  const shortName = shorttitle || title.split(":")[0];
  const paperLink = URL || (DOI ? `https://doi.org/${DOI}` : undefined);

  return (
    <div className={classes.publication}>
      <div className={classes.image}>
        {poster &&
          (poster.includes(".mp4") ? (
            <video
              src={poster}
              title={`${shortName} video loading..`}
              playsInline
              autoPlay
              loop
              preload=""
              muted
              controls={false}
            />
          ) : (
            <img src={poster} alt={`${shortName} thumbnail loading...`} />
          ))}
      </div>
      <div className={classes.info}>
        <div className={classes.title}>
          <a href={paperLink} dangerouslySetInnerHTML={{ __html: title }} />
        </div>
        <div className={classes.authors} >
          {author.map(({ given, family }) => (
              given=="Linghao"?
                  <span key={given + family} className={classes.hilightedAuthor}>
              <span dangerouslySetInnerHTML={{__html: given }} /> <span dangerouslySetInnerHTML={{ __html: family }} />
            </span>:<span key={given + family}>
              <span  dangerouslySetInnerHTML={{__html: given }} /> <span  dangerouslySetInnerHTML={{ __html: family }} />
            </span>
            //   <span key={given + family}>
            //   <span dangerouslySetInnerHTML={{__html: given }} /> <span dangerouslySetInnerHTML={{ __html: family }} />
            //  </span>

          ))}
        </div>
        <div className={classes.venue}>
          {props["container-title"] && <span dangerouslySetInnerHTML={{ __html: props["container-title"] }} />}
          <span>{issued?.["date-parts"][0].join(" / ")}</span>
          &nbsp; {note && <span dangerouslySetInnerHTML={{ __html: note }} />}
        </div>
        <div className={classes.links}>
          {props["project"] && (
            <span className={classes.link}>
              <a href={props["project"]}>Project</a>
            </span>
          )}
          {props["code"] && (
            <span className={classes.link}>
              <a href={props["code"]}>Code</a>
            </span>
          )}
        </div>
      </div>
    </div>
  );
});
