import { useState, useEffect } from 'react';
import { Home } from 'lucide-react';

export default function NotFound() {
  const [counter, setCounter] = useState(10);
  
  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [counter]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-9xl font-bold text-blue-500">404</h1>
        
        <div className="w-full flex items-center justify-center my-6">
          <div className="h-px bg-gray-300 w-full"></div>
          <div className="px-4 text-gray-500 font-medium">Page Not Found</div>
          <div className="h-px bg-gray-300 w-full"></div>
        </div>
        
        <p className="text-gray-600 mb-8">
          Oops! The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        
        <a 
          href="/" 
          className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-300 font-medium"
        >
          <Home className="mr-2 h-5 w-5" />
          Back to Homepage
          {counter > 0 && <span className="ml-2 text-sm opacity-75">({counter}s)</span>}
        </a>
      </div>
      
      <div className="mt-8 text-center text-gray-500">
        <p>Need help? <a href="/contact" className="text-blue-500 hover:underline">Contact our support team</a></p>
      </div>
    </div>
  );
}