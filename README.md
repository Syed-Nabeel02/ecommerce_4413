# York Store  E-Commerce Platform

-  Github Repository(with sql Script): https://github.com/Syed-Nabeel02/ecommerce_4413
- Deployed link: https://mellow-unicorn-811456.netlify.app/
- Admin credentials
  - Username: admin
  - Password: adminPass

## Setup Guide
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
  - [1. Database Setup](#1-database-setup)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Populate Database](#3-populate-database)
  - [4. Frontend Setup](#4-frontend-setup)
  - [Resources](#resources-used-as-references-for-this-project)
---

## Prerequisites
- **Java Development Kit (JDK)** - Version 17 or higher
- **Apache Maven** - Version 3.6 or higher
- **Node.js** - Version 18 or higher (includes npm)
- **PostgreSQL** - Version 12 or higher
- **pgAdmin** (optional)
  - Usually comes bundled with PostgreSQL installation
- **IntelliJ IDEA** or **Eclipse IDE** (Optional, for IDE-based development)


---
### Backend
- Spring Boot 3.x
- Spring Data JPA
- PostgreSQL Database
- Cloudinary (Image Storage)
### Frontend
- React 18
- Vite
- Redux Toolkit
- React Router
- Axios
- Tailwind CSS
- Material-UI
- TanStack Table

---

## Setup Instructions

### 1. Database Setup

#### Step 1.1: Create PostgreSQL Database

1. Open **pgAdmin** or use the **psql** command line tool
2. Connect to your PostgreSQL server
3. Create a new database named **`ecommerce`**

**Using pgAdmin:**
- Right-click on "Databases" → "Create" → "Database"
- Enter database name: `ecommerce`
- Click "Save"

**Using psql command line:**
```bash
psql -U postgres
CREATE DATABASE ecommerce;
\q
```

#### Step 1.2: Configure Database Credentials

Navigate to the backend configuration file with any IDE and update  PostgreSQL credentials:

**File:** `ecommerce-backend/src/main/resources/application.properties`

```properties
# Update these lines with your PostgreSQL credentials
spring.datasource.username=postgres
spring.datasource.password=POSTGRES_PASSWORD
```

Replace `POSTGRES_PASSWORD` with  actual PostgreSQL password.

---

### 2. Backend Setup

Run the backend application once to automatically create all database tables. Choose one method:

**Option A: Command Line**
```bash
cd ecommerce-backend
mvn clean install
mvn spring-boot:run -DskipTests
```

**Option B: IntelliJ IDEA**
1. File → Open → Select `ecommerce-backend` folder
2. Wait for Maven dependencies to download or go to View → Tool Windows → Maven to manually trigger download or go to pom.xml and click on "Load Maven Changes"
3. Navigate to `src/main/java/com.ecommerce.project/EcommerceApplication.java`
4. Right-click → Run 'EcommerceApplication' (or click green play button)

**Option C: Eclipse IDE**
1. File → Import → Maven → Existing Maven Projects
2. Browse to `ecommerce-backend` folder → Finish
3. Wait for dependencies to download or right-click on the project and select Maven → Update Project
4. Navigate to `src/main/java/com.ecommerce.project/EcommerceApplication.java`
5Right-click project → Run As → Spring Boot App (or Java Application)

**Wait for this message:**
```
Started EcommerceApplication in X.XXX seconds
```

Spring Boot will automatically create all database tables and will create an admin user.

Backend runs on `http://localhost:8080`

---

### 3. Populate Database

Now that the tables are created, we need to add initial data (categories and products).

#### Step 3.1: Open pgAdmin

1. Launch pgAdmin
2. Connect to your PostgreSQL server
3. Navigate to: Databases → ecommerce → Schemas → public → Tables

#### Step 3.2: Open Query Tool

Right-click on the **ecommerce** database and select **"Query Tool"**

#### Step 3.3: Run the Database Script

1. Copy **`Database_script.sql`** (located in the project root directory)
3. Run it in the pgAdmin Query Tool


**The script will:**
- Insert 4 categories (Glendon, Lassonde, Osgoode, Schulich)
- Insert products (T-Shirts, Hoodies, Joggers) with images from Cloudinary
- Create initial product inventory

---

### 4. Frontend Setup

```bash
cd ecom-frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`
---

##Resources used as references for this project:
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- medium.com/@tericcabrel/implement-jwt-authentication-in-a-spring-boot-3-application
- EmbarkX Spring boot Tutorial
- GreatStack react Tutorial
- freecodecamp.org for React and Redux tutorials
- React icon library documentation and components
- Headless UI Documentation and components
- Material-UI Documentation and components
- TanStack Table Documentation and components
- Redux Toolkit Documentation
- icons8.com for icons
- Cloudinary for image storage


