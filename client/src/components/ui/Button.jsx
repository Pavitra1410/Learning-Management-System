import React from 'react';

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
  size = 'md', // 'sm' | 'md' | 'lg'
  ring = true,
  disabled = false,
  className = '',
  ...props
}) {
  const sizeClasses = {
    sm: 'h-9 px-4 text-xs gap-1.5',
    md: 'h-11 px-6 text-sm gap-2',
    lg: 'h-12 px-8 text-base gap-2.5',
  };

  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
    success: 'btn-success',
  };

  const showRing = ring && (variant === 'primary' || variant === 'secondary');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-semibold border-0 cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || 'btn-primary'} ${className}`}
      {...props}
    >
      <span>{children}</span>
      {showRing && <i className="lumen-ring" aria-hidden="true" />}
    </button>
  );
}

