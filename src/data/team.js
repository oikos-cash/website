// Single source of truth for the team roster.
//
// Rendered in two places, which previously kept their own copies of this array
// and drifted apart (a member removed from the splash section stayed live on
// /team). Add, edit and remove people here only:
//   - src/pages/Team.jsx                     -> the /team page, uses `bio`
//   - src/components/slides/TeamSlide.jsx    -> splash section, uses `shortBio`
//
// `socials` keys must have a matching icon in the renderer's `socialIcons` map
// or the link is silently dropped. Both renderers currently cover twitter,
// github and linkedin.
export const TEAM_MEMBERS = [
  {
    name: "Yank Carlos R. Espinal",
    role: "Software Engineer",
    bio: "Software Engineer with extensive experience with full stack development, scalable products, and AI systems integration.",
    shortBio: "Full stack development, scalable products, and AI systems integration.",
    avatar: "/assets/yank.png",
    initials: "YC",
    socials: {
      github: "https://github.com/nubo94",
      linkedin: "https://www.linkedin.com/in/yankcarlos/",
    },
  },
  {
    name: "Raudin Moreno",
    role: "Cloud Specialist",
    bio: "Software Engineer & Cloud Specialist building robust, scalable infrastructure for the next generation of decentralized systems.",
    shortBio: "Building robust, scalable infrastructure for decentralized systems.",
    avatar: "/assets/raudin.png",
    initials: "RM",
    socials: {
      // Renders nothing until a `website` icon is added to the socialIcons maps.
      website: "https://raudinmoreno.vercel.app/",
      github: "https://github.com/raudinm",
      linkedin: "https://www.linkedin.com/in/raudinm",
    },
  },
];
