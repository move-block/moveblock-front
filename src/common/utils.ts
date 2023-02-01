export const truncateWalletAddress = (
  address: string,
  firstPartLength = 4,
  lastPartLength = 4
) => {
  const firstPart = address.substring(0, firstPartLength);
  const lastPart = address.substring(
    address.length - lastPartLength,
    address.length
  );
  return `${firstPart}...${lastPart}`;
};
