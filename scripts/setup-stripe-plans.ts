import { stripe } from "@/lib/payments/stripe/config";
import { db } from "@/lib/db";

const PLANS = [
  {
    name: "Starter",
    description: "Perfect for getting started",
    monthlyAmount: 2900, // $29.00
    yearlyAmount: 29900, // $299.00
    features: [
      "Up to 1,000 API calls/month",
      "Basic support",
      "1 project",
      "Email support"
    ],
  },
  {
    name: "Professional",
    description: "For growing businesses",
    monthlyAmount: 7900, // $79.00
    yearlyAmount: 79900, // $799.00
    features: [
      "Up to 100,000 API calls/month",
      "Priority support",
      "Unlimited projects",
      "Advanced analytics",
      "Custom integrations"
    ],
    isPopular: true,
  },
  {
    name: "Enterprise",
    description: "For large scale operations",
    monthlyAmount: 29900, // $299.00
    yearlyAmount: 299900, // $2,999.00
    features: [
      "Unlimited API calls",
      "24/7 dedicated support",
      "Unlimited projects",
      "Advanced security",
      "Custom SLA",
      "Dedicated account manager"
    ],
  },
];

async function setupStripePlans() {
  console.log("🔄 Setting up Stripe plans...\n");

  for (const plan of PLANS) {
    try {
      // Create product in Stripe
      console.log(`📦 Creating product: ${plan.name}`);
      const product = await stripe.products.create({
        name: plan.name,
        description: plan.description,
        metadata: {
          plan_type: plan.name.toLowerCase(),
        },
      });

      console.log(`✅ Product created: ${product.id}\n`);

      // Create monthly price
      console.log(`💰 Creating monthly price for ${plan.name}`);
      const monthlyPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: plan.monthlyAmount,
        currency: "usd",
        recurring: {
          interval: "month",
          interval_count: 1,
        },
      });

      console.log(`✅ Monthly price: ${monthlyPrice.id}`);

      // Create yearly price
      console.log(`💰 Creating yearly price for ${plan.name}`);
      const yearlyPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: plan.yearlyAmount,
        currency: "usd",
        recurring: {
          interval: "year",
          interval_count: 1,
        },
      });

      console.log(`✅ Yearly price: ${yearlyPrice.id}\n`);

      // Create or update plan in database
      const existingPlan = await db.plan.findFirst({
        where: { name: plan.name },
      });

      if (existingPlan) {
        // Update existing plan
        await db.plan.update({
          where: { id: existingPlan.id },
          data: {
            stripeProductId: product.id,
            features: plan.features,
            isPopular: plan.isPopular || false,
          },
        });

        // Update monthly plan
        await db.plan.update({
          where: {
            name_interval: {
              name: plan.name,
              interval: "month"
            }
          },
          data: {
            stripePriceId: monthlyPrice.id,
          },
        });

        // Update yearly plan
        await db.plan.update({
          where: {
            name_interval: {
              name: plan.name,
              interval: "year"
            }
          },
          data: {
            stripePriceId: yearlyPrice.id,
          },
        });
      } else {
        // Create monthly plan
        await db.plan.create({
          data: {
            name: plan.name,
            description: plan.description,
            amount: plan.monthlyAmount,
            currency: "usd",
            interval: "month",
            features: plan.features,
            stripePriceId: monthlyPrice.id,
            stripeProductId: product.id,
            isPopular: plan.isPopular || false,
          },
        });

        // Create yearly plan
        await db.plan.create({
          data: {
            name: plan.name,
            description: plan.description,
            amount: plan.yearlyAmount,
            currency: "usd",
            interval: "year",
            features: plan.features,
            stripePriceId: yearlyPrice.id,
            stripeProductId: product.id,
            isPopular: plan.isPopular || false,
          },
        });
      }

      console.log(`📝 Database updated for ${plan.name}\n`);
    } catch (error) {
      console.error(`❌ Error setting up plan ${plan.name}:`, error);
    }
  }

  console.log("✨ Stripe plans setup complete!");
}

setupStripePlans().catch(console.error);
