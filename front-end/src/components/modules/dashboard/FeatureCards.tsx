"use client";

import { SimpleGrid } from "@chakra-ui/react";
import FeatureCard from "./FeatureCard";

const FeatureCards = () => {
  const airDrop =
    "Launch your token distribution in seconds. Gas-optimized airdrops with smart eligibility rules. Start distributing now.";

  const stream =
    "Set up automated crypto payments once, run forever. Handle subscriptions, salaries, and recurring transfers automatically. Deploy your first stream.";

  const distribution =
    "Distribute tokens to thousands instantly. One transaction, multiple recipients. Equal or weighted splits with real-time tracking. Execute distribution.";

  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
      <FeatureCard
        title="Distribution"
        linkText="Create Distribution"
        description={distribution}
        imgType="distribution"
        link="/distribution"
      />
      <FeatureCard
        title="Payment Stream"
        linkText="Create Stream"
        description={stream}
        imgType="stream"
        link="/payment-stream"
      />
      <FeatureCard
        title="Airdrops"
        linkText="Create Campaign"
        description={airDrop}
        imgType="airdrop"
        link="/airdrop"
      />
    </SimpleGrid>
  );
};

export default FeatureCards;

