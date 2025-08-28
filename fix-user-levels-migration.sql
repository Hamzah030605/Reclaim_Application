-- Fix user levels based on XP using the proper level system
-- This migration updates all users' levels to match their XP according to the level system

-- First, let's see what levels we have in the database
SELECT DISTINCT level FROM users ORDER BY level;

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

-- Update users with 12000-13999 XP to level 20
UPDATE users 
SET level = 20 
WHERE xp >= 12000 AND xp < 14000;

-- Update users with 14000-15999 XP to level 21
UPDATE users 
SET level = 21 
WHERE xp >= 14000 AND xp < 16000;

-- Update users with 16000-17999 XP to level 22
UPDATE users 
SET level = 22 
WHERE xp >= 16000 AND xp < 18000;

-- Update users with 18000-19999 XP to level 23
UPDATE users 
SET level = 23 
WHERE xp >= 18000 AND xp < 20000;

-- Update users with 20000-24999 XP to level 24
UPDATE users 
SET level = 24 
WHERE xp >= 20000 AND xp < 25000;

-- Update users with 25000-29999 XP to level 25
UPDATE users 
SET level = 25 
WHERE xp >= 25000 AND xp < 30000;

-- Update users with 30000-49999 XP to level 26
UPDATE users 
SET level = 26 
WHERE xp >= 30000 AND xp < 50000;

-- Update users with 50000-74999 XP to level 30
UPDATE users 
SET level = 30 
WHERE xp >= 50000 AND xp < 75000;

-- Update users with 75000-99999 XP to level 35
UPDATE users 
SET level = 35 
WHERE xp >= 75000 AND xp < 100000;

-- Update users with 100000-149999 XP to level 40
UPDATE users 
SET level = 40 
WHERE xp >= 100000 AND xp < 150000;

-- Update users with 150000-199999 XP to level 45
UPDATE users 
SET level = 45 
WHERE xp >= 150000 AND xp < 200000;

-- Update users with 200000-299999 XP to level 50
UPDATE users 
SET level = 50 
WHERE xp >= 200000 AND xp < 300000;

-- Update users with 300000-499999 XP to level 60
UPDATE users 
SET level = 60 
WHERE xp >= 300000 AND xp < 500000;

-- Update users with 500000-999999 XP to level 75
UPDATE users 
SET level = 75 
WHERE xp >= 500000 AND xp < 1000000;

-- Update users with 1000000+ XP to level 100 (max level)
UPDATE users 
SET level = 100 
WHERE xp >= 1000000;

-- Ensure no users have negative XP
UPDATE users 
SET xp = 0 
WHERE xp < 0;

-- Ensure no users have level less than 1
UPDATE users 
SET level = 1 
WHERE level < 1;

-- Ensure no users have level greater than 100 (max level)
UPDATE users 
SET level = 100 
WHERE level > 100;

-- Verify the results
SELECT level, COUNT(*) as user_count, MIN(xp) as min_xp, MAX(xp) as max_xp 
FROM users 
GROUP BY level 
ORDER BY level;
