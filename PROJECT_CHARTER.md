
# MemoryStitch Project Charter

## Project Overview
MemoryStitch is an AI-powered biographical storytelling platform that conducts thoughtful interviews to help users preserve their life stories in a meaningful and engaging way.

## Style Guide

### Brand Identity
- Logo: White version of Memory Stitcher logo
- Logo placement: Centered in dark brown header area
- Logo dimensions: 48px height (h-12) for desktop, 32px height (h-8) for mobile

### Color Palette
- Primary Background: Warm beige (HSL: 34 33% 90%)
- Header/Logo Background: Rich dark brown (#2C1810)
- Text Colors:
  - Primary Text: Dark (HSL: 30 24% 20%)
  - Muted Text: Medium contrast (HSL: 30 24% 40%)
- UI Elements:
  - Cards: Light beige (HSL: 34 33% 95%)
  - Borders: Soft beige (HSL: 34 33% 80%)
  - Accent: Light beige (HSL: 34 33% 85%)
  - Primary Actions: Warm beige (HSL: 26 60% 85%)

### Design Principles
- Warm and inviting color scheme
- High contrast for the logo area
- Consistent use of beige tones throughout the interface
- Accessible text contrast ratios
- Responsive design with mobile-friendly navigation

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
  - [x] Automatic personal family creation for free tier
  - [x] Family member management with roles (paid tiers only)
  - [ ] Family invitation system (paid tiers only)
  - [x] Family sharing as paid upgrade feature
- [ ] Story sharing within families (paid tiers only)

### Free Tier Management
- [x] Story limits tracking
- [ ] Interview session limits
- [ ] Story revision limits
- [x] Single-user personal family
- [x] Upgrade path to family sharing

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
- [x] Free tier personal family

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
- [ ] Family sharing features (paid tiers)
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
- 2024-03-XX: Implemented free tier personal family and upgrade path

## Security & Data Protection
- [x] Row Level Security (RLS) policies
- [x] Secure family member management
- [x] Protected story access
- [ ] Data encryption at rest
- [ ] Regular security audits
- [ ] GDPR compliance measures

## Subscription Tiers

### Free Tier
- Single-user personal family automatically created
- Limited to 5 stories per month
- Basic story features
- Clear upgrade path to family sharing

### Basic Family Plan
- Up to 8 family members
- Family story sharing
- Collaborative writing
- All core features

### Premium Family Plan
- Up to 20 family members
- Priority support
- All core features
- Advanced analytics
- Priority AI processing
