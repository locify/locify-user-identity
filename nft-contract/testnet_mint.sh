#!/bin/bash

export NEAR_ACCT=nft1.liv1.testnet && \
sleep 1 && \
echo "!!! call mint" && \
near call $NEAR_ACCT nft_mint '{"token_id": "123",  "metadata": { "title": "LOCIFY TEAM", "description": "The Team Goes", "media": "https://bafybeidl4hjbpdr6u6xvlrizwxbrfcyqurzvcnn5xoilmcqbxfbdwrmp5m.ipfs.dweb.link/"}, "receiver_id": "3ugen.testnet"}' --accountId 3ugen.testnet --deposit 0.1
