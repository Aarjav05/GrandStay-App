export const getErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred.';
  
  // Common Supabase Auth / Postgres Error strings mapping
  const msg = error.message || error.code;
  
  if (msg.includes('Email not confirmed')) return 'Please confirm your email address.';
  if (msg.includes('Invalid login credentials')) return 'Invalid email or password.';
  if (msg.includes('User already registered')) return 'An account with this email already exists.';
  if (msg.includes('Password should be at least')) return 'Password is too short.';
  if (msg.includes('PGRST116')) return 'Record not found.';
  if (msg.includes('23505')) return 'This record already exists.'; // Unique violation
  
  return msg;
};
