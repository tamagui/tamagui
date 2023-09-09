import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'belaytionship.rocks',
  slug: 'belytionship.rocks',
});
