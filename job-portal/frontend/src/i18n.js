import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      // Common
      "welcome": "Welcome",
      "login": "Login",
      "logout": "Logout",
      "register": "Register",
      "dashboard": "Dashboard",
      "jobs": "Jobs",
      "business": "Business",
      "search": "Search",
      "location": "Location",
      "salary": "Salary",
      "apply": "Apply",
      "save": "Save",
      "delete": "Delete",
      "edit": "Edit",
      "view": "View",
      "cancel": "Cancel",
      "submit": "Submit",
      "loading": "Loading...",
      "error": "Error",
      "success": "Success",
      "try_again": "Try Again",
      "phone": "Phone",
      "view_jobs": "View Jobs",
      "no_businesses_found": "No businesses found",
      "no_businesses_description": "There are currently no businesses registered on the platform.",
      
      // Navbar
      "dark_mode": "Dark Mode",
      "light_mode": "Light Mode",
      
      // Landing Page
      "find_your_dream_job": "Find Your Dream Job",
      "connect_with_top_companies": "Connect with top companies and find jobs that perfectly match your skills and aspirations.",
      "browse_jobs": "Browse Jobs",
      "join_as": "Join as",
      "job_seeker": "Job Seeker",
      "employer": "Employer",
      "admin": "Admin",
      "find_your_dream_job_seeker": "Find your dream job and build your career",
      "post_jobs_employer": "Post jobs and find the perfect candidates",
      "manage_platform_admin": "Manage the platform and monitor activity",
      "why_choose_us": "Why Choose Us",
      "millions_of_jobs": "Millions of Jobs",
      "verified_employers": "Verified Employers",
      "career_resources": "Career Resources",
      
      // Registration Page
      "create_account": "Create your account",
      "full_name": "Full Name",
      "email_address": "Email Address",
      "password": "Password",
      "role": "Role",
      "business_name": "Business Name",
      "admin_code": "Admin Code",
      "sign_up": "Sign Up",
      "already_have_account": "Already have an account?",
      "sign_in": "Sign in",
      
      // Login Page
      "sign_in_account": "Sign in to your account",
      "remember_me": "Remember me",
      "forgot_password": "Forgot your password?",
      "dont_have_account": "Don't have an account?",
      
      // Jobs Page
      "find_your_dream_job_title": "Find Your Dream Job",
      "browse_thousands_jobs": "Browse through thousands of job opportunities",
      "keywords": "Keywords",
      "job_title_keywords": "Job title, keywords",
      "city_state": "City, state",
      "radius_km": "Radius: {{radius}} km",
      "sort_by": "Sort by",
      "most_recent": "Most Recent",
      "highest_salary": "Highest Salary",
      "closest_distance": "Closest Distance",
      "min_salary": "Minimum Salary",
      "showing_jobs": "Showing {{count}} job(s)",
      "no_jobs_found": "No jobs found",
      "try_adjusting_search": "Try adjusting your search criteria",
      
      // User Dashboard
      "welcome_user": "Welcome, {{name}}",
      "back_to_jobs": "Back to Jobs",
      "applied_jobs": "Applied Jobs ({{count}})",
      "saved_jobs": "Saved Jobs ({{count}})",
      "applied_on": "Applied on: {{date}}",
      "view_job": "View Job",
      "remove": "Remove",
      "not_applied_jobs": "You haven't applied to any jobs yet.",
      "not_saved_jobs": "You haven't saved any jobs yet.",
      
      // Owner Dashboard
      "employer_dashboard": "Employer Dashboard",
      "post_new_job": "Post New Job",
      "cancel": "Cancel",
      "total_jobs": "Total Jobs",
      "active_jobs": "Active Jobs",
      "total_applicants": "Total Applicants",
      "post_a_new_job": "Post a New Job",
      "job_title": "Job Title",
      "salary_per": "Salary (₹ per {{type}})",
      "city": "City",
      "latitude": "Latitude",
      "longitude": "Longitude",
      "job_description": "Job Description",
      "post_job": "Post Job",
      "your_jobs": "Your Jobs ({{count}})",
      "posted_on": "Posted on: {{date}}",
      "view_applications": "View Applications",
      "status": "Status",
      "not_posted_jobs": "You haven't posted any jobs yet.",
      "post_first_job": "Post your first job",
      
      // Admin Panel
      "admin_dashboard": "Admin Dashboard",
      "manage_users_jobs": "Manage users, jobs and monitor platform activity",
      "total_users": "Total Users",
      "job_seekers": "Job Seekers",
      "employers": "Employers",
      "admins": "Admins",
      "applications": "Applications",
      "recent_activity": "Recent Activity",
      "action": "Action",
      "details": "Details",
      "timestamp": "Timestamp",
      "user_management": "User Management",
      "name": "Name",
      "email": "Email",
      "role": "Role",
      "status": "Status",
      "actions": "Actions",
      "activate": "Activate",
      "deactivate": "Deactivate",
      "job_management": "Job Management",
      "title": "Title",
      "company": "Company",
      "flag": "Flag",
      "remove": "Remove",
      
      // Chat
      "job_chat": "Job Chat",
      "online": "online",
      "no_messages": "No messages yet. Start the conversation!",
      "type_message": "Type your message...",
      "send": "Send"
    }
  },
  hi: {
    translation: {
      // Common
      "welcome": "स्वागत है",
      "login": "लॉग इन करें",
      "logout": "लॉग आउट",
      "register": "रजिस्टर करें",
      "dashboard": "डैशबोर्ड",
      "jobs": "नौकरियां",
      "business": "व्यवसाय",
      "search": "खोज",
      "location": "स्थान",
      "salary": "वेतन",
      "apply": "आवेदन करें",
      "save": "सहेजें",
      "delete": "हटाएं",
      "edit": "संपादित करें",
      "view": "देखें",
      "cancel": "रद्द करें",
      "submit": "जमा करें",
      "loading": "लोड हो रहा है...",
      "error": "त्रुटि",
      "success": "सफलता",
      "try_again": "पुनः प्रयास करें",
      "phone": "फ़ोन",
      "view_jobs": "नौकरियां देखें",
      "no_businesses_found": "कोई व्यवसाय नहीं मिला",
      "no_businesses_description": "वर्तमान में प्लेटफ़ॉर्म पर कोई व्यवसाय पंजीकृत नहीं है।",
      
      // Navbar
      "dark_mode": "डार्क मोड",
      "light_mode": "लाइट मोड",
      
      // Landing Page
      "find_your_dream_job": "अपनी सपनों की नौकरी ढूंढें",
      "connect_with_top_companies": "शीर्ष कंपनियों से जुड़ें और अपने कौशल और अभिलाषाओं के अनुरूप पूरी तरह से मेल खाने वाली नौकरी ढूंढें।",
      "browse_jobs": "नौकरियां ब्राउज़ करें",
      "join_as": "के रूप में शामिल हों",
      "job_seeker": "नौकरी चाहने वाला",
      "employer": "नियोक्ता",
      "admin": "व्यवस्थापक",
      "find_your_dream_job_seeker": "अपनी सपनों की नौकरी ढूंढें और अपना करियर बनाएं",
      "post_jobs_employer": "नौकरियां पोस्ट करें और सही उम्मीदवारों को ढूंढें",
      "manage_platform_admin": "प्लेटफॉर्म का प्रबंधन करें और निगरानी करें",
      "why_choose_us": "हमें क्यों चुनें",
      "millions_of_jobs": "लाखों नौकरियां",
      "verified_employers": "सत्यापित नियोक्ता",
      "career_resources": "करियर संसाधन",
      
      // Registration Page
      "create_account": "अपना खाता बनाएं",
      "full_name": "पूरा नाम",
      "email_address": "ईमेल पता",
      "password": "पासवर्ड",
      "role": "भूमिका",
      "business_name": "व्यवसाय का नाम",
      "admin_code": "व्यवस्थापक कोड",
      "sign_up": "साइन अप करें",
      "already_have_account": "क्या आपके पास पहले से एक खाता है?",
      "sign_in": "साइन इन करें",
      
      // Login Page
      "sign_in_account": "अपने खाते में साइन इन करें",
      "remember_me": "मुझे याद रखें",
      "forgot_password": "क्या आप पासवर्ड भूल गए?",
      "dont_have_account": "क्या आपके पास खाता नहीं है?",
      
      // Jobs Page
      "find_your_dream_job_title": "अपनी सपनों की नौकरी ढूंढें",
      "browse_thousands_jobs": "हजारों नौकरी अवसरों के माध्यम से ब्राउज़ करें",
      "keywords": "खोजशब्द",
      "job_title_keywords": "नौकरी का शीर्षक, खोजशब्द",
      "city_state": "शहर, राज्य",
      "radius_km": "त्रिज्या: {{radius}} किमी",
      "sort_by": "द्वारा क्रमबद्ध करें",
      "most_recent": "सबसे हाल का",
      "highest_salary": "सबसे अधिक वेतन",
      "closest_distance": "निकटतम दूरी",
      "min_salary": "न्यूनतम वेतन",
      "showing_jobs": "{{count}} नौकरी(यां) दिखाई जा रही हैं",
      "no_jobs_found": "कोई नौकरी नहीं मिली",
      "try_adjusting_search": "अपनी खोज के मानदंडों को समायोजित करने का प्रयास करें",
      
      // User Dashboard
      "welcome_user": "स्वागत है, {{name}}",
      "back_to_jobs": "नौकरियों पर वापस जाएं",
      "applied_jobs": "आवेदन की गई नौकरियां ({{count}})",
      "saved_jobs": "सहेजी गई नौकरियां ({{count}})",
      "applied_on": "आवेदन किया गया: {{date}}",
      "view_job": "नौकरी देखें",
      "remove": "हटाएं",
      "not_applied_jobs": "आपने अभी तक किसी भी नौकरी के लिए आवेदन नहीं किया है।",
      "not_saved_jobs": "आपने अभी तक किसी भी नौकरी को सहेजा नहीं है।",
      
      // Owner Dashboard
      "employer_dashboard": "नियोक्ता डैशबोर्ड",
      "post_new_job": "नई नौकरी पोस्ट करें",
      "cancel": "रद्द करें",
      "total_jobs": "कुल नौकरियां",
      "active_jobs": "सक्रिय नौकरियां",
      "total_applicants": "कुल आवेदनकर्ता",
      "post_a_new_job": "एक नई नौकरी पोस्ट करें",
      "job_title": "नौकरी का शीर्षक",
      "salary_per": "वेतन (₹ प्रति {{type}})",
      "city": "शहर",
      "latitude": "अक्षांश",
      "longitude": "देशांतर",
      "job_description": "नौकरी का विवरण",
      "post_job": "नौकरी पोस्ट करें",
      "your_jobs": "आपकी नौकरियां ({{count}})",
      "posted_on": "पोस्ट किया गया: {{date}}",
      "view_applications": "आवेदन देखें",
      "status": "स्थिति",
      "not_posted_jobs": "आपने अभी तक कोई नौकरी पोस्ट नहीं की है।",
      "post_first_job": "अपनी पहली नौकरी पोस्ट करें",
      
      // Admin Panel
      "admin_dashboard": "व्यवस्थापक डैशबोर्ड",
      "manage_users_jobs": "उपयोगकर्ताओं, नौकरियों का प्रबंधन करें और प्लेटफॉर्म गतिविधि की निगरानी करें",
      "total_users": "कुल उपयोगकर्ता",
      "job_seekers": "नौकरी चाहने वाले",
      "employers": "नियोक्ता",
      "admins": "व्यवस्थापक",
      "applications": "आवेदन",
      "recent_activity": "हाल की गतिविधि",
      "action": "कार्रवाई",
      "details": "विवरण",
      "timestamp": "टाइमस्टैम्प",
      "user_management": "उपयोगकर्ता प्रबंधन",
      "name": "नाम",
      "email": "ईमेल",
      "role": "भूमिका",
      "status": "स्थिति",
      "actions": "कार्रवाइयां",
      "activate": "सक्रिय करें",
      "deactivate": "निष्क्रिय करें",
      "job_management": "नौकरी प्रबंधन",
      "title": "शीर्षक",
      "company": "कंपनी",
      "flag": "झंडा",
      "remove": "हटाएं",
      
      // Chat
      "job_chat": "नौकरी चैट",
      "online": "ऑनलाइन",
      "no_messages": "अभी तक कोई संदेश नहीं। बातचीत शुरू करें!",
      "type_message": "अपना संदेश टाइप करें...",
      "send": "भेजें"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;