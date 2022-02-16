import React, { useEffect } from 'react'
import { Amplify, Auth, Hub } from 'aws-amplify'
import { useSetRecoilState } from 'recoil'
import { authState, AuthT } from '@src/store/authState'
import { CognitoUser } from '@aws-amplify/auth'

import awsConfig from '@src/aws-exports'

Amplify.configure(awsConfig)

type props = {
    children: React.ReactNode
}

export function AuthAws({ children }: props) {
    const setAuthState = useSetRecoilState<AuthT>(authState)

    useEffect(() => {
        Hub.listen('auth', ({ payload: { event, data } }) => {
            switch (event) {
                case 'signIn':
                case 'cognitoHostedUI':
                    Auth.currentAuthenticatedUser().then((userData) => {
                        console.info('subscription change state')
                        console.table(userData)
                        if (userData instanceof CognitoUser) {
                            setAuthState((state) => ({
                                ...state,
                                t: 'authenticated',
                                user: userData.getUsername(),
                            }))
                        } else {
                            setAuthState((state) => ({
                                ...state,
                                t: 'error',
                                err: 'exception - non CognitoUser',
                            }))
                        }
                    })
                    break
                case 'signOut':
                    console.info('subscription signOut')
                    setAuthState((state) => ({
                        ...state,
                        t: 'nonAuthenticated',
                    }))
                    break
                case 'signIn_failure':
                case 'cognitoHostedUI_failure':
                    console.info('subscription signIn failure')
                    console.error('Sign in subscription failure', data)
                    setAuthState((state) => ({
                        ...state,
                        t: 'error',
                        err: 'signIn failure',
                    }))
                    break
            }
        })

        Auth.currentAuthenticatedUser()
            .then((userData) => {
                if (userData instanceof CognitoUser) {
                    setAuthState((state) => ({
                        ...state,
                        t: 'authenticated',
                        user: userData.getUsername(),
                    }))
                } else {
                    setAuthState((state) => ({
                        ...state,
                        t: 'error',
                        err: 'exception - non CognitoUser',
                    }))
                }
            })
            .catch((err) => {
                setAuthState((state) => ({ ...state, t: 'nonAuthenticated' }))
                console.error('init signIn  failure:', err)
            })
    }, [])

    return <>{children}</>
}
