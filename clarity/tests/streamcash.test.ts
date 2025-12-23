import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";
import { initSimnet } from "@hirosystems/clarinet-sdk";

const simnet = await initSimnet();

const accounts = simnet.getAccounts();
const sender = accounts.get("wallet_1")!;
const recipient = accounts.get("wallet_2")!;
const unauthorized = accounts.get("wallet_3")!;

function getCurrentStxBalance(address: string) {
  const assetsMap = simnet.getAssetsMap();
  return assetsMap.get("STX")?.get(address) || BigInt(0);
}

// Helper to extract uint value from Ok response
function extractUint(result: any): number {
  // The result is an OkCV with a value property containing a UIntCV
  const okResult = result as { value: { value: bigint } };
  if (okResult?.value?.value !== undefined) {
    return Number(okResult.value.value);
  }
  throw new Error("Failed to extract uint from result");
}

describe("streamcash", () => {
  // Helper to create a basic stream
  const createStream = (
    recipientAddress: string,
    initialBalance: number,
    startBlock: number,
    stopBlock: number,
    paymentPerBlock: number,
    caller: string = sender,
  ) => {
    const response = simnet.callPublicFn(
      "streamcash",
      "stream-to",
      [
        Cl.principal(recipientAddress),
        Cl.uint(initialBalance),
        Cl.tuple({
          "start-block": Cl.uint(startBlock),
          "stop-block": Cl.uint(stopBlock),
        }),
        Cl.uint(paymentPerBlock),
      ],
      caller,
    );
    const currentBlock = simnet.burnBlockHeight;
    return { response, currentBlock };
  };

  it("creates a stream successfully", () => {
    const startBlock = simnet.burnBlockHeight;
    const stopBlock = startBlock + 100;
    const initialBalance = 1000000000; // 1000 STX in microstacks
    const paymentPerBlock = 10000000; // 10 STX per block

    const originalSenderBalance = getCurrentStxBalance(sender);
    const { response } = createStream(
      recipient,
      initialBalance,
      startBlock,
      stopBlock,
      paymentPerBlock,
    );

    expect(response.result).toBeOk(Cl.uint(0)); // First stream has ID 0

    // Verify funds were transferred from sender
    expect(getCurrentStxBalance(sender)).toEqual(
      originalSenderBalance - BigInt(initialBalance),
    );
  });

  it("prevents non-sender from refueling a stream", () => {
    const startBlock = simnet.burnBlockHeight;
    const stopBlock = startBlock + 100;
    const { response: createResponse } = createStream(
      recipient,
      1000000000,
      startBlock,
      stopBlock,
      10000000,
    );
    const streamId = extractUint(createResponse.result);

    const refuelResponse = simnet.callPublicFn(
      "streamcash",
      "refuel",
      [Cl.uint(streamId), Cl.uint(500000000)],
      unauthorized, // Not the sender
    );

    expect(refuelResponse.result).toBeErr(Cl.uint(0)); // err-unauthorized
  });

  it("allows sender to refuel a stream", () => {
    const startBlock = simnet.burnBlockHeight;
    const stopBlock = startBlock + 100;
    const { response: createResponse } = createStream(
      recipient,
      1000000000,
      startBlock,
      stopBlock,
      10000000,
    );
    const streamId = extractUint(createResponse.result);

    const originalSenderBalance = getCurrentStxBalance(sender);
    const refuelAmount = 500000000; // 500 STX

    const refuelResponse = simnet.callPublicFn(
      "streamcash",
      "refuel",
      [Cl.uint(streamId), Cl.uint(refuelAmount)],
      sender,
    );

    expect(refuelResponse.result).toBeOk(Cl.uint(refuelAmount));
    expect(getCurrentStxBalance(sender)).toEqual(
      originalSenderBalance - BigInt(refuelAmount),
    );
  });

  it("prevents non-recipient from withdrawing", () => {
    const startBlock = simnet.burnBlockHeight;
    const stopBlock = startBlock + 100;
    const { response: createResponse } = createStream(
      recipient,
      1000000000,
      startBlock,
      stopBlock,
      10000000,
    );
    const streamId = extractUint(createResponse.result);

    // Move forward a few blocks
    simnet.mineEmptyBlocks(5);

    const withdrawResponse = simnet.callPublicFn(
      "streamcash",
      "withdraw",
      [Cl.uint(streamId)],
      unauthorized, // Not the recipient
    );

    expect(withdrawResponse.result).toBeErr(Cl.uint(0)); // err-unauthorized
  });

  it("allows recipient to withdraw available balance", () => {
    const startBlock = simnet.burnBlockHeight;
    const stopBlock = startBlock + 100;
    const initialBalance = 1000000000; // 1000 STX
    const paymentPerBlock = 10000000; // 10 STX per block

    const { response: createResponse } = createStream(
      recipient,
      initialBalance,
      startBlock,
      stopBlock,
      paymentPerBlock,
    );
    const streamId = extractUint(createResponse.result);

    // Move forward 5 blocks
    simnet.mineEmptyBlocks(5);

    const originalRecipientBalance = getCurrentStxBalance(recipient);
    const expectedWithdrawable = 5 * paymentPerBlock; // 5 blocks * 10 STX = 50 STX

    const withdrawResponse = simnet.callPublicFn(
      "streamcash",
      "withdraw",
      [Cl.uint(streamId)],
      recipient,
    );

    expect(withdrawResponse.result).toBeOk(Cl.uint(expectedWithdrawable));
    expect(getCurrentStxBalance(recipient)).toEqual(
      originalRecipientBalance + BigInt(expectedWithdrawable),
    );
  });

  it("calculates balance correctly before stream starts", () => {
    const currentBlock = simnet.burnBlockHeight;
    const startBlock = currentBlock + 10; // Stream starts in the future
    const stopBlock = startBlock + 100;
    const { response: createResponse } = createStream(
      recipient,
      1000000000,
      startBlock,
      stopBlock,
      10000000,
    );
    const streamId = extractUint(createResponse.result);

    const balanceResponse = simnet.callReadOnlyFn(
      "streamcash",
      "balance-of",
      [Cl.uint(streamId), Cl.principal(recipient)],
      recipient,
    );

    expect(balanceResponse.result).toBeUint(0); // No balance before stream starts
  });

  it("calculates balance correctly during active stream", () => {
    const startBlock = simnet.burnBlockHeight;
    const stopBlock = startBlock + 100;
    const paymentPerBlock = 10000000; // 10 STX per block
    const { response: createResponse } = createStream(
      recipient,
      1000000000,
      startBlock,
      stopBlock,
      paymentPerBlock,
    );
    const streamId = extractUint(createResponse.result);

    // Move forward 7 blocks
    simnet.mineEmptyBlocks(7);

    const balanceResponse = simnet.callReadOnlyFn(
      "streamcash",
      "balance-of",
      [Cl.uint(streamId), Cl.principal(recipient)],
      recipient,
    );

    const expectedBalance = 7 * paymentPerBlock; // 7 blocks * 10 STX = 70 STX
    expect(balanceResponse.result).toBeUint(expectedBalance);
  });

  it("calculates balance correctly after stream ends", () => {
    const startBlock = simnet.burnBlockHeight;
    const stopBlock = startBlock + 100;
    const paymentPerBlock = 10000000; // 10 STX per block
    const { response: createResponse } = createStream(
      recipient,
      1000000000,
      startBlock,
      stopBlock,
      paymentPerBlock,
    );
    const streamId = extractUint(createResponse.result);

    // Move past the stop block
    simnet.mineEmptyBlocks(101);

    const balanceResponse = simnet.callReadOnlyFn(
      "streamcash",
      "balance-of",
      [Cl.uint(streamId), Cl.principal(recipient)],
      recipient,
    );

    const expectedBalance = 100 * paymentPerBlock; // 100 blocks * 10 STX = 1000 STX
    expect(balanceResponse.result).toBeUint(expectedBalance);
  });

  it("prevents refund before stream ends", () => {
    const startBlock = simnet.burnBlockHeight;
    const stopBlock = startBlock + 100;
    const { response: createResponse } = createStream(
      recipient,
      1000000000,
      startBlock,
      stopBlock,
      10000000,
    );
    const streamId = extractUint(createResponse.result);

    // Move forward but not past stop block
    simnet.mineEmptyBlocks(50);

    const refundResponse = simnet.callPublicFn(
      "streamcash",
      "refund",
      [Cl.uint(streamId)],
      sender,
    );

    expect(refundResponse.result).toBeErr(Cl.uint(2)); // err-stream-still-active
  });

  it("prevents non-sender from refunding", () => {
    const startBlock = simnet.burnBlockHeight;
    const stopBlock = startBlock + 100;
    const { response: createResponse } = createStream(
      recipient,
      1000000000,
      startBlock,
      stopBlock,
      10000000,
    );
    const streamId = extractUint(createResponse.result);

    // Move past stop block
    simnet.mineEmptyBlocks(101);

    const refundResponse = simnet.callPublicFn(
      "streamcash",
      "refund",
      [Cl.uint(streamId)],
      unauthorized, // Not the sender
    );

    expect(refundResponse.result).toBeErr(Cl.uint(0)); // err-unauthorized
  });

  it("allows sender to refund excess balance after stream ends", () => {
    const startBlock = simnet.burnBlockHeight;
    const stopBlock = startBlock + 100;
    const initialBalance = 2000000000; // 2000 STX
    const paymentPerBlock = 10000000; // 10 STX per block
    // Total streamed: 100 blocks * 10 STX = 1000 STX
    // Excess: 2000 - 1000 = 1000 STX

    const { response: createResponse } = createStream(
      recipient,
      initialBalance,
      startBlock,
      stopBlock,
      paymentPerBlock,
    );
    const streamId = extractUint(createResponse.result);

    // Move past stop block
    simnet.mineEmptyBlocks(101);

    const originalSenderBalance = getCurrentStxBalance(sender);
    const expectedExcess = 1000000000; // 1000 STX excess

    const refundResponse = simnet.callPublicFn(
      "streamcash",
      "refund",
      [Cl.uint(streamId)],
      sender,
    );

    expect(refundResponse.result).toBeOk(Cl.uint(expectedExcess));
    expect(getCurrentStxBalance(sender)).toEqual(
      originalSenderBalance + BigInt(expectedExcess),
    );
  });

  it("handles multiple withdrawals correctly", () => {
    const startBlock = simnet.burnBlockHeight;
    const stopBlock = startBlock + 100;
    const paymentPerBlock = 10000000; // 10 STX per block
    const { response: createResponse } = createStream(
      recipient,
      1000000000,
      startBlock,
      stopBlock,
      paymentPerBlock,
    );
    const streamId = extractUint(createResponse.result);

    const originalRecipientBalance = getCurrentStxBalance(recipient);

    // First withdrawal after 5 blocks
    simnet.mineEmptyBlocks(5);
    const firstWithdraw = simnet.callPublicFn(
      "streamcash",
      "withdraw",
      [Cl.uint(streamId)],
      recipient,
    );
    expect(firstWithdraw.result).toBeOk(Cl.uint(5 * paymentPerBlock));

    // Second withdrawal after 5 more blocks (total 10 blocks)
    simnet.mineEmptyBlocks(5);
    const secondWithdraw = simnet.callPublicFn(
      "streamcash",
      "withdraw",
      [Cl.uint(streamId)],
      recipient,
    );
    expect(secondWithdraw.result).toBeOk(Cl.uint(5 * paymentPerBlock));

    // Total withdrawn should be 10 blocks worth
    expect(getCurrentStxBalance(recipient)).toEqual(
      originalRecipientBalance + BigInt(10 * paymentPerBlock),
    );
  });

  it("returns error for invalid stream ID", () => {
    const invalidStreamId = 999;

    const refuelResponse = simnet.callPublicFn(
      "streamcash",
      "refuel",
      [Cl.uint(invalidStreamId), Cl.uint(1000000)],
      sender,
    );

    expect(refuelResponse.result).toBeErr(Cl.uint(3)); // err-invalid-stream-id
  });

  it("creates multiple streams with sequential IDs", () => {
    const startBlock = simnet.burnBlockHeight;
    const stopBlock = startBlock + 100;

    const stream1 = createStream(
      recipient,
      1000000000,
      startBlock,
      stopBlock,
      10000000,
    );
    expect(stream1.response.result).toBeOk(Cl.uint(0));

    const stream2 = createStream(
      recipient,
      1000000000,
      startBlock,
      stopBlock,
      10000000,
    );
    expect(stream2.response.result).toBeOk(Cl.uint(1));

    const stream3 = createStream(
      recipient,
      1000000000,
      startBlock,
      stopBlock,
      10000000,
    );
    expect(stream3.response.result).toBeOk(Cl.uint(2));
  });

  it("calculates sender balance correctly", () => {
    const startBlock = simnet.burnBlockHeight;
    const stopBlock = startBlock + 100;
    const initialBalance = 2000000000; // 2000 STX
    const paymentPerBlock = 10000000; // 10 STX per block
    const { response: createResponse } = createStream(
      recipient,
      initialBalance,
      startBlock,
      stopBlock,
      paymentPerBlock,
    );
    const streamId = extractUint(createResponse.result);

    // Move forward 30 blocks
    simnet.mineEmptyBlocks(30);

    // Recipient balance: 30 * 10 = 300 STX
    // Sender balance: 2000 - 300 = 1700 STX
    const senderBalanceResponse = simnet.callReadOnlyFn(
      "streamcash",
      "balance-of",
      [Cl.uint(streamId), Cl.principal(sender)],
      sender,
    );

    const expectedSenderBalance = initialBalance - 30 * paymentPerBlock;
    expect(senderBalanceResponse.result).toBeUint(expectedSenderBalance);
  });

  it("returns zero balance for unrelated principal", () => {
    const startBlock = simnet.burnBlockHeight;
    const stopBlock = startBlock + 100;
    const { response: createResponse } = createStream(
      recipient,
      1000000000,
      startBlock,
      stopBlock,
      10000000,
    );
    const streamId = extractUint(createResponse.result);

    simnet.mineEmptyBlocks(10);

    const balanceResponse = simnet.callReadOnlyFn(
      "streamcash",
      "balance-of",
      [Cl.uint(streamId), Cl.principal(unauthorized)],
      unauthorized,
    );

    expect(balanceResponse.result).toBeUint(0);
  });
});
