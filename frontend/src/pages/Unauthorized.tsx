import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, Home } from 'lucide-react';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="bg-red-500/10 p-4 rounded-full inline-flex mx-auto">
          <AlertTriangle className="h-16 w-16 text-red-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-foreground">Access Denied</h1>
        
        <div className="bg-background/80 backdrop-blur-sm p-6 rounded-xl border border-border/50 shadow-lg">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-foreground/40" />
          </div>
          
          <p className="text-foreground/80 mb-6">
            You don't have permission to access this resource. This area requires specific privileges that are not associated with your account.
          </p>
          
          <div className="space-y-3">
            <Button 
              variant="default" 
              className="w-full" 
              onClick={() => navigate('/')}
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized; 