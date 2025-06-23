const {expect} = require("chai");
const {ethers, upgrades} = require("hardhat");

describe("USDV Contract Tests", function () {
    let owner, admin, pauser, minter, upgrader, blacklistAdmin, user1, user2;
    let usdv;

    before(async () => {
        [owner, admin, pauser, minter, upgrader, blacklistAdmin, user1, user2] =
            await ethers.getSigners();
    });

    beforeEach(async () => {
        const USDV = await ethers.getContractFactory("USDV");

        usdv = await upgrades.deployProxy(
            USDV,
            [
                admin.address,
                pauser.address,
                minter.address,
                upgrader.address,
                blacklistAdmin.address
            ],
            {initializer: 'initialize'}
        );

        await usdv.waitForDeployment();
    });


    describe("Initialization", () => {
        it("Should initialize with correct roles", async () => {
            expect(await usdv.hasRole(await usdv.DEFAULT_ADMIN_ROLE(), admin.address)).to.be.true;
            expect(await usdv.hasRole(await usdv.PAUSER_ROLE(), pauser.address)).to.be.true;
            expect(await usdv.hasRole(await usdv.MINTER_ROLE(), minter.address)).to.be.true;
            expect(await usdv.hasRole(await usdv.UPGRADER_ROLE(), upgrader.address)).to.be.true;
            expect(await usdv.hasRole(await usdv.BLACKLIST_ADMIN_ROLE(), blacklistAdmin.address)).to.be.true;
        });

        it("Should set correct token metadata", async () => {
            expect(await usdv.name()).to.equal("USD Vault");
            expect(await usdv.symbol()).to.equal("USDV");
        });
    });

    describe("Pausable Functionality", () => {
        it("Should allow PAUSER_ROLE to pause/unpause", async () => {
            await usdv.connect(pauser).pause();
            expect(await usdv.paused()).to.be.true;

            await usdv.connect(pauser).unpause();
            expect(await usdv.paused()).to.be.false;
        });

        it("Should prevent non-pausers from pausing", async () => {
            await expect(usdv.connect(user1).pause())
                .to.be.revertedWithCustomError(usdv, "AccessControlUnauthorizedAccount");
        });
    });

    describe("Minting Functionality", () => {
        it("Should allow MINTER_ROLE to mint tokens", async () => {
            const amount = ethers.parseEther("1000");
            await usdv.connect(minter).mint(user1.address, amount);
            expect(await usdv.balanceOf(user1.address)).to.equal(amount);
        });

        it("Should prevent non-minters from minting", async () => {
            await expect(usdv.connect(user1).mint(user1.address, 100))
                .to.be.revertedWithCustomError(usdv, "AccessControlUnauthorizedAccount");
        });
    });

    describe("Blacklist Functionality", () => {
        it("Should prevent blacklisted addresses from transferring", async () => {
            // Grant blacklist role to admin
            await usdv.connect(blacklistAdmin).grantRole(await usdv.BLACKLIST_ROLE(), user1.address);
            // Test transfers
            await expect(usdv.connect(minter).mint(user1.address, 100))
                .to.be.revertedWith("SecureBlacklistToken: Recipient is blacklisted");
            await expect(usdv.connect(user1).transfer(user2.address, 50))
                .to.be.revertedWith("SecureBlacklistToken: Sender is blacklisted");
            await expect(usdv.connect(user2).transfer(user1.address, 50))
                .to.be.revertedWith("SecureBlacklistToken: Recipient is blacklisted");
        });

        it("Should prevent renouncing blacklist role", async () => {
            await usdv.connect(blacklistAdmin).grantRole(await usdv.BLACKLIST_ROLE(), user1.address);
            await expect(
                usdv.connect(user1).renounceRole(await usdv.BLACKLIST_ROLE(), user1.address)
            ).to.be.revertedWith("SecureBlacklistToken: Cannot renounce blacklist role");
        });
    });

    describe("Upgrade Functionality", () => {
        it("Should allow UPGRADER_ROLE to upgrade", async () => {
            const USDVFactoryV2 = await ethers.getContractFactory("USDV_V2_Test");
            const usdvV2 = await upgrades.upgradeProxy(
                await usdv.getAddress(),
                USDVFactoryV2.connect(upgrader),
                {
                    kind: "uups",
                    initializer: "initializeV2"
                }
            );
            expect(await usdvV2.version()).to.equal("v2.0"); // Assume V2 adds version() function
        });

        it("Should prevent non-upgraders from upgrading", async () => {
            const USDVFactoryV2 = await ethers.getContractFactory("USDV_V2_Test");
            await expect(
                upgrades.upgradeProxy(
                    await usdv.getAddress(),
                    USDVFactoryV2.connect(user1),
                    {
                        kind: "uups",
                        initializer: "initializeV2"
                    }
                )
            ).to.be.reverted;
        });
    });

    describe("Access Control", () => {
        it("Should allow role admins to manage roles", async () => {
            // Blacklist Admin should manage BLACKLIST_ROLE
            await usdv.connect(blacklistAdmin).grantRole(await usdv.BLACKLIST_ROLE(), user1.address);
            expect(await usdv.hasRole(await usdv.BLACKLIST_ROLE(), user1.address)).to.be.true;
        });

        it("Should implement role hierarchy correctly", async () => {
            // DEFAULT_ADMIN should be able to manage all roles
            await usdv.connect(admin).grantRole(await usdv.PAUSER_ROLE(), user2.address);
            expect(await usdv.hasRole(await usdv.PAUSER_ROLE(), user2.address)).to.be.true;
        });
    });

    describe("Burn Functionality", () => {
        it("Should allow user burn USDV", async () => {
            amount = ethers.parseEther("1000");
            await usdv.connect(minter).mint(user1.address, amount);
            totalAmount = await usdv.balanceOf(user1.address);
            totalSupply = await usdv.totalSupply();
            await usdv.connect(user1).burn(totalAmount);
            expect(await usdv.balanceOf(user1.address)).to.equal(0);
            expect(await usdv.totalSupply()).to.equal(totalSupply - totalAmount);
        });

        //超额检测
        it("Should check burn amount", async () => {
            amount = await usdv.balanceOf(user1.address);
            burnAmount = amount + 1n;
            await expect(usdv.connect(user1).burn(burnAmount))
                .to.be.revertedWithCustomError(usdv, "ERC20InsufficientBalance");
        });
    });

    describe("Approve Functionality", () => {
        it("Should approve", async () => {
            amount = ethers.parseEther("1000");
            await usdv.connect(minter).mint(user1.address, amount);

            await usdv.connect(user1).approve(user2.address, amount);
            expect(await usdv.allowance(user1.address, user2.address)).to.equal(amount);
            await usdv.connect(user1).increaseAllowance(user2.address, amount);
            expect(await usdv.allowance(user1.address, user2.address)).to.equal(amount + amount);

            await usdv.connect(user2).transferFrom(user1.address, user2.address, amount);
            expect(await usdv.allowance(user1.address, user2.address)).to.equal(amount);
            expect(await usdv.balanceOf(user2.address)).to.equal(amount);

            await usdv.connect(user1).decreaseAllowance(user2.address, amount);
            expect(await usdv.allowance(user1.address, user2.address)).to.equal(0);

        });

        //超额转出检测
        it("Should check allowance amount", async () => {
            await expect(usdv.connect(user2).transferFrom(user1.address, user2.address, amount))
                .to.be.revertedWithCustomError(usdv, "ERC20InsufficientAllowance");
        });
    });

    describe("ERC20Permit Functionality", () => {
        it("Should Permit", async () => {
            const value = ethers.parseEther("1000");
            const nonce = await usdv.nonces(user1.address);
            const deadline = Math.floor(Date.now() / 1000) + 3600;
            const network = await ethers.provider.getNetwork();
            const chainId = network.chainId;

            const domain = {
                name: await usdv.name(),
                version: "1",
                chainId: chainId,
                verifyingContract: await usdv.getAddress(),
            };

            const types = {
                Permit: [
                    {name: "owner", type: "address"},
                    {name: "spender", type: "address"},
                    {name: "value", type: "uint256"},
                    {name: "nonce", type: "uint256"},
                    {name: "deadline", type: "uint256"},
                ],
            };

            const message = {
                owner: user1.address,
                spender: user2.address,
                value: value,
                nonce: nonce,
                deadline: deadline
            };

            const signature = await user1.signTypedData(domain, types, message);
            const {v, r, s} = ethers.Signature.from(signature);
            await usdv.connect(user2).permit(user1.address, user2.address, value, deadline, v, r, s);

            expect(await usdv.allowance(user1.address, user2.address)).to.equal(value);

        });
    });

});