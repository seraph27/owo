import katex from 'katex'
import * as React from 'react'

interface Props {
  expression: string
  block?: boolean
}

export function Katex({ expression, block = false }: Props) {
  const html = React.useMemo(
    () =>
      katex.renderToString(expression, {
        throwOnError: false,
        displayMode: block,
      }),
    [expression, block],
  )

  return (
    <span
      className={block ? 'katex-display' : ''}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}