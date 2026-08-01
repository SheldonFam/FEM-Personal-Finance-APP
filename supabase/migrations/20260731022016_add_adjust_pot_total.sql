-- Atomic pot balance adjustment.
--
-- Issue #35, under spec #27.
--
-- The application previously read a pot's total, applied the change in the
-- browser, and wrote the result back. Two overlapping adjustments would read
-- the same starting total and the second write would overwrite the first, so
-- one deposit or withdrawal vanished silently.
--
-- This applies the change in a single UPDATE. Postgres holds a row lock for
-- the duration of that statement, so concurrent calls against the same pot
-- serialise and both take effect.
--
-- SECURITY INVOKER (the default, stated explicitly) means the row-level
-- security policies already on public.pots apply to the UPDATE exactly as they
-- would to a direct write from the client. A caller cannot adjust a pot that
-- is not theirs, and no auth.uid() check is needed here -- adding one would
-- duplicate the policy and risk drifting from it.
--
-- search_path is pinned empty so the function cannot be captured by a
-- shadowing object in a caller-controlled schema; every name below is
-- therefore fully qualified.

create or replace function public.adjust_pot_total(
  pot_id uuid,
  delta numeric
)
returns public.pots
language sql
security invoker
set search_path = ''
as $$
  update public.pots
     set total = greatest(0, coalesce(total, 0) + delta)
   where id = pot_id
  returning *;
$$;

-- coalesce, not bare `total + delta`: a null total would make the sum null, and
-- Postgres' greatest() skips nulls, so the row would silently land on 0 and the
-- deposit would vanish. The read-then-write this replaces treated a null total
-- as 0; that behaviour is preserved rather than quietly changed.

comment on function public.adjust_pot_total(uuid, numeric) is
  'Adds delta to a pot''s total in one atomic statement, clamped at zero. '
  'Positive delta deposits, negative withdraws. Returns the updated row, or '
  'no row if the pot does not exist or RLS denies access.';

-- New functions are executable by PUBLIC by default. Narrow that: only a
-- signed-in user should be able to move money. RLS would block anon anyway,
-- but defence in depth costs nothing here.
revoke all on function public.adjust_pot_total(uuid, numeric) from public;
grant execute on function public.adjust_pot_total(uuid, numeric) to authenticated;
