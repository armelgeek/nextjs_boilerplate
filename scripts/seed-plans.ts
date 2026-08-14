import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  console.log("Seeding plans...");

  const plans = [
    
    {
      name: "Starter",
      description: "Perfect for individuals and small projects",
      stripePriceId: "price_starter_monthly", 
      stripeProductId: "prod_starter", 
      amount: 999, 
      currency: "usd",
      interval: "month",
      features: [
        "Up to 10 projects",
        "Basic analytics",
        "Email support",
        "1 GB storage",
        "Community access",
      ],
      isPopular: false,
      isActive: true,
    },
    {
      name: "Professional",
      description: "Ideal for growing teams and businesses",
      stripePriceId: "price_professional_monthly", 
      stripeProductId: "prod_professional", 
      amount: 2999, 
      currency: "usd",
      interval: "month",
      features: [
        "Unlimited projects",
        "Advanced analytics",
        "Priority support",
        "10 GB storage",
        "Team collaboration",
        "API access",
        "Custom integrations",
      ],
      isPopular: true,
      isActive: true,
    },
    {
      name: "Enterprise",
      description: "For large organizations with advanced needs",
      stripePriceId: "price_enterprise_monthly", 
      stripeProductId: "prod_enterprise", 
      amount: 9999, 
      currency: "usd",
      interval: "month",
      features: [
        "Everything in Professional",
        "Dedicated support",
        "Unlimited storage",
        "Advanced security",
        "SLA guarantee",
        "Custom contracts",
        "On-premise deployment",
      ],
      isPopular: false,
      isActive: true,
    },
    
    {
      name: "Starter",
      description: "Perfect for individuals and small projects",
      stripePriceId: "price_starter_yearly", 
      stripeProductId: "prod_starter", 
      amount: 9999, 
      currency: "usd",
      interval: "year",
      features: [
        "Up to 10 projects",
        "Basic analytics",
        "Email support",
        "1 GB storage",
        "Community access",
      ],
      isPopular: false,
      isActive: true,
    },
    {
      name: "Professional",
      description: "Ideal for growing teams and businesses",
      stripePriceId: "price_professional_yearly", 
      stripeProductId: "prod_professional", 
      amount: 29999, 
      currency: "usd",
      interval: "year",
      features: [
        "Unlimited projects",
        "Advanced analytics",
        "Priority support",
        "10 GB storage",
        "Team collaboration",
        "API access",
        "Custom integrations",
      ],
      isPopular: true,
      isActive: true,
    },
    {
      name: "Enterprise",
      description: "For large organizations with advanced needs",
      stripePriceId: "price_enterprise_yearly", 
      stripeProductId: "prod_enterprise", 
      amount: 99999, 
      currency: "usd",
      interval: "year",
      features: [
        "Everything in Professional",
        "Dedicated support",
        "Unlimited storage",
        "Advanced security",
        "SLA guarantee",
        "Custom contracts",
        "On-premise deployment",
      ],
      isPopular: false,
      isActive: true,
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { stripePriceId: plan.stripePriceId },
      update: plan,
      create: plan,
    });
  }

  console.log("Plans seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
