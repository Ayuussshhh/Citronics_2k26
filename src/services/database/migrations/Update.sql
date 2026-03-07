INSERT INTO events (
    name, tagline, description, start_time, end_time, venue,
    max_tickets, ticket_price, registered, prize, tags,
    featured, images, department_id, created_by, category_id ,status, visibility
)
VALUES (
    'EcoVision AI – Poster Making Competition',
    'AI for Sustainable Tomorrow',
    'Visualizing AI for a Sustainable Tomorrow',
    '2026-04-10 10:00:00 Asia/Kolkata',
    '2026-04-10 14:00:00 Asia/Kolkata',
    'Drawing Hall',
    100,
    100.0,
    0,
    'Total up to 5000: 1st 2500, 2nd 1500, 3rd 1000',
    ARRAY['Innovation'],
    FALSE,
    '[]'::jsonb,
    (SELECT id FROM departments WHERE name = 'Core Team'),
    NULL,
    6,
    'published',
    'public'
);


INSERT INTO events (
    name, tagline, description, start_time, end_time, venue,
    max_tickets, ticket_price, registered, prize, tags,
    featured, images, department_id, created_by,category_id , status, visibility
)
VALUES (
    'Palette to Plate',
    'AI for Sustainable Tomorrow',
    '',
    '2026-04-10 10:00:00 Asia/Kolkata',
    '2026-04-10 14:00:00 Asia/Kolkata',
    'Drawing Hall',
    100,
    100.0,
    0,
    'Total up to 5000: 1st 2500, 2nd 1500, 3rd 1000',
    ARRAY['Innovation'],
    FALSE,
    '[]'::jsonb,
    (SELECT id FROM departments WHERE name = 'Core Team'),
    NULL,
    6,
    'published',
    'public'
);

--change name --

UPDATE events
SET name = 'SUSTAINABILITY: The Smart Indore Pitch'
WHERE name = 'Shark Tank: AI theme Indore City Problem';

UPDATE events
SET name = 'ROBO Pick & Place'
WHERE name = 'Line Follower';


UPDATE events
SET name = 'Guess the Monument'
WHERE name = 'Newspaper Tall Structure';

--details updation--

BEGIN;

-- ZENGA Block timing
UPDATE events
SET start_time = '2026-04-10 12:00:00 Asia/Kolkata',
    end_time   = '2026-04-10 16:00:00 Asia/Kolkata'
WHERE name = 'ZENGA Block';

-- Guess the Monument venue
UPDATE events
SET venue = 'Room No 202'
WHERE name = 'Guess the Monument';

-- Youth Parliament venue
UPDATE events
SET venue = 'CDGI Entrance'
WHERE name = 'Youth Parliament';

-- Reel to Deal venue
UPDATE events
SET venue = 'Chanakya Sabhagrah for Judgement'
WHERE name = 'Reel to Deal';

-- Business Ethics timing
UPDATE events
SET start_time = '2026-04-10 10:00:00 Asia/Kolkata',
    end_time   = '2026-04-10 14:00:00 Asia/Kolkata'
WHERE name = 'Business Ethics Decision Making';

-- Brand Quiz venue
UPDATE events
SET venue = 'Chanakya Sabhagrah'
WHERE name = 'Brand Quiz';

COMMIT;








-- add event to events details table--
INSERT INTO event_details (id, event_id, brief, team_size, rules, rounds, prize, document_url)
SELECT
  26,
  e.id,
  'This event focuses on the Fireless Cooking Art among participants. It provides a platform to showcase creativity in cooking, marketing ability, and innovative skills.',
  3,
  ARRAY[
    'The competition will be held from 10:00 AM to 04:00 PM. Participants must arrive 30 minutes before the event for registration and stall setup.',
    'Cooking using fire, gas, or microwave is strictly prohibited.',
    'Participants must bring all required ingredients, utensils, and materials themselves. Organizers will only provide stall space.',
    'The dish must be prepared on the spot during the event time. Pre-cooked food is not allowed except basic items like bread, biscuits, and fruits.',
    'Each participant or team must prepare at least one dish for judging and may prepare extra quantity for selling to visitors.',
    'Participants must maintain proper hygiene and cleanliness at their stall.',
    'Each stall should display the name of the dish and its price if they plan to sell it.',
    'Judging will be based on creativity, taste, presentation, hygiene, and marketing.',
    'Participants must clean their stall area after the event.',
    'Judges'' decision will be final and binding. Any misconduct may lead to disqualification.'
  ],
  0,
  '{"1st": 5000, "2nd": 3000, "3rd": 2000, "total": 10000, "currency": "INR"}'::jsonb,
  'https://res.cloudinary.com/djjboqxal/raw/upload/v1772877947/Palette_to_Plate_Updated_qiv0rh.doc'
FROM events e
WHERE e.name = 'Palette to Plate';




INSERT INTO event_details (id, event_id, brief, team_size, rules, rounds, prize, document_url)
SELECT
27,
e.id,
'Technical quiz, Basic assembly challenge and Identification of auto components.',
2,
ARRAY[
'Participation is open to all students',
'All participants must register before the event deadline',
'The event will be conducted in two rounds',
'Round 1: Technical Quiz',
'Round 2: Basic assembly challenge and Identification of auto components',
'Participants will be evaluated based on predefined technical and performance criteria',
'Any malpractice will lead to disqualification',
'Judges decision will be final and binding'
],
2,
'{"1st":2500,"2nd":1500,"3rd":1000,"total":5000,"currency":"INR"}'::jsonb,
'https://res.cloudinary.com/djjboqxal/raw/upload/v1772878306/Auto_Quest_ak4vg6.doc'
FROM events e
WHERE e.name = 'Auto Quest';


