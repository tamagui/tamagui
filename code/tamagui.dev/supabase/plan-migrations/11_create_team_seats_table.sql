-- This file creates tables to manage team seats and invitations
-- team_seats table tracks the total number of seats purchased and used per subscription
CREATE TABLE team_seats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  subscription_id TEXT REFERENCES subscriptions(id),
  total_seats INTEGER NOT NULL DEFAULT 0,
  used_seats INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- team_members table tracks who has been invited and their status
CREATE TABLE team_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  team_seat_id UUID REFERENCES team_seats(id),
  user_id UUID REFERENCES auth.users(id),
  github_username TEXT,
  discord_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('invited', 'active', 'removed')),
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  activated_at TIMESTAMP WITH TIME ZONE,
  removed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better query performance
CREATE INDEX idx_team_seats_subscription_id ON team_seats(subscription_id);
CREATE INDEX idx_team_members_team_seat_id ON team_members(team_seat_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);
CREATE INDEX idx_team_members_github_username ON team_members(github_username);
CREATE INDEX idx_team_members_discord_id ON team_members(discord_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for team_seats table
CREATE TRIGGER update_team_seats_updated_at
  BEFORE UPDATE ON team_seats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE team_seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Only allow users to view their own team seats and members
CREATE POLICY "Users can view their own team seats"
  ON team_seats FOR SELECT
  USING (
    subscription_id IN (
      SELECT id FROM subscriptions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their team members"
  ON team_members FOR SELECT
  USING (
    team_seat_id IN (
      SELECT id FROM team_seats WHERE subscription_id IN (
        SELECT id FROM subscriptions WHERE user_id = auth.uid()
      )
    )
  ); 