import React, { useMemo } from 'react'

import useCountdown from 'decentraland-gatsby/dist/hooks/useCountdown'
import useFormatMessage from 'decentraland-gatsby/dist/hooks/useFormatMessage'
import Time from 'decentraland-gatsby/dist/utils/date/Time'
import TokenList from 'decentraland-gatsby/dist/utils/dom/TokenList'

import Date from '../Common/Date'

import './FinishLabel.css'

const clock = require('../../images/icons/time.svg').default

export type FinishLabelProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
  date: Date
}

export default React.memo(function FinishLabel({ date, ...props }: FinishLabelProps) {
  const time = useMemo(() => Time.from(date), [date])
  const timeout = useCountdown(date)
  const t = useFormatMessage()

  const label =
    timeout.time > 0
      ? `${t('page.proposal_list.finish_label.ends')} ${time.fromNow()}`
      : `${t('page.proposal_list.finish_label.ended')} ${time.format('MMM DD, YYYY')}`
  return (
    <div {...props} className={TokenList.join([`FinishLabel`])}>
      <img src={clock} width="24" height="24" />
      <span>
        <Date date={date}>{label}</Date>
      </span>
    </div>
  )
})
