import React from 'react'

import Paragraph from 'decentraland-gatsby/dist/components/Text/Paragraph'
import useFormatMessage from 'decentraland-gatsby/dist/hooks/useFormatMessage'
import { navigate } from 'decentraland-gatsby/dist/plugins/intl'
import TokenList from 'decentraland-gatsby/dist/utils/dom/TokenList'
import isNumber from 'lodash/isNumber'
import toSnakeCase from 'lodash/snakeCase'

import { NewGrantCategory } from '../../entities/Grant/types'
import { getNewGrantsCategoryIcon } from '../../entities/Grant/utils'
import { CategoryIconVariant } from '../../helpers/styles'

import { categoryIcons } from './CategoryBanner'
import './CategoryOption.css'

export type CategoryOptionProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> & {
  active?: boolean
  type: string
  count?: number
}

const icons: Record<string, any> = {
  all_proposals: require('../../images/icons/all.svg').default,
  all_grants: require('../../images/icons/all.svg').default,
  community: require('../../images/icons/grant.svg').default,
  content_creator: require('../../images/icons/grant.svg').default,
  gaming: require('../../images/icons/grant.svg').default,
  platform_contributor: require('../../images/icons/grant.svg').default,
  ...categoryIcons,
}

export const getCategoryIcon = (type: string, variant?: CategoryIconVariant, size?: number) => {
  const newGrants = Object.values(NewGrantCategory)
  const newGrantIndex = newGrants.map(toSnakeCase).indexOf(type)
  const isNewGrant = newGrantIndex !== -1
  if (isNewGrant) {
    const icon = getNewGrantsCategoryIcon(newGrants[newGrantIndex])
    return icon({ variant: variant || CategoryIconVariant.Filled, size: size })
  }

  return <img src={icons[type]} width="24" height="24" />
}

export default React.memo(function CategoryOption({ active, type, className, count, ...props }: CategoryOptionProps) {
  const t = useFormatMessage()
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (props.onClick) {
      props.onClick(e)
    }

    if (!e.defaultPrevented) {
      e.preventDefault()

      if (props.href) {
        navigate(props.href)
      }
    }
  }

  return (
    <a
      {...props}
      onClick={handleClick}
      className={TokenList.join([
        'CategoryOption',
        `CategoryOption--${type}`,
        active && 'CategoryOption--active',
        className,
      ])}
    >
      <span>
        <span>{getCategoryIcon(type, CategoryIconVariant.Circled)}</span>
        <span>
          <Paragraph tiny semiBold>
            {t(`category.${type}_title`)}
          </Paragraph>
        </span>
      </span>
      {isNumber(count) && (
        <span className={TokenList.join(['CategoryOption__Counter', active && 'CategoryOption__Counter--active'])}>
          {count}
        </span>
      )}
    </a>
  )
})
