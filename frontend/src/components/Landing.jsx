import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, ArrowRight } from '@phosphor-icons/react';
import ParticleBackground from './ParticleBackground';

const Landing = () => {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at top right, rgba(0, 32, 69, 0.05), transparent 40%), var(--background)' }}>
      <ParticleBackground />
      <div className="animate-in" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '800px', padding: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '0.5rem 1.5rem', backgroundColor: 'var(--surface_container_lowest)', borderRadius: '9999px', boxShadow: 'var(--shadow-ambient)', marginBottom: '2rem' }}>
          <Brain size={24} color="var(--primary)" weight="fill" />
          <span style={{ fontWeight: 600, color: 'var(--primary)' }}>ScholarInsight AI Suite</span>
        </div>
        
        <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>
          The Digital Curator for Academic Research
        </h1>
        
        <p style={{ fontSize: '1.25rem', color: 'var(--on_surface_variant)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
          Transform complex PDF papers into actionable insights through sophisticated AI parsing, plagiarism detection, and editorial humanization.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/login" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '1.125rem', padding: '1rem 2rem' }}>
            Login <ArrowRight weight="bold" />
          </Link>
          <Link to="/login" state={{ isSignup: true }} className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '1.125rem', padding: '1rem 2rem', border: '1px solid var(--primary)' }}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
