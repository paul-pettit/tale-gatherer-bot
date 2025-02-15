
# MemoryStitch Project Charter

## Project Overview
MemoryStitch is a family storytelling platform that enables multiple generations to share and preserve their stories through an interactive, AI-enhanced experience.

## Core Features

### Authentication & Family Management
- [x] User authentication with email/password
- [x] Profile creation with basic info
- [ ] Family creation and management
- [ ] Member invitations via Telegram (MVP)
- [ ] Future: Email and SMS invitations

### Story Management
- [ ] Story creation with auto-save
- [ ] Draft/published workflow
- [ ] Version control for stories
- [ ] Publishing with irreversible status
- [ ] Comments with real-time updates
- [ ] Threaded conversations

### AI Integration
- [ ] OpenAI-powered interview system
- [ ] Customizable model settings
- [ ] Future: Support for alternative AI providers (DeepSeek, OpenRouter)

### Subscription Tiers
- Basic Family Plan ($20/month)
  - Up to 8 members
  - All core features
- Extended Family Plan ($35/month)
  - Up to 20 members
  - Priority support
  - All core features
- Additional members: $3/month each

## Technical Stack
- Frontend: React with TypeScript
- Backend: Supabase
- AI: OpenAI API (with flexibility for alternatives)
- Real-time: Supabase Realtime
- Database: PostgreSQL (via Supabase)

## Development Phases

### Phase 1 (Current)
- [x] Database schema setup
- [ ] User authentication
- [ ] Family creation
- [ ] Basic profile management

### Phase 2
- [ ] Story creation and management
- [ ] AI interviewer integration
- [ ] Draft/publish workflow

### Phase 3
- [ ] Comments and real-time updates
- [ ] Family member invitations
- [ ] Version control

### Phase 4
- [ ] Subscription management
- [ ] Enhanced AI features
- [ ] Analytics and insights

## Future Enhancements
- Collaborative storytelling features
- Additional AI model support
- Enhanced media support
- Mobile applications
- Advanced analytics
- Export/backup features

## Project Updates
- 2024-03-XX: Initial project setup and database schema
