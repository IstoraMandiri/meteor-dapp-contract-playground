# Contract Playground

## Set up

Clone this repo

```
cd ~/Desktop
git clone https://github.com/hitchcott/meteor-dapp-contract-playground
```

Clone the pre-release light wallet alongside this folder and build `core`:

```
git clone https://github.com/hitchcott/lw-alpha-test
cd lw-alpha-test/packages/core
npm i
```

Start Meteor, with `PACKAGE_DIRS`. (Replace `YOURNAME`)

```
cd ~/Desktop/meteor-dapp-contract-playground
npm i
# this next step might take a while with slow internet; time to grab a sandwich
PACKAGE_DIRS='/Users/YOURNAME/Desktop/lw-alpha-test/packages' meteor
```

If you haven't created an account in `geth` yet, do this first! Use an easy to remember password (e.g. `testing`)

```
geth account list
# don't have one? 
geth account new
```

([More Info Here](https://github.com/ethereum/go-ethereum/wiki/Managing-your-accounts)) 

Now start `geth`, using the mining script. (Replace `YOURNAME`)

```
geth --dev --rpc --rpccorsdomain "*" --maxpeers 0 --nodiscover js /Users/YOURNAME/Desktop/meteor-dapp-contract-playground/private/miner.js
```

Now pop over to `http://localhost:3000`

The first time you initialize, you'll see a popup message asking to send some ETH to your light wallet some ether.

Go to `/accounts` route, create a new account. **WARINING:** USE A NON-SECURE PASSWORD, eg: `testing`

This password will be used for all future transactions so you don't need to enter it every time.

Copy the new account's address.

Then send it some Ether:

```
geth attach
eth.sendTransaction({from: eth.accounts[0], to:'0x8733fc4c592a4f0b56194ee8c21f9767e150c085', value:5e18})
# enter your password when prompted
```

By now your ready to roll! Refresh the browser and watch those contracts get deployed.

Now play around; create a new account, send some ether, send some tokens, set the simplestorage button.

And then you can start implementing your own contracts. It's recommended to use source control (git).