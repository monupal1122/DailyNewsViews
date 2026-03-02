import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import FuzzyText from "../components/FuzzyText";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="text-center">
        <FuzzyText
          baseIntensity={0.2}
          hoverIntensity={0.5}
          enableHover
          className="mb-4 text-4xl font-bold"
        >
          404
        </FuzzyText>
        <p className="mb-4 text-xl text-muted-foreground">
          Oops! Page not found
        </p>
        <a href="/" className="text-white underline hover:text-muted-foreground">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
