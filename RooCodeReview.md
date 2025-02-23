w   # Roo Code Review - Memory Stitcher Project

## Project Overview

Memory Stitcher is an AI-powered biographical storytelling platform that conducts thoughtful interviews to help users preserve their life stories. It leverages React for the frontend, Supabase for the backend, and OpenAI API for AI functionalities.

## Technical Details and Findings

### Supabase Edge Functions Review

I have reviewed the following Supabase Edge Functions to understand the project's backend logic and connections to external services:

*   **`supabase/functions/ai-interviewer/index.ts`**:
    *   **Purpose**: This is the primary function for conducting AI interviews. It handles generating interview questions and responses using the OpenAI API.
    *   **Key Features**:
        *   Integrates with OpenAI's `gpt-4o` model.
        *   Fetches system prompts and user profiles from Supabase to provide context to the AI.
        *   Manages user credits, deducting credits for each interview session.
        *   Logs prompt usage, costs, and errors in the `prompt_logs` table in Supabase.
        *   Implements CORS headers for cross-origin requests.
    *   **Connections**:
        *   **OpenAI API**: Uses the OpenAI API to generate interview responses.
        *   **Supabase Database**: Interacts with Supabase to:
            *   Fetch system prompts from the `system_prompts` table.
            *   Retrieve user profiles from the `profiles` table.
            *   Update user credits in the `profiles` table.
            *   Log prompt usage in the `prompt_logs` table.
    *   **Environment Variables**: Requires `OPENAI_API_KEY`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` to be configured.

*   **`supabase/functions/create-checkout/index.ts`**:
    *   **Purpose**: Creates Stripe checkout sessions for user subscriptions.
    *   **Key Features**:
        *   Integrates with the Stripe API to create checkout sessions.
        *   Fetches user profiles from Supabase to retrieve Stripe customer IDs.
        *   Creates new Stripe customers if they don't exist and updates the user profile with the Stripe customer ID.
        *   Handles credit package details and metadata for Stripe sessions.
        *   Defines success and cancel URLs for the checkout process.
    *   **Connections**:
        *   **Stripe API**: Uses the Stripe API to create customers and checkout sessions.
        *   **Supabase Database**: Interacts with Supabase to:
            *   Fetch user profiles from the `profiles` table.
            *   Update user profiles with Stripe customer IDs.
            *   Retrieve credit package details from the `credit_packages` table.
    *   **Environment Variables**: Requires `STRIPE_SECRET_KEY`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY`.

*   **`supabase/functions/create-credit-checkout/index.ts`**:
    *   **Purpose**: Creates Stripe checkout sessions specifically for purchasing credits.
    *   **Key Features**:
        *   Similar to `create-checkout`, but tailored for one-time credit purchases.
        *   Verifies Stripe price IDs and ensures they are active and of the correct type ("one-time").
        *   Creates a `credit_purchases` record in Supabase with a "pending" status.
        *   Includes metadata in the Stripe session to link the purchase back to the user and credit package.
    *   **Connections**:
        *   **Stripe API**: Uses the Stripe API to create prices, customers, and checkout sessions.
        *   **Supabase Database**: Interacts with Supabase to:
            *   Fetch user profiles from the `profiles` table.
            *   Update user profiles with Stripe customer IDs.
            *   Retrieve credit package details from the `credit_packages` table.
            *   Create records in the `credit_purchases` table.
    *   **Environment Variables**: Requires `STRIPE_SECRET_KEY`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY`.

*   **`supabase/functions/stripe-webhook/index.ts`**:
    *   **Purpose**: Handles Stripe webhook events to process successful payments and update the application state.
    *   **Key Features**:
        *   Verifies the Stripe webhook signature to ensure event authenticity.
        *   Listens for `checkout.session.completed` events.
        *   Updates the `credit_purchases` record status to "completed" upon successful payment.
        *   Uses an RPC function `add_credits` to grant credits to the user's profile.
    *   **Connections**:
        *   **Stripe API**: Used for webhook event verification.
        *   **Supabase Database**: Interacts with Supabase to:
            *   Update records in the `credit_purchases` table.
            *   Call the `add_credits` RPC function to update user credits in the `profiles` table.
    *   **Environment Variables**: Requires `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SIGNING_SECRET`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY`.

