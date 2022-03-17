import React from 'react'
import { Modal, ModalProps } from 'decentraland-ui/dist/components/Modal/Modal'
import { Header } from 'decentraland-ui/dist/components/Header/Header'
import Paragraph from 'decentraland-gatsby/dist/components/Text/Paragraph'
import { Close } from 'decentraland-ui/dist/components/Close/Close'
import TokenList from 'decentraland-gatsby/dist/utils/dom/TokenList'
import useFormatMessage from 'decentraland-gatsby/dist/hooks/useFormatMessage'
import Time from 'decentraland-gatsby/dist/utils/date/Time'
import { UpdateAttributes } from '../../entities/Updates/types'
import './ProposalModal.css'
import './UpdateDetailModal.css'
import { Profile } from 'decentraland-gatsby/dist/utils/loader/profile'
import Username from '../User/Username'
import { ProposalAttributes } from '../../entities/Proposal/types'

export type UpdateDetailModalProps = Omit<ModalProps, 'children'> & {
  update?: UpdateAttributes | null
  proposalUser?: ProposalAttributes['user']
  profile: Profile
}

export function UpdateDetailModal({
  update,
  open,
  onDismiss,
  onClose,
  loading,
  profile,
  proposalUser,
}: UpdateDetailModalProps) {
  const l = useFormatMessage()
  const date = !!update?.due_date ? Time(update.due_date).format('MMMM') : Time(update?.completion_date).format('MMMM')
  const formattedCompletionDate = Time(update?.completion_date).fromNow()

  return (
    <Modal
      open={open}
      onDismiss={onDismiss}
      onClose={onClose}
      loading={loading}
      size="small"
      className={TokenList.join(['ProposalModal', 'UpdateDetailModal'])}
      closeIcon={<Close />}
    >
      <Modal.Content className="ProposalModal__Title">
        <Header>{l('modal.update_detail.date', { date })}</Header>
      </Modal.Content>
      <Modal.Content className="UpdateDetailModal__Content">
        <Header as="h2">{update?.title}</Header>
        <Paragraph>{update?.description}</Paragraph>
        <div className="UpdateDetailModal__Date">
          <Paragraph className="UpdateDetailModal__Timestamp">
            {l('modal.update_detail.date', { date: formattedCompletionDate })}
          </Paragraph>{' '}
          <Username profile={profile} proposalUser={proposalUser} />
        </div>
      </Modal.Content>
    </Modal>
  )
}
