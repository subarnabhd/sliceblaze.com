"use client";
import { useSupabaseAuthEffect } from '@/lib/useSupabaseAuthEffect';

export default function AuthSyncer() {
  useSupabaseAuthEffect();
  return null;
}
