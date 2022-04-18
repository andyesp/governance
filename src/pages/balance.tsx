import React, { useMemo } from 'react'
import { useLocation } from '@gatsbyjs/reach-router'
import Head from 'decentraland-gatsby/dist/components/Head/Head'
import MaintenancePage from 'decentraland-gatsby/dist/components/Layout/MaintenancePage'
import useAuthContext from 'decentraland-gatsby/dist/context/Auth/useAuthContext'
import useFormatMessage from 'decentraland-gatsby/dist/hooks/useFormatMessage'
import { Container } from 'decentraland-ui/dist/components/Container/Container'
import { Loader } from 'decentraland-ui/dist/components/Loader/Loader'
import { Stats } from 'decentraland-ui/dist/components/Stats/Stats'
import isEthereumAddress from 'validator/lib/isEthereumAddress'

import DelegatedFromUserCard from '../components/Delegation/DelegatedFromUserCard'
import DelegatedToUserCard from '../components/Delegation/DelegatedToUserCard'
import Navigation, { NavigationTab } from '../components/Layout/Navigation'
import VotingPower from '../components/Token/VotingPower'
import LogIn from '../components/User/LogIn'
import UserStats from '../components/User/UserStats'
import useDelegation from '../hooks/useDelegation'
import useDelegatedVotingPower from '../hooks/useDelegatedVotingPower'
import useVotingPowerBalance from '../hooks/useVotingPowerBalance'
import { isUnderMaintenance } from '../modules/maintenance'
import ManaBalanceCard from '../components/Token/ManaBalanceCard'
import LandBalanceCard from '../components/Token/LandBalanceCard'
import EstateBalanceCard from '../components/Token/EstateBalanceCard'
import NameBalanceCard from '../components/Token/NameBalanceCard'
import './balance.css'

const SNAPSHOT_SPACE = process.env.GATSBY_SNAPSHOT_SPACE || ''

export default function BalancePage() {
  const t = useFormatMessage()
  const location = useLocation()
  const params = useMemo(() => new URLSearchParams(location.search), [location.search])
  const [userAddress] = useAuthContext()
  const address = isEthereumAddress(params.get('address') || '') ? params.get('address') : userAddress
  const isLoggedUserProfile = userAddress === address
  const [delegation, delegationState] = useDelegation(address)
  const [votingPower, votingPowerState] = useVotingPowerBalance(address, SNAPSHOT_SPACE)
  const { scores, isLoadingScores, delegatedVotingPower } = useDelegatedVotingPower(delegation.delegatedFrom)

  if (isUnderMaintenance()) {
    return (
      <>
        <Head
          title={t('page.balance.title') || ''}
          description={t('page.balance.description') || ''}
          image="https://decentraland.org/images/decentraland.png"
        />
        <Navigation activeTab={NavigationTab.Wrapping} />
        <MaintenancePage />
      </>
    )
  }

  if (!userAddress) {
    return <LogIn title={t('page.balance.title') || ''} description={t('page.balance.description') || ''} />
  }

  return (
    <div className="BalancePage">
      <Head
        title={t('page.balance.title') || ''}
        description={t('page.balance.description') || ''}
        image="https://decentraland.org/images/decentraland.png"
      />
      <Navigation activeTab={NavigationTab.Wrapping} />
      <Container className="VotingPowerSummary">
        <UserStats size="huge" className="VotingPowerProfile" address={address || userAddress} />
        <Stats title={t(`page.balance.total_label`) || ''}>
          <VotingPower value={votingPower} size="huge" />
          <Loader size="small" className="balance" active={votingPowerState.loading} />
        </Stats>
      </Container>
      <Container className="VotingPowerDetail">
        <ManaBalanceCard address={address} />
        <LandBalanceCard address={address} />
        <EstateBalanceCard address={address} />
        <NameBalanceCard address={address} />
        <DelegatedToUserCard
          isLoggedUserProfile={isLoggedUserProfile}
          delegation={delegation}
          scores={scores}
          loading={delegationState.loading || isLoadingScores}
          delegatedVotingPower={delegatedVotingPower}
        />
        <DelegatedFromUserCard isLoggedUserProfile={isLoggedUserProfile} delegation={delegation} />
      </Container>
    </div>
  )
}
