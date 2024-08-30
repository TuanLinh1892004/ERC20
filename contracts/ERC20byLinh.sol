// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8;

// Linh rewrite ERC20
contract ERC20byLinh {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    string public name;
    uint public totalSupply;

    address public owner;

    mapping (address => uint) private balances;
    mapping(address account => mapping(address spender => uint256)) private allowances;

    constructor(string memory _name) {
        name = _name;
        owner = msg.sender;
    }

    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }

    function allowance(address _owner, address spender) external view returns (uint256) {
        return allowances[_owner][spender];
    }

    function mint(address to, uint amount) external {
        require(msg.sender == owner, "only owner can mint");

        totalSupply += amount;
        balances[to] += amount;

        emit Transfer(address(0), to, amount);
    }

    function transfer(address to, uint256 value) external {
        require(balances[msg.sender] >= value, "sender doesn't have enough tokens");
        balances[msg.sender] -= value;
        balances[to] += value;
        emit Transfer(msg.sender, to, value);
    }

    function approve(address spender, uint256 value) external {
        allowances[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
    }

    function transferFrom(address from, address to, uint256 value) external {
        require(msg.sender == from || allowances[from][msg.sender] >= value, "sender doesn't have permission to transfer");
        require(balances[from] >= value, "not enough tokens");
        balances[from] -= value;
        balances[to] += value;
        allowances[from][msg.sender] -= value;
        emit Transfer(from, to, value); 
    }
}