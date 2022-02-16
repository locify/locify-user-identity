import React, { FormEvent, Fragment, useState } from 'react'
import { Box, Button, CircularProgress, Grid, TextField } from '@mui/material'
import { Auth } from 'aws-amplify'

type props = {
    username: string
    toIndex: () => void
}

export const ConfirmCodeBody = ({ username, toIndex }: props) => {
    const [confirmationCode, setConfirmationCode] = useState('')
    const [isPending, setPending] = useState<boolean>(false)

    async function submitConfirmCode() {
        setPending(true)
        try {
            const res = await Auth.confirmSignUp(username, confirmationCode)
            console.info('submit success')
            console.table(res)
            toIndex()
        } catch (err) {
            console.error('confirmation code error')
            console.table(err)
        }
        setPending(false)
    }

    return (
        <Fragment>
            <Box
                component="form"
                noValidate
                onSubmit={async (event: FormEvent) => {
                    event.preventDefault()
                    await submitConfirmCode()
                }}
                onChange={(event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault()
                    const res = event.target as HTMLInputElement
                    setConfirmationCode(res.value)
                    //console.info(res.id)
                    //console.info(res.value)
                }}
                sx={{ mt: 3 }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            id="code"
                            label="Confirmation Code"
                            name="confirmation code"
                            autoComplete="code"
                            value={confirmationCode}
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
                        Confirm
                    </Button>
                )}
            </Box>
        </Fragment>
    )
}
