export type Site = {
  TITLE: string
  DESCRIPTION: string
  EMAIL: string
  NUM_POSTS_ON_HOMEPAGE: number
  POSTS_PER_PAGE: number
  SITEURL: string
}

export type Link = {
  href: string
  label: string
}

export const SITE: Site = {
  TITLE: 'seraph.dev',
  DESCRIPTION:
    'seraph.dev - the playground where competitive programming meets pure, unfiltered problem-solving madness.',
  EMAIL: 'ychao@ucsd.edu',
  NUM_POSTS_ON_HOMEPAGE: 3,
  POSTS_PER_PAGE: 3,
  SITEURL: 'https://seraph-dev-astro-seraphs-projects-57f140e1.vercel.app/',
}

export const NAV_LINKS: Link[] = [
  { href: '/blog', label: 'blog' },
  { href: '/table', label: 'table' }, 
  { href: '/resources', label: 'resources' },
  { href: '/tags', label: 'tags' },
  { href: '/authors', label: 'authors' },
  { href: '/about', label: 'about' },
]

export const SOCIAL_LINKS: Link[] = [
  { href: 'https://github.com/seraph27', label: 'GitHub' },
  { href: 'https://kenkoooo.com/atcoder/#/table/sera1007', label: 'Atcoder' },
  { href: 'ychao@ucsd.edu', label: 'Email' },
]
