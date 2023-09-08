import * as Updates from 'expo-updates';

export type ConfigType = typeof Config;
export let Config = {
  publicUrl: process.env.EXPO_PUBLIC_URL ?? 'https://localhost:3000',
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? 'https://localhost:54321',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
  enableHiddenFeatures: true,
};

if (Updates.channel === 'development') {
  Config.publicUrl = 'localhost:3000';
  Config.supabaseUrl = 'http://localhost:54321';
  Config.enableHiddenFeatures = false;
} else if (Updates.channel === 'test') {
  Config.publicUrl = 'https://www.belaytionship.rocks';
  Config.supabaseUrl = 'https://slwmxbbwegsfgxepfjlg.supabase.co';
  Config.supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsd214YmJ3ZWdzZmd4ZXBmamxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE2ODM0MjAsImV4cCI6MjAwNzI1OTQyMH0.jr2Z4p_86ag116e_io3DiKx2K7W1BF5C0YXf5ifGWBQ';
  Config.enableHiddenFeatures = true;
} else if (Updates.channel === 'production') {
  // Production is staging for the moment
  Config.publicUrl = 'https://www.belaytionship.rocks';
  Config.supabaseUrl = 'https://slwmxbbwegsfgxepfjlg.supabase.co';
  Config.supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsd214YmJ3ZWdzZmd4ZXBmamxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE2ODM0MjAsImV4cCI6MjAwNzI1OTQyMH0.jr2Z4p_86ag116e_io3DiKx2K7W1BF5C0YXf5ifGWBQ';
  Config.enableHiddenFeatures = true;
}