INSERT INTO event_details (id, event_id, brief, team_size, rules, rounds, prize, document_url)
SELECT
28,
e.id,
'Technical Design challenge on AutoCAD or SolidWorks.',
2,
ARRAY[
'Participation is open to all students',
'Registration before deadline is mandatory',
'Round 1: Basic Design',
'Round 2: Simulation',
'Evaluation based on technical performance and design quality',
'Malpractice leads to disqualification',
'Judges decision will be final'
],
2,
'{"1st":2500,"2nd":1500,"3rd":1000,"total":5000,"currency":"INR"}'::jsonb,
'https://res.cloudinary.com/djjboqxal/raw/upload/v1772878305/Battle_of_Design_ncectm.doc'
FROM events e
WHERE e.name = 'Battle of Design'
ON CONFLICT (event_id) DO UPDATE SET
brief = EXCLUDED.brief,
team_size = EXCLUDED.team_size,
rules = EXCLUDED.rules,
rounds = EXCLUDED.rounds,
prize = EXCLUDED.prize;

INSERT INTO event_details (id, event_id, brief, team_size, rules, rounds, prize, document_url)
SELECT
29,
e.id,
'Coding competition testing logical thinking, programming fundamentals and real-time problem solving.',
1,
ARRAY[
'Round 1: Logic League – MCQ based programming fundamentals test',
'Round 2: Code Combat – Practical coding challenge',
'Evaluation based on accuracy, efficiency and problem solving ability'
],
2,
'{"1st":3000,"2nd":1200,"3rd":800,"total":5000,"currency":"INR"}'::jsonb,
'https://res.cloudinary.com/djjboqxal/raw/upload/v1772877946/Codeology_zatdku.doc'
FROM events e
WHERE e.name = 'Codeology'
ON CONFLICT (event_id) DO UPDATE SET
brief = EXCLUDED.brief,
team_size = EXCLUDED.team_size,
rules = EXCLUDED.rules,
rounds = EXCLUDED.rounds,
prize = EXCLUDED.prize;

INSERT INTO event_details (id, event_id, brief, team_size, rules, rounds, prize, document_url)
SELECT
30,
e.id,
'Fun bingo game promoting quick thinking and engagement during the tech fest.',
1,
ARRAY[
'Participants will receive bingo tickets',
'Numbers will be randomly announced',
'Winners determined by patterns like Early Five, Lines and Full House',
'Valid claim verification required'
],
1,
'{"1st":1000,"2nd":1000,"3rd":1000,"4th":1000,"5th":1000,"total":5000,"currency":"INR"}'::jsonb,
'https://res.cloudinary.com/djjboqxal/raw/upload/v1772877926/Tech_Bingo_Tambola_updated_kmj6l6.doc'
FROM events e
WHERE e.name = 'Tech Bingo (Tambola)'
ON CONFLICT (event_id) DO UPDATE SET
brief = EXCLUDED.brief,
team_size = EXCLUDED.team_size,
rules = EXCLUDED.rules,
rounds = EXCLUDED.rounds,
prize = EXCLUDED.prize;

INSERT INTO event_details (id, event_id, brief, team_size, rules, rounds, prize, document_url)
SELECT
31,
e.id,
'Create a marketing reel through a team-based enactment to promote a product or service.',
5,
ARRAY[
'Team of 4-5 members',
'Reel duration must be between 1 and 4 minutes',
'Upload reel on Instagram',
'Mandatory tagging of official CDGI / Citronics page',
'Judging based on creativity, marketing appeal and engagement'
],
1,
'{"1st":2500,"2nd":1500,"3rd":1000,"total":5000,"currency":"INR"}'::jsonb,
'https://res.cloudinary.com/djjboqxal/raw/upload/v1772877946/Reel_to_Deal_updated_wy6jx3.doc'
FROM events e
WHERE e.name = 'Reel to Deal'
ON CONFLICT (event_id) DO UPDATE SET
brief = EXCLUDED.brief,
team_size = EXCLUDED.team_size,
rules = EXCLUDED.rules,
rounds = EXCLUDED.rounds,
prize = EXCLUDED.prize;

INSERT INTO event_details (id, event_id, brief, team_size, rules, rounds, prize, document_url)
SELECT
32,
e.id,
'Strategic brand comparison competition analysing competing brands from the same industry.',
5,
ARRAY[
'Participants compare two competing brands',
'Preparation time 20-30 minutes',
'Presentation must cover market share, strategy and positioning',
'Final verdict on which brand is stronger'
],
1,
'{"1st":2500,"2nd":1500,"3rd":1000,"total":5000,"currency":"INR"}'::jsonb,
'https://res.cloudinary.com/djjboqxal/raw/upload/v1772877947/Clash_of_Titan_updated_jq9ham.doc'
FROM events e
WHERE e.name = 'Clash of Titan'
ON CONFLICT (event_id) DO UPDATE SET
brief = EXCLUDED.brief,
team_size = EXCLUDED.team_size,
rules = EXCLUDED.rules,
rounds = EXCLUDED.rounds,
prize = EXCLUDED.prize;