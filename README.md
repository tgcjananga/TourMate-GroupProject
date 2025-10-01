___
# TourMate
___

TourMate is a comprehensive tour guide web application designed to help tourists efficiently plan their trips in a cost-friendly and time-saving manner. The platform provides route recommendations, hotel suggestions, and detailed information about various places to visit.
### Core Feature
TourMate generates a **detailed schedule** for trips, including accommodations, meal suggestions, and recommended restaurants along the route.

## Features
 + **Personalized Route Planning** : Create optimized itineraries tailored to individual preferences.
 + **Hotel Recommendations** : Get a list of nearby accommodations based on budget, ratings, and 
                          proximity.
 + **Place Details** : Explore detailed descriptions, ratings, and reviews of tourist spots.
 + **Time Management** : Prioritized schedules to make the most of the trip duration.

## Technology Stack
**Frontend**
+ **HTML, CSS, JavaScript** : For a responsive and interactive user interface.
+ **React.js** : Modern web framework for dynamic and scalable UI components.

**Backend**
+ **Spring Boot** : For RESTful APIs and server-side logic.
  
**Database**
+ **MySQL** : To store user data, places, hotels, and routes information.
  
**APIs**
+ [Open Street Map API](https://wiki.openstreetmap.org/wiki/API_v0.6): For route planning and geolocation services.
+ [Booking.com API](https://rapidapi.com/ntd119/api/booking-com18/playground/apiendpoint_3bf55712-c8a7-47ca-bf69-4cf39df9916d) : For Hotels details
+ [Travel Advisor](https://rapidapi.com/apidojo/api/travel-advisor/playground/apiendpoint_29754943-5eb1-4dff-9153-fa9c67a72d9b) : For Attractions and Restaurants details
  
## Installation and Setup
Prerequisites
+ Java 11+
+ Node.js 
+ MySQL
  
### Steps to Run
1. **Clone the repository**

```bash
git clone https://github.com/cepdnaclk/e20-CO227-TourMate
```
2. **Open repository directory**
```bash
cd e20-CO227-TourMate
```
3. **Database Configuration**

+ Update the **application.properties** file in the backend/src/main/resources with your database credentials.
+ run the sql scripts provided in assests/sql/

4. **Backend Setup**

Navigate to the backend directory.
```bash
cd backend
```
Build and run the Spring Boot application

```bash
./mvnw spring-boot:run
```
5. **Frontend Setup**

Navigate to the frontend directory.
```bash
cd frontend
```
Install dependencies and start the development server:
```bash
npm install  
npm start
```

# Project Structure
```
tourmate/  
├── backend/  
│   ├── src/  
│   │   ├── main/  
│   │   └── test/  
│   └── pom.xml  
├── frontend/  
│   ├── src/  
│   ├── public/  
│   └── package.json
├── docs
├── README.md  
```

# Contact
For inquiries, suggestions, or issues, feel free to reach out: [Email1](tharindumapa09@gmail.com) [Email2](e20453@eng.pdn.ac.lk)

# Happy Touring with TourMate! 🌍✈️

