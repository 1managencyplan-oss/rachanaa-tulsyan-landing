# ─────────────────────────────────────────────
#  META ADS AUTOMATION — CONFIG
#  Fill in your credentials before running
# ─────────────────────────────────────────────

# ── STEP 1: Get from business.facebook.com/settings → Accounts → Ad Accounts
AD_ACCOUNT_ID = "act_XXXXXXXXXXXXXXX"   # e.g. act_123456789

# ── STEP 2: Get from developers.facebook.com → My Apps → Access Tokens
ACCESS_TOKEN  = "YOUR_LONG_LIVED_ACCESS_TOKEN"

# ── STEP 3: Your Facebook Page ID (facebook.com/settings → Page Info)
PAGE_ID       = "YOUR_PAGE_ID"

# ── STEP 4: Your Instagram Account ID (linked to the Page above)
INSTAGRAM_ACTOR_ID = "YOUR_INSTAGRAM_ID"   # optional — remove if no IG

# ── STEP 5: Anthropic API key (claude.ai → API → Keys)
ANTHROPIC_API_KEY = "sk-ant-XXXXXXXXXXXXXXX"

# ── CAMPAIGN SETTINGS ────────────────────────
CAMPAIGN_NAME   = "Dream App Workshop – Rs 249"
DAILY_BUDGET    = 300          # rupees per day (minimum 57)
MAX_DAILY_SPEND = 1000         # safety cap – auto-pauses if exceeded
TARGET_CPL      = 80           # target cost-per-lead in Rs

# ── LANDING PAGE ─────────────────────────────
LANDING_PAGE_URL = "https://yourdomain.com/"   # your landing page URL

# ── AUDIENCE TARGETING ───────────────────────
TARGETING = {
    "geo_locations": {
        "countries": ["IN"],
        "cities": [
            {"key": "2295359", "name": "Mumbai"},
            {"key": "2295424", "name": "Delhi"},
            {"key": "2295420", "name": "Bangalore"},
            {"key": "2295388", "name": "Pune"},
            {"key": "2295445", "name": "Hyderabad"},
            {"key": "2295382", "name": "Ahmedabad"},
            {"key": "2295430", "name": "Surat"},
            {"key": "2295401", "name": "Jaipur"},
        ],
    },
    "age_min": 22,
    "age_max": 50,
    "genders": [0],   # 0 = all, 1 = male, 2 = female
    "interests": [
        {"id": "6003232518610", "name": "Entrepreneurship"},
        {"id": "6003195797498", "name": "Small business"},
        {"id": "6003394950498", "name": "Mobile app"},
        {"id": "6003121108198", "name": "Startup company"},
        {"id": "6003143961621", "name": "Business"},
    ],
    "publisher_platforms": ["facebook", "instagram"],
    "facebook_positions": ["feed", "story", "reels"],
    "instagram_positions": ["stream", "story", "reels"],
}

# ── WHATSAPP AUTO-REPLY ───────────────────────
WHATSAPP_NUMBER = "+91XXXXXXXXXX"      # your WhatsApp number with country code
WHATSAPP_MSG = (
    "Hi! 👋 Thanks for your interest in the *Dream App Workshop*!\n\n"
    "🚀 Learn to build your dream app in just 30 minutes using AI — no coding needed!\n\n"
    "📅 *Workshop Details:*\n"
    "• Live Online Session\n"
    "• Price: Only ₹249\n"
    "• Money Back Guarantee\n\n"
    "👉 *Book your seat here:* {landing_page}\n\n"
    "Any questions? Just reply here! 😊"
)

# ── NOTIFICATION EMAIL ────────────────────────
NOTIFY_EMAIL = "palashrajak21@gmail.com"   # get daily reports here

# ── OPTIMIZATION RULES ───────────────────────
PAUSE_AD_IF_CPL_ABOVE = 150     # Rs — pause ad if cost per lead > this
SCALE_AD_IF_CPL_BELOW = 50      # Rs — increase budget if CPL < this
SCALE_BUDGET_BY       = 1.20    # 20% budget increase when scaling
MIN_LEADS_TO_OPTIMIZE = 10      # don't optimize until this many leads
