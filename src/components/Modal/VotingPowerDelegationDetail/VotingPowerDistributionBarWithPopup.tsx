import React from 'react'

import TokenList from 'decentraland-gatsby/dist/utils/dom/TokenList'

import './VotingPowerDistributionBarWithPopup.css'
import VotingPowerDistributionPopup from './VotingPowerDistributionPopup'

const getPercentage = (value: number, total: number): string => `${((value * 100) / total).toFixed(2)}%`

interface Props {
  value: number
  total: number
  label: string
  className: string
}

const VotingPowerDistributionBarWithPopup = ({ value, className, label, total }: Props) => {
  const valuePercentage = getPercentage(value, total)
  return (
    <>
      {value > 0 && (
        <VotingPowerDistributionPopup amount={value} percentage={valuePercentage} label={label}>
          <div
            className={TokenList.join(['VotingPowerDistributionBarWithPopup', className])}
            style={{ width: valuePercentage }}
          />
        </VotingPowerDistributionPopup>
      )}
    </>
  )
}

export default VotingPowerDistributionBarWithPopup
