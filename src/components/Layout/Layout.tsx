import { Footer } from 'decentraland-ui/dist/components/Footer/Footer'
import { Navbar, NavbarProps } from 'decentraland-ui/dist/components/Navbar/Navbar'

import { getSupportedChainIds } from '../../helpers'
import WalletSelectorModal from '../Modal/WalletSelectorModal'
import WrongNetworkModal from '../Modal/WrongNetworkModal'

import './Layout.css'

interface Props {
  rightMenu?: NavbarProps['rightMenu']
  children?: React.ReactNode
}

export default function Layout({ children, rightMenu }: Props) {
  const state = {} as any
  const handleClickMenuOption = function (event: React.MouseEvent, section: string) {
    if (!event.defaultPrevented) {
      return {
        place: 'navbar',
        section,
        menu: section.split('_'),
      }
    }

    return null
  }

  return (
    <>
      <Navbar activePage="dao" onClickMenuOption={handleClickMenuOption} rightMenu={rightMenu} />
      <main>{children}</main>
      {/* <WrongNetworkModal
        currentNetwork={state.chainId}
        expectedNetworks={getSupportedChainIds()}
        onSwitchNetwork={(chainId) => state.switchTo(chainId)}
        providerType={state.providerType}
      />
      <WalletSelectorModal
        open={state.selecting}
        loading={state.loading}
        chainId={getSupportedChainIds()[0]}
        error={state.error}
        onConnect={(providerType, chainId) => state.connect(providerType, chainId)}
        onClose={() => state.select(false)}
      /> */}
      <Footer locale="en" locales={['en']} isFullWidth={false} className="WiderFooter" />
    </>
  )
}
