const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe ("ERC20", function () {

    async function deployContract () {
        const Linh = await ethers.getContractFactory("ERC20byLinh");
        const contract = await Linh.deploy("maimaituoi20");
        const [owner, addr1, addr2] = await ethers.getSigners();

        return { contract, owner, addr1, addr2 };
    }

    describe ("Deploy contract", function () {
        
        it ("Should set owner and name of the contract", async function () {
            const { contract, owner } = await loadFixture(deployContract);

            const contractOwner = await contract.owner();
            const contractName = await contract.name();

            expect (contractOwner).to.equal(owner.address);
            expect (contractName).to.equal("maimaituoi20");
        })
    })

    describe ("Mint", function () {
        it ("Should revert if sender isn't owner", async function() {
            const { contract, owner, addr1 } = await loadFixture(deployContract);
            
            await expect (
                contract.connect(addr1).mint(addr1.address, 1)
            ).to.be.revertedWith("only owner can mint");
        })
        it ("Should be able to mint", async function () {
            const { contract, owner, addr1 } = await loadFixture(deployContract);

            await contract.connect(owner).mint(addr1.address, 1);

            const addr1Balances = await contract.balanceOf(addr1.address);
            const totalSupply = await contract.totalSupply();

            expect (addr1Balances).to.equal(1);
            expect (totalSupply).to.equal(1);
        })
    })

    describe ("Approve", function () {
        it ("Should be able to approve", async function () {
            const { contract, addr1, addr2 } = await loadFixture(deployContract);

            await contract.connect(addr1).approve(addr2.address, 2);
            const allow = await contract.allowance(addr1.address, addr2.address);
            expect (allow).to.equal(2);
        })
    })

    describe ("Transfer", function () {
        it ("Should revert if sender doesn't have enough tokens", async function () {
            const { contract, owner, addr1, addr2 } = await loadFixture(deployContract);
            
            await contract.connect(owner).mint(addr1.address, 2);
            await expect (
                contract.connect(addr1).transfer(addr2.address, 3)
            ).to.be.revertedWith("sender doesn't have enough tokens");
        })
        it ("Should be able to transfer", async function () {
            const { contract, owner, addr1, addr2 } = await loadFixture(deployContract);

            await contract.connect(owner).mint(addr1.address, 5);
            await contract.connect(addr1).transfer(addr2.address, 3);
            
            const addr1bala = await contract.balanceOf(addr1.address);
            const addr2bala = await contract.balanceOf(addr2.address);

            expect (addr1bala).to.equal(2);
            expect (addr2bala).to.equal(3);
        })
    })
    
    describe ("TransferFrom", function () {
        it ("Should revert if sender doesn't have permission", async function () {
            const { contract, owner, addr1, addr2 } = await loadFixture(deployContract);

            await expect (
                contract.connect(addr2).transferFrom(owner.address, addr1.address, 2)
            ).to.be.revertedWith("sender doesn't have permission to transfer");
        })
        it ("Should revert if address \"from\" doesn't have enough tokens", async function () {
            const { contract, owner, addr1 } = await loadFixture(deployContract);

            await expect (
                contract.connect(owner).transferFrom(owner.address, addr1.address, 2)
            ).to.be.revertedWith("not enough tokens");
        })
        it ("Should be able to transfer", async function () {
            const { contract, owner, addr1, addr2 } = await loadFixture(deployContract);

            await contract.connect(owner).mint(owner, 5);
            await contract.connect(owner).approve(addr2.address, 4);
            await contract.connect(addr2).transferFrom(owner.address, addr1.address, 3);

            const ownerbala = await contract.balanceOf(owner.address);
            const addr1bala = await contract.balanceOf(addr1.address);
            const approve = await contract.allowance(owner.address, addr2.address);

            expect (ownerbala).to.equal(2);
            expect (addr1bala).to.equal(3);
            expect (approve).to.equal(1);
        })
    })
})