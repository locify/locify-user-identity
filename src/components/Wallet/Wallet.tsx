import React, { useEffect } from 'react'
// @ts-ignore
import near from '@src/lib/near'

import { Logger } from 'aws-amplify'
import { useSetRecoilState } from 'recoil'
import { walletState, WalletT } from '@src/store/walletState'

const logger = new Logger('useWallet')

type props = {
    children: React.ReactNode
}

export const Wallet = ({ children }: props) => {
    const setWalletState = useSetRecoilState<WalletT>(walletState)

    useEffect(() => {
        logger.error('set wallet state')
        const init = async () => {
            try {
                await near.init()
                if (near) {
                    if (near.isLoggedIn()) {
                        const account = near.getAccount()?.accountId ?? 'error'
                        const balance = near.getAccount().balance.total ?? '0'
                        //console.info('loggedIn')
                        setWalletState({
                            t: 'authenticated',
                            user: {
                                name: account,
                                balance: balance,
                                pubKey: near.pubKey,
                            },
                        })
                        logger.info(account)
                        //console.info('nKey: ', nKey)
                    } else {
                        console.info('wallet out')
                        setWalletState({ t: 'nonAuthenticated' })
                    }
                }
            } catch (e) {
                logger.error('near wallet initialization error')
            }
        }
        init()
    }, [])

    return <>{children}</>
}
