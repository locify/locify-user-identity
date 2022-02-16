import { atom } from 'recoil'

export type AuthT =
    | { t: 'loading' }
    | { t: 'error'; err: string }
    | { t: 'nonAuthenticated' }
    | { t: 'authenticated'; user: string }

export const authState = atom<AuthT>({
    key: 'authAwsState',
    default: { t: 'loading' },
})
