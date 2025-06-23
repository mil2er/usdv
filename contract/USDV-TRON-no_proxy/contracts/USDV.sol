// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/IAccessControl.sol";
import "@openzeppelin/contracts/access/extensions/AccessControlEnumerable.sol";

contract USDV is ERC20, ERC20Burnable, ERC20Pausable, ERC20Permit, AccessControlEnumerable{
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BLACKLIST_ADMIN_ROLE = keccak256("BLACKLIST_ADMIN_ROLE");
    bytes32 public constant BLACKLIST_ROLE = keccak256("BLACKLIST_ROLE");

    constructor(address defaultAdmin, address pauser, address minter, address blacklistAdmin) ERC20("USD Vault", "USDV") ERC20Permit("USD Vault"){
        require(defaultAdmin != address(0), "defaultAdmin is zero address");
        require(pauser != address(0), "pauser is zero address");
        require(minter != address(0), "minter is zero address");
        require(blacklistAdmin != address(0), "blacklistAdmin is zero address");

        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(PAUSER_ROLE, pauser);
        _grantRole(MINTER_ROLE, minter);
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

    // override for black list check
    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Pausable) {
        require(
            !hasRole(BLACKLIST_ROLE, from),
            "USDV: Sender is blacklisted"
        );
        require(
            !hasRole(BLACKLIST_ROLE, to),
            "USDV: Recipient is blacklisted"
        );
        super._update(from, to, value);
    }

    //!!!Disable voluntary renouncement of the blacklist and defaultAdmin role
    function renounceRole(bytes32 role, address account) public override(AccessControl, IAccessControl) {
        require(
            role != BLACKLIST_ROLE,
            "SecureBlacklist: Cannot renounce blacklist role"
        );
        require(
            role != DEFAULT_ADMIN_ROLE,
            "SecureDefaultAdmin: Cannot renounce defaultAdmin role"
        );
        super.renounceRole(role, account);
    }

    function decimals() public view virtual override(ERC20) returns (uint8) {
        return 6;
    }

}