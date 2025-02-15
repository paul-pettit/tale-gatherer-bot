
# MemoryStitch Project Charter

## Project Overview
MemoryStitch is a family storytelling platform that enables multiple generations to share and preserve their stories through an interactive, AI-enhanced experience.

## Core Features

### Authentication & Family Management
- [x] User authentication with email/password
- [x] Profile creation with basic info
- [x] Family creation and management
  - [x] Personal family creation
  - [x] Family member management with roles
  - [ ] Family invitation system
- [ ] Member invitations via Telegram (MVP)
- [ ] Future: Email and SMS invitations

### Story Management
- [x] Basic story creation
- [x] Draft status support
- [x] Family-based story organization
- [x] Free tier story limits
- [ ] Auto-save functionality
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
- [x] Frontend: React with TypeScript
- [x] Backend: Supabase
  - [x] Row Level Security (RLS) policies
  - [x] User authentication
  - [x] Database schema
- [ ] AI: OpenAI API (with flexibility for alternatives)
- [x] Real-time: Supabase Realtime
- [x] Database: PostgreSQL (via Supabase)

## Development Phases

### Phase 1 (Completed)
- [x] Database schema setup
- [x] User authentication
- [x] Family creation
- [x] Basic profile management
- [x] Story creation with family organization

### Phase 2 (Current)
- [ ] Story management enhancements
  - [ ] Auto-save functionality
  - [ ] Rich text editor
  - [ ] Story preview
- [ ] AI interviewer integration
- [ ] Enhanced draft/publish workflow

### Phase 3 (Upcoming)
- [ ] Comments and real-time updates
- [ ] Family member invitations
- [ ] Version control
- [ ] Story sharing capabilities

### Phase 4 (Future)
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
- 2024-03-XX: Implemented authentication and basic profile management
- 2024-03-XX: Added family creation and management
- 2024-03-XX: Implemented story creation with family organization
- 2024-03-XX: Added RLS policies for secure data access

## Security & Data Protection
- [x] Row Level Security (RLS) for all tables
- [x] Secure family member management
- [x] Protected story access
- [ ] Data encryption at rest
- [ ] Regular security audits
- [ ] GDPR compliance measures

