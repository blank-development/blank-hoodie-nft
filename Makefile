
.PHONY: deploy
deploy: 
	npx hardhat run scripts/deploy.js --network ${network}

.PHONY: verify
verify:
	npx hardhat verify --network ${network} ${address}

.PHONY: airdrop
airdrop:
	npx hardhat run scripts/airdrop.js --network ${network}