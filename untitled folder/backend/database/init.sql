CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS "Users" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  "firstName" VARCHAR(50) NOT NULL,
  "lastName" VARCHAR(50) NOT NULL,
  gender VARCHAR(10) CHECK (gender IN ('male','female','other')),
  "dateOfBirth" DATE,
  "profilePicture" VARCHAR(500),
  preferences JSONB DEFAULT '{}',
  "isActive" BOOLEAN DEFAULT TRUE,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Quizzes" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
  gender VARCHAR(10) NOT NULL CHECK (gender IN ('male','female')),
  answers JSONB NOT NULL DEFAULT '{}',
  "aestheticProfile" JSONB DEFAULT '{}',
  "completedAt" TIMESTAMPTZ,
  "isCompleted" BOOLEAN DEFAULT FALSE,
  score INTEGER,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Outfits" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  "imageUrl" VARCHAR(500),
  tags TEXT[] DEFAULT '{}',
  occasion VARCHAR(100),
  season VARCHAR(50),
  "isLiked" BOOLEAN DEFAULT FALSE,
  "isSaved" BOOLEAN DEFAULT FALSE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "StyleHistories" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
  "outfitId" UUID NOT NULL REFERENCES "Outfits"(id) ON DELETE CASCADE,
  action VARCHAR(20) NOT NULL CHECK (action IN ('viewed','liked','disliked','saved','worn','rated')),
  metadata JSONB DEFAULT '{}',
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON "Users"(email);
CREATE INDEX IF NOT EXISTS idx_quizzes_user_id ON "Quizzes"("userId");
CREATE INDEX IF NOT EXISTS idx_outfits_user_id ON "Outfits"("userId");
CREATE INDEX IF NOT EXISTS idx_outfits_tags ON "Outfits" USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_style_history_user_id ON "StyleHistories"("userId");

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trg_users_updated BEFORE UPDATE ON "Users" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_quizzes_updated BEFORE UPDATE ON "Quizzes" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_outfits_updated BEFORE UPDATE ON "Outfits" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_style_histories_updated BEFORE UPDATE ON "StyleHistories" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
