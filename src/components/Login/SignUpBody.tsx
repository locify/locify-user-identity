import React, { FormEvent, Fragment, useState } from 'react'
import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    Grid,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Auth, Logger } from 'aws-amplify'
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth'
import { useSignUp } from '@components/Login/useSignUp'
import { useNavigate } from 'react-router-dom'

type props = {
    setNotConfirmed(state: boolean): void
    setUsername(username: string): void
    toIndex: () => void
}

const logger = new Logger('signUpBody')

export const SignUpBody = ({
    setNotConfirmed,
    setUsername,
    toIndex,
}: props) => {
    const { stateForm, dispatch } = useSignUp()
    const [isPending, setPending] = useState<boolean>(false)
    const navigate = useNavigate()
    const [isException, setIsException] = useState('')
    const [isFbSignUp, setIsFbSignUp] = useState(false)
    const [isGoogleSignUp, setIsGoogleSignUp] = useState(false)

    async function submitSignUp() {
        setPending(true)
        setIsException('')
        try {
            setUsername(stateForm.email)
            const user = await Auth.signUp({
                username: stateForm.email,
                password: stateForm.password,
                attributes: {
                    email: stateForm.email,
                },
            })
            navigate('/')
            logger.info('signUp user:' + user)
            setNotConfirmed(true)
        } catch (e) {
            if (typeof e === 'string') {
                logger.error('exception submit signUp string: ' + e)
            }
            logger.error('exception submit signUp object: ' + e)
            setIsException('something went wrong')
        }
        setPending(false)
        if (isException === '') {
            setNotConfirmed(true)
        }
    }

    return (
        <Fragment>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper>
                    <Stack direction={'column'} sx={{ m: 3 }}>
                        <Box
                            display={'flex'}
                            flexDirection={'column'}
                            justifyContent={'center'}
                            alignItems={'center'}
                        >
                            <Avatar sx={{ m: 4, bgcolor: 'secondary.main' }}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Sign up
                            </Typography>
                        </Box>
                        <Box
                            component="form"
                            noValidate
                            onSubmit={async (event: FormEvent) => {
                                event.preventDefault()
                                await submitSignUp()
                            }}
                            onChange={(
                                event: React.FormEvent<HTMLFormElement>
                            ) => {
                                event.preventDefault()
                                const res = event.target as HTMLInputElement
                                //console.info(`res: ${res.id} ${res.value}`)
                                if (res.id === 'email') {
                                    dispatch({
                                        t: 'INPUT_EMAIL',
                                        data: res.value,
                                    })
                                } else if (res.id === 'password') {
                                    dispatch({
                                        t: 'INPUT_PASSWORD',
                                        data: res.value,
                                    })
                                } else if (res.id === 'password2') {
                                    dispatch({
                                        t: 'INPUT_PASSWORD2',
                                        data: res.value,
                                    })
                                }
                            }}
                            sx={{ mt: 3 }}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                        value={stateForm.email}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="new-password"
                                        value={stateForm.password}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="password2"
                                        label="Password"
                                        type="password"
                                        id="password2"
                                        autoComplete="new-password"
                                        value={stateForm.password2}
                                    />
                                </Grid>
                                {isException.length > 0 && (
                                    <Grid item xs={12}>
                                        <Typography>{isException}</Typography>
                                    </Grid>
                                )}
                            </Grid>
                            {isPending ? (
                                <CircularProgress />
                            ) : (
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Sign Up
                                </Button>
                            )}
                            {!isGoogleSignUp ? (
                                <Button
                                    type="button"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                    onClick={() => {
                                        setIsGoogleSignUp(true)
                                        logger.info(
                                            'start federated SignIn Google'
                                        )
                                        Auth.federatedSignIn({
                                            provider:
                                                CognitoHostedUIIdentityProvider.Google,
                                        })
                                            .then((res) => {
                                                console.table(res)
                                            })
                                            .catch((e) =>
                                                setIsException(
                                                    'something went wrong with Facebook signUp'
                                                )
                                            )
                                    }}
                                >
                                    Google
                                </Button>
                            ) : (
                                <CircularProgress />
                            )}
                            {!isFbSignUp ? (
                                <Button
                                    type="button"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                    onClick={() => {
                                        setIsFbSignUp(true)
                                        logger.info(
                                            'start federated SignIn Facebook'
                                        )
                                        Auth.federatedSignIn({
                                            provider:
                                                CognitoHostedUIIdentityProvider.Facebook,
                                        })
                                            .then((res) => {
                                                console.table(res)
                                            })
                                            .catch((e) =>
                                                setIsException(
                                                    'something went wrong with Facebook signUp'
                                                )
                                            )
                                    }}
                                >
                                    Facebook
                                </Button>
                            ) : (
                                <CircularProgress />
                            )}
                        </Box>
                    </Stack>
                </Paper>
            </Box>
        </Fragment>
    )
}
