import { TRPCError } from '@trpc/server'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { z } from 'zod'

import {
  startOfDay,
  add,
  isAfter,
  addMinutes,
  format,
  addHours,
  roundToNearestMinutes,
  formatDuration,
} from 'date-fns'
export const climbRouter = createTRPCRouter({
  create: protectedProcedure.input(z.object({
    name: z.string(),
    type: z.string(),
    start: z.string(),
    duration: z.string(),
    location: z.string(),
  })).mutation(async ({ ctx: { supabase, session }, input }) => {

    const profile = await supabase.from('climbs').insert([{
      name: input.name,
      type: input.type as any,
      start: input.start,
      duration: add(new Date(input.start), {
        minutes: Number(input.duration)
      }).toISOString(),
      // location: input.location,
      created_by: session?.user.id,
      created_at: new Date().toISOString(),
    }]).select()

    if (profile.error) {
      console.log(profile.error)
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }

    console.log(profile)
  }),
})
