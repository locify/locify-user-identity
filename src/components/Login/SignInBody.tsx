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

import { useSignIn } from '@components/Login/useSignIn'
import { Auth, Logger } from 'aws-amplify'

const logger = new Logger('signInBody')

type props = {
    setNotConfirmed(state: boolean): void
    setUsername(username: string): void
    toIndex: () => void
}

export const SignInBody = ({
    setNotConfirmed,
    setUsername,
    toIndex,
}: props) => {
    const { stateForm, dispatch } = useSignIn()
    const [isPending, setPending] = useState<boolean>(false)

    async function submitSignIn() {
        setPending(true)
        try {
            setUsername(stateForm.email)
            const user = await Auth.signIn({
                username: stateForm.email,
                password: stateForm.password,
            })
            logger.info(user)
        } catch (e) {
            const err = e as Record<string, string>
            if (err.code === 'UserNotConfirmedException') {
                console.info('signIn user not confirmed')
                setNotConfirmed(true)
            }
            console.info('exception sign in')
            console.table(e)
        }

        setPending(false)
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
                                Login
                            </Typography>
                        </Box>
                        <Box
                            component="form"
                            noValidate
                            onSubmit={async (event: FormEvent) => {
                                event.preventDefault()
                                await submitSignIn()
                            }}
                            onChange={(
                                event: React.FormEvent<HTMLFormElement>
                            ) => {
                                event.preventDefault()
                                const res = event.target as HTMLInputElement
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
                                    Log In
                                </Button>
                            )}
                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Google
                            </Button>
                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Facebook
                            </Button>
                        </Box>
                    </Stack>
                </Paper>
            </Box>
        </Fragment>
    )
}
