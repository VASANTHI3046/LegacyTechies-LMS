-- Trigger types regeneration by adding a helpful comment
COMMENT ON TABLE public.profiles IS 'User profile information including full name, avatar, and bio';
COMMENT ON TABLE public.courses IS 'Courses created by teachers with title, description, and duration';
COMMENT ON TABLE public.enrollments IS 'Student enrollments in courses';
COMMENT ON TABLE public.assignments IS 'Course assignments with due dates and max points';
COMMENT ON TABLE public.submissions IS 'Student assignment submissions';
COMMENT ON TABLE public.grades IS 'Grades for student submissions';
COMMENT ON TABLE public.materials IS 'Course learning materials and resources';
COMMENT ON TABLE public.forum_posts IS 'Forum posts for course discussions';
COMMENT ON TABLE public.notifications IS 'User notifications for various events';
COMMENT ON TABLE public.user_roles IS 'User role assignments (student or teacher)';