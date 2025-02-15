
# MemoryStitch Project Charter

## Project Overview
MemoryStitch is an AI-powered biographical storytelling platform that conducts thoughtful interviews to help users preserve their life stories in a meaningful and engaging way.

## Core Features

### AI Interview System (Primary Focus)
- [ ] Curated question bank with categories
  - Childhood and Roots
  - Family and Close Relationships
  - First Love and Relationships
  - High School and Early Years
  - Career and Aspirations
  - Risk, Adventures, and Growth
  - Reflections and Legacy
- [ ] Interactive AI interviewer
  - Random initial question selection
  - Dynamic follow-up questions
  - Up to 15 questions per session
  - Empathetic and professional tone
- [ ] Story Generation
  - Professional biographical narrative creation
  - User review and modification system
  - Privacy controls (private/shared)
- [ ] Story Enhancement
  - Style and tone adjustments
  - Detail refinement
  - Fact verification

### Family Management (Supporting Features)
- [x] User authentication with email/password
- [x] Profile creation with basic info
- [x] Family creation and management
  - [x] Personal family creation
  - [x] Family member management with roles
  - [ ] Family invitation system
- [ ] Story sharing within families

### Free Tier Management
- [x] Story limits tracking
- [ ] Interview session limits
- [ ] Story revision limits

## Technical Stack
- [x] Frontend: React with TypeScript
- [x] Backend: Supabase
  - [x] Row Level Security (RLS) policies
  - [x] User authentication
  - [x] Database schema
- [ ] AI: OpenAI API for interviewer
- [x] Real-time: Supabase Realtime
- [x] Database: PostgreSQL (via Supabase)

## Development Phases

### Phase 1 (Completed)
- [x] Database schema setup
- [x] User authentication
- [x] Family creation
- [x] Basic profile management
- [x] Initial story creation

### Phase 2 (Current Priority)
- [ ] AI Interview System
  - [ ] Question bank implementation
  - [ ] AI interviewer integration
  - [ ] Story generation and editing
  - [ ] Privacy controls
- [ ] Enhanced story management
  - [ ] Story preview
  - [ ] Version control

### Phase 3 (Upcoming)
- [ ] Family sharing features
- [ ] Enhanced interview capabilities
- [ ] Advanced story formatting
- [ ] Collaborative storytelling

### Phase 4 (Future)
- [ ] Subscription management
- [ ] Enhanced AI features
- [ ] Analytics and insights

## Project Updates
- 2024-03-XX: Initial project setup and database schema
- 2024-03-XX: Implemented authentication and basic profile management
- 2024-03-XX: Added family creation and management
- 2024-03-XX: Implemented story creation with family organization
- 2024-03-XX: Added RLS policies for secure data access

## Security & Data Protection
- [x] Row Level Security (RLS) policies
- [x] Secure family member management
- [x] Protected story access
- [ ] Data encryption at rest
- [ ] Regular security audits
- [ ] GDPR compliance measures
