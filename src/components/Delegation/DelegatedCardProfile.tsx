import React from 'react'
import { Blockie } from 'decentraland-ui/dist/components/Blockie/Blockie'
import { Address } from 'decentraland-ui/dist/components/Address/Address'
import { Loader } from 'decentraland-ui/dist/components/Loader/Loader'
import Avatar from 'decentraland-gatsby/dist/components/User/Avatar'
import useFormatMessage from 'decentraland-gatsby/dist/hooks/useFormatMessage'
import { Link } from 'decentraland-gatsby/dist/plugins/intl'
import locations from '../../modules/locations'
import './DelegatedCardProfile.css'
import useProfile from '../../hooks/useProfile'

export type DelegatedCardProfileProps = {
  address: string
}

export default function DelegatedCardProfile({ address }: DelegatedCardProfileProps) {
  const t = useFormatMessage()
  const {profile, profileState, hasDclAvatar} = useProfile(address)

  if (!address) {
    return null
  }

  return (
    <div className="DelegatedCardProfile">
      {!hasDclAvatar && (
        <Blockie seed={address!}>
          <Address value={address!} strong />
        </Blockie>
      )}
      {hasDclAvatar && (
        <div className="DelegatedCardProfile__ProfileContainer">
          <Avatar className="DelegatedCardProfile__ProfileAvatar" address={profile!.ethAddress} size="big" />
          <span className="DelegatedCardProfile__ProfileName">{profile!.name}</span>
          <Link href={locations.balance({ address })}>{t('page.balance.delegations_from_view_profile')}</Link>
        </div>
      )}
      <Loader size="small" active={profileState.loading} />
    </div>
  )
}
