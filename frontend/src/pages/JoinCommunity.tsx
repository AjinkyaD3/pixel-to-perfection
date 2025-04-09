import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThreeDBackground from '@/components/ThreeDBackground';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const JoinCommunity: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    year: '',
    department: '',
    interests: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // TODO: Implement actual form submission logic
      console.log('Joining community with:', formData);
      // After successful submission, redirect to thank you page or home
      navigate('/thank-you');
    } catch (err) {
      setError('Failed to submit form. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen">
      <ThreeDBackground />
      <Navbar />
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8 bg-background/80 backdrop-blur-xl p-8 rounded-xl border border-border/50 shadow-lg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
              Join Our Community
            </h2>
            <p className="mt-2 text-center text-foreground/70">
              Be part of our growing tech community and get access to exclusive events and resources
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-border/50 rounded-md shadow-sm placeholder-foreground/50 text-foreground focus:outline-none focus:ring-neon-blue focus:border-neon-blue sm:text-sm bg-background/50"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-border/50 rounded-md shadow-sm placeholder-foreground/50 text-foreground focus:outline-none focus:ring-neon-blue focus:border-neon-blue sm:text-sm bg-background/50"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-border/50 rounded-md shadow-sm placeholder-foreground/50 text-foreground focus:outline-none focus:ring-neon-blue focus:border-neon-blue sm:text-sm bg-background/50"
                  placeholder="+91 1234567890"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-foreground">
                  Year of Study
                </label>
                <select
                  id="year"
                  name="year"
                  required
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-border/50 rounded-md shadow-sm focus:outline-none focus:ring-neon-blue focus:border-neon-blue sm:text-sm bg-background/50 text-foreground"
                  value={formData.year}
                  onChange={handleChange}
                >
                  <option value="">Select Year</option>
                  <option value="1">First Year</option>
                  <option value="2">Second Year</option>
                  <option value="3">Third Year</option>
                  <option value="4">Fourth Year</option>
                </select>
              </div>
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-foreground">
                  Department
                </label>
                <select
                  id="department"
                  name="department"
                  required
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-border/50 rounded-md shadow-sm focus:outline-none focus:ring-neon-blue focus:border-neon-blue sm:text-sm bg-background/50 text-foreground"
                  value={formData.department}
                  onChange={handleChange}
                >
                  <option value="">Select Department</option>
                  <option value="CSE">Computer Science</option>
                  <option value="IT">Information Technology</option>
                  <option value="ECE">Electronics & Communication</option>
                  <option value="EEE">Electrical & Electronics</option>
                  <option value="MECH">Mechanical</option>
                  <option value="CIVIL">Civil</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="interests" className="block text-sm font-medium text-foreground">
                  Areas of Interest
                </label>
                <textarea
                  id="interests"
                  name="interests"
                  rows={3}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-border/50 rounded-md shadow-sm placeholder-foreground/50 text-foreground focus:outline-none focus:ring-neon-blue focus:border-neon-blue sm:text-sm bg-background/50"
                  placeholder="Web Development, AI/ML, Cybersecurity, etc."
                  value={formData.interests}
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-neon-blue hover:bg-neon-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-blue"
              >
                Join Community
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JoinCommunity; 