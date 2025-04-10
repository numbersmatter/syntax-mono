

import * as Headless from '@headlessui/react'
import React, { forwardRef } from 'react'
import { Link as ReactRouterLink, type LinkProps } from 'react-router'

export const Link = forwardRef(function Link(
  props: { href: string | LinkProps['to'] } & Omit<LinkProps, 'to'>,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  return (
    <Headless.DataInteractive>
      <ReactRouterLink {...props} to={props.href} ref={ref} />
    </Headless.DataInteractive>
  )
})
