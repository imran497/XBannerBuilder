'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 60, className = "" }: LogoProps) {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // SVG has viewBox="0 0 162 32", aspect ratio is 162:32 (about 5:1)
  const width = (size * 162) / 32;

  // Only show logo after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a placeholder with same dimensions to prevent layout shift
    return <div style={{ width, height: size }} />
  }

  const currentTheme = theme === 'system' ? resolvedTheme : theme
  const logoSrc = currentTheme === 'dark'
    ? '/simpleXheader_dark.svg'
    : '/simpleXheader.svg'

  return (
    <img
      src={logoSrc}
      alt="xheader.app"
      width={width}
      height={size}
      className={className}
    />
  );
}

export function LogoWithText({ size = 60 }: LogoProps) {
  return <Logo size={size} />;
}