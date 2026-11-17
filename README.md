# National Digitized Discovery Platform for Startup (NDDPS)
**Final Year Project | Project ID: 2026-27-WD-04**  
**Academic Milestone: Phase 1 (Target: November 2026)**

---

## 👥 Team Members & Module Division

| Member | Role | Module | Key Deliverables |
|---|---|---|---|
| **Aditya Jatav** | Backend & API Developer | **Module A: Startup Registration & Admin Moderation** | Auth JWT (`/api/auth`), Startup Profile CRUD (`/api/startups`), Startup Schema, Admin Verification API (`/api/admin/startups/pending`, `verify`) |
| **Arjun Kumar** | Frontend Functionality Developer | **Module B: Resource Discovery & Search Module** | Real-time SearchBar, Multi-faceted FilterPanel (Domain, Stage, Location, Status), StartupCard grid, Pagination & Sort controls |
| **Arushi Khatri** | Frontend UI/UX Developer | **Module C: Recommendation Engine & Startup Profile UI** | Detailed Startup Profile Page, Recommendation Cards UI with Match Score %, Responsive Landing Page with Ecosystem stats, Navbar/Footer layout |
| **Anushri Jain** | Database Developer | **Module D: Scheme & Policy Mapping, Analytics & Insights** | Scheme & Resource schemas, Seed data (12 authentic Indian schemes, 18 realistic startups), Scheme Mapping query logic (`/api/schemes/map/:id`), Aggregation queries (`/api/analytics/overview`) |

---

## 🚀 Key Architectural Highlights

1. **Full-Stack MERN Architecture**:
   - **Frontend**: React 18/19, Vite 6, Tailwind CSS, Lucide React icons, React Router DOM v6.
   - **Backend**: Node.js, Express.js, Mongoose, JWT, bcryptjs, CORS, dotenv.
   - **Architecture**: Clean MVC on backend (`/models`, `/controllers`, `/routes`, `/middleware`, `/seed`, `/utils`) and modular frontend (`/components`, `/pages`, `/context`, `/services`).

2. **Zero-Crash In-Memory Fallback Store (`utils/inMemoryStore.js`)**:
   - The backend attempts to connect to MongoDB (`mongodb://127.0.0.1:27017/startup_discovery`) with a graceful timeout.
   - **If MongoDB is running**: Automatically connects and seeds if collections are empty.
   - **If MongoDB service is NOT running**: The backend automatically activates the In-Memory Data Store fallback without crashing. All 100% of APIs, search, multi-filters, CRUD operations, authentication, admin moderation, and analytics work seamlessly!

---

## 📦 How to Run

### Quick Start (Windows)
Double-click `run-demo.bat` in the project root to start both backend and frontend servers automatically in separate windows.

### Manual Start

#### 1. Backend Server
```bash
cd backend
npm install
npm start
```
*Backend runs on `http://localhost:5000` (Health check: `http://localhost:5000/api/health`)*

#### 2. Frontend Application
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173` (with Vite API proxy to port 5000)*

---

## 🔑 Login Credentials

| Role | Email | Password | Access |
|---|---|---|---|
| **Admin (DPIIT Moderator)** | `admin@nddps.gov.in` | `Admin@123` | Full access, Admin Moderation Panel, Verify/Approve/Reject startups |
| **Startup Founder** | `rahul@startupindia.com` | `Startup@123` | Register startups, manage profile, view recommendations |

---

## 📋 Features Walkthrough

### 1. Startup Registration & Admin Moderation (Module A)
- Register as a startup founder or sign in at `/login`.
- Registered startups initially receive `Pending` verification status.
- Admin (`admin@nddps.gov.in`) can access `/admin` to review pending startups and approve or reject them with moderator remarks.
- Startup founders can create, view, update, and delete their startup profiles.

### 2. Startup Discovery, Real-Time Search & Filtering (Module B)
- Real-time debounced keyword search bar at `/discover` searching across startup names, taglines, domains, and descriptions.
- Multi-faceted filter sidebar by Industry/Domain, Funding Stage, State/City, and Verification Status.
- Responsive grid cards showing domain tags, verification status badges, team size, location, and matched scheme count.
- Dynamic sorting (*Newest First*, *Oldest First*, *Alphabetical A-Z*, *Funding Stage*) and pagination controls.

### 3. Startup Profiles & Government Scheme Recommendations (Module C)
- Comprehensive profile view at `/startup/:id` displaying founder information, DPIIT registration, problem/solution overview, and metrics.
- Recommendation engine matching startups with government schemes and calculating **Match Score %** based on domain, funding stage, and location.
- Startup owners can edit their profile via an inline modal.
- Modern ecosystem landing page with stats, quick domain pills, and featured startups.

### 4. Government Schemes & Ecosystem Analytics (Module D)
- Explore 12+ authentic Indian schemes at `/schemes` (*Startup India Seed Fund Scheme, NIDHI-PRAYAS, MeitY TIDE 2.0, iStart Rajasthan, BIRAC BIG Grant*, etc.).
- Aggregated ecosystem analytics at `/analytics` visualizing startup distributions across domains, funding stages, states, and verification statuses.
