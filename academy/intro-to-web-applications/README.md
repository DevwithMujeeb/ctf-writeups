# Introduction to Web Applications — HackTheBox Academy

**Module:** Introduction to Web Applications
**Platform:** HackTheBox Academy
**Status:** ✅ Completed
**Completed:** July 2026

---

## Overview

Introduction to Web Applications covers how modern web applications are built, how they work, and what dangers they introduce into a corporate environment. Coming from a backend development background, this module reframes familiar concepts through a security lens — shifting from "how do I build this" to "how does this get attacked."

A developer thinks about web apps as products. A security engineer thinks about web apps as attack surfaces.

---

## 1. Web Apps vs Websites

A **website** has static pages and therefore does not produce real time changes — content is the same for every user. A **web application** (Web 2.0) presents dynamic content — it is interactive, based on user interaction, and can perform various functionality for the end-user that websites lack.

Web apps are fully functional and can perform various functionality for the end-user while websites lock this type of functionality. Key characteristics of web apps:

- Being modular
- Running on any display size
- Running on any platform without being updated

**Web App vs Native OS App:**

- Version unity — updates happen without pushing to the user
- Does not necessarily need installation
- Native OS apps are usually more capable than web apps
- Hybrid and Progressive web apps bridge this gap

**Why web apps are a major attack surface:** Due to their availability and accessibility, they tend to be vulnerable and offer a vast attack surface. Unlike native apps, web apps are publicly accessible by anyone on the internet — every endpoint is potentially reachable by an attacker.

---

## 2. Web Application Architecture

### Web Application Infrastructure Models

Web Application Infrastructure describes the structure of required components such as the database. There are four main infrastructure models:

**Client-Server (front end and back end):** The client sends requests to the server, the server processes them and responds. All components may be on separate machines.

**One Server (simplest design — straightforward and easy to implement):** The entire web app and their components including the database are hosted on a single server. All eggs in one basket — if the server is compromised, everything is compromised.

**Many Servers — One Database:** This model separates the database into its own database server and allows the web apps' hosting server to access the database server to store and retrieve data. Main advantage is segmentation — compromising the web server doesn't automatically give database access.

**Many Servers — Many Database:** Builds upon Many Servers-One Database model. Serves as backup in case any web server or database goes offline — reduces downtime as much as possible. Also includes serverless web apps or apps that utilize microservices.

### Web Application Components

Web Application Components — the components that make up a web application divided into areas:

- **UI/UX** — what the user sees and interacts with
- **Client** — the browser or app making requests
- **Server** — processes requests and returns responses

### Web Application Architecture (Three-Tier)

**Presentation Layer** — consists of UI process components that enable communication with the application and the system. These can be accessed by the client via web browser and are returned in the form of HTML, JavaScript, and CSS.

**Application Layer** — ensures that all client requests (web browser) are correctly processed, such as authorization, privileges, and data passed on to the client.

**Data Layer** — determines exactly where the required data is stored and can be accessed.

### Microservices and Serverless

**Microservices** are independent components of the web app where in most cases each is programmed for one task. They communicate via APIs and can be scaled independently.

**Serverless** platforms — such as AWS, GCP, Azure etc. — provide application frameworks to build web applications without having to worry about the servers themselves. The cloud provider manages the infrastructure; you deploy functions.

---

## Key Takeaways — Section 1

- Web apps are dynamic and interactive — websites are static
- Web apps are publicly accessible by anyone — every endpoint is a potential attack surface
- One Server architecture is the simplest but most dangerous — all components on one machine
- Many Servers-Many Database provides the most resilience and segmentation
- Three-tier architecture (Presentation, Application, Data) is the standard for modern web apps
- Microservices and serverless reduce infrastructure burden but introduce new attack surfaces (API security, cloud misconfiguration)
