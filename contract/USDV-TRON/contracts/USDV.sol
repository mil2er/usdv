// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.23;

import {AccessControlEnumerableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/extensions/AccessControlEnumerableUpgradeable.sol";
import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {IAccessControl} from "@openzeppelin/contracts/access/IAccessControl.sol";
import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {ERC20BurnableUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import {ERC20PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PausableUpgradeable.sol";
import {ERC20PermitUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {ERC1967Utils} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Utils.sol";
import {IBeacon} from "@openzeppelin/contracts/proxy/beacon/IBeacon.sol";

contract USDV is Initializable, ERC20Upgradeable, ERC20BurnableUpgradeable, ERC20PausableUpgradeable, AccessControlEnumerableUpgradeable, ERC20PermitUpgradeable, UUPSUpgradeable, IBeacon {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant BLACKLIST_ADMIN_ROLE = keccak256("BLACKLIST_ADMIN_ROLE");
    bytes32 public constant BLACKLIST_ROLE = keccak256("BLACKLIST_ROLE");

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address defaultAdmin, address pauser, address minter, address upgrader, address blacklistAdmin)
    public initializer
    {
        require(defaultAdmin != address(0), "defaultAdmin is zero address");
        require(pauser != address(0), "pauser is zero address");
        require(minter != address(0), "minter is zero address");
        require(upgrader != address(0), "upgrader is zero address");
        require(blacklistAdmin != address(0), "blacklistAdmin is zero address");

        __ERC20_init("USD Vault", "USDV");
        __ERC20Burnable_init();
        __ERC20Pausable_init();
        __AccessControl_init();
        __AccessControlEnumerable_init();
        __ERC20Permit_init("USD Vault");
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(PAUSER_ROLE, pauser);
        _grantRole(MINTER_ROLE, minter);
        _grantRole(UPGRADER_ROLE, upgrader);
        _grantRole(BLACKLIST_ADMIN_ROLE, blacklistAdmin);
        _setRoleAdmin(BLACKLIST_ROLE, BLACKLIST_ADMIN_ROLE);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, allowance(owner, spender) + addedValue);
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        address owner = _msgSender();
        uint256 currentAllowance = allowance(owner, spender);
        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
        unchecked {
            _approve(owner, spender, allowance(owner, spender) - subtractedValue);
        }
        return true;
    }

    //override for role check
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(UPGRADER_ROLE) {

    }

    // override for black list check
    function _update(address from, address to, uint256 value)
    internal
    override(ERC20Upgradeable, ERC20PausableUpgradeable)
    {
        require(
            !hasRole(BLACKLIST_ROLE, from),
            "SecureBlacklistToken: Sender is blacklisted"
        );
        require(
            !hasRole(BLACKLIST_ROLE, to),
            "SecureBlacklistToken: Recipient is blacklisted"
        );
        super._update(from, to, value);
    }

    //!!!Disable voluntary renouncement of the blacklist and defaultAdmin role
    function renounceRole(bytes32 role, address account) public override(AccessControlUpgradeable, IAccessControl) {
        require(
            role != BLACKLIST_ROLE,
            "SecureBlacklistToken: Cannot renounce blacklist role"
        );
        require(
            role != DEFAULT_ADMIN_ROLE,
            "SecureDefaultAdmin: Cannot renounce defaultAdmin role"
        );
        super.renounceRole(role, account);
    }

    function implementation() external view returns (address) {
        return ERC1967Utils.getImplementation();
    }

    function decimals() public view virtual override(ERC20Upgradeable) returns (uint8) {
        return 6;
    }

}