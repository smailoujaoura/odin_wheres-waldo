import prisma from "./prisma.js";

async function main() {
  console.log("Cleaning database...");
  await prisma.character.deleteMany();
  await prisma.map.deleteMany();

  console.log("Seeding data...");
  await prisma.map.create({
    data: {
      name: "Dragon Charmers",
      imageUrl: "https://pynkymxvcgzuycbsptfn.supabase.co/storage/v1/object/public/waldo/dragon-charmers-island.webp",
      characters: {
        create: [
          { 
            name: "Dragon", 
            iconUrl: "https://pynkymxvcgzuycbsptfn.supabase.co/storage/v1/object/public/waldo/dragon.png",
            xPct: 0, 
            yPct: 0 
          },
          { 
            name: "Raft Man", 
            iconUrl: "https://pynkymxvcgzuycbsptfn.supabase.co/storage/v1/object/public/waldo/raft-man.png",
            xPct: 0, 
            yPct: 0 
          },
          { 
            name: "Wizard", 
            iconUrl: "https://pynkymxvcgzuycbsptfn.supabase.co/storage/v1/object/public/waldo/wizard.png",
            xPct: 0, 
            yPct: 0
          },
        ]
      }
    }
  });

  console.log("Database seeded! 🚀");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });