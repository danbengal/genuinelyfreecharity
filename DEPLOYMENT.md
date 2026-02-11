# Deployment Guide for genuinelyfreecharity.com

## Recent Updates (Feb 2026)

### ✅ Completed Improvements

1. **SQLite Database** — Migrated from PostgreSQL (Neon) to local SQLite
   - Database file: `prisma/dev.db`
   - No external database service needed for local development
   - Seed data included (3 charities, 2 reporting periods, sample allocations)

2. **Mobile Responsiveness** — Fully optimized for all mobile devices
   - iPhone SE (320px) through iPhone 15 Pro Max
   - Responsive typography, spacing, and layouts
   - Large touch targets (48px minimum) for poll options and buttons
   - Smooth animations and transitions
   - Touch-friendly navigation

3. **Working Poll System** — Fully functional voting with restrictions
   - Users can vote once per 24 hours (tracked by cookie + fingerprint)
   - Real-time vote results with animated progress bars
   - Automatic percentage calculations
   - Already-voted state handling with next availability time

4. **Impact Dashboard** — Connected to real database data
   - Total allocated (lifetime)
   - Today / This Month / Last 30 Days breakdowns
   - Last allocation date
   - Organization count
   - All data pulled from actual database

5. **Visual Polish**
   - Smooth CSS animations (fade-in, slide-in)
   - Loading skeletons with proper sizing
   - Error states for all components
   - Better mobile navigation and spacing
   - Proper favicon and Open Graph meta tags for social sharing

6. **API Routes** — All functional and tested
   - `POST /api/poll/vote` — Submit a vote (with rate limiting)
   - `GET /api/poll` — Get current active poll
   - `GET /api/impact` — Dashboard statistics
   - `GET /api/allocations` — Allocation history
   - `GET /api/organizations` — Organization totals
   - Full admin API suite (`/api/admin/*`)

## Database Setup

### Initial Setup

```bash
# Generate Prisma client
npm run postinstall

# Run migrations
npm run db:migrate

# Seed with sample data
npm run db:seed
```

### Database Location

- **Development:** `prisma/dev.db` (SQLite file)
- **Production:** Configure connection string for your database provider

### Schema

The database includes:
- **Poll** — Questions with options and active status
- **PollOption** — Individual poll choices
- **Vote** — User votes (with fingerprint)
- **ParticipationLimit** — 24-hour voting restrictions
- **Recipient** — Charitable organizations
- **ReportingPeriod** — Monthly/custom periods
- **AdSenseRevenueReport** — Ad revenue per period
- **OperatingCost** — Infrastructure costs per period
- **Allocation** — Charitable allocations with proof

## Running the App

### Development

```bash
npm run dev
# Open http://localhost:3000
```

### Production Build

```bash
npm run build
npm run start
```

### Build Status

✅ **Last build: SUCCESS** (Zero errors, zero warnings)

## Poll Rotation (Daily)

Polls can be rotated manually or automatically via cron.

### Manual Rotation

```bash
npx tsx scripts/rotate-poll.ts
```

### Automatic Rotation (Cron)

Add to your crontab to rotate polls daily at midnight:

```bash
# Edit crontab
crontab -e

# Add this line (adjust path):
0 0 * * * cd /path/to/app && npx tsx scripts/rotate-poll.ts >> /var/log/poll-rotation.log 2>&1
```

### Via Admin Panel

1. Go to `/admin`
2. Log in with `ADMIN_PASSWORD` from `.env`
3. Create new polls or toggle active status manually

## Mobile Testing

Tested and optimized for:
- iPhone SE (375x667)
- iPhone 12/13/14 (390x844)
- iPhone 14 Pro Max (430x932)
- iPhone 15 Pro Max (430x932)
- Android devices (320px - 430px wide)

### Key Mobile Features

- Responsive text sizing (sm: / md: / lg: breakpoints)
- Touch-friendly buttons (min 44px tap targets)
- No text overflow or horizontal scrolling
- Optimized spacing and padding
- Native-feeling animations
- Proper viewport meta tags

## Environment Variables

Required in `.env`:

```bash
# Security
SALT_SECRET="your-random-salt-string"
ADMIN_PASSWORD="your-admin-password"

# Optional: Google AdSense
NEXT_PUBLIC_ADSENSE_CLIENT_ID="ca-pub-xxxxxxxxxxxxxxxx"
```

## Deployment Platforms

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

**Note:** For SQLite, you'll need persistent storage. Consider migrating to PostgreSQL (Vercel Postgres) or PlanetScale for production.

### Other Platforms

- **Railway:** Supports SQLite with persistent volumes
- **Fly.io:** Supports SQLite with persistent volumes
- **DigitalOcean App Platform:** Use managed PostgreSQL

## Production Considerations

1. **Database:** Migrate to PostgreSQL for production (update `prisma/schema.prisma`)
2. **File Uploads:** If adding proof document uploads, use S3/Cloudflare R2
3. **Caching:** Add Redis for rate limiting at scale
4. **Monitoring:** Add Sentry or similar for error tracking
5. **Analytics:** Consider privacy-respecting analytics (Plausible, Fathom)

## Next Steps

Optional enhancements:
- [ ] Admin dashboard UI improvements
- [ ] CSV export for all data (already available for allocations)
- [ ] Email notifications for new allocations
- [ ] Public API for transparency data
- [ ] RSS feed for allocations
- [ ] Webhook integration for donation platforms

---

**Questions?** Check the main README.md or open an issue.
