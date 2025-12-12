import { DemoExample } from './types';

export const COUNTRIES = [
  "Global / International",
  "United States",
  "United Kingdom",
  "India",
  "Canada",
  "Australia",
  "Brazil",
  "Germany",
  "Japan",
  "South Korea",
  "France",
  "Nigeria",
  "Indonesia"
];

export const DEFAULT_TREND_SNAPSHOT = `Top Hashtags (72h): #corecore, #silentreview, #wholesome, #grwm, #foryou
Trending Audio: "Original Sound - Sped Up", "Classical Bangers", "Lo-Fi Beats to Study To"
Visual Styles: High contrast text overlays, quick cuts (0.5s), saturated colors, retro VHS filters.`;

export const DEMO_EXAMPLES: DemoExample[] = [
  {
    id: 'demo-1',
    title: 'Meme Template',
    type: 'image',
    url: 'https://picsum.photos/seed/meme1/600/600',
    caption: 'Me trying to explain the lore of FNAF to my grandma',
    trendSnapshot: DEFAULT_TREND_SNAPSHOT,
    result: {
      score: 85,
      verdict: 'YES',
      confidence: 0.92,
      rationale: "Strong relatability score. The chaotic energy matches current 'corecore' trends. Visual composition is clean enough for text overlay.",
      top_fixes: ["Increase contrast on text", "Add a grain filter"],
      platform_predictions: [
        { platformName: "Twitter / X", probability: 95 },
        { platformName: "Instagram", probability: 80 },
        { platformName: "Reddit", probability: 85 },
        { platformName: "TikTok", probability: 40 }
      ],
      hashtags: ["#fnaf", "#relatable", "#corecore", "#grandma", "#lore"],
      post_times: ["18:00 Local", "21:30 Local"],
      caption_variants: ["Explaining FNAF lore be like...", "She just wanted a cookie 😭", "The lore runs deep", "Me vs My Grandma's patience"],
      thumbnail_suggestions: ["Close up on face", "Split screen reaction"],
      edit_recipes: ["Add VHS static overlay", "Desaturate background"],
      hook_line: "Me Explaining...",
      trend_match: "Matches 'corecore' chaos and high contrast text style."
    }
  },
  {
    id: 'demo-2',
    title: 'Lifestyle Vlog Clip',
    type: 'video',
    url: 'https://picsum.photos/seed/vlog1/400/700', // Placeholder for video thumb
    caption: 'Morning routine 2024 ✨',
    trendSnapshot: "Trends: #cleangirl #morningroutine #aesthetic. Audio: Acoustic Morning.",
    result: {
      score: 65,
      verdict: 'NO',
      confidence: 0.85,
      rationale: "Pacing is too slow for current retention rates. Lighting is inconsistent. Lacks a clear visual hook in the first 3 seconds.",
      top_fixes: ["Cut intro by 2 seconds", "Color grade to warmer tones", "Sync cuts to beat", "Add on-screen text hook", "Stabilize camera motion", "Increase playback speed 1.2x"],
      platform_predictions: [
        { platformName: "TikTok", probability: 75 },
        { platformName: "Instagram Reels", probability: 65 },
        { platformName: "YouTube Shorts", probability: 50 },
        { platformName: "Twitter / X", probability: 20 }
      ],
      hashtags: ["#morningroutine", "#grwm", "#aesthetic", "#productivity"],
      post_times: ["08:00 Local", "10:00 Local"],
      caption_variants: ["My realistic morning", "5am club struggle", "Morning vibes", "Get ready with me"],
      thumbnail_suggestions: ["Coffee pour shot", "Outfit check mirror", "Bright window lighting"],
      edit_recipes: ["Speed up 1.5x", "Add 'Morning' text overlay at 0:00"],
      hook_line: "Watch This Routine",
      trend_match: "Matches #aesthetic but fails pacing requirements of current meta.",
      video_analysis: {
        attention_drops: [
            { timestamp: "00:00-00:03", reason: "Slow fade in, no movement", fix: "Start mid-action" },
            { timestamp: "00:08", reason: "Shaky footage of coffee", fix: "Use stabilizer or cut" },
            { timestamp: "00:15", reason: "Dead air before speaking", fix: "Jump cut to dialogue" }
        ],
        rewritten_hook: "Don't scroll! Here is exactly why your morning routine is failing you..."
      }
    }
  },
    {
    id: 'demo-3',
    title: 'Indie Music Demo',
    type: 'audio',
    url: 'https://picsum.photos/seed/audio1/500/300', // Placeholder for video thumb
    caption: 'My new track dropped today!',
    trendSnapshot: "Trends: #newmusic #indiepop #bedroompop. Audio Meta: High tempo, catchy chorus loops.",
    result: {
      score: 78,
      verdict: 'YES',
      confidence: 0.88,
      rationale: "Strong hook at 0:05. Production quality fits 'bedroom pop' aesthetic. Tempo is danceable.",
      top_fixes: ["Start immediately with chorus", "Boost bass frequencies"],
      platform_predictions: [
        { platformName: "TikTok", probability: 92 },
        { platformName: "Instagram Reels", probability: 85 },
        { platformName: "YouTube Shorts", probability: 60 },
        { platformName: "SoundCloud", probability: 80 }
      ],
      hashtags: ["#newmusic", "#bedroompop", "#unsignedartist", "#indie"],
      post_times: ["16:00 Local", "20:00 Local"],
      caption_variants: ["Does this sound like summer?", "Wrote this at 3am", "POV: Main character energy", "Song of the summer?"],
      thumbnail_suggestions: ["Album art static", "Lip sync video"],
      edit_recipes: ["Loop the chorus", "Add reverb for dreaminess"],
      hook_line: "Catchy Chorus Loop",
      trend_match: "Fits #bedroompop aesthetic perfectly."
    }
  }
];