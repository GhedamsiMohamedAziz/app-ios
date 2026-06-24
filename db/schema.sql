-- Owned by: database-reviewer
-- Target schema to replace the in-memory store (src/lib/store.ts). Postgres.

CREATE TABLE sellers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  rating        NUMERIC(2,1) NOT NULL DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
  lat           DOUBLE PRECISION NOT NULL,
  lng           DOUBLE PRECISION NOT NULL,
  label         TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE part_requests (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  make          TEXT NOT NULL,
  model         TEXT NOT NULL,
  year          INT  NOT NULL CHECK (year BETWEEN 1950 AND 2100),
  part_name     TEXT NOT NULL,
  description   TEXT NOT NULL,
  buyer_lat     DOUBLE PRECISION NOT NULL,
  buyer_lng     DOUBLE PRECISION NOT NULL,
  buyer_label   TEXT NOT NULL,
  urgency       TEXT NOT NULL DEFAULT 'standard' CHECK (urgency IN ('critical','urgent','standard','scheduled')),
  status        TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','closed')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at    TIMESTAMPTZ              -- NULL only in scheduled/passive mode (DARRAGI-BIDWIN-002)
);

-- Closer relies on (status, expires_at): fetch open + already expired rows.
CREATE INDEX idx_requests_expires ON part_requests(status, expires_at)
  WHERE status = 'open';

CREATE TABLE bids (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id    UUID NOT NULL REFERENCES part_requests(id) ON DELETE CASCADE,
  seller_id     UUID REFERENCES sellers(id),
  seller_name   TEXT NOT NULL,
  seller_rating NUMERIC(2,1) NOT NULL DEFAULT 0 CHECK (seller_rating BETWEEN 0 AND 5),
  price         NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  currency      TEXT NOT NULL DEFAULT 'TND',
  condition     TEXT NOT NULL CHECK (condition IN ('new','used','refurbished')),
  seller_lat    DOUBLE PRECISION NOT NULL,
  seller_lng    DOUBLE PRECISION NOT NULL,
  seller_label  TEXT NOT NULL,
  eta_days      INT NOT NULL CHECK (eta_days >= 0),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_bids_request ON bids(request_id);
CREATE INDEX idx_requests_status ON part_requests(status);
