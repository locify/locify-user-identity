import React, { Fragment, useState } from 'react'
import { SignInBody } from '@components/Login/SignInBody'
import { ConfirmCodeBody } from '@components/Login/ConfirmCodeBody'
import { useNavigate } from 'react-router-dom'

type props = {}

export const SignIn = () => {
    const [isNotConfirmed, setNotConfirmed] = useState<boolean>(false)
    const [username, setUsername] = useState('')
    const navigate = useNavigate()
    const toIndex = () => navigate('/')
    return (
        <Fragment>
            {isNotConfirmed ? (
                <ConfirmCodeBody username={username} toIndex={toIndex} />
            ) : (
                <SignInBody
                    setNotConfirmed={setNotConfirmed}
                    setUsername={setUsername}
                    toIndex={toIndex}
                />
            )}
        </Fragment>
    )
}