*   **`supabase/functions/interview/index.ts`**:
    *   **Purpose**: An older version of the AI interviewer function.
    *   **Key Features**:
        *   Similar to `ai-interviewer` but uses the older `gpt-4` model.
        *   Functionally similar to `ai-interviewer` in terms of prompt processing, context handling, and logging.
    *   **Connections**:
        *   **OpenAI API**: Uses the OpenAI API with `gpt-4` model.
        *   **Supabase Database**: Interacts with Supabase in a similar way to `ai-interviewer`.
    *   **Environment Variables**: Requires `OPENAI_API_KEY`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY`.

*   **`supabase/functions/interview-chat/index.ts`**:
    *   **Purpose**: Another iteration of the AI interviewer, possibly for a more chat-oriented interface.
    *   **Key Features**:
        *   Uses `gpt-4o-mini` model.
        *   Focuses on empathetic and concise follow-up questions in a chat context.
        *   Saves chat messages in the `chat_messages` table.
        *   Logs interactions in `prompt_logs`.
    *   **Connections**:
        *   **OpenAI API**: Uses the OpenAI API with `gpt-4o-mini` model.
        *   **Supabase Database**: Interacts with Supabase to:
            *   Fetch chat sessions and related story data from `chat_sessions` and `stories` tables.
            *   Retrieve previous chat messages from `chat_messages` table.
            *   Save new user and AI messages in `chat_messages` table.
            *   Log prompt usage in `prompt_logs`.
    *   **Environment Variables**: Requires `OPENAI_API_KEY`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY`.

### Supabase Database Schema Review

*   **`add_credits` function**:
    *   **Signature**: `add_credits(p_user_id UUID, p_credits INTEGER)`
    *   **Purpose**: RPC function to add credits to a user's `purchased_story_credits` balance in the `profiles` table.
    *   **Details**:
        ```sql
        CREATE OR REPLACE FUNCTION add_credits(p_user_id UUID, p_credits INTEGER)
        RETURNS void
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          UPDATE profiles
          SET purchased_story_credits = COALESCE(purchased_story_credits, 0) + p_credits
          WHERE id = p_user_id;
        END;
        $$;
        ```
    *   **Security**: `SECURITY DEFINER` - runs with definer's permissions, used to securely update user credits.

### Frontend Code Review

*   **`src/pages/auth/index.tsx` (Authentication Page)**:
    *   **Purpose**: Handles user signup and sign-in.
    *   **Key Features**:
        *   Uses `supabase.auth.signUp` and `supabase.auth.signInWithPassword` for authentication.
        *   Manages form state using `useState` and provides context using `AuthFormProvider`.
        *   Inserts additional profile information during signup into `profile_field_values` table.
        *   Uses `sonner` for toast notifications and `react-router-dom` for navigation.
    *   **Connections**:
        *   **Supabase Auth**: Directly uses `supabase.auth` for authentication.
        *   **Supabase Database**: Interacts with `profile_fields` and `profile_field_values` tables during signup.
    *   **Components**:
        *   `AuthForm`: UI component for the authentication form.
        *   `AuthFormProvider`: Context provider for authentication form state.

### Environment Variables

The following environment variables are used in the project:

*   `OPENAI_API_KEY`: OpenAI API key for accessing OpenAI models.
*   `STRIPE_SECRET_KEY`: Stripe API secret key for interacting with the Stripe API.
*   `STRIPE_WEBHOOK_SIGNING_SECRET`: Stripe webhook signing secret for verifying Stripe webhook events.
*   `SUPABASE_URL`: URL of the Supabase instance.
*   `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key for secure access to the Supabase API.

### Summary of Findings (Updated)

*   **Supabase as Backend**: Supabase is central to the project, handling authentication, database management, and edge function execution.
*   **Stripe Integration**: Stripe is used for handling payments and subscriptions, with edge functions managing checkout sessions and webhook events.
*   **OpenAI Integration**: OpenAI API powers the AI interview system, with different edge functions utilizing various OpenAI models (`gpt-4o`, `gpt-4`, `gpt-4o-mini`).
*   **Environment Variables**: Securely managing environment variables is crucial for API keys and Supabase credentials.
*   **Payment Workflow**: The payment workflow involves creating checkout sessions, handling webhook events, and updating user credits and purchase statuses in Supabase.
*   **AI Interview Workflow**: The AI interview workflow involves fetching prompts and user context from Supabase, interacting with the OpenAI API, and logging interactions and credit usage.
*   **`add_credits` RPC Function**: A secure function to add credits to user profiles, used in the payment processing flow.
*   **Frontend Authentication**: Frontend uses `supabase.auth` for signup and sign-in, and manages user profile data.

I have now completed the review of the project, including the project charter, Supabase and edge endpoint connections, database schema, frontend code, and environment variables. The findings have been documented in `RooCodeReview.md`.