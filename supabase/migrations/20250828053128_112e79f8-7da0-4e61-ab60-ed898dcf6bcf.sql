-- Remove school_name column and add department column to profiles table
ALTER TABLE public.profiles 
DROP COLUMN school_name,
ADD COLUMN department text;