import { StudioLayout } from '@components/StudioLayout';
import { withSupabase } from '@lib/withSupabase';
import { GetLayout } from './getDefaultLayout';


export const getStudioLayout: GetLayout = (page, pageProps) => {
  return withSupabase(<StudioLayout>{page}</StudioLayout>, pageProps, true);
};
