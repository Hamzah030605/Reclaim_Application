-- Fix user levels based on XP using the proper level system
-- This migration updates all users' levels to match their XP according to the level system

-- Update users with 0-49 XP to level 1
UPDATE users 
SET level = 1 
WHERE xp >= 0 AND xp < 50;

-- Update users with 50-149 XP to level 2
UPDATE users 
SET level = 2 
WHERE xp >= 50 AND xp < 150;

-- Update users with 150-299 XP to level 3
UPDATE users 
SET level = 3 
WHERE xp >= 150 AND xp < 300;

-- Update users with 300-499 XP to level 4
UPDATE users 
SET level = 4 
WHERE xp >= 300 AND xp < 500;

-- Update users with 500-749 XP to level 5
UPDATE users 
SET level = 5 
WHERE xp >= 500 AND xp < 750;

-- Update users with 750-999 XP to level 6
UPDATE users 
SET level = 6 
WHERE xp >= 750 AND xp < 1000;

-- Update users with 1000-1499 XP to level 7
UPDATE users 
SET level = 7 
WHERE xp >= 1000 AND xp < 1500;

-- Update users with 1500-1999 XP to level 8
UPDATE users 
SET level = 8 
WHERE xp >= 1500 AND xp < 2000;

-- Update users with 2000-2499 XP to level 9
UPDATE users 
SET level = 9 
WHERE xp >= 2000 AND xp < 2500;

-- Update users with 2500-2999 XP to level 10
UPDATE users 
SET level = 10 
WHERE xp >= 2500 AND xp < 3000;

-- Update users with 3000-3499 XP to level 11
UPDATE users 
SET level = 11 
WHERE xp >= 3000 AND xp < 3500;

-- Update users with 3500-3999 XP to level 12
UPDATE users 
SET level = 12 
WHERE xp >= 3500 AND xp < 4000;

-- Update users with 4000-4999 XP to level 13
UPDATE users 
SET level = 13 
WHERE xp >= 4000 AND xp < 5000;

-- Update users with 5000-5999 XP to level 14
UPDATE users 
SET level = 14 
WHERE xp >= 5000 AND xp < 6000;

-- Update users with 6000-6999 XP to level 15
UPDATE users 
SET level = 15 
WHERE xp >= 6000 AND xp < 7000;

-- Update users with 7000-7999 XP to level 16
UPDATE users 
SET level = 16 
WHERE xp >= 7000 AND xp < 8000;

-- Update users with 8000-8999 XP to level 17
UPDATE users 
SET level = 17 
WHERE xp >= 8000 AND xp < 9000;

-- Update users with 9000-9999 XP to level 18
UPDATE users 
SET level = 18 
WHERE xp >= 9000 AND xp < 10000;

-- Update users with 10000-11999 XP to level 19
UPDATE users 
SET level = 19 
WHERE xp >= 10000 AND xp < 12000;

-- Update users with 12000+ XP to level 20 (and beyond as needed)
UPDATE users 
SET level = 20 
WHERE xp >= 12000;

-- Ensure no users have negative XP
UPDATE users 
SET xp = 0 
WHERE xp < 0;

-- Ensure no users have level less than 1
UPDATE users 
SET level = 1 
WHERE level < 1;
