import React, { useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import HomeIcon from '@mui/icons-material/Home'
import AccountCircle from '@mui/icons-material/AccountCircle'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import { Button, Tooltip } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { authState } from '@src/store/authState'
import { Auth } from 'aws-amplify'
import { walletState } from '@src/store/walletState'
// @ts-ignore
import near from '@src/lib/near'
import { LoadingButton } from '@mui/lab'
import { usePathname } from '@src/lib/utils'

type MenuProps = {
    name: string
}

export function MenuAppBar({ name }: MenuProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const navigate = useNavigate()

    const isLoggedIn = useRecoilValue(authState)
    const isWalledIn = useRecoilValue(walletState)
    const setWalletState = useSetRecoilState(walletState)

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }
    const handleSignOut = async () => {
        try {
            await Auth.signOut()
            navigate('/login')
        } catch (e) {
            console.error(`signOut error: ${e}`)
        }
    }
    const handleWalletSignOut = async () => {
        near.signOut()
        setWalletState({ t: 'nonAuthenticated' })
    }

    const isLoginPath = () => {
        return usePathname() === '/login' || usePathname() === '/signup'
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => navigate('/')}
                    >
                        <HomeIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        {name}
                    </Typography>

                    {!isLoginPath() &&
                        (isLoggedIn.t === 'authenticated' ? (
                            <div>
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleMenu}
                                    color="inherit"
                                >
                                    <AccountCircle />
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={handleSignOut}>
                                        {isLoggedIn ? 'Sign out' : 'Sign in'}
                                    </MenuItem>
                                </Menu>
                            </div>
                        ) : (
                            <Button
                                variant={'text'}
                                color={'inherit'}
                                onClick={() => navigate('/login')}
                            >
                                Sign in
                            </Button>
                        ))}
                    {isWalledIn.t === 'loading' && (
                        <LoadingButton
                            loading
                            loadingIndicator={'loading'}
                            variant={'text'}
                            color={'inherit'}
                        />
                    )}
                    {isWalledIn.t === 'nonAuthenticated' && (
                        <Button
                            variant={'text'}
                            color={'inherit'}
                            onClick={() => near.signIn()}
                        >
                            Wallet sign-in
                        </Button>
                    )}
                    {isWalledIn.t === 'authenticated' && (
                        <Tooltip
                            title={isWalledIn.user.name}
                            placement={'bottom'}
                        >
                            <Button
                                variant={'text'}
                                color={'inherit'}
                                onClick={handleWalletSignOut}
                            >
                                Wallet sign-out
                            </Button>
                        </Tooltip>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    )
}
