import React from 'react'

import { AuthAws, Wallet } from '@src/components'
import Router from '@src/Router'

export default function App() {
    return (
        <AuthAws>
            <Wallet>
                <Router />
            </Wallet>
        </AuthAws>
    )

}
