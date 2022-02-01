
.PHONY: deploy
deploy: 
	npx hardhat run scripts/deploy.js --network ${network}