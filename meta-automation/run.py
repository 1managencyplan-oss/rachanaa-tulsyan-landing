# ─────────────────────────────────────────────
#  META ADS AUTOMATION — MAIN RUNNER
#  One file to control everything
# ─────────────────────────────────────────────

import sys, os, json, schedule, time
from datetime import datetime

os.makedirs("reports", exist_ok=True)

def banner():
    print("""
╔══════════════════════════════════════════════╗
║   🚀 META ADS AUTOMATION — DREAM APP        ║
║   Full Campaign Manager powered by Claude   ║
╚══════════════════════════════════════════════╝
""")

def menu():
    print("""
What do you want to do?

  1️⃣  Generate AI ad copies (Claude)
  2️⃣  Launch new campaign
  3️⃣  Activate paused campaign (go LIVE)
  4️⃣  Check today's performance
  5️⃣  Process new leads + WhatsApp
  6️⃣  View leads summary
  7️⃣  Start auto-scheduler (runs checks every day at 8 PM)
  8️⃣  Run full pipeline (generate → launch → schedule)

  Q   Quit
""")

def run_generate():
    from ad_copy_generator import generate_ad_copies, print_copies
    n = int(input("How many ad variants? (recommended: 3-5): ") or "3")
    copies = generate_ad_copies(n)
    print_copies(copies)
    with open("generated_copies.json", "w") as f:
        json.dump(copies, f, indent=2, ensure_ascii=False)
    print("✅ Saved to generated_copies.json")
    return copies

def run_launch():
    if not os.path.exists("generated_copies.json"):
        print("❌ No copies found. Run option 1 first.")
        return
    with open("generated_copies.json") as f:
        copies = json.load(f)

    img = input("Image path (leave blank to skip): ").strip() or None
    live = input("Go LIVE immediately? (y/N): ").strip().lower() == "y"

    from campaign_launcher import launch_campaign
    launch_campaign(copies, image_path=img, go_live=live)

def run_activate():
    confirm = input("Are you sure you want to go LIVE? (y/N): ").strip().lower()
    if confirm == "y":
        from campaign_launcher import activate_campaign
        activate_campaign()

def run_check():
    from performance_monitor import run_daily_check
    run_daily_check()

def run_leads():
    form_id = input("Enter your Lead Form ID (from Ads Manager): ").strip()
    wati    = input("WATI API key (leave blank to use WhatsApp links): ").strip() or None
    wati_ep = None
    if wati:
        wati_ep = input("WATI endpoint URL: ").strip()
    from lead_manager import process_new_leads
    process_new_leads(form_id, wati, wati_ep)

def run_leads_summary():
    from lead_manager import print_summary
    print_summary()

def run_scheduler():
    print("\n⏰ Auto-scheduler started — runs daily at 8:00 PM")
    print("   (checks stats, optimizes ads, emails report)")
    print("   Press Ctrl+C to stop\n")

    def daily_job():
        print(f"\n🔔 Running daily check — {datetime.now().strftime('%d %b %Y %H:%M')}")
        from performance_monitor import run_daily_check
        run_daily_check()

    schedule.every().day.at("20:00").do(daily_job)

    # Also run leads check every 2 hours
    def leads_job():
        form_id = os.environ.get("META_FORM_ID")
        if form_id:
            from lead_manager import process_new_leads
            process_new_leads(form_id)

    schedule.every(2).hours.do(leads_job)

    while True:
        schedule.run_pending()
        time.sleep(60)

def run_full_pipeline():
    print("\n🚀 Running FULL PIPELINE: Generate → Launch → Schedule\n")
    copies = run_generate()
    input("\n✅ Copies generated! Press Enter to launch campaign...")
    run_launch()
    input("\n✅ Campaign created! Press Enter to start scheduler...")
    run_scheduler()


# ── MAIN ─────────────────────────────────────
if __name__ == "__main__":
    banner()
    while True:
        menu()
        choice = input("Enter choice: ").strip().upper()
        if   choice == "1": run_generate()
        elif choice == "2": run_launch()
        elif choice == "3": run_activate()
        elif choice == "4": run_check()
        elif choice == "5": run_leads()
        elif choice == "6": run_leads_summary()
        elif choice == "7": run_scheduler()
        elif choice == "8": run_full_pipeline()
        elif choice == "Q": print("Bye! 👋"); sys.exit(0)
        else: print("Invalid choice.")
        input("\nPress Enter to continue...")
