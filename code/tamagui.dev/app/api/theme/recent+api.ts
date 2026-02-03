import { apiRoute } from '~/features/api/apiRoute'
import { supabaseAdmin } from '~/features/auth/supabaseAdmin'

// featured theme IDs for the banner
const FEATURED_THEME_IDS = [1980, 1951, 82, 53, 37]

// cache for 20 minutes
let cachedData: { recent: any[]; featured: any[] } | null = null
let cacheTime = 0
const CACHE_DURATION = 20 * 60 * 1000 // 20 minutes

export default apiRoute(async () => {
  const now = Date.now()

  // return cached if fresh
  if (cachedData && now - cacheTime < CACHE_DURATION) {
    return Response.json(cachedData)
  }

  // fetch recent themes from all users
  const { data: recentData, error: recentError } = await supabaseAdmin
    .from('theme_histories')
    .select('id, search_query, theme_data, created_at')
    .order('created_at', { ascending: false })
    .limit(10)

  if (recentError) {
    console.error('Error fetching recent themes:', recentError)
  }

  // fetch featured themes by ID
  const { data: featuredData, error: featuredError } = await supabaseAdmin
    .from('theme_histories')
    .select('id, search_query, theme_data, created_at')
    .in('id', FEATURED_THEME_IDS)

  if (featuredError) {
    console.error('Error fetching featured themes:', featuredError)
  }

  cachedData = {
    recent: recentData || [],
    featured: featuredData || [],
  }
  cacheTime = now

  return Response.json(cachedData)
})
