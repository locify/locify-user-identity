#!/bin/bash

./build.sh && \
export NEAR_ACCT=nft1.liv1.testnet && \
#near delete $NEAR_ACCT liv1.testnet && \
sleep 1 && \
near create-account $NEAR_ACCT --masterAccount liv1.testnet --initialBalance 10 && \
sleep 1 && \
#near deploy $NEAR_ACCT --wasmFile ./res/nft_simple.wasm && \
near deploy $NEAR_ACCT --wasmFile ../out/main.wasm && \
sleep 1 && \
echo "!!! call init contract" && \
near call $NEAR_ACCT new_default_meta '{"owner_id": "liv1.testnet" }' --accountId liv1.testnet