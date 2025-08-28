// Test script to verify level system is working correctly
// Run this with: node test-level-system.js

const LEVEL_SYSTEM = [
  // Beginner (0 to 10 days)
  { level: 1, name: "Casual Observer", description: "Just starting the journey", color: "#6B7280", xpRequired: 0 },
  { level: 2, name: "The Curious", description: "Taking first steps", color: "#6B7280", xpRequired: 50 },
  { level: 3, name: "Novice", description: "Growing stronger", color: "#6B7280", xpRequired: 150 },
  { level: 4, name: "Starter", description: "Building foundations", color: "#6B7280", xpRequired: 300 },
  { level: 5, name: "The Explorer", description: "Establishing roots", color: "#6B7280", xpRequired: 500 },
  { level: 6, name: "Beginner Monk", description: "Developing strength", color: "#6B7280", xpRequired: 750 },
  { level: 7, name: "The Initiate", description: "Becoming resilient", color: "#6B7280", xpRequired: 1000 },
  
  // Intermediate (10 to 30 days)
  { level: 8, name: "Beta Warrior", description: "Standing tall", color: "#10B981", xpRequired: 1500 },
  { level: 9, name: "The Disciplined", description: "Gaining wisdom", color: "#10B981", xpRequired: 2000 },
  { level: 10, name: "Silent Seeker", description: "Deeply rooted", color: "#10B981", xpRequired: 2500 },
  { level: 11, name: "The Apprentice", description: "Protecting others", color: "#10B981", xpRequired: 3000 },
  { level: 12, name: "The Resilient", description: "Fighting for change", color: "#10B981", xpRequired: 3500 },
  { level: 13, name: "Self-Mastery Novice", description: "Leading by example", color: "#10B981", xpRequired: 4000 },
  
  // Advanced (30 to 60 days)
  { level: 14, name: "Focused Seeker", description: "Inspiring others", color: "#059669", xpRequired: 5000 },
  { level: 15, name: "The Vanguard", description: "Stories of strength", color: "#059669", xpRequired: 6000 },
  { level: 16, name: "True Monk", description: "Beyond ordinary", color: "#059669", xpRequired: 7000 },
  { level: 17, name: "Pathfinder", description: "Wise beyond years", color: "#059669", xpRequired: 8000 },
  { level: 18, name: "Mentalist", description: "Complete control", color: "#059669", xpRequired: 9000 },
  { level: 19, name: "Ascendant", description: "Unstoppable force", color: "#059669", xpRequired: 10000 },
  
  // Expert (60+ days)
  { level: 20, name: "The Sage", description: "Unbreakable spirit", color: "#047857", xpRequired: 12000 },
  { level: 21, name: "The Titan", description: "Enlightened being", color: "#047857", xpRequired: 14000 },
  { level: 22, name: "Master Monk", description: "Perfect peace", color: "#047857", xpRequired: 16000 },
  { level: 23, name: "The Virtuous", description: "Complete enlightenment", color: "#047857", xpRequired: 18000 },
  { level: 24, name: "Supreme Seeker", description: "Beyond comprehension", color: "#047857", xpRequired: 20000 },
  { level: 25, name: "Zen Master", description: "Ultimate wisdom", color: "#047857", xpRequired: 25000 },
  { level: 26, name: "The Unshakable", description: "Unmovable foundation", color: "#047857", xpRequired: 30000 },
  
  // Ultimate (Top-tier, over 100 days)
  { level: 30, name: "God Mode", description: "Divine presence", color: "#1E40AF", xpRequired: 50000 },
  { level: 35, name: "Legendary Monk", description: "Mythical status", color: "#1E40AF", xpRequired: 75000 },
  { level: 40, name: "The Pure One", description: "Perfect purity", color: "#3730A3", xpRequired: 100000 },
  { level: 45, name: "The Enlightened", description: "Complete awakening", color: "#3730A3", xpRequired: 150000 },
  { level: 50, name: "Samurai of the Mind", description: "Warrior spirit", color: "#7C3AED", xpRequired: 200000 },
  { level: 60, name: "Ascended Master", description: "Transcendent being", color: "#DC2626", xpRequired: 300000 },
  { level: 75, name: "Transcendent One", description: "Beyond mortal limits", color: "#B91C1C", xpRequired: 500000 },
  { level: 100, name: "Supreme Being", description: "Ultimate existence", color: "#7C2D12", xpRequired: 1000000 },
];

function calculateLevelFromXP(xp) {
  // Ensure XP is not negative
  const validXP = Math.max(0, xp);
  
  // Find the highest level that the user qualifies for
  const qualifiedLevels = LEVEL_SYSTEM.filter(level => validXP >= level.xpRequired);
  
  if (qualifiedLevels.length === 0) {
    return 1; // Default to level 1 if no levels qualify
  }
  
  // Return the highest level the user qualifies for, but cap at 100
  const calculatedLevel = Math.max(...qualifiedLevels.map(level => level.level));
  return Math.min(100, calculatedLevel);
}

function getLevelInfo(level) {
  // Ensure level is within valid range
  const validLevel = Math.max(1, Math.min(100, level));
  
  // Find the exact level match first
  const exactMatch = LEVEL_SYSTEM.find(l => l.level === validLevel);
  if (exactMatch) return exactMatch;

  // If no exact match, find the highest level that's less than or equal to the current level
  const availableLevels = LEVEL_SYSTEM.filter(l => l.level <= validLevel);
  if (availableLevels.length > 0) {
    return availableLevels[availableLevels.length - 1];
  }

  // Fallback to the first level
  return LEVEL_SYSTEM[0];
}

// Test cases
const testCases = [
  { xp: 0, expectedLevel: 1 },
  { xp: 25, expectedLevel: 1 },
  { xp: 50, expectedLevel: 2 },
  { xp: 55, expectedLevel: 2 },
  { xp: 150, expectedLevel: 3 },
  { xp: 1000, expectedLevel: 7 },
  { xp: 10007, expectedLevel: 19 }, // This was the problematic case
  { xp: 50000, expectedLevel: 30 },
  { xp: 100000, expectedLevel: 40 },
  { xp: 1000000, expectedLevel: 100 },
  { xp: 2000000, expectedLevel: 100 }, // Should cap at 100
  { xp: -5, expectedLevel: 1 }, // Should handle negative XP
];

console.log("🧪 Testing Level System...\n");

testCases.forEach(({ xp, expectedLevel }) => {
  const calculatedLevel = calculateLevelFromXP(xp);
  const levelInfo = getLevelInfo(calculatedLevel);
  const isCorrect = calculatedLevel === expectedLevel;
  
  console.log(`XP: ${xp} → Level: ${calculatedLevel} (${levelInfo.name}) ${isCorrect ? '✅' : '❌ Expected: ' + expectedLevel}`);
});

console.log("\n📊 Level System Summary:");
console.log(`Total levels defined: ${LEVEL_SYSTEM.length}`);
console.log(`Highest level: ${Math.max(...LEVEL_SYSTEM.map(l => l.level))}`);
console.log(`Lowest XP requirement: ${Math.min(...LEVEL_SYSTEM.map(l => l.xpRequired))}`);
console.log(`Highest XP requirement: ${Math.max(...LEVEL_SYSTEM.map(l => l.xpRequired))}`);

console.log("\n🎯 Key Milestones:");
const milestones = [1, 2, 8, 14, 20, 30, 100];
milestones.forEach(level => {
  const info = getLevelInfo(level);
  console.log(`Level ${level}: ${info.name} (${info.xpRequired} XP)`);
});
