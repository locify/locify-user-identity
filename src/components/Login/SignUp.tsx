import React, { Fragment, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ConfirmCodeBody } from '@components/Login/ConfirmCodeBody'
import { SignUpBody } from '@components/Login/SignUpBody'

type props = {}

export const SignUp = () => {
    const [isNotConfirmed, setNotConfirmed] = useState<boolean>(false)
    const [username, setUsername] = useState('')
    const navigate = useNavigate()
    const toIndex = () => navigate('/')
    return (
        <Fragment>
            {isNotConfirmed ? (
                <ConfirmCodeBody username={username} toIndex={toIndex} />
            ) : (
                <SignUpBody
                    setNotConfirmed={setNotConfirmed}
                    setUsername={setUsername}
                    toIndex={toIndex}
                />
            )}
        </Fragment>
    )
}
