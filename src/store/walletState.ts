import { atom } from 'recoil'

export type NearUserT = {
    name: string
    balance: string
    pubKey: string
}
export type WalletT =
    | { t: 'loading' }
    | { t: 'error'; err: string }
    | { t: 'nonAuthenticated' }
    | { t: 'authenticated'; user: NearUserT }

export const walletState = atom<WalletT>({
    key: 'walletAuthState',
    default: { t: 'loading' },
})
