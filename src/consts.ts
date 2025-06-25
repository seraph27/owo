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
  TITLE: 'owo',
  DESCRIPTION:
    'seraph.dev - enjoy problem solving.',
  EMAIL: 'ychao@ucsd.edu',
  NUM_POSTS_ON_HOMEPAGE: 3,
  POSTS_PER_PAGE: 3,
  SITEURL: 'https://seraphowo.vercel.app/',
}

export const NAV_LINKS: Link[] = [
  { href: '/blog', label: 'editorial' },
  // { href: '/table', label: 'table' }, 
]

export const SOCIAL_LINKS: Link[] = [

]
