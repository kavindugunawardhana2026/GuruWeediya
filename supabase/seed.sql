-- ============================================================
-- GuruWeediya.lk — Mock Data Seed
-- ============================================================

-- Clean up existing mock data (optional, but good for local dev)
-- DELETE FROM public.users WHERE email LIKE '%@mock.guruweediya.lk';

-- 1. Insert Users (Teachers)
INSERT INTO public.users (id, email, role) VALUES
  ('a1b2c3d4-0001-0000-0000-000000000001', 'kamal@mock.guruweediya.lk', 'teacher'),
  ('a1b2c3d4-0002-0000-0000-000000000002', 'nimal@mock.guruweediya.lk', 'teacher'),
  ('a1b2c3d4-0003-0000-0000-000000000003', 'sunimal@mock.guruweediya.lk', 'teacher'),
  ('a1b2c3d4-0004-0000-0000-000000000004', 'ruwan@mock.guruweediya.lk', 'teacher'),
  ('a1b2c3d4-0005-0000-0000-000000000005', 'kasun@mock.guruweediya.lk', 'teacher')
ON CONFLICT (email) DO NOTHING;

-- 2. Insert Users (Institutes)
INSERT INTO public.users (id, email, role) VALUES
  ('b1c2d3e4-0001-0000-0000-000000000001', 'sasip@mock.guruweediya.lk', 'institute'),
  ('b1c2d3e4-0002-0000-0000-000000000002', 'rotary@mock.guruweediya.lk', 'institute'),
  ('b1c2d3e4-0003-0000-0000-000000000003', 'apex@mock.guruweediya.lk', 'institute')
ON CONFLICT (email) DO NOTHING;

-- 3. Insert Teachers
INSERT INTO public.teachers (id, user_id, full_name, bio, subjects, mediums, districts, hourly_rate, is_verified, verification_status) VALUES
  ('t1b2c3d4-0001-0000-0000-000000000001', 'a1b2c3d4-0001-0000-0000-000000000001', 'Kamal Perera', 'Experienced Maths teacher for A/L students with 10+ years of producing island ranks.', '{Mathematics,Combined Mathematics}', '{Sinhala,English}', '{Colombo,Gampaha}', 2500, true, 'approved'),
  ('t1b2c3d4-0002-0000-0000-000000000002', 'a1b2c3d4-0002-0000-0000-000000000002', 'Nimal Silva', 'Specialized in O/L and A/L Science. Interactive teaching methods.', '{Science,Physics}', '{Sinhala}', '{Kandy}', 2000, true, 'approved'),
  ('t1b2c3d4-0003-0000-0000-000000000003', 'a1b2c3d4-0003-0000-0000-000000000003', 'Sunimal Fernando', 'British Council certified English instructor focusing on Spoken English and IELTS.', '{English,Spoken English}', '{English}', '{Colombo,Online}', 3000, false, 'pending'),
  ('t1b2c3d4-0004-0000-0000-000000000004', 'a1b2c3d4-0004-0000-0000-000000000004', 'Ruwan Rajapakse', 'A/L Physics lecturer with practical demonstrations and extensive past paper discussions.', '{Physics}', '{Sinhala,English}', '{Kurunegala,Colombo}', 3500, true, 'approved'),
  ('t1b2c3d4-0005-0000-0000-000000000005', 'a1b2c3d4-0005-0000-0000-000000000005', 'Kasun Bandara', 'Chemistry simplified. I make organic chemistry easy to understand.', '{Chemistry}', '{Sinhala}', '{Galle,Matara}', 2000, false, 'pending')
ON CONFLICT (user_id) DO NOTHING;

