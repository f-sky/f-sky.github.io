import { memo } from "react";
import classes from "@/styles/personal.module.css";

export type PersonalType = typeof import("@/data/personal.json");

export const Personal = memo<PersonalType>(function Personal(props) {
  const { name, chineseName, worksFor, links } = props;

  return (
    <section className={classes.personal}>
      <div className={classes.profile}>
        <img className={classes.portrait} src="images/portrait.jpg" alt="pottrait" />
        <div className={classes.profileInfo}>
          <h1 className={classes.name}>{name}</h1>
          <h3 className={classes.chineseName}>{chineseName}</h3>
          <h3 className={classes.worksFor}>{worksFor}</h3>
          <div className={classes.links}>
            {links.map((item) => (
              <span key={item.name}>
                <a href={item.link}>{item.name}</a>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});
