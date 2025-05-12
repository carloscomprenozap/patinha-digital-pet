
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ className, size = 'md' }: LogoProps) => {
  const sizeClass = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  }[size];

  return (
    <Link to="/" className={`font-bold ${sizeClass} flex items-center ${className}`}>
      <span className="text-vetcare-500 mr-1">Vet</span>
      <span className="text-vetblue-500">Casa</span>
    </Link>
  );
};

export default Logo;
