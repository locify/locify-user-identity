import getConfig from './config/near'
import * as nearAPI from 'near-api-js'
import { Base64 } from 'js-base64'
import axios from 'axios'
import Big from 'big.js'

const BOATLOAD_OF_GAS = Big(3)
    .times(10 ** 13)
    .toFixed()

class Near {
    constructor() {
        this.wallet = {}
        this.currentUser = null
        this.nearConfig = {}
        this.signer = {}
        this.token = null
        this.contract = null
        this.pubKey = null
        this.balance = null
        this.keyStoreExport = null
        this.skey = null
        this.keysList = null
    }

    async authToken() {
        if (this.currentUser) {
            const accountId = this.currentUser.accountId
            const arr = new Array(accountId)
            for (let i = 0; i < accountId.length; i++) {
                arr[i] = accountId.charCodeAt(i)
            }
            const msgBuf = new Uint8Array(arr)
            const signedMsg = await this.signer.signMessage(
                msgBuf,
                this.wallet._authData.accountId,
                this.wallet._networkId
            )
            const pubKey = Buffer.from(signedMsg.publicKey.data).toString('hex')
            this.pubKey = pubKey
            const signature = Buffer.from(signedMsg.signature).toString('hex')
            const payload = [accountId, pubKey, signature]
            this.token = Base64.encode(payload.join('&'))
        }
    }

    async init() {
        const { keyStores, connect, WalletConnection, InMemorySigner } = nearAPI
        const keyStore = new keyStores.BrowserLocalStorageKeyStore()

        this.keyStoreExport = keyStore
        const nearConfig = {
            ...getConfig(process.env.APP_ENV || 'development'),
            keyStore,
        }
        const near = await connect(nearConfig)
        const wallet = new WalletConnection(near)
        this.wallet = wallet
        this.nearConfig = nearConfig
        if (wallet.isSignedIn()) {
            const account = await near.account(wallet.getAccountId())
            this.keysList = await account.getAccessKeys()

            console.log(wallet.getAccountId())
            let currentUser
            if (wallet.getAccountId()) {
                const resKey = await keyStore.getKey(
                    'default',
                    wallet.getAccountId()
                )
                console.log('read keys from near lib')
                this.skey = resKey.secretKey
                this.pubKey = resKey.publicKey
                console.log(
                    'skey: ',
                    this.skey ?? 'not found in near lib, refresh browser'
                )
                currentUser = {
                    accountId: wallet.getAccountId(),
                    balance: await wallet.account().getAccountBalance(),
                }
            }
            this.currentUser = currentUser
            this.signer = new InMemorySigner(keyStore)
            await this.authToken()
            axios.defaults.headers.common['Authorization'] = this.token
        }

        //const contract = this.nearConfig.CONTRACT_NAME
        const contract = 'd1.liv1.testnet'
        console.log('near lib contract name: ', contract)
        console.log('near signer: ', wallet.getAccountId())
        this.contract = await new nearAPI.Contract(wallet.account(), contract, {
            viewMethods: ['get_keys', 'get_str', 'get_account_id'],
            changeMethods: ['add_keys', ['rotate_keys']],
            signer: wallet.getAccountId(),
        })
    }

    signIn() {
        this.wallet.requestSignIn(this.nearConfig.contractName, 'liv1')
    }

    signOut() {
        this.wallet.signOut()
        window.location.replace(
            window.location.origin + window.location.pathname
        )
    }

    getKey() {
        return this.pubKey
    }

    getAllKeys() {
        return this.keysList
    }

    getskey() {
        return this.skey
    }

    isLoggedIn() {
        if (this.wallet.isSignedIn) {
            return this.wallet.isSignedIn()
        }
    }

    getAccount() {
        return this.currentUser
    }
}

export default new Near()
