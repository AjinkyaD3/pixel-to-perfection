import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

const MemberLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement actual authentication
        if (formData.email === 'member@aces.com' && formData.password === 'member123') {
            navigate('/member/dashboard');
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-lg p-8">
                    <div className="flex flex-col items-center mb-8">
                        <div className="bg-neon-purple/10 p-3 rounded-full mb-4">
                            <User className="h-8 w-8 text-neon-purple" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">Member Login</h1>
                        <p className="text-muted-foreground mt-2">Access your member dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-foreground">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="member@aces.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="bg-background/50 border-border/50 focus:border-neon-purple"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-foreground">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="bg-background/50 border-border/50 focus:border-neon-purple"
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm text-center">{error}</div>
                        )}

                        <Button
                            type="submit"
                            className="w-full relative overflow-hidden group"
                        >
                            <span className="absolute inset-0 bg-neon-gradient animate-gradient-animation bg-300"></span>
                            <span className="relative">Sign In</span>
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        <p>Default credentials:</p>
                        <p className="mt-1">Email: member@aces.com</p>
                        <p>Password: member123</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default MemberLogin; 