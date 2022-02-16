import React, { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import { useRecoilValue } from 'recoil'
import { walletState, WalletT } from '@src/store/walletState'
import { NearAuthProvider } from '@ceramicnetwork/blockchain-utils-linking'
// @ts-ignore
import near from '@src/lib/near'
import { DID } from 'dids'
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver'
import { ThreeIdConnect } from '@3id/connect'
import { CeramicClient } from '@ceramicnetwork/http-client'
import { DIDDataStore } from '@glazed/did-datastore'
import * as nearApiJs from 'near-api-js'
import { KeyPair } from 'near-api-js'
import { Avatar, Box, Grid, Paper, Stack, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'

import { box, randomBytes } from 'tweetnacl'
import { decodeBase64, encodeBase64, encodeUTF8 } from 'tweetnacl-util'
import { KeyPairEd25519 } from 'near-api-js/lib/utils'
import { convertSecretKey } from 'ed2curve'

const API_URL = 'https://ceramic-clay.3boxlabs.com'

const ceramic = new CeramicClient(API_URL)

interface IEncryptedMsg {
    ciphertext: string
    ephemPubKey: string
    nonce: string
    version: string
}

function encrypt(sKey: Uint8Array) {
    console.log('Encrypt started')
    const ephemeralKeyPair = box.keyPair()
    const keyRandom = KeyPairEd25519.fromRandom()
    const _sKey = convertSecretKey(sKey)
    console.info(`enc skey: ${_sKey}`)
    const _pKey = box.keyPair.fromSecretKey(_sKey).publicKey
    console.info(` enc _p: ${_pKey} _s: ${_sKey}`)
    const _ui8 = new TextEncoder().encode(keyRandom.secretKey)
    console.log('ciphertext: ', _ui8)
    const nonce = randomBytes(box.nonceLength)

    const sharedA = box.before(_pKey, ephemeralKeyPair.secretKey)
    const encrypted = box.after(_ui8, nonce, sharedA)
    const fullMsg = new Uint8Array(
        nonce.length + ephemeralKeyPair.publicKey.length + encrypted.length
    )
    console.log('encrypted: ', keyRandom.secretKey)
    fullMsg.set(nonce)
    fullMsg.set(ephemeralKeyPair.publicKey, nonce.length)
    fullMsg.set(encrypted, nonce.length + ephemeralKeyPair.publicKey.length)
    return encodeBase64(fullMsg)
}

/* Decrypt a message with a base64 encoded secretKey (privateKey) */
function decrypt(sKey: Uint8Array, fullCipher: string) {
    //console.log(`cipher length: ${fullCipher.length}`)
    const _sKey = convertSecretKey(sKey)
    const _fullCipher = decodeBase64(fullCipher)
    const nonce = _fullCipher.slice(0, 24)
    //console.log('nonce: ', nonce)
    const senderPublicKey = _fullCipher.slice(24, 56)
    //const _sPk = new TextEncoder().encode(senderPublicKey)
    //console.log('pk: ', senderPublicKey)
    const cipher = _fullCipher.slice(56)
    const sharedB = box.before(senderPublicKey, _sKey)

    const decrypted = box.open.after(cipher, nonce, sharedB)
    if (!decrypted) {
        throw new Error('Could not decrypt message')
    }

    const base64DecryptedMessage = encodeUTF8(decrypted)
    return base64DecryptedMessage
}

export const Index = () => {
    const walletInfo = useRecoilValue<WalletT>(walletState)
    const [cName, setCName] = useState('')
    const [cDescription, setCDescription] = useState('')
    const [cUrl, setCUrl] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [errorState, setErrorState] = useState('')
    const [userId, setUserId] = useState('not set')
    const [did, setDid] = useState('not set')

    useEffect(() => {
        const getProfile = async () => {
            if (walletInfo.t === 'authenticated') {
                setIsLoading(true)
                const skey = near.getskey()
                const pubkey = near.getKey()
                console.info('get public key: ', pubkey)
                console.info('get secret key: ', skey)
                setUserId(walletInfo.user.name)
                const PRIVATE_KEY = `ed25519:${skey}`
                console.log('pkey: ', PRIVATE_KEY)

                const keyStore = new nearApiJs.keyStores.InMemoryKeyStore()
                const chainRef = 'testnet'
                const keyPair = KeyPair.fromString(PRIVATE_KEY)
                const CONTRACT_NAME = 'd1.liv1.testnet'
                await keyStore.setKey(chainRef, walletInfo.user.name, keyPair)
                const config = {
                    keyStore, // instance of InMemoryKeyStore
                    networkId: 'default',
                    nodeUrl: 'https://rpc.testnet.near.org',
                    contractName: CONTRACT_NAME,
                    walletUrl: 'https://wallet.testnet.near.org',
                    helperUrl: 'https://helper.testnet.near.org',
                }
                // @ts-ignore
                const nearDid = await nearApiJs.connect(config)

                const authProvider = new NearAuthProvider(
                    nearDid,
                    walletInfo.user.name,
                    chainRef
                )
                const threeIdConnect = new ThreeIdConnect()
                await threeIdConnect.connect(authProvider)
                const provider = threeIdConnect.getDidProvider()

                ceramic.did = new DID({
                    resolver: ThreeIdResolver.getResolver(ceramic),
                })
                ceramic.did.setProvider(provider)
                console.log('wait auth')
                const publishedModel = {
                    schemas: {
                        BasicProfile:
                            'ceramic://k3y52l7qbv1frxt706gqfzmq6cbqdkptzk8uudaryhlkf6ly9vx21hqu4r6k1jqio',
                    },
                    definitions: {
                        basicProfile:
                            'kjzl6cwe1jw145cjbeko9kil8g9bxszjhyde21ob8epxuxkaon1izyqsu8wgcic',
                    },
                    tiles: {},
                }
                const dataStore = new DIDDataStore({
                    ceramic,
                    model: publishedModel,
                })
                await ceramic.did.authenticate()
                console.log('get auth')

                console.log('start did: ', ceramic.did.id)
                if (ceramic.did.id) {
                    setDid(ceramic.did.id)
                }
                const resProfilePost = await dataStore.get('basicProfile')
                if (resProfilePost) {
                    console.group('get res init profile')
                    console.table(resProfilePost)
                    console.groupEnd()
                    setCName(resProfilePost.name)
                    setCUrl(resProfilePost.url)
                    setCDescription(resProfilePost.description)
                } else {
                    console.log('res profile not found')
                }
                setIsLoading(false)
            }
        }
        getProfile()
    }, [walletInfo.t])

    const handleGet = async () => {
        if (walletInfo.t === 'authenticated') {
            setIsLoading(true)
            const skey = near.getskey()
            const PRIVATE_KEY = `ed25519:${skey}`
            console.log('pkey: ', PRIVATE_KEY)

            const keyStore = new nearApiJs.keyStores.InMemoryKeyStore()
            const chainRef = 'testnet'
            const keyPair = KeyPair.fromString(PRIVATE_KEY)
            const CONTRACT_NAME = 'd1.liv1.testnet'
            await keyStore.setKey(chainRef, walletInfo.user.name, keyPair)
            const config = {
                keyStore, // instance of InMemoryKeyStore
                networkId: 'default',
                nodeUrl: 'https://rpc.testnet.near.org',
                contractName: CONTRACT_NAME,
                walletUrl: 'https://wallet.testnet.near.org',
                helperUrl: 'https://helper.testnet.near.org',
            }
            // @ts-ignore
            const nearDid = await nearApiJs.connect(config)

            const authProvider = new NearAuthProvider(
                nearDid,
                walletInfo.user.name,
                chainRef
            )
            const threeIdConnect = new ThreeIdConnect()
            console.log('start did')
            await threeIdConnect.connect(authProvider)
            const provider = threeIdConnect.getDidProvider()

            console.log('start did')
            const clientDid = new DID({
                resolver: ThreeIdResolver.getResolver(ceramic),
            })

            console.log('start did')
            clientDid.setProvider(provider)
            ceramic.did = new DID({
                resolver: ThreeIdResolver.getResolver(ceramic),
            })
            ceramic.did.setProvider(provider)
            await ceramic.did.authenticate()
            console.log('start did')
            const publishedModel = {
                schemas: {
                    BasicProfile:
                        'ceramic://k3y52l7qbv1frxt706gqfzmq6cbqdkptzk8uudaryhlkf6ly9vx21hqu4r6k1jqio',
                },
                definitions: {
                    basicProfile:
                        'kjzl6cwe1jw145cjbeko9kil8g9bxszjhyde21ob8epxuxkaon1izyqsu8wgcic',
                },
                tiles: {},
            }
            const dataStore = new DIDDataStore({
                ceramic,
                model: publishedModel,
            })
            const resProfile = await dataStore.get('basicProfile')
            if (resProfile) {
                console.group('get res GET profile')
                console.table(resProfile)
                console.groupEnd()
                setCName(resProfile.name)
                setCUrl(resProfile.url)
                setCDescription(resProfile.description)
            } else {
                console.log('res profile not found')
            }
            setIsLoading(false)
        }
    }
    const handleUserChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCName(event.target.value)
    }
    const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCUrl(event.target.value)
    }
    const handleDescriptionChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setCDescription(event.target.value)
    }
    const handleSet = async () => {
        if (walletInfo.t === 'authenticated') {
            setIsLoading(true)
            const skey = near.getskey()
            const PRIVATE_KEY = `ed25519:${skey}`
            console.log('pkey: ', PRIVATE_KEY)

            const keyStore = new nearApiJs.keyStores.InMemoryKeyStore()
            const chainRef = 'testnet'
            const keyPair = KeyPair.fromString(PRIVATE_KEY)
            const CONTRACT_NAME = 'd1.liv1.testnet'
            await keyStore.setKey(chainRef, walletInfo.user.name, keyPair)
            const config = {
                keyStore, // instance of InMemoryKeyStore
                networkId: 'default',
                nodeUrl: 'https://rpc.testnet.near.org',
                contractName: CONTRACT_NAME,
                walletUrl: 'https://wallet.testnet.near.org',
                helperUrl: 'https://helper.testnet.near.org',
            }
            // @ts-ignore
            const nearDid = await nearApiJs.connect(config)

            const authProvider = new NearAuthProvider(
                nearDid,
                walletInfo.user.name,
                chainRef
            )
            const threeIdConnect = new ThreeIdConnect()
            console.log('start did')
            await threeIdConnect.connect(authProvider)
            const provider = threeIdConnect.getDidProvider()

            console.log('start did')
            const clientDid = new DID({
                resolver: ThreeIdResolver.getResolver(ceramic),
            })

            console.log('start did')
            clientDid.setProvider(provider)
            ceramic.did = new DID({
                resolver: ThreeIdResolver.getResolver(ceramic),
            })
            ceramic.did.setProvider(provider)
            await ceramic.did.authenticate()
            console.log('start did')
            const publishedModel = {
                schemas: {
                    BasicProfile:
                        'ceramic://k3y52l7qbv1frxt706gqfzmq6cbqdkptzk8uudaryhlkf6ly9vx21hqu4r6k1jqio',
                },
                definitions: {
                    basicProfile:
                        'kjzl6cwe1jw145cjbeko9kil8g9bxszjhyde21ob8epxuxkaon1izyqsu8wgcic',
                },
                tiles: {},
            }
            const dataStore = new DIDDataStore({
                ceramic,
                model: publishedModel,
            })
            console.info('my new profile: ')
            console.table(`${cName} ${cUrl} ${cDescription}`)
            const res = await dataStore.set('basicProfile', {
                name: cName,
                url: cUrl,
                description: cDescription,
            })
            console.log('SET result: ', res)
            setCName('')
            setCUrl('')
            setCDescription('')
            setIsLoading(false)
        }
    }
    return (
        <Box>
            <Box
                sx={{ my: 4 }}
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
            >
                <Paper>
                    <Stack
                        sx={{ mt: 4 }}
                        direction={'column'}
                        alignItems={'center'}
                        spacing={2}
                    >
                        <Avatar src={'/ceramic.png'} />
                        <Typography sx={{ mt: 4 }} variant={'h5'}>
                            Locify-identity
                        </Typography>

                        <Box
                            display={'flex'}
                            alignItems={'center'}
                            justifyContent={'center'}
                        >
                            <Grid container xs={12} md={6} spacing={2}>
                                <Grid item xs={12} sx={{ mx: 4 }}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="name"
                                        label="User name"
                                        name="userName"
                                        value={cName}
                                        onChange={handleUserChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sx={{ mx: 4 }}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="url"
                                        label="Url"
                                        name="url"
                                        autoComplete="email"
                                        value={cUrl}
                                        onChange={handleUrlChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sx={{ mx: 4 }}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="description"
                                        label="Description"
                                        name="description"
                                        value={cDescription}
                                        onChange={handleDescriptionChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sx={{ mx: 4 }}>
                                    {errorState.length > 0 && (
                                        <Typography gutterBottom>
                                            {errorState}
                                        </Typography>
                                    )}
                                    <Stack
                                        sx={{ mt: 2, mb: 2 }}
                                        direction={'row'}
                                        spacing={6}
                                    >
                                        <LoadingButton
                                            fullWidth
                                            loading={isLoading}
                                            variant="contained"
                                            onClick={handleGet}
                                        >
                                            Get
                                        </LoadingButton>
                                        <LoadingButton
                                            fullWidth
                                            loading={isLoading}
                                            variant="contained"
                                            onClick={handleSet}
                                        >
                                            Set
                                        </LoadingButton>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} sx={{ mx: 4 }}>
                                    <Typography variant={'subtitle1'}>
                                        Additional info:
                                    </Typography>
                                    <Typography variant={'subtitle1'}>
                                        User name: {userId}
                                    </Typography>
                                    <Typography variant={'subtitle1'}>
                                        DID id: {did}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Stack>
                </Paper>
            </Box>
        </Box>
    )
}
