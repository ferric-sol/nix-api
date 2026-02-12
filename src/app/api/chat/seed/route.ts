import { NextRequest, NextResponse } from 'next/server';
import { addMessage } from '@/lib/store';

const SEED_SECRET = process.env.SEED_SECRET || '';

// Realistic quit-vaping struggles from "community members"
const PERSONAS = [
  { username: 'jake_2026', style: 'casual bro' },
  { username: 'breathefree', style: 'earnest and hopeful' },
  { username: 'quittr', style: 'sarcastic but trying' },
  { username: 'day1again', style: 'raw and honest' },
  { username: 'clearlung', style: 'motivational' },
  { username: 'nosmoke_nova', style: 'anxious but determined' },
];

const MESSAGES = [
  // Morning cravings
  "woke up and the first thing i wanted was my vape. day 3 tho 💪",
  "morning cravings hit different. made coffee instead. small wins",
  "anyone else's brain try to convince them 'just one hit' at 7am?",
  "3 days clean. my lungs already feel different honestly",
  // Stress/triggers
  "had a brutal day at work. wanted to hit the vape so bad but used the crave button instead",
  "my roommate vapes and it's killing me. had to leave the room twice today",
  "stress at school almost got me. held the button for 30 seconds and the urge passed. this actually works??",
  "got in an argument with my gf and immediately reached for my pocket. muscle memory is real",
  // Progress
  "1 week!! longest i've gone in 2 years. feels unreal",
  "day 5 and i can actually taste food again?? is that a thing?",
  "2 weeks clean 🎉 saving like $40/week too which is nice",
  "hit day 10. the cravings are getting shorter. they used to last 10 min now it's like 2",
  // Late night
  "can't sleep. this is when i'd normally chain vape. just scrolling here instead",
  "midnight craving check in. still going. barely.",
  "the boredom cravings at night are worse than the stress ones during the day imo",
  // Relapses/honesty
  "relapsed at a party last weekend. not gonna lie. but i'm back. day 1 again",
  "slipped up yesterday. felt like shit about it but resetting the streak. we go again",
  "almost bought a disposable today. walked out of the gas station empty handed tho",
  // Encouragement
  "to everyone on day 1 — it gets easier around day 4. promise",
  "if i can quit after 3 years of a pod a day, you can too fr",
  "the crave button sounds dumb but it actually helps. something about holding it down",
  "stay strong tonight everyone. tomorrow you wake up one day stronger 💚",
  // Physical
  "my cough is finally going away. 2 weeks in and i can breathe through my nose again",
  "went for a run today without wheezing for the first time in forever",
  "headaches are brutal this week but everyone says it gets better",
  "day 6: taste buds coming back is wild. a banana tasted amazing??",
  // Community
  "this app is the only reason i haven't caved today tbh",
  "seeing other people's streaks keeps me going ngl",
  "anyone else quit with a friend? accountability partner helps a lot",
  "grateful for this community. my friends don't get it",
];

export async function POST(request: NextRequest) {
  // Auth check
  const auth = request.headers.get('authorization');
  if (!SEED_SECRET || auth !== `Bearer ${SEED_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { username, text } = body;

    // Allow custom message or pick random
    const persona = username 
      ? { username } 
      : PERSONAS[Math.floor(Math.random() * PERSONAS.length)];
    const message = text || MESSAGES[Math.floor(Math.random() * MESSAGES.length)];

    const result = await addMessage(persona.username, message, false);
    return NextResponse.json({ message: result });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
