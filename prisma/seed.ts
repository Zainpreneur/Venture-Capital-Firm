import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PASSWORD = "meridian2024";

async function main() {
  console.log("Seeding Meridian Peak Ventures demo data…");

  // Wipe existing data (order respects FK dependencies).
  await prisma.document.deleteMany();
  await prisma.task.deleteMany();
  await prisma.note.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.companyMetric.deleteMany();
  await prisma.investment.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.portfolioCompany.deleteMany();
  await prisma.distribution.deleteMany();
  await prisma.capitalCall.deleteMany();
  await prisma.commitment.deleteMany();
  await prisma.limitedPartner.deleteMany();
  await prisma.fund.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash(PASSWORD, 10);

  const [avery, noah, priya, jordan] = await Promise.all([
    prisma.user.create({
      data: {
        name: "Avery Kwan",
        email: "avery.kwan@meridianpeak.vc",
        passwordHash,
        role: "PARTNER",
        title: "Managing Partner",
        colorTag: "#c8912a",
      },
    }),
    prisma.user.create({
      data: {
        name: "Noah Feldman",
        email: "noah.feldman@meridianpeak.vc",
        passwordHash,
        role: "ASSOCIATE",
        title: "Associate",
        colorTag: "#3c4d6c",
      },
    }),
    prisma.user.create({
      data: {
        name: "Priya Subramaniam",
        email: "priya.subramaniam@meridianpeak.vc",
        passwordHash,
        role: "ANALYST",
        title: "Analyst",
        colorTag: "#22a878",
      },
    }),
    prisma.user.create({
      data: {
        name: "Jordan Reyes",
        email: "jordan.reyes@meridianpeak.vc",
        passwordHash,
        role: "PARTNER",
        title: "General Partner",
        colorTag: "#d94c5f",
      },
    }),
  ]);

  // -------------------------------------------------------------------
  // Funds
  // -------------------------------------------------------------------
  const fundII = await prisma.fund.create({
    data: {
      name: "Meridian Peak Fund II",
      vintageYear: 2020,
      targetSizeUsd: 80_000_000,
      managementFeePct: 2,
      carryPct: 20,
      status: "HARVESTING",
      closeDate: new Date("2020-06-01"),
      description: "Early-stage fund focused on B2B SaaS and fintech infrastructure.",
    },
  });

  const fundIII = await prisma.fund.create({
    data: {
      name: "Meridian Peak Fund III",
      vintageYear: 2023,
      targetSizeUsd: 150_000_000,
      managementFeePct: 2,
      carryPct: 20,
      status: "INVESTING",
      closeDate: new Date("2023-09-15"),
      description: "Seed through Series B fund investing across AI infrastructure, climate tech, and fintech.",
    },
  });

  // -------------------------------------------------------------------
  // Limited Partners & commitments
  // -------------------------------------------------------------------
  const lpData = [
    { name: "Hallmark University Endowment", type: "ENDOWMENT" as const, country: "USA", email: "invest@hallmarkendowment.org" },
    { name: "Northbridge Family Office", type: "FAMILY_OFFICE" as const, country: "USA", email: "office@northbridgefo.com" },
    { name: "Cascade Pension Partners", type: "INSTITUTIONAL" as const, country: "Canada", email: "ir@cascadepension.ca" },
    { name: "Solstice Fund of Funds", type: "FUND_OF_FUNDS" as const, country: "UK", email: "partners@solsticefof.co.uk" },
    { name: "Anchor Point Insurance Group", type: "CORPORATE" as const, country: "USA", email: "corpdev@anchorpointins.com" },
    { name: "Dr. Elena Marsh", type: "INDIVIDUAL" as const, country: "USA", email: "elena.marsh@privateemail.com" },
  ];

  const lps = await Promise.all(
    lpData.map((lp) => prisma.limitedPartner.create({ data: lp }))
  );

  const commitmentPlan: [number, string, number, Date][] = [
    [0, fundII.id, 12_000_000, new Date("2020-04-01")],
    [1, fundII.id, 6_000_000, new Date("2020-04-15")],
    [2, fundII.id, 15_000_000, new Date("2020-05-01")],
    [0, fundIII.id, 20_000_000, new Date("2023-07-01")],
    [1, fundIII.id, 10_000_000, new Date("2023-07-10")],
    [2, fundIII.id, 25_000_000, new Date("2023-08-01")],
    [3, fundIII.id, 30_000_000, new Date("2023-08-15")],
    [4, fundIII.id, 15_000_000, new Date("2023-09-01")],
    [5, fundIII.id, 2_000_000, new Date("2023-09-10")],
  ];

  for (const [lpIdx, fundId, amountUsd, signedDate] of commitmentPlan) {
    await prisma.commitment.create({
      data: { lpId: lps[lpIdx].id, fundId, amountUsd, signedDate },
    });
  }

  // Capital calls & distributions
  await prisma.capitalCall.createMany({
    data: [
      { fundId: fundII.id, callNumber: 1, purpose: "Initial deployment", amountUsd: 15_000_000, callDate: new Date("2020-07-01"), dueDate: new Date("2020-07-31"), status: "COMPLETE" },
      { fundId: fundII.id, callNumber: 2, purpose: "Follow-on reserves", amountUsd: 10_000_000, callDate: new Date("2021-03-01"), dueDate: new Date("2021-03-31"), status: "COMPLETE" },
      { fundId: fundII.id, callNumber: 3, purpose: "Management fees Q3", amountUsd: 3_000_000, callDate: new Date("2022-09-01"), dueDate: new Date("2022-09-30"), status: "COMPLETE" },
      { fundId: fundIII.id, callNumber: 1, purpose: "Initial deployment", amountUsd: 25_000_000, callDate: new Date("2023-10-01"), dueDate: new Date("2023-10-31"), status: "COMPLETE" },
      { fundId: fundIII.id, callNumber: 2, purpose: "New investments Q2", amountUsd: 18_000_000, callDate: new Date("2024-04-01"), dueDate: new Date("2024-04-30"), status: "COMPLETE" },
      { fundId: fundIII.id, callNumber: 3, purpose: "Follow-on round support", amountUsd: 12_000_000, callDate: new Date("2025-01-15"), dueDate: new Date("2025-02-14"), status: "PARTIAL" },
      { fundId: fundIII.id, callNumber: 4, purpose: "Management fees FY26", amountUsd: 3_000_000, callDate: new Date("2026-07-01"), dueDate: new Date("2026-07-31"), status: "PENDING" },
    ],
  });

  await prisma.distribution.createMany({
    data: [
      { fundId: fundII.id, distributionNumber: 1, amountUsd: 8_000_000, distributionDate: new Date("2023-11-01"), type: "CAPITAL_GAIN" },
      { fundId: fundII.id, distributionNumber: 2, amountUsd: 5_500_000, distributionDate: new Date("2024-12-01"), type: "RETURN_OF_CAPITAL" },
      { fundId: fundII.id, distributionNumber: 3, amountUsd: 4_200_000, distributionDate: new Date("2025-11-01"), type: "CAPITAL_GAIN" },
    ],
  });

  // -------------------------------------------------------------------
  // Portfolio companies
  // -------------------------------------------------------------------
  const companySeeds = [
    {
      name: "Ledgerly",
      tagline: "Automated close & reconciliation for finance teams",
      description:
        "Ledgerly builds AI-assisted close-management software that helps mid-market finance teams reconcile accounts and close the books in days instead of weeks.",
      sector: "Fintech",
      stage: "SERIES_A" as const,
      status: "ACTIVE" as const,
      foundedYear: 2021,
      hqCity: "Austin",
      hqCountry: "USA",
      employeeCount: 42,
      website: "https://ledgerly.example.com",
      round: { fundId: fundIII.id, roundName: "Series A", date: "2024-02-10", invested: 4_500_000, pre: 18_000_000, post: 22_500_000, own: 20, lead: noah.id },
      metrics: [
        { period: "2024-Q2", arr: 1_200_000, revenue: 300_000, gm: 78, burn: 220_000, cash: 6_000_000, hc: 28, runway: 27 },
        { period: "2024-Q4", arr: 2_100_000, revenue: 550_000, gm: 80, burn: 260_000, cash: 5_200_000, hc: 34, runway: 20 },
        { period: "2025-Q2", arr: 3_400_000, revenue: 900_000, gm: 81, burn: 300_000, cash: 4_400_000, hc: 42, runway: 15 },
      ],
      currentValue: 8_500_000,
    },
    {
      name: "Verdant Grid",
      tagline: "Distributed energy management for commercial buildings",
      description:
        "Verdant Grid's platform optimizes on-site battery storage and solar assets for commercial real estate, cutting energy costs and carbon output.",
      sector: "Climate Tech",
      stage: "SEED" as const,
      status: "ACTIVE" as const,
      foundedYear: 2022,
      hqCity: "Denver",
      hqCountry: "USA",
      employeeCount: 18,
      website: "https://verdantgrid.example.com",
      round: { fundId: fundIII.id, roundName: "Seed", date: "2023-11-05", invested: 2_000_000, pre: 8_000_000, post: 10_000_000, own: 20, lead: avery.id },
      metrics: [
        { period: "2024-Q1", arr: 300_000, revenue: 80_000, gm: 55, burn: 140_000, cash: 1_800_000, hc: 10, runway: 13 },
        { period: "2024-Q4", arr: 720_000, revenue: 190_000, gm: 58, burn: 160_000, cash: 1_400_000, hc: 15, runway: 9 },
        { period: "2025-Q3", arr: 1_450_000, revenue: 410_000, gm: 61, burn: 180_000, cash: 2_600_000, hc: 18, runway: 14 },
      ],
      currentValue: 15_000_000,
    },
    {
      name: "Nimbus Compute",
      tagline: "GPU orchestration for AI training workloads",
      description:
        "Nimbus Compute provides a scheduling and orchestration layer that helps AI labs squeeze more utilization out of scarce GPU capacity across clouds.",
      sector: "AI Infrastructure",
      stage: "SERIES_B" as const,
      status: "ACTIVE" as const,
      foundedYear: 2020,
      hqCity: "San Francisco",
      hqCountry: "USA",
      employeeCount: 96,
      website: "https://nimbuscompute.example.com",
      round: { fundId: fundII.id, roundName: "Series B", date: "2022-05-20", invested: 6_000_000, pre: 60_000_000, post: 66_000_000, own: 9, lead: jordan.id },
      metrics: [
        { period: "2024-Q2", arr: 9_000_000, revenue: 2_200_000, gm: 62, burn: 900_000, cash: 22_000_000, hc: 70, runway: 24 },
        { period: "2025-Q1", arr: 14_500_000, revenue: 3_800_000, gm: 65, burn: 1_100_000, cash: 18_000_000, hc: 88, runway: 16 },
        { period: "2025-Q4", arr: 21_000_000, revenue: 5_600_000, gm: 68, burn: 1_300_000, cash: 25_000_000, hc: 96, runway: 19 },
      ],
      currentValue: 42_000_000,
    },
    {
      name: "Harborlight Health",
      tagline: "Remote patient monitoring for chronic care",
      description:
        "Harborlight Health builds connected-device and software infrastructure that lets clinics monitor chronic-care patients between visits.",
      sector: "Healthtech",
      stage: "PRE_SEED" as const,
      status: "ACTIVE" as const,
      foundedYear: 2024,
      hqCity: "Boston",
      hqCountry: "USA",
      employeeCount: 7,
      website: "https://harborlighthealth.example.com",
      round: { fundId: fundIII.id, roundName: "Pre-Seed", date: "2024-08-12", invested: 750_000, pre: 5_000_000, post: 5_750_000, own: 13, lead: priya.id },
      metrics: [
        { period: "2025-Q1", arr: 60_000, revenue: 15_000, gm: 40, burn: 90_000, cash: 900_000, hc: 5, runway: 10 },
        { period: "2025-Q3", arr: 180_000, revenue: 48_000, gm: 45, burn: 110_000, cash: 700_000, hc: 7, runway: 6 },
      ],
      currentValue: 5_750_000,
    },
    {
      name: "Fairwind Logistics",
      tagline: "Route optimization for regional freight carriers",
      description:
        "Fairwind Logistics never found product-market fit beyond its initial pilot customers and wound down operations in 2025.",
      sector: "Logistics",
      stage: "SEED" as const,
      status: "WRITTEN_OFF" as const,
      foundedYear: 2021,
      hqCity: "Chicago",
      hqCountry: "USA",
      employeeCount: 0,
      website: null,
      round: { fundId: fundII.id, roundName: "Seed", date: "2021-09-01", invested: 1_500_000, pre: 6_000_000, post: 7_500_000, own: 20, lead: noah.id },
      metrics: [],
      currentValue: 0,
    },
    {
      name: "Solace Robotics",
      tagline: "Warehouse pick-and-pack automation",
      description:
        "Solace Robotics was acquired by a strategic logistics automation player in 2025, returning 4.2x to Fund II.",
      sector: "Robotics",
      stage: "SERIES_A" as const,
      status: "EXITED" as const,
      foundedYear: 2019,
      hqCity: "Pittsburgh",
      hqCountry: "USA",
      employeeCount: 60,
      website: "https://solacerobotics.example.com",
      round: { fundId: fundII.id, roundName: "Series A", date: "2020-10-01", invested: 3_000_000, pre: 12_000_000, post: 15_000_000, own: 20, lead: jordan.id },
      metrics: [],
      currentValue: 12_600_000,
    },
  ];

  for (const seed of companySeeds) {
    const company = await prisma.portfolioCompany.create({
      data: {
        name: seed.name,
        tagline: seed.tagline,
        description: seed.description,
        website: seed.website,
        logoLabel: seed.name.slice(0, 2).toUpperCase(),
        sector: seed.sector,
        stage: seed.stage,
        status: seed.status,
        foundedYear: seed.foundedYear,
        hqCity: seed.hqCity,
        hqCountry: seed.hqCountry,
        employeeCount: seed.employeeCount,
      },
    });

    await prisma.investment.create({
      data: {
        portfolioCompanyId: company.id,
        fundId: seed.round.fundId,
        leadPartnerId: seed.round.lead,
        roundName: seed.round.roundName,
        investmentDate: new Date(seed.round.date),
        amountInvestedUsd: seed.round.invested,
        preMoneyUsd: seed.round.pre,
        postMoneyUsd: seed.round.post,
        ownershipPct: seed.round.own,
        currentValueUsd: seed.currentValue,
        securityType: "PREFERRED_EQUITY",
        boardSeat: seed.round.invested >= 2_000_000,
      },
    });

    for (const m of seed.metrics) {
      await prisma.companyMetric.create({
        data: {
          portfolioCompanyId: company.id,
          periodDate: new Date(`${m.period.slice(0, 4)}-${m.period.endsWith("Q1") ? "03" : m.period.endsWith("Q2") ? "06" : m.period.endsWith("Q3") ? "09" : "12"}-15`),
          arrUsd: m.arr,
          revenueUsd: m.revenue,
          grossMarginPct: m.gm,
          burnRateUsd: m.burn,
          cashBalanceUsd: m.cash,
          headcount: m.hc,
          runwayMonths: m.runway,
        },
      });
    }

    await prisma.contact.create({
      data: {
        name: `${seed.name.split(" ")[0]} Founder`,
        title: "CEO & Co-Founder",
        organization: seed.name,
        email: `founder@${seed.name.toLowerCase().replace(/\s+/g, "")}.example.com`,
        type: "FOUNDER",
        portfolioCompanyId: company.id,
      },
    });

    await prisma.note.create({
      data: {
        content: `Board sync — reviewed ${m0(seed)} performance and hiring plan for next two quarters.`,
        type: "MEETING",
        authorId: seed.round.lead ?? avery.id,
        portfolioCompanyId: company.id,
      },
    });
  }

  function m0(seed: { name: string }) {
    return seed.name;
  }

  // -------------------------------------------------------------------
  // Deal pipeline
  // -------------------------------------------------------------------
  const dealSeeds = [
    {
      companyName: "Kindling AI",
      tagline: "Voice-first customer support copilot",
      sector: "AI Infrastructure",
      stage: "SEED" as const,
      dealStage: "DUE_DILIGENCE" as const,
      size: 3_000_000,
      valuation: 15_000_000,
      source: "REFERRAL" as const,
      lead: avery.id,
      prob: 60,
      nextStep: "Complete technical diligence with CTO",
      nextStepDate: "2026-09-10",
    },
    {
      companyName: "Terraform Foods",
      tagline: "Precision fermentation protein platform",
      sector: "Foodtech",
      stage: "SERIES_A" as const,
      dealStage: "TERM_SHEET" as const,
      size: 8_000_000,
      valuation: 40_000_000,
      source: "CONFERENCE" as const,
      lead: jordan.id,
      prob: 75,
      nextStep: "Finalize term sheet redlines with lead counsel",
      nextStepDate: "2026-09-05",
    },
    {
      companyName: "Ripple Payments",
      tagline: "Cross-border payouts for marketplaces",
      sector: "Fintech",
      stage: "SEED" as const,
      dealStage: "SCREENING" as const,
      size: 2_500_000,
      valuation: 12_000_000,
      source: "INBOUND" as const,
      lead: noah.id,
      prob: 35,
      nextStep: "Partner screen call",
      nextStepDate: "2026-09-02",
    },
    {
      companyName: "Beacon Analytics",
      tagline: "Supply chain risk analytics for insurers",
      sector: "Insurtech",
      stage: "PRE_SEED" as const,
      dealStage: "SOURCING" as const,
      size: 1_200_000,
      valuation: 7_000_000,
      source: "COLD_OUTREACH" as const,
      lead: priya.id,
      prob: 15,
      nextStep: "Intro call with founders",
      nextStepDate: "2026-09-01",
    },
    {
      companyName: "Glacier Robotics",
      tagline: "Cold-chain inspection drones",
      sector: "Robotics",
      stage: "SEED" as const,
      dealStage: "SCREENING" as const,
      size: 3_500_000,
      valuation: 16_000_000,
      source: "EXISTING_PORTFOLIO" as const,
      lead: noah.id,
      prob: 30,
      nextStep: "Reference calls with pilot customers",
      nextStepDate: "2026-09-08",
    },
    {
      companyName: "Ember Data",
      tagline: "Data observability for streaming pipelines",
      sector: "AI Infrastructure",
      stage: "SEED" as const,
      dealStage: "CLOSED_LOST" as const,
      size: 2_800_000,
      valuation: 14_000_000,
      source: "REFERRAL" as const,
      lead: avery.id,
      prob: 0,
      nextStep: null,
      nextStepDate: null,
      lostReason: "Founder took a competing term sheet at a higher valuation.",
    },
  ];

  for (const d of dealSeeds) {
    const deal = await prisma.deal.create({
      data: {
        companyName: d.companyName,
        tagline: d.tagline,
        sector: d.sector,
        stage: d.stage,
        dealStage: d.dealStage,
        dealSizeSoughtUsd: d.size,
        valuationExpectUsd: d.valuation,
        source: d.source,
        leadPartnerId: d.lead,
        probabilityPct: d.prob,
        nextStep: d.nextStep,
        nextStepDate: d.nextStepDate ? new Date(d.nextStepDate) : null,
        lostReason: (d as any).lostReason ?? null,
      },
    });

    await prisma.contact.create({
      data: {
        name: `${d.companyName.split(" ")[0]} Founder`,
        title: "Co-Founder & CEO",
        organization: d.companyName,
        email: `founder@${d.companyName.toLowerCase().replace(/\s+/g, "")}.example.com`,
        type: "FOUNDER",
        dealId: deal.id,
      },
    });

    await prisma.note.create({
      data: {
        content: `Initial call notes: strong team, ${d.sector.toLowerCase()} market timing looks favorable. Following up on ${d.nextStep ?? "next steps"}.`,
        type: "CALL",
        authorId: d.lead,
        dealId: deal.id,
      },
    });

    await prisma.task.create({
      data: {
        title: d.nextStep ?? "Review deal",
        status: d.dealStage.startsWith("CLOSED") ? "DONE" : "TODO",
        priority: d.prob >= 50 ? "HIGH" : "MEDIUM",
        dueDate: d.nextStepDate ? new Date(d.nextStepDate) : null,
        assigneeId: d.lead,
        dealId: deal.id,
      },
    });
  }

  // A few unattached firm-wide tasks
  await prisma.task.createMany({
    data: [
      { title: "Prepare Q3 LP update letter", priority: "HIGH", status: "IN_PROGRESS", assigneeId: priya.id, dueDate: new Date("2026-09-15") },
      { title: "Renew data room subscription", priority: "LOW", status: "TODO", assigneeId: noah.id, dueDate: new Date("2026-09-30") },
      { title: "Schedule annual LP advisory committee meeting", priority: "MEDIUM", status: "TODO", assigneeId: avery.id, dueDate: new Date("2026-10-05") },
    ],
  });

  // Sample documents
  await prisma.document.createMany({
    data: [
      { name: "Fund III LPA — Executed.pdf", category: "LEGAL", sizeKb: 2400, uploadedById: avery.id, fundId: fundIII.id },
      { name: "Fund III Q2 2026 LP Report.pdf", category: "FINANCIAL", sizeKb: 1800, uploadedById: priya.id, fundId: fundIII.id },
      { name: "Fund II Q2 2026 LP Report.pdf", category: "FINANCIAL", sizeKb: 1650, uploadedById: priya.id, fundId: fundII.id },
    ],
  });

  console.log("Seed complete.");
  console.log(`Demo login: ${avery.email} / ${PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
