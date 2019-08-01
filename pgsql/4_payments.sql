CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID DEFAULT gen_random_uuid(),
  payee_id UUID DEFAULT gen_random_uuid(),
  memo varchar(255) NOT NULL,
  amount INTEGER NOT NULL,
  currency varchar(10) NOT NULL,
  velo_source_account varchar(255) NOT NULL,
  velo_status varchar(255) NULL,
  created_at timestamp without time zone default (now() at time zone 'utc'),
  updated_at timestamp without time zone default (now() at time zone 'utc'),
  FOREIGN KEY (batch_id) REFERENCES batches(id),
  FOREIGN KEY (payee_id) REFERENCES payees(id)
);

CREATE INDEX batch_ind ON payments(batch_id);
CREATE INDEX payee_ind ON payments(payee_id);