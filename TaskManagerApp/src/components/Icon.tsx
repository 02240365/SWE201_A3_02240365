import React, { ComponentProps } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

/**
 * Thin wrapper around Ionicons so the rest of the app can pass icon names as
 * plain strings. Centralizing it here keeps the (large) icon-name typing in
 * one spot and makes swapping icon sets trivial.
 */
export default function Icon({ name, size = 22, color = '#111827' }: IconProps) {
  // Ionicons' name prop is a big string-literal union; we accept a string and
  // cast once here to keep call sites clean.
  return <Ionicons name={name as ComponentProps<typeof Ionicons>['name']} size={size} color={color} />;
}
