export const REWARD_TIERS = [
  { min: 0,   max: 40,  emoji: '📞', label: 'Call your parents',                      tier: 1 },
  { min: 41,  max: 80,  emoji: '💃', label: 'Dance session',                           tier: 2 },
  { min: 81,  max: 120, emoji: '🎵', label: 'Watch a music video',                     tier: 3 },
  { min: 121, max: 160, emoji: '🤝', label: 'Meetup with a friend',                    tier: 4 },
  { min: 161, max: 200, emoji: '🎬', label: 'Music video recording & post on Instagram', tier: 5 },
  { min: 201, max: Infinity, emoji: null, label: null,                                  tier: 6 },
];

const TOP_REWARDS = [
  { emoji: '💅', label: 'Colour your hair!' },
  { emoji: '🎸', label: 'Attend a live gig!' },
];

export function calcEffortScore(studyHours, mockScore) {
  return studyHours * 10 + (mockScore - 200) / 6;
}

export function getReward(studyHours, mockScore) {
  const score = calcEffortScore(studyHours, mockScore);
  if (score > 200) {
    const pick = TOP_REWARDS[Math.floor(Math.random() * TOP_REWARDS.length)];
    return { ...pick, tier: 6, effortScore: score };
  }
  const tier = REWARD_TIERS.find(t => score >= t.min && score <= t.max);
  return { ...tier, effortScore: score };
}

export const SLOT_EMOJIS = ['🎰', '⭐', '💫', '🌟', '✨', '🔥', '💎', '🏆', '🎯', '📞', '💃', '🎵', '🤝', '🎬', '💅', '🎸'];
