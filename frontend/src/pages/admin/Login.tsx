import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Zap, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { authService } from '@/lib/api';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [debugInfo, setDebugInfo] = useState('');

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('pixel_to_perfection_token');
    const user = localStorage.getItem('pixel_to_perfection_user');
    
    if (token && user) {
      try {
        const userData = JSON.parse(user);
        setDebugInfo(`Found existing user: ${userData.name}, role: ${userData.role}`);
        if (userData.role === 'admin') {
          navigate('/admin/dashboard');
        }
      } catch (err) {
        // Invalid user data in localStorage
        localStorage.removeItem('pixel_to_perfection_token');
        localStorage.removeItem('pixel_to_perfection_user');
        setDebugInfo('Invalid user data in localStorage');
      }
    } else {
      setDebugInfo('No user found in localStorage');
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setDebugInfo('Attempting login...');
    
    try {
      // Make actual API call
      setDebugInfo(`Sending request to API for ${formData.email}`);
      const data = await authService.login(formData.email, formData.password);
      
      setDebugInfo(`Response received: ${JSON.stringify(data.user)}`);
      
      // Verify that the user is an admin
      if (!data || !data.user || data.user.role !== 'admin') {
        setDebugInfo('User is not an admin');
        throw new Error('Access denied. Admin privileges required.');
      }
      
      toast({
        title: 'Success',
        description: 'Logged in successfully',
      });
      
      setDebugInfo('Login successful, navigating to dashboard');
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error('Admin login error:', err);
      
      // Set appropriate error message based on the error
      if (err.response && err.response.status === 429) {
        setDebugInfo('Rate limit exceeded');
        setError('Too many login attempts. Please try again later.');
      } else if (err.response && err.response.data && err.response.data.error) {
        setDebugInfo(`Server error: ${err.response.data.error}`);
        setError(err.response.data.error);
      } else if (err.message.includes('Access denied')) {
        setDebugInfo('Access denied error');
        setError('Access denied. Admin privileges required.');
      } else {
        setDebugInfo(`General error: ${err.message}`);
        setError('Invalid credentials or insufficient permissions');
      }
      
      toast({
        title: 'Error',
        description: 'Login failed. Please check your credentials.',
        variant: 'destructive',
      });
    } finally {
      setLoading(prev => {
        setDebugInfo(`Setting loading to false (was ${prev})`);
        return false;
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-black p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-black/40 backdrop-blur-md p-8 rounded-xl border border-gray-800 shadow-2xl"
      >
        <div className="flex justify-center mb-6">
          <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
            <Zap className="h-6 w-6 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-white mb-8">Admin Portal</h2>
        
        {error && (
          <div className="mb-4 p-2 bg-red-500/10 border border-red-500/30 rounded text-red-500 text-sm text-center">
            {error}
          </div>
        )}
        
        {debugInfo && (
          <div className="mb-4 p-2 bg-gray-500/10 border border-gray-500/30 rounded text-gray-300 text-xs text-center">
            Debug: {debugInfo}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                required
                className="bg-gray-900/50 border-gray-700 text-white"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="bg-gray-900/50 border-gray-700 text-white"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin; 