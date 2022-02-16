import React from 'react'
import {
    Box,
    Container,
    CssBaseline,
    Grid,
    Paper,
    Typography,
} from '@mui/material'
import { Outlet } from 'react-router-dom'
import { Copyright, MenuAppBar } from '@src/components'
import { authState } from '@src/store/authState'
import { useRecoilValue } from 'recoil'
import { walletState } from '@src/store/walletState'

export const Layout = () => {
    const isLoggedIn = useRecoilValue(authState)
    const isWalledIn = useRecoilValue(walletState)
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            <CssBaseline />
            <Container component="main" sx={{ mt: 1, mb: 2 }} maxWidth={'lg'}>
                <MenuAppBar name={'Locify-identity v2'} />
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        {isWalledIn.t === 'authenticated' ? (
                            <Outlet />
                        ) : (
                            <Box
                                sx={{ mt: 4 }}
                                display="flex"
                                justifyContent={'center'}
                                alignItems={'center'}
                            >
                                <Paper>
                                    <Typography sx={{ m: 4 }} variant={'h5'}>
                                        Please signing with Near wallet first
                                    </Typography>
                                </Paper>
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </Container>
            <Box
                component="footer"
                sx={{
                    py: 3,
                    px: 2,
                    mt: 'auto',
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[200]
                            : theme.palette.grey[800],
                }}
            >
                <Container maxWidth="lg">
                    <Copyright />
                </Container>
            </Box>
        </Box>
    )
}
