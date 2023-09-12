import { TRPCError } from '@trpc/server'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { z } from 'zod'

import {
  add,
} from 'date-fns'

export const climbRouter = createTRPCRouter({
  read: protectedProcedure.query(async ({ ctx: { supabase } }) => {
    // const climbs = await supabase.from('climbs').select(`*, climber:profiles(*)`).filter('requested', 'lte', 'joined').order('created_at', { ascending: false })
    const climbs = await supabase
      .from('climbs')
      .select(`*, climber:profiles(*)`)
      .lt('joined', 2)
      .gt('start', new Date().toISOString())
      // Need to get climbs that start after now.
      .order('start', { ascending: true })

    if (climbs.error) {
      console.log(climbs.error)
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }

    return climbs.data.map((climb) => {
      return {
        ...climb,
        climber: Array.isArray(climb.climber) ? climb.climber[0] : climb.climber
      };
    })
  }),
  join: protectedProcedure.input(z.object({
    climb_id: z.number(),
  })).mutation(async ({ ctx: { supabase, session }, input }) => {

    const climb = await supabase.from('climbs').select(`*`).eq('id', input.climb_id).single()
    if (climb.error) {
      console.log(climb.error)
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }

    if (climb.data.joined >= climb?.data?.requested) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Climb is full' })
    }

    const updatedClimb = await supabase.from('climbs').update({
      joined: climb.data.joined + 1,
    }).eq('id', input.climb_id)

    if (updatedClimb.error) {
      console.log(updatedClimb.error)
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }

    const profileClimb = await supabase.from("profile_climbs").insert({
      profile_id: session?.user.id,
      climb_id: input.climb_id,
    })

    if (profileClimb.error) {
      console.log(profileClimb.error)
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }

    return true

  }),
  create: protectedProcedure.input(z.object({
    name: z.string(),
    type: z.string(),
    start: z.string(),
    duration: z.string(),
    location: z.string(),
    day: z.string(),
  })).mutation(async ({ ctx: { supabase, session }, input }) => {

    const profile = await supabase.from('climbs').insert([{
      name: input.name,
      type: input.type as any,
      start: add(new Date(input.start), {
        days: Number(input.day)
      }).toISOString(),
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
    return true
  }),
})
