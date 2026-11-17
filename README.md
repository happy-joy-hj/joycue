# JoyCue

**Context-aware activity recommendations for the moment you're in.**

JoyCue is an in-development full-stack web application that helps people find realistic activities based on their available time, energy, location, budget, and personal interests.

Instead of creating another productivity system or overwhelming users with long task lists, JoyCue focuses on one question:

> What can I do right now?

The application combines a Next.js web interface, PostgreSQL-backed user data, and a Python FastAPI recommendation service that ranks activities using contextual scoring and recommendation history.

## Project Status

🚧 **In development — not production-ready.**

The repository includes implementations of account authentication, interest-based onboarding, activity recommendations, recommendation feedback, and saved activities.

The recommendation engine has automated tests, and GitHub Actions runs quality checks for both the web application and Python service.

A complete end-to-end application workflow and a publicly accessible deployment have not been independently verified.

## Features

### Context-Aware Recommendations

Users can provide their current preferences, including:

- **Available time:** Under 10 minutes, approximately 15, 30, or 60 minutes, or no preference
- **Energy level:** Very low, low, medium, or high
- **Location:** Stay in, go out, or either
- **Budget:** Free, low-cost, or any
- **Personal interests:** Selected during onboarding

The application requests up to three ranked activity recommendations from the recommendation service.

Each recommendation presents an activity, a suggested first step, and available explanations of why it fits the user's context. Activity descriptions are displayed when provided.

### Personalized Ranking

JoyCue uses a deterministic, weighted recommendation algorithm rather than a trained machine learning model.

The recommendation pipeline:

1. Filters out activities that violate supported constraints, such as incompatible locations or paid activities when the user requests free options.
2. Scores eligible activities across time, energy, ease of starting, location, and budget.
3. Adjusts the scoring weights when users have selected interests.
4. Applies penalties for recently recommended activities and previous negative feedback.
5. Sorts activities by their final scores and returns the highest-ranked results.

The baseline scoring weights are:

| Factor           | Weight |
| ---------------- | -----: |
| Time fit         |    25% |
| Energy fit       |    25% |
| Ease of starting |    20% |
| Location fit     |    20% |
| Budget fit       |    10% |

When interests are available, the algorithm uses a separate weighting configuration that allocates 15% to interest matching.

The service also returns score breakdowns and reason codes to explain recommendations.

### Accounts and Activity History

The application includes:

- Email/password and Google sign-in flows using Better Auth
- Interest-based onboarding with PostgreSQL persistence
- Recommendation session history
- "Do this" and "Not for me" feedback actions
- Saving and removing activities for later

Recent recommendation history and negative feedback influence future ranking scores.

The current recommendation flow uses activities from a starter dataset.

## Tech Stack

| Layer                  | Technologies                             |
| ---------------------- | ---------------------------------------- |
| Frontend               | Next.js, React, TypeScript, Tailwind CSS |
| Web API                | Next.js Route Handlers                   |
| Recommendation Service | Python, FastAPI, Pydantic                |
| Database               | PostgreSQL, Prisma                       |
| Authentication         | Better Auth                              |
| Testing                | pytest, FastAPI TestClient               |
| CI                     | GitHub Actions                           |

## Architecture

JoyCue separates its web application from the recommendation service.

**Recommendation request flow:**

1. The Next.js application collects the user's contextual preferences.
2. A Next.js API route retrieves the user's selected interests, active starter activities, and recent recommendation history from PostgreSQL.
3. The web API sends the recommendation request to the FastAPI service.
4. FastAPI filters and ranks activities using weighted scores, interest matching, and history-based penalties.
5. The web API persists the resulting recommendation session and returns the recommendations to the interface.

User authentication, onboarding, recommendation history, and saved activities are handled through the web application and Prisma.

The FastAPI service focuses on validating recommendation requests and calculating ranked results.

## Testing and Continuous Integration

The Python recommendation service includes automated tests covering:

- Activity and context validation
- Candidate filtering
- Weighted scoring and ranking
- Interest-based personalization
- Repetition and feedback penalties
- Recommendation explanations
- FastAPI endpoint responses
- Starter activity data

The repository uses GitHub Actions to run separate validation jobs.

**Recommender service:**

- Install Python dependencies
- Run the pytest test suite

**Web application:**

- Install Node.js dependencies
- Generate the Prisma Client
- Run ESLint
- Build the Next.js application

CI runs on pull requests and pushes to `main`.

Frontend unit tests and full end-to-end integration tests are not currently part of the configured CI workflow.

## Project Structure

```text
joycue/
├── apps/
│   ├── web/              # Next.js application and API routes
│   │   ├── app/          # Pages and API handlers
│   │   ├── components/   # Shared UI components
│   │   ├── lib/          # Authentication and service utilities
│   │   └── prisma/       # Database schema, migrations, and seed
│   └── recommender/      # FastAPI recommendation service
│       ├── app/          # API, models, scoring, and ranking
│       ├── scripts/      # Recommendation evaluation script
│       └── tests/        # Python test suite
├── data/                 # Starter activity dataset
└── README.md
```

## Development and Validation

The repository contains separate dependency configurations for the web application and recommendation service.

**Web application** (`apps/web`):

```bash
npm ci
npx prisma generate
npm run lint
npm run build
```

**Recommendation service** (`apps/recommender`):

```bash
python -m pip install -r requirements.txt
python -m pytest
```

These commands reflect the checks configured in GitHub Actions.

The web application also requires database, authentication, and recommender-service configuration. See [`apps/web/.env.example`](apps/web/.env.example) for the expected environment variables and [`apps/web/prisma/`](apps/web/prisma/) for the database schema, migrations, and seed script.

A complete local installation procedure, including starting both services and verifying database-backed workflows, has not yet been independently validated.

## Known Limitations

- **Development status:** The application has not been verified as production-ready or publicly deployed.
- **Free-text context:** Users can enter additional contextual text, but the current ranking algorithm does not incorporate that text into scoring.
- **Recommendation approach:** Ranking uses configurable rules and weighted scores, not a trained ML model or an LLM.
- **Activity sources:** The current recommendation flow uses the starter activity dataset rather than dynamically generated or user-created activities.
- **Testing coverage:** Automated tests focus on the Python recommendation service. Frontend interactions and complete cross-service workflows have not been covered by automated end-to-end tests.

JoyCue remains an ongoing project focused on practical recommendations, personalization, and maintainable full-stack application development.
