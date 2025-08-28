-- Create offense_records table to store disciplinary offenses
CREATE TABLE public.offense_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  student_grade INTEGER NOT NULL CHECK (student_grade >= 7 AND student_grade <= 11),
  student_class TEXT NOT NULL CHECK (student_class IN ('Barbados', 'Cuba', 'Dominica', 'Grenada', 'Jamaica', 'St. Lucia', 'Trinidad & Tobago')),
  offense_type TEXT NOT NULL,
  offense_description TEXT,
  recorded_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.offense_records ENABLE ROW LEVEL SECURITY;

-- Create policies for offense records access
CREATE POLICY "Admins can view all offense records" 
ON public.offense_records 
FOR SELECT 
USING (get_current_user_role() = 'admin'::user_role);

CREATE POLICY "Users can view offense records they created" 
ON public.offense_records 
FOR SELECT 
USING (auth.uid() = recorded_by);

CREATE POLICY "Users can insert offense records" 
ON public.offense_records 
FOR INSERT 
WITH CHECK (auth.uid() = recorded_by);

CREATE POLICY "Admins can update all offense records" 
ON public.offense_records 
FOR UPDATE 
USING (get_current_user_role() = 'admin'::user_role);

CREATE POLICY "Users can update offense records they created" 
ON public.offense_records 
FOR UPDATE 
USING (auth.uid() = recorded_by);

CREATE POLICY "Admins can delete all offense records" 
ON public.offense_records 
FOR DELETE 
USING (get_current_user_role() = 'admin'::user_role);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_offense_records_updated_at
BEFORE UPDATE ON public.offense_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for better performance on queries
CREATE INDEX idx_offense_records_student_name ON public.offense_records(student_name);
CREATE INDEX idx_offense_records_student_class ON public.offense_records(student_class);
CREATE INDEX idx_offense_records_created_at ON public.offense_records(created_at);
CREATE INDEX idx_offense_records_recorded_by ON public.offense_records(recorded_by);