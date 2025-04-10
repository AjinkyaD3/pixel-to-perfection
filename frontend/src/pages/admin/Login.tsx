import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Zap, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { authService } from '@/lib/api';

// Set to true during development to bypass actual API calls
const DEBUG_MODE = false;

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      let data;

      if (DEBUG_MODE) {
        // Mock response for debugging/development if using test credentials
        if (formData.email === 'admin@example.com' && formData.password === 'admin123') {
          console.log('DEBUG MODE: Using mock admin login data');
          data = {
            token: 'mock-token-admin',
            user: { 
              _id: '1', 
              name: 'Admin User', 
              email: formData.email, 
              role: 'admin' 
            }
          };
          
          // Store mock data in localStorage
          localStorage.setItem('pixel_to_perfection_token', data.token);
          localStorage.setItem('pixel_to_perfection_user', JSON.stringify(data.user));
        } else {
          throw new Error('Invalid credentials');
        }
      } else {
        // Make actual API call
        data = await authService.login(formData.email, formData.password);
        
        // Verify that the user is an admin
        if (data.user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }
      }
      
      toast({
        title: 'Success',
        description: 'Logged in successfully',
      });
      
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Admin login error:', err);
      setError('Invalid credentials or insufficient permissions');
      toast({
        title: 'Error',
        description: 'Login failed. Please check your credentials.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
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