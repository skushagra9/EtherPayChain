## Learnings
When we talk about using payable in Solidity, it's not about enabling an address to receive Ether (because all addresses can do that by default), but rather about enabling a function or a contract to handle Ether transfers directly within the Solidity code. for more details.


Why are we using this:

```

  function getPaymentsByUser(address userAddress) public view returns (Payment[] memory) {
        uint256 count = 0;

        for (uint i = 0; i < payments.length; i++) {
            if (payments[i].user == userAddress) {
                count++;
            }
        }

        Payment[] memory userPayments = new Payment[](count);

        uint256 index = 0;
        for (uint i = 0; i < payments.length; i++) {
            if (payments[i].user == userAddress) {
                userPayments[index] = payments[i];
                index++;
            }
        }

        return userPayments;
    }

```

Instead of this:

```
  function getPaymentsByUser(address userAddress) public view returns (Payment[] memory) {
            Payment[] memory userPayments = new Payment[];
    for (uint i = 0; i < payments.length; i++) {
            if (payments[i].user == userAddress) {
                userPayments.push(payments[i]);
            }
        }

        return userPayments;
    }
```

The approach you've provided uses the push method to add elements to the userPayments array dynamically. While this approach seems concise and straightforward, it has a fundamental issue in Solidity due to gas optimization constraints.

In Solidity, dynamic arrays (arrays whose length can change during execution) can be costly in terms of gas consumption, especially when using the push method to add elements. The reason is that each push operation requires additional gas to update the array's length dynamically.

Here's why using push in this context can be problematic:

    Gas Cost: Each push operation incurs extra gas costs because Solidity needs to resize the array and update its length.
    Gas Limitations: Ethereum imposes gas limits on contract execution. If the gas consumed exceeds the limit, the transaction fails.
    Potential Out-of-Gas Errors: Using push excessively or in loops with a large number of iterations can lead to out-of-gas errors, causing transactions to revert.

To mitigate these issues, especially in situations where the array size can be large or the function may be called frequently, it's advisable to preallocate the array's size if possible. This is why in the previous example, we first counted the user's payments to determine the array size (count) and then created the array with a fixed size using new Payment[] (count).
