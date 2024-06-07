import { useState } from 'react'
import './App.css'
import { Core } from '@walletconnect/core'
import { Web3Wallet } from '@walletconnect/web3wallet'

function App() {
    const PROJECT_ID = import.meta.env.VITE_PROJECT_ID
    // console.log(PROJECT_ID)

    const [uri, setUri] = useState('')
    const [address, setAddress] = useState('')

    function handleUriChange(e) {
        setUri(e.target.value)
    }
    function handleAddressChange(e) {
        setAddress(e.target.value)
    }

    async function connectToDapp() {
        if (uri === '') {
            console.log('uri cannot be empty')
            return
        }
        if (address === '') {
            console.log('address cannot be empty')
            return
        }
        const core = new Core({
            projectId: PROJECT_ID,
        })
        const web3wallet = await Web3Wallet.init({
            core, // <- pass the shared `core` instance
            metadata: {
                name: 'Demo app',
                description: 'Demo Client as Wallet/Peer',
                url: 'http://localhost:5173/',
                icons: [],
            },
        })

        console.log(core)
        console.log(web3wallet)
        const sessions = web3wallet.getActiveSessions()
        const sessionsArray = Object.values(sessions)

        console.log(sessionsArray)

        const namespaces = {
            eip155: {
                chains: ['eip155:1'], // Ethereum Mainnet
                methods: ['eth_sendTransaction', 'eth_signTransaction', 'personal_sign', 'eth_signTypedData'],
                events: ['accountsChanged', 'chainChanged'],
                accounts: [`eip155:1:${address}`],
            },
        }

        web3wallet.on('session_proposal', async (proposal) => {
            console.log('the proposal')
            console.log(proposal)

            const session = await web3wallet.approveSession({
                id: proposal.id,
                namespaces,
            })

            console.log(session)
        })
        await web3wallet.pair({ uri })
    }
    return (
        <div>
            <h1>WalletConnect Impersonator</h1>
            <input type="text" value={uri} onChange={handleUriChange} placeholder="Enter WalletConnect URI" />
            <input
                type="text"
                value={address}
                onChange={handleAddressChange}
                placeholder="Enter Ethereum Address to Impersonate"
            />
            <button onClick={connectToDapp}>Connect</button>
        </div>
    )
}

export default App
