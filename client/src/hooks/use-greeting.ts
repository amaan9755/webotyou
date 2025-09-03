import { useState, useEffect } from "react";

export function useGreeting() {
  const [greeting, setGreeting] = useState("Good Evening");

  useEffect(() => {
    function updateGreeting() {
      const now = new Date();
      // Convert to IST (UTC+5:30)
      const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
      const hour = istTime.getHours();
      
      let newGreeting;
      if (hour >= 5 && hour < 12) {
        newGreeting = "Good Morning";
      } else if (hour >= 12 && hour < 17) {
        newGreeting = "Good Afternoon";
      } else if (hour >= 17 && hour < 21) {
        newGreeting = "Good Evening";
      } else {
        newGreeting = "Good Night";
      }
      
      setGreeting(newGreeting);
    }

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return greeting;
}
