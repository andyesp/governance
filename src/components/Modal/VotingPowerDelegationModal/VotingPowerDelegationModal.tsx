import React, { useState } from 'react'

import { Close } from 'decentraland-ui/dist/components/Close/Close'
import { Modal, ModalProps } from 'decentraland-ui/dist/components/Modal/Modal'

import useDelegatesInfo, { Delegate } from '../../../hooks/useDelegatesInfo'
import exampleDelegates from '../../../modules/delegates/example_delegates.json'
import VotingPowerDelegationDetail from '../VotingPowerDelegationDetail/VotingPowerDelegationDetail'
import VotingPowerDelegationList from '../VotingPowerDelegationList/VotingPowerDelegationList'

import './VotingPowerDelegationModal.css'

type VotingPowerDelegationModalProps = Omit<ModalProps, 'children'> & {
  vp: number
}

function VotingPowerDelegationModal({ vp, ...props }: VotingPowerDelegationModalProps) {
  const [selectedDelegate, setSelectedDelegate] = useState<Delegate | null>(null)
  const delegates = useDelegatesInfo(exampleDelegates.map((delegate) => delegate.address))

  return (
    <Modal {...props} size="small" closeIcon={<Close />} className="VotingPowerDelegationModal">
      {!selectedDelegate && (
        <VotingPowerDelegationList delegates={delegates} vp={vp} onDelegateClick={setSelectedDelegate} />
      )}
      {selectedDelegate && (
        <VotingPowerDelegationDetail delegate={selectedDelegate} onBackClick={() => setSelectedDelegate(null)} />
      )}
    </Modal>
  )
}

export default VotingPowerDelegationModal
