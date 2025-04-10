import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8 text-center">About Us</h2>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg mb-6">
            Welcome to our community of tech enthusiasts and innovators. We're dedicated to fostering
            creativity and collaboration in the world of technology.
          </p>
          <p className="text-lg">
            Join us on our journey to explore the latest trends, share knowledge, and build amazing
            things together.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 