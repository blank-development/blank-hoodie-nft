
.PHONY: test
test:
	npx hardhat test

.PHONY: coverage
coverage: 
	npx hardhat coverage

.PHONY: compile
compile: 
	npx hardhat compile

.PHONY: rinkeby
rinkeby: 
	npx hardhat run scripts/deployment.js --network rinkeby