import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://alo2.ink/", // replace this with your deployed domain
  author: "Alo",
  desc: "my blog for record study on development",
  title: "Alo's",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
};

export const LOCALE = {
  lang: "zh-Hans", // html lang code. Set this empty and default will be "en"
  langTag: ["en-EN"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/dashboard",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "WeChat",
    href: "",
    linkTitle: `${SITE.title} on WeChat`,
    active: false,
  },
  {
    name: "Mail",
    href: "mailto:anlongtu19@gmail.com",
    linkTitle: `${SITE.title} on email`,
    active: true,
  },
];