-- 4. Insert Institutes
INSERT INTO public.institutes (id, user_id, institute_name, branch_location, district, contact_number, description, is_verified) VALUES
  ('i1c2d3e4-0001-0000-0000-000000000001', 'b1c2d3e4-0001-0000-0000-000000000001', 'Sasip Institute', 'Nugegoda', 'Colombo', '0112223334', 'Leading A/L tuition provider in Nugegoda with state of the art AC halls.', true),
  ('i1c2d3e4-0002-0000-0000-000000000002', 'b1c2d3e4-0002-0000-0000-000000000002', 'Rotary Hall', 'Nugegoda', 'Colombo', '0115556667', 'Historic tuition establishment catering to thousands of students.', true),
  ('i1c2d3e4-0003-0000-0000-000000000003', 'b1c2d3e4-0003-0000-0000-000000000003', 'Apex Education', 'Matara', 'Matara', '0412224445', 'Premier educational hub in the southern province.', false)
ON CONFLICT (user_id) DO NOTHING;

-- 5. Insert Jobs
INSERT INTO public.jobs (id, institute_id, title, subject, medium, description, location, district, budget_range, status) VALUES
  ('j1a2b3c4-0001-0000-0000-000000000001', 'i1c2d3e4-0001-0000-0000-000000000001', 'A/L Combined Maths Lecturer', 'Combined Mathematics', 'Sinhala', 'Looking for an experienced A/L Combined Maths teacher for 2026 batch.', 'Nugegoda', 'Colombo', 'LKR 4000 - 6000 / hr', 'open'),
  ('j1a2b3c4-0002-0000-0000-000000000002', 'i1c2d3e4-0002-0000-0000-000000000002', 'O/L English Teacher', 'English', 'English', 'We need a vibrant teacher to handle O/L paper classes.', 'Nugegoda', 'Colombo', 'LKR 2000 - 3000 / hr', 'open'),
  ('j1a2b3c4-0003-0000-0000-000000000003', 'i1c2d3e4-0003-0000-0000-000000000003', 'A/L Chemistry Lecturer', 'Chemistry', 'Sinhala', 'Urgently hiring an A/L Chemistry teacher for weekend classes.', 'Matara', 'Matara', 'LKR 3000 - 4500 / hr', 'open')
ON CONFLICT DO NOTHING;

-- 6. Insert Reviews
INSERT INTO public.reviews (teacher_id, institute_id, rating, review_text) VALUES
  ('t1b2c3d4-0001-0000-0000-000000000001', 'i1c2d3e4-0001-0000-0000-000000000001', 5, 'Kamal sir is excellent. The students love his teaching style and our class registrations have doubled.'),
  ('t1b2c3d4-0004-0000-0000-000000000004', 'i1c2d3e4-0001-0000-0000-000000000001', 4, 'Very professional and always on time. Highly recommended for Physics.'),
  ('t1b2c3d4-0004-0000-0000-000000000004', 'i1c2d3e4-0002-0000-0000-000000000002', 5, 'Ruwan sir conducted a fantastic seminar for our A/L students.'),
  ('t1b2c3d4-0002-0000-0000-000000000002', 'i1c2d3e4-0003-0000-0000-000000000003', 4, 'Good engagement with O/L students. Reliable teacher.')
ON CONFLICT DO NOTHING;

-- 7. Insert Teacher Documents (For Admin Verification Queue)
INSERT INTO public.teacher_documents (id, user_id, doc_type, file_path, status) VALUES
  ('d1e2f3g4-0001-0000-0000-000000000003', 'a1b2c3d4-0003-0000-0000-000000000003', 'nic', 'https://example.com/mock-nic-sunimal.pdf', 'pending_review'),
  ('d1e2f3g4-0002-0000-0000-000000000003', 'a1b2c3d4-0003-0000-0000-000000000003', 'degree_certificate', 'https://example.com/mock-degree-sunimal.pdf', 'pending_review'),
  ('d1e2f3g4-0001-0000-0000-000000000005', 'a1b2c3d4-0005-0000-0000-000000000005', 'nic', 'https://example.com/mock-nic-kasun.pdf', 'pending_review')
ON CONFLICT DO NOTHING;
