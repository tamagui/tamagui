import { supabase } from 'app/utils/supabase/client.native';
// require('ts-node').register()

import { faker } from '@faker-js/faker'
import { add } from 'date-fns'
import { AuthResponse, SupabaseClient, createClient } from '@supabase/supabase-js'
import { Database, } from './types'
import { Enums, Tables } from './helpers';

type Climbs = Tables<'climbs'>
const supabaseInstance = createClient<Database>("http://localhost:54321", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0")
async function createClimbs(supabase: SupabaseClient<Database>, user: AuthResponse['data']['user']) {
  // Create 10 climbs from faker data with the Shape of Tables['climbs'] and Enums['climb_type']
  // created at should be now to 1 week ago
  // created by should be the user id from the auth response
  // start should be in the future, a time between now and 3 weeks from now
  // duration should be between 20 minutes and 5 hours after start
  // type should be one of the climb types enum
  // id should be an auto incrementing integer starting at 1
  // name should be a random string of 10-25 characters with the user's first name in it and fake verb
  // the start time should be between 7am and 10pm, and the duration should be between 20 minutes and 5 hours, but the climb cannot end after 10pm

  const climbs = Array.from({ length: 10 }).map((_, i) => {

    // past date between now and 1 week ago


    const start = add(faker.date.between(
      {
        from: new Date(),
        to: add(new Date(), { weeks: 3 }),
      }), {
      hours: faker.number.int({ min: 0, max: 4 }),
      minutes: faker.number.int({ min: 0, max: 59 }),
    })
    return {
      created_at: faker.date.between({
        from: add(new Date(), { weeks: -1 }),
        to: new Date(),
      }).toISOString(),
      created_by: user?.id as string,
      start: start.toISOString(),
      duration: add(start, {
        hours: faker.number.int({ min: 0, max: 4 }),
        minutes: faker.number.int({ min: 0, max: 59 }),
      }).toISOString(),
      type: faker.helpers.arrayElement(['boulder', 'lead_rope', 'top_rope']) as Enums<'climb_type'>,
      id: i + 1,
      name: `${user?.user_metadata.first_name} ${faker.helpers.arrayElement(['climbs', 'sends', 'projects', 'attempts'])} ${faker.helpers.arrayElement(['a', 'the', 'my'])} ${faker.helpers.arrayElement(['red', 'blue', 'green', 'yellow', 'purple', 'black'])} ${faker.helpers.arrayElement(['route', 'problem', 'boulder'])}`,
    }
  })

  const { data, error } = await supabase.from('climbs').insert(climbs)

  if (error) {
    console.log(error)
    return
  }

  return data

}

// const { data, error } = await supabase.from('climbs').insert()

async function createBenjamin(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase.auth.signUp({
    email: 'benschac@gmail.com',
    password: 'qwerty',
    options: {
      data: {
        first_name: 'Benjamin',
        last_name: 'Schachter',
        username: 'benschac',
      }
    }
  })

  if (error) {
    console.log(error)
    return
  }

  return data
}


// Notes: This doesn't work, look into it tomorrow
async function createUsers(supabase: SupabaseClient<Database>, count: number) {
  const users = Array.from({ length: count }).map(() => {
    return supabase.auth.signUp({
      email: faker.internet.email(),
      password: faker.internet.password(),
      options: {
        data: {
          first_name: faker.person.firstName(),
          last_name: faker.person.lastName(),
          username: faker.internet.userName(),
          avatar_url: faker.image.avatar(),
        }
      }
    })
  })

  const results = await Promise.all(users)
  return results
}

async function main() {
  console.log('Running seeds with faker data')
  const benjamin = await createBenjamin(supabaseInstance)
  const users = await createUsers(supabaseInstance, 10)


  if (!benjamin) {
    console.log('no benjamin')
    return
  }
  const benjaminsClimbs = await createClimbs(supabaseInstance, benjamin.user)
}




main().catch(console.error)

console.log('hello')
