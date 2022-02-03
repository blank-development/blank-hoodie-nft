
.PHONY: deploy
deploy: 
	npx hardhat run scripts/deploy.js --network ${network}

.PHONY: verify
verify:
	npx hardhat verify ${address}