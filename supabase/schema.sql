-- ============================================
-- ChurchConnect — Supabase Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CHURCHES
-- ============================================
CREATE TABLE churches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  description TEXT,
  address TEXT,
  city TEXT,
  state TEXT(2),
  phone TEXT,
  email TEXT,
  website TEXT,
  instagram TEXT,
  whatsapp TEXT,
  pastor_name TEXT,
  plan TEXT NOT NULL DEFAULT 'starter' CHECK (plan IN ('starter', 'growth', 'revival', 'legacy')),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MEMBERS
-- ============================================
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id UUID REFERENCES churches(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'leader', 'deacon', 'elder', 'pastor', 'admin')),
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(church_id, email)
);

-- ============================================
-- EVENTS
-- ============================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id UUID REFERENCES churches(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  banner_url TEXT,
  category TEXT NOT NULL DEFAULT 'culto',
  start_date DATE NOT NULL,
  end_date DATE,
  start_time TIME NOT NULL,
  end_time TIME,
  location TEXT,
  address TEXT,
  is_online BOOLEAN DEFAULT FALSE,
  meeting_url TEXT,
  capacity INTEGER,
  registered_count INTEGER DEFAULT 0,
  is_free BOOLEAN DEFAULT TRUE,
  price DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled', 'finished')),
  requires_checkin BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(church_id, slug)
);

-- ============================================
-- REGISTRATIONS
-- ============================================
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'checked_in')),
  qr_code TEXT UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  checked_in_at TIMESTAMPTZ,
  UNIQUE(event_id, member_id)
);

-- ============================================
-- NOTIFICATIONS
-- ============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id UUID REFERENCES churches(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ANALYTICS (aggregated)
-- ============================================
CREATE TABLE church_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id UUID REFERENCES churches(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  total_members INTEGER DEFAULT 0,
  new_members INTEGER DEFAULT 0,
  active_events INTEGER DEFAULT 0,
  total_registrations INTEGER DEFAULT 0,
  total_checkins INTEGER DEFAULT 0,
  UNIQUE(church_id, date)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_churches_slug ON churches(slug);
CREATE INDEX idx_churches_owner ON churches(owner_id);
CREATE INDEX idx_events_church ON events(church_id);
CREATE INDEX idx_events_date ON events(start_date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_members_church ON members(church_id);
CREATE INDEX idx_registrations_event ON registrations(event_id);
CREATE INDEX idx_registrations_member ON registrations(member_id);
CREATE INDEX idx_registrations_qr ON registrations(qr_code);

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update registered_count
CREATE OR REPLACE FUNCTION update_registered_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status != 'cancelled' THEN
    UPDATE events SET registered_count = registered_count + 1 WHERE id = NEW.event_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status != 'cancelled' AND NEW.status = 'cancelled' THEN
      UPDATE events SET registered_count = registered_count - 1 WHERE id = NEW.event_id;
    ELSIF OLD.status = 'cancelled' AND NEW.status != 'cancelled' THEN
      UPDATE events SET registered_count = registered_count + 1 WHERE id = NEW.event_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.status != 'cancelled' THEN
    UPDATE events SET registered_count = registered_count - 1 WHERE id = OLD.event_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_registered_count
AFTER INSERT OR UPDATE OR DELETE ON registrations
FOR EACH ROW EXECUTE FUNCTION update_registered_count();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_churches_updated_at BEFORE UPDATE ON churches
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_events_updated_at BEFORE UPDATE ON events
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE churches ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Churches: owner can do anything; public can read
CREATE POLICY "Churches are publicly readable" ON churches FOR SELECT USING (true);
CREATE POLICY "Church owners can manage" ON churches FOR ALL USING (auth.uid() = owner_id);

-- Events: public can read published; church admins can manage
CREATE POLICY "Published events are public" ON events FOR SELECT
  USING (status = 'published' OR church_id IN (
    SELECT id FROM churches WHERE owner_id = auth.uid()
  ));
CREATE POLICY "Church admins manage events" ON events FOR ALL
  USING (church_id IN (SELECT id FROM churches WHERE owner_id = auth.uid()));

-- Members: only church admins can manage
CREATE POLICY "Church admins manage members" ON members FOR ALL
  USING (church_id IN (SELECT id FROM churches WHERE owner_id = auth.uid()));

-- Registrations
CREATE POLICY "Users can see own registrations" ON registrations FOR SELECT
  USING (member_id IN (SELECT id FROM members WHERE user_id = auth.uid()));
CREATE POLICY "Church admins manage registrations" ON registrations FOR ALL
  USING (event_id IN (
    SELECT e.id FROM events e
    JOIN churches c ON c.id = e.church_id
    WHERE c.owner_id = auth.uid()
  ));

-- ============================================
-- SEED DATA (demo)
-- ============================================
-- Insert demo church (replace owner_id with real user id)
-- INSERT INTO churches (owner_id, name, slug, city, state, pastor_name, plan, verified)
-- VALUES ('YOUR_USER_ID', 'Igreja Graça Viva', 'graca-viva', 'São Paulo', 'SP', 'Pr. Rafael Silva', 'revival', true);
