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
    'seraph.dev - enjoy the purest form of problem solving.',
  EMAIL: 'ychao@ucsd.edu',
  NUM_POSTS_ON_HOMEPAGE: 3,
  POSTS_PER_PAGE: 3,
  SITEURL: 'https://seraphowo.vercel.app/',
}

export const NAV_LINKS: Link[] = [
  { href: '/blog', label: 'blog' },
  { href: '/table', label: 'table' }, 
]

export const SOCIAL_LINKS: Link[] = [

]
